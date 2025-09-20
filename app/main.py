from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import requests
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse, HTMLResponse
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from pydantic import BaseModel
from typing import List, Optional
from db import ensure_database_initialized, get_db_connection
from services import add_user_tokens

# ---------- CONFIG ----------
CLIENT_SECRETS_FILE = "client.json"
SCOPES = ["https://www.googleapis.com/auth/fitness.activity.read"]
REDIRECT_URI = "https://grgwkl96-8000.inc1.devtunnels.ms/callback"

app = FastAPI(title="Global Health API", version="0.1.0")


@app.on_event("startup")
async def on_startup() -> None:
	await ensure_database_initialized()


class UserCreate(BaseModel):
	name: str
	age: Optional[int] = None
	gender: Optional[str] = None


class UserOut(BaseModel):
	user_id: int
	name: str
	age: Optional[int] = None
	gender: Optional[str] = None
	created_at: str


@app.get("/health")
async def health() -> dict:
	return {"status": "ok"}

from starlette.middleware.sessions import SessionMiddleware
app.add_middleware(SessionMiddleware, secret_key="super-secret-key")

@app.get("/")
def index():
    return {"message": "Welcome!", "link": "/authorize"}
@app.get("/authorize")
async def authorize(request: Request):
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri = "https://grgwkl96-8000.inc1.devtunnels.ms/callback"
    )
    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true"
    )
    request.session["state"] = state
    return RedirectResponse(authorization_url)


@app.get("/callback")
async def callback(request: Request):
    state = request.session.get("state")

    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )
    flow.fetch_token(authorization_response=str(request.url))

    credentials = flow.credentials

    # Save credentials in session
    request.session["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes
    }

    # Save tokens in DB for user_id = 1 (replace with actual logged-in user)
    saved = await add_user_tokens(
        user_id=1,  # TODO: dynamically get logged-in user_id
        access_token=credentials.token,
        refresh_token=credentials.refresh_token,
        expiry=credentials.expiry.isoformat() if credentials.expiry else None
    )

    return HTMLResponse(
        f"Access Token: {credentials.token}<br>"
        f"Refresh Token: {credentials.refresh_token}<br>"
        f"Saved in DB: {saved}"
    )

@app.get("/revoke")
async def revoke(request: Request):
    if "credentials" not in request.session:
        return HTMLResponse("You need to <a href='/authorize'>authorize</a> first.")

    credentials = Credentials(**request.session["credentials"])
    revoke = requests.post(
        'https://oauth2.googleapis.com/revoke',
        params={'token': credentials.token},
        headers={'content-type': 'application/x-www-form-urlencoded'}
    )

    if revoke.status_code == 200:
        return "Access revoked."
    else:
        raise HTTPException(status_code=400, detail="Failed to revoke token")

@app.post("/users", response_model=UserOut, status_code=201)
async def create_user(payload: UserCreate):
	async for conn in get_db_connection():
		cursor = await conn.execute(
			"""
			INSERT INTO Users (name, age, gender)
			VALUES (?, ?, ?)
			RETURNING user_id, name, age, gender, created_at
			""",
			(payload.name, payload.age, payload.gender),
		)
		row = await cursor.fetchone()
		await conn.commit()
		return dict(row)


@app.get("/users", response_model=List[UserOut])
async def list_users():
	async for conn in get_db_connection():
		cursor = await conn.execute(
			"SELECT user_id, name, age, gender, created_at FROM Users ORDER BY user_id DESC"
		)
		rows = await cursor.fetchall()
		return [dict(r) for r in rows]


@app.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: int):
	async for conn in get_db_connection():
		cursor = await conn.execute(
			"SELECT user_id, name, age, gender, created_at FROM Users WHERE user_id = ?",
			(user_id,),
		)
		row = await cursor.fetchone()
		if row is None:
			raise HTTPException(status_code=404, detail="User not found")
		return dict(row)

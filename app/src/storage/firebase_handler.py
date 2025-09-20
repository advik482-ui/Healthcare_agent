import os
import google.cloud.firestore
from datetime import datetime, timezone, timedelta

# Use a global variable to hold the client instance (singleton pattern)
_db_client = None

def _get_firestore_client():
    """Initializes and returns a Firestore client instance."""
    global _db_client
    if _db_client is None:
        try:
            _db_client = google.cloud.firestore.Client(database="kanhaiya")
            print("Firestore client initialized successfully for database 'kanhaiya'.")
        except Exception as e:
            print(f"FATAL: Could not initialize Firestore. Error: {e}")
    return _db_client

def save_chat_history(user_id, sender, message):
    """Saves a single message to the user's chat history for the current day."""
    db = _get_firestore_client()
    if not db: return

    try:
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        doc_ref = db.collection("users").document(user_id).collection("dailyData").document(today_str)
        chat_message = {
            "sender": sender,
            "message": message,
            "timestamp": datetime.now(timezone.utc)
        }
        # This continues to append messages to the conversation array during the day.
        doc_ref.set(
            {"conversation": google.cloud.firestore.ArrayUnion([chat_message])},
            merge=True
        )
    except Exception as e:
        print(f"Error saving chat history for user '{user_id}': {e}")

def get_todays_chat_history(user_id, limit=10):
    """Retrieves the most recent chat history for a user from the current day."""
    db = _get_firestore_client()
    if not db: return []

    try:
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        doc_ref = db.collection("users").document(user_id).collection("dailyData").document(today_str)
        doc = doc_ref.get()
        if doc.exists:
            conversation = doc.to_dict().get("conversation", [])
            return conversation[-limit:]
        return []
    except Exception as e:
        print(f"Error retrieving today's chat history for user '{user_id}': {e}")
        return []

def get_full_daily_conversation(user_id, date_str):
    """Fetches the entire conversation log for a specific day for summarization."""
    db = _get_firestore_client()
    if not db: return []
    
    try:
        doc_ref = db.collection("users").document(user_id).collection("dailyData").document(date_str)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict().get("conversation", [])
        return []
    except Exception as e:
        print(f"Error fetching full conversation for user '{user_id}' on {date_str}: {e}")
        return []

def save_daily_summary(user_id, date_str, summary):
    """
    Saves the daily summary and REPLACES the detailed conversation log.
    This is an aggressive data-saving measure.
    """
    db = _get_firestore_client()
    if not db: return
    
    try:
        doc_ref = db.collection("users").document(user_id).collection("dailyData").document(date_str)
        # --- THIS IS THE KEY CHANGE ---
        # We now completely overwrite the daily document.
        # This deletes the 'conversation' array and replaces it with the 'summary'.
        doc_ref.set({
            "summary": summary,
            "summarized_at": datetime.now(timezone.utc) # Good practice to log when this happened
        })
        print(f"Successfully REPLACED conversation with summary for user '{user_id}' on {date_str}.")
    except Exception as e:
        print(f"Error saving summary and replacing conversation for user '{user_id}' on {date_str}: {e}")


def get_past_summaries(user_id, days_to_fetch=7):
    """
    Retrieves conversation summaries from the past few days to provide long-term context.
    """
    db = _get_firestore_client()
    if not db: return []

    summaries = []
    today = datetime.now(timezone.utc)
    
    for i in range(1, days_to_fetch + 1):
        try:
            past_date = today - timedelta(days=i)
            date_str = past_date.strftime("%Y-%m-%d")
            doc_ref = db.collection("users").document(user_id).collection("dailyData").document(date_str)
            doc = doc_ref.get()
            if doc.exists:
                summary = doc.to_dict().get("summary")
                if summary:
                    summaries.append({"date": date_str, "summary": summary})
        except Exception as e:
            print(f"Could not fetch summary for {date_str} for user '{user_id}': {e}")
            continue
            
    return sorted(summaries, key=lambda x: x['date'], reverse=True)


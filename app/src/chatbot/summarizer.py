import os
import google.generativeai as genai
from datetime import datetime, timezone

# Import the Firebase handler to get data and save the summary
from src.storage.firebase_handler import get_full_daily_conversation, save_daily_summary

# Configure the Gemini API key
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
except KeyError:
    print("FATAL: GEMINI_API_KEY environment variable not set.")
    exit()

def _format_conversation_for_summary(conversation):
    """Formats the raw conversation log into a simple, readable script."""
    if not conversation:
        return "No conversation happened today."
    
    script = ""
    for message in conversation:
        role = "User" if message.get('sender') == 'user' else "Assistant"
        script += f"{role}: {message.get('message')}\n"
    return script

def summarize_day_for_user(user_id):
    """
    Orchestrates the daily summarization for a specific user.
    Fetches the conversation, generates a summary, and saves it.
    """
    try:
        today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        # 1. Fetch the full, raw conversation for today from Firebase
        conversation_log = get_full_daily_conversation(user_id, today_str)

        if not conversation_log:
            print(f"No conversation to summarize for user '{user_id}' on {today_str}.")
            return "No conversation to summarize."

        # 2. Format the conversation into a script for the AI
        conversation_script = _format_conversation_for_summary(conversation_log)

        # 3. Create a specific prompt for the summarization task
        prompt = f"""
        You are a medical data analyst. Your task is to read the following conversation script between a user and an AI Health Companion and create a concise summary.

        The summary should be a single paragraph and must include:
        - The main health symptoms or concerns mentioned by the user.
        - Any activities or lifestyle choices discussed (e.g., exercise, diet).
        - The overall mood or sentiment of the user if discernible.

        Conversation Script:
        ---
        {conversation_script}
        ---

        Concise Summary:
        """

        # 4. Call the Gemini API to generate the summary
        model = genai.GenerativeModel('gemini-1.5-flash')
        api_response = model.generate_content(prompt)
        summary_text = api_response.text.strip()

        # 5. Save the generated summary back to Firebase
        save_daily_summary(user_id, today_str, summary_text)

        print(f"Successfully generated and saved summary for user '{user_id}' for date {today_str}.")
        return summary_text

    except Exception as e:
        print(f"Error during summarization for user '{user_id}': {e}")
        return None

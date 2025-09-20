import os
import json
import google.generativeai as genai
from google.api_core.exceptions import GoogleAPICallError

# Import the database handlers
from src.storage.firebase_handler import get_todays_chat_history, get_past_summaries
from src.storage.sqlite_handler import get_user_profile_sync, get_comprehensive_user_data_sync

# Configure the Gemini API key
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
except KeyError:
    print("FATAL: GEMINI_API_KEY environment variable not set.")
    exit()

def _format_profile_for_prompt(profile):
    """Formats the user's SQLite profile into a readable string."""
    if not profile: return "No profile data available."
    profile_dict = dict(profile)
    profile_summary = "\n--- User Health Profile ---\n"
    for key, value in profile_dict.items():
        if value and key not in ['user_id']:
            profile_summary += f"- {key.replace('_', ' ').title()}: {value}\n"
    return profile_summary

def _format_history_for_prompt(history):
    """Formats today's recent chat history."""
    if not history: return ""
    formatted_history = "\n--- Today's Conversation (Most Recent) ---\n"
    for message in history:
        role = "User" if message.get('sender') == 'user' else "Health Companion"
        formatted_history += f"{role}: {message.get('message')}\n"
    return formatted_history

# --- NEW: Function to format past summaries ---
def _format_summaries_for_prompt(summaries):
    """Formats past daily summaries to provide long-term context."""
    if not summaries: return ""
    formatted_summaries = "\n--- Previous Day Summaries (Most Recent First) ---\n"
    for entry in summaries:
        formatted_summaries += f"Date: {entry['date']}\nSummary: {entry['summary']}\n\n"
    return formatted_summaries

def handle_conversation(user_id, user_message):
    """
    Manages a conversational turn using comprehensive user data, recent history, AND past summaries
    as rich context, while also extracting symptoms.
    """
    try:
        # 1. Retrieve COMPREHENSIVE user data from SQLite (ALL tables, ALL data)
        comprehensive_user_data = get_comprehensive_user_data_sync(user_id)
        
        # 2. Retrieve today's recent chat history from Firebase
        chat_history = get_todays_chat_history(user_id)
        history_context = _format_history_for_prompt(chat_history)
        
        # 3. Retrieve past daily summaries from Firebase for long-term memory
        past_summaries = get_past_summaries(user_id)
        summaries_context = _format_summaries_for_prompt(past_summaries)

        # 4. Construct the master prompt with comprehensive user data
        master_prompt = f"""
        You are an AI Health Companion. Your role is to be a supportive and helpful conversational partner.
        You have access to COMPREHENSIVE user health data including:
        1. Complete Health Profile: All physical metrics, medical conditions, medications, disorders, lab values
        2. Recent Symptoms: Last 30 days of symptom logs with severity and duration
        3. Previous Day Summaries: Concise summaries of past conversations for long-term memory
        4. Today's Conversation: The most recent messages from today

        Use ALL this information to have a deeply context-aware conversation. You can reference:
        - Specific health metrics (BMI, blood pressure, heart rate, etc.)
        - Medical conditions and allergies
        - Current medications and their schedules
        - Recent symptoms and their patterns
        - Lab values and health indicators
        - Previous conversation summaries for continuity

        Your secondary task is to silently identify and extract any medical symptoms the user mentions in their message.

        {comprehensive_user_data}

        {summaries_context}
        {history_context}

        Current User Message: "{user_message}"

        Based on all information, provide a JSON response with two keys:
        1. "response": Your natural, empathetic, and helpful conversational response that references relevant health data when appropriate.
        2. "symptoms": A list of any medical symptoms from the *current user message only*. If none, provide an empty list.

        JSON Response:
        """

        # 5. Call the Gemini API
        model = genai.GenerativeModel('gemini-1.5-flash')
        try:
            api_response = model.generate_content(master_prompt)
            cleaned_json = api_response.text.strip().replace('```json', '').replace('```', '').strip()
            parsed_response = json.loads(cleaned_json)
            
            ai_message = parsed_response.get("response", "I'm sorry, I'm having trouble responding.")
            extracted_symptoms = parsed_response.get("symptoms", [])

            return ai_message, extracted_symptoms

        except (GoogleAPICallError, ValueError, json.JSONDecodeError) as e:
            print(f"Error processing AI response: {e}")
            return "I'm sorry, I encountered an issue. Could you please rephrase?", []

    except Exception as e:
        print(f"An unexpected error occurred in handle_conversation: {e}")
        return "I'm sorry, a system error occurred. Please try again.", []


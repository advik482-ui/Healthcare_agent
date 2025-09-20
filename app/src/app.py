import os
import sys
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

# --- ROBUST PATHING SETUP ---
# This is a more robust way to handle imports when the script is run from the root directory.
# It ensures that Python knows where to find your 'src' modules.
# __file__ is the path to the current script (e.g., D:\medical_agent\src\app.py)
src_path = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(src_path)
sys.path.insert(0, project_root)

# Now, we can reliably import our custom modules
from src.chatbot.conversational_agent import handle_conversation
from src.chatbot.summarizer import summarize_day_for_user
from src.storage.firebase_handler import save_chat_history
from src.storage.sqlite_handler import add_symptom_log_sync, get_all_users_sync

# Load environment variables from the .env file in the project root
dotenv_path = os.path.join(project_root, '.env')
load_dotenv(dotenv_path=dotenv_path)

# --- FLASK APP INITIALIZATION (THE FIX) ---
# Explicitly define the absolute path to the 'templates' folder.
# This removes any guesswork for Flask.
template_dir = os.path.join(project_root, 'templates')
app = Flask(__name__, template_folder=template_dir)

# --- API ENDPOINTS ---

@app.route('/')
def index():
    """Render the chat interface."""
    return render_template('chat.html')

@app.route('/get_users', methods=['GET'])
def get_users():
    """Fetches all users to populate the UI dropdown."""
    try:
        users = get_all_users_sync()
        return jsonify(users)
    except Exception as e:
        print(f"Error fetching users: {e}")
        return jsonify({"error": "Could not fetch users"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    """Handles the main chat interaction."""
    data = request.json
    user_id = data.get("user_id")
    message = data.get("message")

    if not user_id or not message:
        return jsonify({"error": "user_id and message are required"}), 400

    try:
        save_chat_history(user_id, "user", message)
        ai_message, extracted_symptoms = handle_conversation(user_id, message)
        
        if extracted_symptoms:
            for symptom in extracted_symptoms:
                 add_symptom_log_sync(user_id, symptom)

        save_chat_history(user_id, "ai", ai_message)
        return jsonify({"response": ai_message})

    except Exception as e:
        print(f"An error occurred in the chat endpoint: {e}")
        return jsonify({"error": f"An internal error occurred: {str(e)}"}), 500

@app.route('/summarize', methods=['POST'])
def summarize():
    """An endpoint to manually trigger the daily summarization for a user."""
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    try:
        summary = summarize_day_for_user(user_id)
        if summary:
            return jsonify({
                "message": "Summarization successful. The raw chat log has been replaced with this summary.",
                "summary": summary
            })
        else:
            return jsonify({
                "message": "Summarization process ran, but no summary was generated (e.g., no conversation)."
            }), 200

    except Exception as e:
        print(f"An error occurred in the summarize endpoint: {e}")
        return jsonify({"error": f"An internal error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


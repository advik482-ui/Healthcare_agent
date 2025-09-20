import os
import google.generativeai as genai
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional

# Import the database handlers
from src.storage.sqlite_handler import get_comprehensive_user_data_sync

# Configure the Gemini API key
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
except KeyError:
    print("FATAL: GEMINI_API_KEY environment variable not set.")
    exit()

def _format_recent_symptoms_for_prompt(symptoms: List[Dict[str, Any]]) -> str:
    """Formats recent symptoms into a readable string for the AI prompt."""
    if not symptoms:
        return "No recent symptoms recorded."
    
    symptoms_text = "Recent symptoms:\n"
    for symptom in symptoms[:5]:  # Limit to 5 most recent
        severity = symptom.get('severity', 'unknown')
        duration = symptom.get('duration', 'unknown')
        notes = symptom.get('notes', '')
        date = symptom.get('log_date', 'unknown date')
        
        symptoms_text += f"• {symptom.get('symptom', 'N/A')} (Severity: {severity}, Duration: {duration})"
        if notes:
            symptoms_text += f" - Notes: {notes}"
        symptoms_text += f" - {date}\n"
    
    return symptoms_text

def _format_medications_for_prompt(medications: List[Dict[str, Any]]) -> str:
    """Formats user medications into a readable string for the AI prompt."""
    if not medications:
        return "No current medications."
    
    meds_text = "Current medications:\n"
    for med in medications[:3]:  # Limit to 3 most recent
        name = med.get('medication_name', 'N/A')
        dosage = med.get('dosage', 'N/A')
        frequency = med.get('frequency', 'N/A')
        
        meds_text += f"• {name} ({dosage}) - {frequency}\n"
    
    return meds_text

def _format_disorders_for_prompt(disorders: List[Dict[str, Any]]) -> str:
    """Formats user disorders into a readable string for the AI prompt."""
    if not disorders:
        return "No diagnosed disorders."
    
    disorders_text = "Diagnosed conditions:\n"
    for disorder in disorders[:3]:  # Limit to 3 most recent
        name = disorder.get('disorder_name', 'N/A')
        diagnosed_date = disorder.get('diagnosed_date', 'N/A')
        resolved = disorder.get('resolved_date', 'Ongoing')
        
        disorders_text += f"• {name} (Diagnosed: {diagnosed_date}, Status: {resolved})\n"
    
    return disorders_text

def _get_notification_context(user_id: int) -> str:
    """Gets comprehensive user context for personalized notifications."""
    try:
        # Get comprehensive user data
        comprehensive_data = get_comprehensive_user_data_sync(user_id)
        
        # Extract key information for notification context
        context = f"""
=== USER CONTEXT FOR PERSONALIZED NOTIFICATION ===
{comprehensive_data}

=== RECENT ACTIVITY SUMMARY ===
This user has been actively tracking their health data. Based on their profile, recent symptoms, medications, and conditions, create a personalized, engaging notification.
"""
        
        return context
    except Exception as e:
        print(f"Error getting user context for user {user_id}: {e}")
        return f"User {user_id} context unavailable."

def generate_personalized_notification(
    user_id: int, 
    notification_type: str = "general",
    custom_context: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generates a hyper-personalized notification for a user based on their comprehensive health data.
    
    Args:
        user_id: The user ID to generate notification for
        notification_type: Type of notification (medication, checkup, general, wellness, symptom_followup)
        custom_context: Optional custom context to include
    
    Returns:
        Dict with title, message, and notification_type
    """
    try:
        # Get user context
        user_context = _get_notification_context(user_id)
        
        # Create personalized prompt based on notification type
        if notification_type == "medication":
            prompt = f"""
            You are a friendly, supportive AI Health Companion. Create a personalized medication reminder notification for this user.
            
            {user_context}
            
            Create a warm, encouraging medication reminder that:
            - References their specific medications and conditions
            - Uses their name and personal health context
            - Is supportive and non-judgmental
            - Includes a fun, motivational element
            - Keeps it concise but personal (max 2 sentences)
            
            Return a JSON response with:
            - "title": A short, catchy title (max 50 characters)
            - "message": The personalized message (max 200 characters)
            - "notification_type": "medication"
            
            JSON Response:
            """
            
        elif notification_type == "wellness":
            prompt = f"""
            You are a friendly, supportive AI Health Companion. Create a personalized wellness check-in notification for this user.
            
            {user_context}
            
            Create a warm, caring wellness check-in that:
            - References their recent health activity and symptoms
            - Shows you remember their specific health conditions
            - Encourages positive health behaviors
            - Is uplifting and supportive
            - Includes a personal touch based on their profile
            - Keeps it concise but meaningful (max 2 sentences)
            
            Return a JSON response with:
            - "title": A short, encouraging title (max 50 characters)
            - "message": The personalized wellness message (max 200 characters)
            - "notification_type": "wellness"
            
            JSON Response:
            """
            
        elif notification_type == "symptom_followup":
            prompt = f"""
            You are a caring AI Health Companion. Create a personalized symptom follow-up notification for this user.
            
            {user_context}
            
            Create a thoughtful symptom follow-up that:
            - References their recent symptoms specifically
            - Shows concern and care for their wellbeing
            - Suggests appropriate next steps or encouragement
            - Is empathetic and supportive
            - Acknowledges their health journey
            - Keeps it caring but not alarming (max 2 sentences)
            
            Return a JSON response with:
            - "title": A caring, supportive title (max 50 characters)
            - "message": The personalized follow-up message (max 200 characters)
            - "notification_type": "symptom_followup"
            
            JSON Response:
            """
            
        elif notification_type == "checkup":
            prompt = f"""
            You are a proactive AI Health Companion. Create a personalized checkup reminder notification for this user.
            
            {user_context}
            
            Create a thoughtful checkup reminder that:
            - References their specific health conditions and medications
            - Emphasizes the importance based on their health profile
            - Is encouraging and supportive
            - Includes a personal touch
            - Motivates them to prioritize their health
            - Keeps it informative but friendly (max 2 sentences)
            
            Return a JSON response with:
            - "title": A clear, motivating title (max 50 characters)
            - "message": The personalized checkup message (max 200 characters)
            - "notification_type": "checkup"
            
            JSON Response:
            """
            
        else:  # general
            prompt = f"""
            You are a friendly, supportive AI Health Companion. Create a personalized general health notification for this user.
            
            {user_context}
            
            Create a warm, engaging general notification that:
            - References their health journey and recent activity
            - Shows you understand their specific health context
            - Encourages positive health behaviors
            - Is uplifting and motivational
            - Includes a personal, caring touch
            - Keeps it positive and supportive (max 2 sentences)
            
            Return a JSON response with:
            - "title": A friendly, engaging title (max 50 characters)
            - "message": The personalized general message (max 200 characters)
            - "notification_type": "general"
            
            JSON Response:
            """
        
        # Add custom context if provided
        if custom_context:
            prompt += f"\n\nAdditional Context: {custom_context}"
        
        # Call the Gemini API
        model = genai.GenerativeModel('gemini-1.5-flash')
        try:
            api_response = model.generate_content(prompt)
            cleaned_json = api_response.text.strip().replace('```json', '').replace('```', '').strip()
            
            import json
            parsed_response = json.loads(cleaned_json)
            
            # Validate response structure
            if not all(key in parsed_response for key in ['title', 'message', 'notification_type']):
                raise ValueError("Invalid response structure")
            
            # Ensure notification_type matches request
            parsed_response['notification_type'] = notification_type
            
            print(f"Successfully generated personalized notification for user {user_id}")
            return parsed_response
            
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing AI response for user {user_id}: {e}")
            # Fallback notification
            return {
                "title": "Health Check-in",
                "message": "Hi! Just checking in on your health journey. Keep up the great work!",
                "notification_type": notification_type
            }
            
    except Exception as e:
        print(f"Error generating personalized notification for user {user_id}: {e}")
        # Fallback notification
        return {
            "title": "Health Reminder",
            "message": "Don't forget to take care of your health today!",
            "notification_type": notification_type
        }

def generate_multiple_personalized_notifications(
    user_id: int, 
    notification_types: List[str] = None
) -> List[Dict[str, Any]]:
    """
    Generates multiple personalized notifications for a user.
    
    Args:
        user_id: The user ID to generate notifications for
        notification_types: List of notification types to generate
    
    Returns:
        List of notification dictionaries
    """
    if notification_types is None:
        notification_types = ["wellness", "medication", "general"]
    
    notifications = []
    for notification_type in notification_types:
        try:
            notification = generate_personalized_notification(user_id, notification_type)
            notifications.append(notification)
        except Exception as e:
            print(f"Error generating {notification_type} notification for user {user_id}: {e}")
            continue
    
    return notifications

def generate_daily_personalized_notification(user_id: int) -> Dict[str, Any]:
    """
    Generates a daily personalized notification based on user's current health status.
    Automatically determines the best notification type based on user data.
    """
    try:
        # Get user context to determine best notification type
        user_context = _get_notification_context(user_id)
        
        # Simple logic to determine notification type based on context
        if "recent symptoms" in user_context.lower() and "symptom" in user_context.lower():
            notification_type = "symptom_followup"
        elif "medication" in user_context.lower():
            notification_type = "medication"
        elif "checkup" in user_context.lower() or "last checkup" in user_context.lower():
            notification_type = "checkup"
        else:
            notification_type = "wellness"
        
        return generate_personalized_notification(user_id, notification_type)
        
    except Exception as e:
        print(f"Error generating daily personalized notification for user {user_id}: {e}")
        return {
            "title": "Daily Health Check",
            "message": "Hope you're having a healthy day! Remember to take care of yourself.",
            "notification_type": "general"
        }

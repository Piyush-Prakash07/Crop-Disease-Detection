import os
import json
import re
from PIL import Image
from dotenv import load_dotenv

# Load .env file
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Candidate models in order of preference
MODELS_TO_TRY = ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-2.5-pro"]

client = None
try:
    from google import genai
    from google.genai import types
    if GEMINI_API_KEY:
        client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Warning: Could not initialize google-genai client: {e}")

def clean_json_response(raw_text: str) -> dict:
    """Safely extracts JSON from markdown-wrapped Gemini output."""
    if not raw_text:
        return {}
    cleaned = re.sub(r"^```json\s*", "", raw_text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"^```\s*", "", cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r"```$", "", cleaned.strip(), flags=re.MULTILINE)
    try:
        return json.loads(cleaned)
    except Exception as e:
        start = raw_text.find('{')
        end = raw_text.rfind('}')
        if start != -1 and end != -1:
            try:
                return json.loads(raw_text[start:end+1])
            except Exception:
                pass
        return {"raw_text": raw_text, "error": f"JSON parse error: {str(e)}"}

def call_gemini_with_fallback(contents, config=None):
    """Executes prompt across available models with fallback."""
    if not client:
        raise ValueError("Gemini client is not initialized. Please verify GEMINI_API_KEY in backend/.env")

    last_error = None
    for model_name in MODELS_TO_TRY:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config=config
            )
            return response
        except Exception as err:
            last_error = err
            print(f"Model {model_name} failed: {err}. Trying fallback...")
            continue
    raise last_error

def diagnose_crop_with_gemini(image_path: str, crop_hint: str = "") -> dict:
    """
    Multimodal crop disease diagnosis using Gemini Vision.
    """
    if not os.path.exists(image_path):
        return {"error": "Image file not found"}

    try:
        img = Image.open(image_path)
        
        prompt = f"""
        You are an expert plant pathologist and precision agronomist.
        Carefully analyze this crop leaf photo.
        {f'Crop hint: {crop_hint}' if crop_hint else ''}

        Provide your diagnosis as a strict JSON object with this exact structure:
        {{
            "crop_name": "Accurate name of the crop/plant (e.g., Tomato, Potato, Pepper Bell, Corn, Apple, etc.)",
            "disease_detected": "Accurate disease name or 'Healthy'",
            "is_healthy": true or false,
            "confidence_score": 96,
            "severity": "Mild | Moderate | Severe | None (Healthy)",
            "affected_part": "Leaves / Stems / Fruit / Whole plant",
            "stage": "Early Stage | Mid-Progression | Advanced Stage",
            "symptoms_observed": [
                "Specific visual symptoms seen on this leaf"
            ],
            "biological_cause": "Pathogen name (fungus/bacteria/virus/pest) and environmental factors",
            "organic_treatments": [
                "Organic & eco-friendly remedies with application instructions"
            ],
            "chemical_treatments": [
                "Recommended chemical treatments / fungicides / pesticides with safety notes"
            ],
            "preventive_measures": [
                "Actionable farm management advice (watering, spacing, soil health)"
            ],
            "agronomist_doctor_note": "A concise 2-3 sentence summary message to the farmer with urgency assessment."
        }}

        Output ONLY valid JSON.
        """

        response = call_gemini_with_fallback(
            contents=[img, prompt],
            config={"response_mime_type": "application/json", "temperature": 0.2}
        )

        return clean_json_response(response.text)

    except Exception as e:
        print(f"Gemini Diagnosis Exception: {e}")
        return {
            "error": f"Gemini Vision API error: {str(e)}",
            "fallback_used": True
        }

def chat_with_agronomist(message: str, context: dict = None, language: str = "en") -> str:
    """
    Conversational AI Agronomist chatbot answering farmers' questions.
    """
    try:
        context_str = ""
        if context:
            context_str = f"""
            Active Crop Diagnosis Context:
            - Crop: {context.get('crop_name', 'Not specified')}
            - Diagnosis: {context.get('disease_detected', 'Not specified')}
            - Severity: {context.get('severity', 'Not specified')}
            - Confidence: {context.get('confidence_score', '')}%
            """

        system_instruction = f"""
        You are 'AgriDoctor AI' (Kisan Mitra), an empathetic, expert precision agronomist and crop doctor.
        You assist farmers with practical, safe, cost-effective, and scientifically sound agricultural advice.
        
        Guidelines:
        1. Keep answers actionable, concise, and easy to understand for farmers.
        2. Always recommend both organic/natural remedies and safe chemical options.
        3. Explain application dosages and weather precautions clearly (e.g. avoid spraying before rain).
        4. If the user asks in Hindi, Spanish, or another language, respond naturally in that language (Requested language: {language}).
        {context_str}
        """

        prompt = f"{system_instruction}\n\nFarmer's Question: {message}"

        response = call_gemini_with_fallback(
            contents=prompt,
            config={"temperature": 0.4}
        )
        return response.text.strip()

    except Exception as e:
        print(f"Gemini Chat Exception: {e}")
        return f"Sorry, I encountered an issue connecting to AgriDoctor AI: {str(e)}"

def generate_weather_spray_plan(crop_name: str, disease_name: str, weather_data: dict) -> dict:
    """
    Produces a 7-day personalized weather-based spraying and crop protection calendar.
    """
    try:
        temp = weather_data.get("temp", "28°C")
        humidity = weather_data.get("humidity", "75%")
        condition = weather_data.get("condition", "Partly Cloudy")
        forecast = weather_data.get("forecast", "Rain expected in 2 days")

        prompt = f"""
        As an expert precision agronomist, create a 7-day weather-aware crop management and spray schedule.
        
        Crop: {crop_name}
        Detected Disease: {disease_name}
        Current Microclimate:
        - Temperature: {temp}
        - Humidity: {humidity}
        - Current Condition: {condition}
        - Forecast: {forecast}

        Output a strict JSON object with this exact structure:
        {{
            "risk_assessment": "Short summary of how current weather affects disease propagation",
            "spray_urgency": "Immediate / Wait for dry window / Low urgency",
            "schedule": [
                {{
                    "day": "Day 1 (Today)",
                    "action": "Specific action (e.g., Spray systemic fungicide at dawn, Prune infected foliage, Do not spray due to rain, etc.)",
                    "can_spray": true,
                    "reason": "Why this action is advised based on temperature/humidity/rain",
                    "caution": "Protective equipment or wind caution"
                }},
                {{
                    "day": "Day 2",
                    "action": "...",
                    "can_spray": false,
                    "reason": "...",
                    "caution": "..."
                }},
                {{
                    "day": "Day 3",
                    "action": "...",
                    "can_spray": true,
                    "reason": "...",
                    "caution": "..."
                }},
                {{
                    "day": "Day 4",
                    "action": "...",
                    "can_spray": true,
                    "reason": "...",
                    "caution": "..."
                }},
                {{
                    "day": "Day 5",
                    "action": "...",
                    "can_spray": true,
                    "reason": "...",
                    "caution": "..."
                }},
                {{
                    "day": "Day 6",
                    "action": "...",
                    "can_spray": true,
                    "reason": "...",
                    "caution": "..."
                }},
                {{
                    "day": "Day 7",
                    "action": "...",
                    "can_spray": true,
                    "reason": "...",
                    "caution": "..."
                }}
            ],
            "key_takeaway": "Main golden rule for this week to save the crop"
        }}
        """

        response = call_gemini_with_fallback(
            contents=prompt,
            config={"response_mime_type": "application/json", "temperature": 0.2}
        )
        return clean_json_response(response.text)

    except Exception as e:
        print(f"Weather Spray Plan Error: {e}")
        return {"error": str(e)}

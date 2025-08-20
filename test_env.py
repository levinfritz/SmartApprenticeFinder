"""
Test if .env file is loaded correctly
"""
import os
from dotenv import load_dotenv

def test_env_loading():
    print("=== Testing .env Loading ===")
    
    # Load .env file explicitly
    print("Loading .env file...")
    load_dotenv()
    
    # Check OpenAI key
    openai_key = os.getenv('OPENAI_API_KEY')
    if openai_key:
        print(f"OpenAI Key found: {openai_key[:15]}...{openai_key[-10:]}")
        print(f"   Full length: {len(openai_key)} characters")
        print(f"   Starts with: {openai_key[:12]}")
    else:
        print("OpenAI Key NOT found")
    
    # Check Google Maps key
    maps_key = os.getenv('GOOGLE_MAPS_API_KEY')
    if maps_key:
        print(f"Google Maps Key found: {maps_key[:10]}...{maps_key[-5:]}")
        print(f"   Full length: {len(maps_key)} characters")
        print(f"   Starts with: {maps_key[:6]}")
    else:
        print("Google Maps Key NOT found")
    
    # Check other env vars
    print(f"\nOther .env variables:")
    print(f"   DEBUG: {os.getenv('DEBUG')}")
    print(f"   LOG_LEVEL: {os.getenv('LOG_LEVEL')}")
    
    # List all environment variables starting with certain prefixes
    print(f"\nAll environment variables with API keys:")
    for key, value in os.environ.items():
        if key.startswith(('OPENAI', 'GOOGLE', 'API')):
            print(f"   {key}: {value[:10]}..." if value else f"   {key}: None")

if __name__ == "__main__":
    test_env_loading()
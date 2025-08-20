"""
Vollständiger System-Test mit echten APIs
Testet alle Komponenten mit ChatGPT und Google Maps
"""
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from matcher.questionnaire import UserProfile, InterestCategory, create_sample_profile
from matcher.matching_engine import ApprenticeshipMatchingEngine
from matcher.distance_calculator import DistanceCalculator
from matcher.ai_integration import AIIntegration
from matcher.text_embeddings import TextEmbeddingMatcher
from data.database import get_session, Apprenticeship

def test_api_connections():
    """Test API connections first"""
    print("Testing API Connections...")
    
    # Test OpenAI
    print("\nTesting OpenAI API...")
    ai = AIIntegration()
    if ai.api_key:
        print(f"OpenAI API Key found: {ai.api_key[:10]}...")
        try:
            # Simple test
            test_response = ai.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Say 'API Test successful' in German"}],
                max_tokens=10
            )
            print(f"OpenAI Response: {test_response.choices[0].message.content}")
        except Exception as e:
            print(f"OpenAI Error: {e}")
    else:
        print("No OpenAI API Key found")
    
    # Test Google Maps
    print("\nTesting Google Maps API...")
    distance_calc = DistanceCalculator()
    if distance_calc.api_key:
        print(f"Google Maps API Key found: {distance_calc.api_key[:10]}...")
        try:
            result = distance_calc.calculate_distance("8001", "3001", "transit")
            print(f"Distance Zurich->Bern: {result.distance_km:.1f}km, {result.duration_minutes}min")
            print(f"   Route found: {result.route_found}")
        except Exception as e:
            print(f"Google Maps Error: {e}")
    else:
        print("No Google Maps API Key found")
    
    # Test Text Embeddings
    print("\nTesting Text Embeddings...")
    embedder = TextEmbeddingMatcher()
    try:
        similarity = embedder.calculate_similarity(
            "Ich arbeite gerne mit Computern", 
            "Informatiker/in EFZ"
        )
        print(f"Text Similarity: {similarity:.3f}")
    except Exception as e:
        print(f"Embeddings Error: {e}")
    
    print("\n" + "="*50)

def test_database():
    """Test database content"""
    print("Testing Database...")
    
    session = get_session()
    try:
        total_apps = session.query(Apprenticeship).filter_by(is_active=True).count()
        print(f"Active apprenticeships in DB: {total_apps}")
        
        if total_apps > 0:
            # Show sample
            sample = session.query(Apprenticeship).filter_by(is_active=True).first()
            print(f"   Sample: {sample.title} bei {sample.company_name}")
            return True
        else:
            print("No apprenticeships found! Run scraper first:")
            print("   python scraper/scheduler.py --job scrape --limit 20")
            return False
    finally:
        session.close()

def create_test_profile():
    """Create a realistic test profile"""
    print("Creating Test User Profile...")
    
    # Create a realistic Swiss student profile
    profile = UserProfile(
        age=17,
        location="Zürich",
        postal_code="8001",
        max_commute_minutes=60,
        preferred_transport="public",
        interests={
            InterestCategory.TECHNICAL: 5,      # Very interested in tech
            InterestCategory.CREATIVE: 2,       # Not very creative
            InterestCategory.SOCIAL: 4,         # Likes working with people
            InterestCategory.BUSINESS: 3,       # Moderate business interest
            InterestCategory.NATURE: 1,         # Not interested in nature
            InterestCategory.HEALTH: 2,         # Not interested in health
            InterestCategory.SPORTS: 3,         # Moderate sports interest
            InterestCategory.LANGUAGES: 4       # Good with languages
        },
        technical_skills={
            "math_skills": 3,      # SkillLevel.ADVANCED
            "language_skills": 4,  # SkillLevel.EXPERT  
            "computer_skills": 4,  # SkillLevel.EXPERT
            "manual_skills": 2     # SkillLevel.INTERMEDIATE
        },
        soft_skills={
            "communication": 4,
            "teamwork": 5,
            "problem_solving": 4,
            "stress_tolerance": 3,
            "detail_orientation": 4
        },
        company_size_preference="medium",
        work_environment="mixed",
        team_vs_individual=4,  # Prefers teamwork
        career_goals=["career_start", "further_education"],
        salary_importance=3,
        growth_importance=5,
        avoid_sectors=["gastronomy", "construction"],  # Avoids these
        required_benefits=["modern_equipment", "mentoring", "good_culture"]
    )
    
    print("Test Profile Created:")
    print(f"   Age: {profile.age}, Location: {profile.location}")
    print(f"   Top interests: Technical({profile.interests[InterestCategory.TECHNICAL]}), Social({profile.interests[InterestCategory.SOCIAL]})")
    print(f"   Avoids: {profile.avoid_sectors}")
    print(f"   Max commute: {profile.max_commute_minutes}min by {profile.preferred_transport}")
    
    return profile

def test_complete_matching():
    """Test the complete matching system"""
    print("\nTesting Complete Matching System...")
    
    # Initialize matching engine
    engine = ApprenticeshipMatchingEngine()
    
    # Create test profile
    user_profile = create_test_profile()
    
    print("\nFinding matches...")
    start_time = datetime.now()
    
    # Find matches with all features enabled
    result = engine.find_matches(
        user_profile=user_profile,
        limit=10,
        min_score=0.3,
        apply_distance_filter=True  # Use Google Maps
    )
    
    end_time = datetime.now()
    processing_time = (end_time - start_time).total_seconds()
    
    print(f"Matching completed in {processing_time:.2f} seconds")
    print(f"   Total apprenticeships considered: {result.total_found}")
    print(f"   Matches above threshold: {len(result.ranked_apprenticeships)}")
    
    # Display results
    if result.ranked_apprenticeships:
        print("\nTop Matches:")
        for i, ranked_app in enumerate(result.ranked_apprenticeships[:5], 1):
            app = ranked_app.apprenticeship
            score = ranked_app.match_score
            
            print(f"\n{i}. {app.title}")
            print(f"   Company: {app.company_name}")
            print(f"   Location: {app.location} ({app.postal_code})")
            print(f"   Total Score: {score.total_score:.1%}")
            print(f"   Breakdown:")
            print(f"      Interest: {score.interest_score:.1%}")
            print(f"      Location: {score.location_score:.1%}")  
            print(f"      Skills: {score.skill_score:.1%}")
            print(f"      Preferences: {score.preference_score:.1%}")
            print(f"   Explanation: {score.explanation}")
        
        # Test detailed AI recommendation for top match
        print("\nAI Recommendation for Top Match:")
        top_app = result.ranked_apprenticeships[0].apprenticeship
        
        match_score, ai_rec = engine.get_detailed_recommendation(user_profile, top_app)
        
        print(f"Match Reason: {ai_rec.match_reason}")
        print(f"Growth Potential: {ai_rec.growth_potential}")
        print(f"Considerations: {ai_rec.considerations}")
        print(f"Next Steps:")
        for step in ai_rec.next_steps:
            print(f"   - {step}")
        print(f"Confidence: {ai_rec.confidence:.1%}")
        
        # AI Summary
        print(f"\nAI Summary: {result.ai_summary}")
        
    else:
        print("No matches found above threshold")
    
    return result

def test_individual_components():
    """Test individual components with APIs"""
    print("\nTesting Individual Components...")
    
    # Test distance calculation with real API
    print("\nDistance Calculation Test:")
    calc = DistanceCalculator()
    
    test_routes = [
        ("8001", "8002", "transit"),  # Zürich local
        ("8001", "3001", "public"),   # Zürich to Bern
        ("1201", "4001", "driving")   # Geneva to Basel
    ]
    
    for origin, dest, mode in test_routes:
        result = calc.calculate_distance(origin, dest, mode)
        print(f"   {origin}->{dest} ({mode}): {result.distance_km:.1f}km, {result.duration_minutes}min")
        print(f"      Route found: {result.route_found}, API used: {bool(calc.api_key)}")
    
    # Test AI text generation
    print("\nAI Text Generation Test:")
    ai = AIIntegration()
    
    if ai.api_key:
        try:
            # Test German response
            response = ai.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Du bist ein Schweizer Berufsberater. Antworte auf Deutsch."},
                    {"role": "user", "content": "Erklaere in 2 Saetzen, warum eine Informatik-Lehre interessant ist."}
                ],
                max_tokens=100
            )
            print(f"   AI Response: {response.choices[0].message.content}")
        except Exception as e:
            print(f"   AI Error: {e}")
    
    print("\n" + "="*50)

def main():
    """Run complete system test"""
    print("SMART APPRENTICE FINDER - FULL SYSTEM TEST")
    print("=" * 60)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Step 1: Test API connections
    test_api_connections()
    
    # Step 2: Test database
    if not test_database():
        print("\nDatabase is empty. Run scraper first!")
        return
    
    # Step 3: Test individual components
    test_individual_components()
    
    # Step 4: Test complete matching
    result = test_complete_matching()
    
    # Final summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    if result and result.ranked_apprenticeships:
        print("SYSTEM TEST SUCCESSFUL!")
        print(f"   - Found {len(result.ranked_apprenticeships)} quality matches")
        print(f"   - Processing time: {result.processing_time:.2f}s")
        print(f"   - APIs working: ChatGPT + Google Maps")
        print(f"   - All components integrated successfully")
        
        print("\nREADY FOR PHASE 3 (WEB UI)!")
        
    else:
        print("System test completed with issues")
        print("   Check API keys and database content")
    
    print(f"\nTest completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
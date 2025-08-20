from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class InterestCategory(Enum):
    TECHNICAL = "technical"
    CREATIVE = "creative"
    SOCIAL = "social"
    BUSINESS = "business"
    NATURE = "nature"
    HEALTH = "health"
    SPORTS = "sports"
    LANGUAGES = "languages"

class SkillLevel(Enum):
    BEGINNER = 1
    INTERMEDIATE = 2
    ADVANCED = 3
    EXPERT = 4

@dataclass
class UserProfile:
    """Complete user profile for apprenticeship matching"""
    # Personal Info
    age: int
    location: str
    postal_code: str
    max_commute_minutes: int
    preferred_transport: str  # "car", "public", "bike", "walk"
    
    # Interests (1-5 scale)
    interests: Dict[InterestCategory, int]
    
    # Skills and Strengths
    technical_skills: Dict[str, SkillLevel]
    soft_skills: Dict[str, int]  # 1-5 scale
    
    # Preferences
    company_size_preference: str  # "small", "medium", "large", "any"
    work_environment: str  # "office", "field", "mixed", "any"
    team_vs_individual: int  # 1-5 scale (1=individual, 5=team)
    
    # Career Goals
    career_goals: List[str]
    salary_importance: int  # 1-5 scale
    growth_importance: int  # 1-5 scale
    
    # Deal Breakers
    avoid_sectors: List[str]
    required_benefits: List[str]

class ApprenticeshipQuestionnaire:
    """Interactive questionnaire to build user profile"""
    
    def __init__(self):
        self.questions = self._create_questions()
        
    def _create_questions(self) -> List[Dict]:
        """Create structured questionnaire"""
        return [
            # Basic Info
            {
                "id": "personal_info",
                "title": "Persönliche Angaben",
                "questions": [
                    {"key": "age", "text": "Wie alt bist du?", "type": "number", "min": 14, "max": 25},
                    {"key": "location", "text": "In welcher Stadt/Region wohnst du?", "type": "text"},
                    {"key": "postal_code", "text": "Deine Postleitzahl:", "type": "text", "pattern": r"\d{4}"},
                    {"key": "max_commute_minutes", "text": "Maximale Pendelzeit (Minuten):", "type": "number", "min": 5, "max": 120, "default": 45},
                    {"key": "preferred_transport", "text": "Bevorzugtes Verkehrsmittel:", "type": "select", 
                     "options": [("car", "Auto"), ("public", "ÖV"), ("bike", "Velo"), ("walk", "Zu Fuss"), ("mixed", "Gemischt")]}
                ]
            },
            
            # Interests
            {
                "id": "interests",
                "title": "Deine Interessen",
                "description": "Bewerte dein Interesse an folgenden Bereichen (1 = gar nicht interessiert, 5 = sehr interessiert):",
                "questions": [
                    {"key": "technical", "text": "Technik & Informatik (Computer, Maschinen, Programmieren)", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "creative", "text": "Kreativität & Design (Kunst, Gestaltung, Medien)", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "social", "text": "Menschen & Beziehungen (Beratung, Pflege, Bildung)", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "business", "text": "Wirtschaft & Verwaltung (Verkauf, Management, Buchhaltung)", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "nature", "text": "Natur & Umwelt (Gartenbau, Landwirtschaft, Umweltschutz)", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "health", "text": "Gesundheit & Medizin (Medizin, Pharmazie, Therapie)", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "sports", "text": "Sport & Bewegung (Fitness, Outdoor, Sportmanagement)", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "languages", "text": "Sprachen & Kommunikation (Fremdsprachen, Journalismus)", "type": "scale", "scale": [1,2,3,4,5]}
                ]
            },
            
            # Skills Assessment
            {
                "id": "skills",
                "title": "Deine Fähigkeiten",
                "description": "Schätze deine Fähigkeiten ehrlich ein:",
                "questions": [
                    {"key": "math_skills", "text": "Mathematik", "type": "skill_level"},
                    {"key": "language_skills", "text": "Sprachen (Deutsch/Englisch)", "type": "skill_level"},
                    {"key": "computer_skills", "text": "Computer & Internet", "type": "skill_level"},
                    {"key": "manual_skills", "text": "Handwerkliche Tätigkeiten", "type": "skill_level"},
                    {"key": "communication", "text": "Kommunikation & Präsentation", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "teamwork", "text": "Teamarbeit", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "problem_solving", "text": "Problemlösung", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "stress_tolerance", "text": "Stressresistenz", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "detail_orientation", "text": "Genauigkeit & Detailarbeit", "type": "scale", "scale": [1,2,3,4,5]}
                ]
            },
            
            # Work Preferences
            {
                "id": "work_preferences",
                "title": "Arbeitsumfeld & Präferenzen",
                "questions": [
                    {"key": "company_size_preference", "text": "Bevorzugte Firmengrösse:", "type": "select",
                     "options": [("small", "Klein (< 50 Mitarbeiter)"), ("medium", "Mittel (50-500)"), ("large", "Gross (> 500)"), ("any", "Egal")]},
                    {"key": "work_environment", "text": "Arbeitsort:", "type": "select",
                     "options": [("office", "Büro"), ("field", "Draussen/Unterwegs"), ("workshop", "Werkstatt/Labor"), ("mixed", "Gemischt"), ("any", "Egal")]},
                    {"key": "team_vs_individual", "text": "Arbeitsstil:", "type": "scale_labeled", 
                     "scale": [1,2,3,4,5], "labels": ["Alleine arbeiten", "Teamarbeit"]},
                    {"key": "routine_vs_variety", "text": "Arbeitsart:", "type": "scale_labeled",
                     "scale": [1,2,3,4,5], "labels": ["Routine & Struktur", "Abwechslung & Flexibilität"]}
                ]
            },
            
            # Career Goals
            {
                "id": "career_goals",
                "title": "Ziele & Prioritäten",
                "questions": [
                    {"key": "primary_goal", "text": "Hauptziel der Lehre:", "type": "select",
                     "options": [
                         ("learn_trade", "Handwerk/Beruf lernen"),
                         ("career_start", "Karriere starten"),
                         ("further_education", "Basis für Weiterbildung"),
                         ("financial_independence", "Finanzielle Unabhängigkeit"),
                         ("personal_growth", "Persönliche Entwicklung")
                     ]},
                    {"key": "salary_importance", "text": "Wie wichtig ist dir ein guter Lohn?", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "growth_importance", "text": "Wie wichtig sind Aufstiegschancen?", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "work_life_balance", "text": "Wie wichtig ist Work-Life-Balance?", "type": "scale", "scale": [1,2,3,4,5]},
                    {"key": "job_security", "text": "Wie wichtig ist Jobsicherheit?", "type": "scale", "scale": [1,2,3,4,5]}
                ]
            },
            
            # Deal Breakers
            {
                "id": "constraints",
                "title": "Ausschlusskriterien",
                "questions": [
                    {"key": "avoid_sectors", "text": "Branchen, die du meiden möchtest:", "type": "multiselect",
                     "options": [
                         ("gastronomy", "Gastronomie"),
                         ("retail", "Detailhandel"),
                         ("construction", "Bauwesen"),
                         ("finance", "Finanzwesen"),
                         ("manufacturing", "Produktion"),
                         ("healthcare", "Gesundheitswesen"),
                         ("it", "IT/Tech"),
                         ("education", "Bildung")
                     ]},
                    {"key": "required_benefits", "text": "Must-have Benefits:", "type": "multiselect",
                     "options": [
                         ("flexible_hours", "Flexible Arbeitszeiten"),
                         ("public_transport", "ÖV-Anbindung"),
                         ("modern_equipment", "Moderne Ausrüstung"),
                         ("mentoring", "Gute Betreuung"),
                         ("career_path", "Klare Aufstiegschancen"),
                         ("further_education", "Weiterbildungsmöglichkeiten"),
                         ("good_culture", "Gute Firmenkultur")
                     ]}
                ]
            }
        ]
    
    def get_profession_mapping(self) -> Dict[str, List[InterestCategory]]:
        """Map Swiss apprenticeship professions to interest categories"""
        return {
            # Technical & IT
            "Informatiker/in EFZ": [InterestCategory.TECHNICAL],
            "Elektroniker/in EFZ": [InterestCategory.TECHNICAL],
            "Polymechaniker/in EFZ": [InterestCategory.TECHNICAL],
            "Automatiker/in EFZ": [InterestCategory.TECHNICAL],
            "Anlagen- und Apparatebauer/in EFZ": [InterestCategory.TECHNICAL],
            
            # Business & Commerce
            "Kaufmann/-frau EFZ": [InterestCategory.BUSINESS],
            "Detailhandelsfachmann/-frau EFZ": [InterestCategory.BUSINESS, InterestCategory.SOCIAL],
            "Detailhandelsassistent/in EBA": [InterestCategory.BUSINESS, InterestCategory.SOCIAL],
            "Logistiker/in EFZ": [InterestCategory.BUSINESS, InterestCategory.TECHNICAL],
            
            # Healthcare
            "Fachmann/-frau Gesundheit EFZ": [InterestCategory.HEALTH, InterestCategory.SOCIAL],
            "Medizinische/r Praxisassistent/in EFZ": [InterestCategory.HEALTH, InterestCategory.SOCIAL],
            "Fachmann/-frau Apotheke EFZ": [InterestCategory.HEALTH, InterestCategory.BUSINESS],
            "Tierpfleger/in EFZ": [InterestCategory.HEALTH, InterestCategory.NATURE],
            
            # Gastronomy & Service
            "Koch/Köchin EFZ": [InterestCategory.CREATIVE, InterestCategory.SOCIAL],
            "Restaurantfachmann/-frau EFZ": [InterestCategory.SOCIAL, InterestCategory.BUSINESS],
            
            # Creative & Design
            "Grafiker/in EFZ": [InterestCategory.CREATIVE, InterestCategory.TECHNICAL],
            "Polydesigner/in 3D EFZ": [InterestCategory.CREATIVE, InterestCategory.TECHNICAL],
            
            # Construction & Crafts
            "Maurer/in EFZ": [InterestCategory.TECHNICAL, InterestCategory.NATURE],
            "Zimmermann/Zimmerin EFZ": [InterestCategory.TECHNICAL, InterestCategory.CREATIVE],
            "Elektroplaner/in EFZ": [InterestCategory.TECHNICAL, InterestCategory.BUSINESS],
            "Heizungsinstallateur/in EFZ": [InterestCategory.TECHNICAL],
            "Metallbauer/in EFZ": [InterestCategory.TECHNICAL, InterestCategory.CREATIVE],
            "Strassenbauer/in EFZ": [InterestCategory.TECHNICAL, InterestCategory.NATURE],
            
            # Nature & Environment
            "Landwirt/in EFZ": [InterestCategory.NATURE, InterestCategory.TECHNICAL],
            "Gärtner/in EFZ": [InterestCategory.NATURE, InterestCategory.CREATIVE],
            "Forstwart/in EFZ": [InterestCategory.NATURE, InterestCategory.SPORTS],
            
            # Finance & Administration
            "Kaufmann/-frau EFZ Bank": [InterestCategory.BUSINESS, InterestCategory.TECHNICAL],
            "Kaufmann/-frau EFZ Treuhand": [InterestCategory.BUSINESS, InterestCategory.TECHNICAL],
            
            # Sports & Fitness
            "Sportfachmann/-frau EFZ": [InterestCategory.SPORTS, InterestCategory.SOCIAL],
            
            # Other
            "Fachmann/-frau Betriebsunterhalt EFZ": [InterestCategory.TECHNICAL, InterestCategory.NATURE],
            "Müller/in EFZ": [InterestCategory.TECHNICAL, InterestCategory.NATURE]
        }
    
    def calculate_interest_match(self, user_interests: Dict[InterestCategory, int], profession: str) -> float:
        """Calculate how well user interests match a profession"""
        profession_mapping = self.get_profession_mapping()
        
        if profession not in profession_mapping:
            return 0.5  # Neutral score for unknown professions
        
        required_interests = profession_mapping[profession]
        
        if not required_interests:
            return 0.5
        
        # Calculate weighted average of relevant interests
        total_score = 0
        for interest in required_interests:
            if interest in user_interests:
                total_score += user_interests[interest]
        
        return min(total_score / len(required_interests) / 5.0, 1.0)  # Normalize to 0-1

def create_sample_profile() -> UserProfile:
    """Create a sample user profile for testing"""
    return UserProfile(
        age=17,
        location="Zürich",
        postal_code="8001",
        max_commute_minutes=45,
        preferred_transport="public",
        interests={
            InterestCategory.TECHNICAL: 4,
            InterestCategory.CREATIVE: 2,
            InterestCategory.SOCIAL: 3,
            InterestCategory.BUSINESS: 3,
            InterestCategory.NATURE: 1,
            InterestCategory.HEALTH: 2,
            InterestCategory.SPORTS: 3,
            InterestCategory.LANGUAGES: 4
        },
        technical_skills={
            "math_skills": SkillLevel.ADVANCED,
            "language_skills": SkillLevel.ADVANCED,
            "computer_skills": SkillLevel.EXPERT,
            "manual_skills": SkillLevel.INTERMEDIATE
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
        team_vs_individual=4,
        career_goals=["career_start", "further_education"],
        salary_importance=3,
        growth_importance=4,
        avoid_sectors=["gastronomy", "construction"],
        required_benefits=["flexible_hours", "modern_equipment", "mentoring"]
    )

if __name__ == "__main__":
    # Test the questionnaire
    questionnaire = ApprenticeshipQuestionnaire()
    sample_profile = create_sample_profile()
    
    # Test interest matching
    test_professions = [
        "Informatiker/in EFZ",
        "Koch/Köchin EFZ", 
        "Kaufmann/-frau EFZ",
        "Polymechaniker/in EFZ"
    ]
    
    print("=== Interest Match Test ===")
    for profession in test_professions:
        match_score = questionnaire.calculate_interest_match(sample_profile.interests, profession)
        print(f"{profession}: {match_score:.2f}")
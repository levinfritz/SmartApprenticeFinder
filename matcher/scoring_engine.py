import math
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from datetime import datetime
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from matcher.questionnaire import UserProfile, ApprenticeshipQuestionnaire, InterestCategory
from data.database import Apprenticeship, get_session

@dataclass
class MatchScore:
    """Complete match score with breakdown"""
    total_score: float  # 0-1 overall score
    interest_score: float  # 0-1 interest match
    location_score: float  # 0-1 location/distance score  
    skill_score: float  # 0-1 skill requirements match
    preference_score: float  # 0-1 work preferences match
    explanation: str  # Why this match works
    
    def __post_init__(self):
        # Ensure scores are between 0 and 1
        self.total_score = max(0, min(1, self.total_score))
        self.interest_score = max(0, min(1, self.interest_score))
        self.location_score = max(0, min(1, self.location_score))
        self.skill_score = max(0, min(1, self.skill_score))
        self.preference_score = max(0, min(1, self.preference_score))

@dataclass 
class RankedApprenticeship:
    """Apprenticeship with match score and ranking"""
    apprenticeship: Apprenticeship
    match_score: MatchScore
    rank: int

class ScoringEngine:
    """Advanced scoring engine for apprenticeship matching"""
    
    def __init__(self):
        self.questionnaire = ApprenticeshipQuestionnaire()
        
        # Scoring weights - can be tuned
        self.weights = {
            'interest': 0.35,      # Most important
            'location': 0.25,      # Very important
            'skills': 0.20,        # Important
            'preferences': 0.20    # Moderately important
        }
        
        # Company size mapping
        self.company_size_indicators = {
            'small': ['gmbh', 'ag', 'einzelunternehmen', 'praxis', 'kanzlei'],
            'medium': ['gruppe', 'holding', 'corporation'],
            'large': ['bank', 'versicherung', 'konzern', 'international', 'schweiz ag', 'suisse']
        }
    
    def score_apprenticeship(self, user_profile: UserProfile, apprenticeship: Apprenticeship) -> MatchScore:
        """Calculate complete match score for an apprenticeship"""
        
        # Calculate individual scores
        interest_score = self._calculate_interest_score(user_profile, apprenticeship)
        location_score = self._calculate_location_score(user_profile, apprenticeship)
        skill_score = self._calculate_skill_score(user_profile, apprenticeship)
        preference_score = self._calculate_preference_score(user_profile, apprenticeship)
        
        # Calculate weighted total score
        total_score = (
            self.weights['interest'] * interest_score +
            self.weights['location'] * location_score +
            self.weights['skills'] * skill_score +
            self.weights['preferences'] * preference_score
        )
        
        # Generate explanation
        explanation = self._generate_explanation(
            user_profile, apprenticeship, 
            interest_score, location_score, skill_score, preference_score
        )
        
        return MatchScore(
            total_score=total_score,
            interest_score=interest_score,
            location_score=location_score,
            skill_score=skill_score,
            preference_score=preference_score,
            explanation=explanation
        )
    
    def _calculate_interest_score(self, user_profile: UserProfile, apprenticeship: Apprenticeship) -> float:
        """Calculate how well the apprenticeship matches user interests"""
        profession = apprenticeship.profession or apprenticeship.title
        
        # Use questionnaire mapping
        base_score = self.questionnaire.calculate_interest_match(user_profile.interests, profession)
        
        # Boost score for strong interests
        if base_score > 0.8:
            base_score = min(1.0, base_score * 1.1)
        
        # Penalty for avoided sectors
        if self._is_in_avoided_sector(apprenticeship, user_profile.avoid_sectors):
            base_score *= 0.3
            
        return base_score
    
    def _calculate_location_score(self, user_profile: UserProfile, apprenticeship: Apprenticeship) -> float:
        """Calculate location compatibility score"""
        
        # Extract postal codes
        user_postal = user_profile.postal_code
        apprentice_postal = apprenticeship.postal_code
        
        if not apprentice_postal or not user_postal:
            return 0.7  # Neutral score when postal code missing
        
        try:
            user_code = int(user_postal)
            app_code = int(apprentice_postal)
            
            # Simple distance estimation based on postal code difference
            # In Switzerland, postal codes roughly correlate with geographic distance
            postal_diff = abs(user_code - app_code)
            
            if postal_diff == 0:
                return 1.0  # Same postal code
            elif postal_diff < 100:
                return 0.9  # Very close
            elif postal_diff < 500:
                return 0.8  # Close
            elif postal_diff < 1000:
                return 0.6  # Moderate distance
            elif postal_diff < 2000:
                return 0.4  # Far
            else:
                return 0.2  # Very far
                
        except (ValueError, TypeError):
            return 0.7  # Default when postal codes are invalid
    
    def _calculate_skill_score(self, user_profile: UserProfile, apprenticeship: Apprenticeship) -> float:
        """Calculate skill requirements match"""
        profession = apprenticeship.profession or apprenticeship.title
        description = (apprenticeship.description or "").lower()
        requirements = (apprenticeship.requirements or "").lower()
        
        combined_text = f"{profession.lower()} {description} {requirements}"
        
        score = 0.7  # Base score
        
        # Technical skills assessment
        if any(word in combined_text for word in ['informatik', 'computer', 'digital', 'software']):
            if user_profile.technical_skills.get('computer_skills'):
                skill_level = user_profile.technical_skills['computer_skills'].value
                score += (skill_level - 2) * 0.1  # Boost for higher skill
        
        # Math skills for technical professions
        if any(word in combined_text for word in ['mathematik', 'rechnen', 'kalkulation', 'technik']):
            if user_profile.technical_skills.get('math_skills'):
                skill_level = user_profile.technical_skills['math_skills'].value
                score += (skill_level - 2) * 0.1
        
        # Language skills for customer-facing roles
        if any(word in combined_text for word in ['kund', 'beratung', 'verkauf', 'service', 'kommunikation']):
            communication_score = user_profile.soft_skills.get('communication', 3)
            score += (communication_score - 3) * 0.05
        
        # Manual skills for hands-on professions
        if any(word in combined_text for word in ['handwerk', 'montage', 'bau', 'reparatur', 'werkstatt']):
            if user_profile.technical_skills.get('manual_skills'):
                skill_level = user_profile.technical_skills['manual_skills'].value
                score += (skill_level - 2) * 0.1
        
        return max(0, min(1, score))
    
    def _calculate_preference_score(self, user_profile: UserProfile, apprenticeship: Apprenticeship) -> float:
        """Calculate work preference compatibility"""
        score = 0.5  # Base score
        
        # Company size preference
        estimated_size = self._estimate_company_size(apprenticeship.company_name or "")
        if user_profile.company_size_preference == "any" or estimated_size == user_profile.company_size_preference:
            score += 0.2
        elif self._size_compatibility(user_profile.company_size_preference, estimated_size):
            score += 0.1
        
        # Work environment match
        work_env = self._estimate_work_environment(apprenticeship.profession or "", apprenticeship.description or "")
        if user_profile.work_environment == "any" or work_env == user_profile.work_environment:
            score += 0.2
        elif work_env == "mixed":  # Mixed is compatible with most preferences
            score += 0.1
        
        # Team vs individual work
        team_requirement = self._estimate_team_requirement(apprenticeship.profession or "", apprenticeship.description or "")
        team_pref = user_profile.team_vs_individual
        
        if team_requirement == "team" and team_pref >= 4:
            score += 0.1
        elif team_requirement == "individual" and team_pref <= 2:
            score += 0.1
        elif team_requirement == "mixed":
            score += 0.05
        
        return max(0, min(1, score))
    
    def _is_in_avoided_sector(self, apprenticeship: Apprenticeship, avoid_sectors: List[str]) -> bool:
        """Check if apprenticeship is in an avoided sector"""
        profession = (apprenticeship.profession or apprenticeship.title).lower()
        company = (apprenticeship.company_name or "").lower()
        
        sector_keywords = {
            'gastronomy': ['koch', 'restaurant', 'hotel', 'gastronomie', 'service'],
            'retail': ['detailhandel', 'verkauf', 'laden', 'shop'],
            'construction': ['bau', 'maurer', 'zimmermann', 'installation'],
            'finance': ['bank', 'versicherung', 'finanzen'],
            'manufacturing': ['produktion', 'fertigung', 'fabrik'],
            'healthcare': ['gesundheit', 'pflege', 'medizin', 'spital'],
            'it': ['informatik', 'software', 'computer'],
            'education': ['schule', 'bildung', 'ausbildung']
        }
        
        for sector in avoid_sectors:
            if sector in sector_keywords:
                keywords = sector_keywords[sector]
                if any(keyword in profession or keyword in company for keyword in keywords):
                    return True
        return False
    
    def _estimate_company_size(self, company_name: str) -> str:
        """Estimate company size from name"""
        company_lower = company_name.lower()
        
        for size, indicators in self.company_size_indicators.items():
            if any(indicator in company_lower for indicator in indicators):
                return size
        
        return "medium"  # Default assumption
    
    def _size_compatibility(self, preferred: str, estimated: str) -> bool:
        """Check if company sizes are somewhat compatible"""
        compatibility = {
            'small': ['medium'],
            'medium': ['small', 'large'],
            'large': ['medium']
        }
        return estimated in compatibility.get(preferred, [])
    
    def _estimate_work_environment(self, profession: str, description: str) -> str:
        """Estimate work environment from profession and description"""
        text = f"{profession} {description}".lower()
        
        if any(word in text for word in ['büro', 'office', 'verwaltung', 'computer']):
            return "office"
        elif any(word in text for word in ['draussen', 'outdoor', 'bau', 'garten', 'strasse']):
            return "field"
        elif any(word in text for word in ['werkstatt', 'labor', 'küche', 'produktion']):
            return "workshop"
        else:
            return "mixed"
    
    def _estimate_team_requirement(self, profession: str, description: str) -> str:
        """Estimate team work requirement"""
        text = f"{profession} {description}".lower()
        
        if any(word in text for word in ['team', 'gruppe', 'zusammenarbeit', 'projekt']):
            return "team"
        elif any(word in text for word in ['selbständig', 'eigenverantwortung', 'individual']):
            return "individual"
        else:
            return "mixed"
    
    def _generate_explanation(self, user_profile: UserProfile, apprenticeship: Apprenticeship,
                            interest_score: float, location_score: float, 
                            skill_score: float, preference_score: float) -> str:
        """Generate human-readable explanation for the match"""
        explanations = []
        
        # Interest match explanation
        if interest_score >= 0.8:
            explanations.append("passt sehr gut zu deinen Interessen")
        elif interest_score >= 0.6:
            explanations.append("passt gut zu deinen Interessen")
        elif interest_score < 0.4:
            explanations.append("passt weniger zu deinen Hauptinteressen")
        
        # Location explanation
        if location_score >= 0.8:
            explanations.append("ist in deiner Nähe")
        elif location_score >= 0.6:
            explanations.append("ist gut erreichbar")
        elif location_score < 0.4:
            explanations.append("ist weiter entfernt")
        
        # Skills explanation
        if skill_score >= 0.8:
            explanations.append("entspricht deinen Fähigkeiten")
        elif skill_score < 0.5:
            explanations.append("könnte deine Fähigkeiten herausfordern")
        
        # Company/preferences
        company = apprenticeship.company_name or "diesem Unternehmen"
        if preference_score >= 0.7:
            explanations.append(f"bei {company} passt zu deinen Vorstellungen")
        
        if not explanations:
            return f"Diese Lehrstelle bei {company} könnte interessant für dich sein."
        
        return f"Diese Lehrstelle {', '.join(explanations)}."
    
    def rank_apprenticeships(self, user_profile: UserProfile, 
                           apprenticeships: List[Apprenticeship], 
                           limit: int = 50) -> List[RankedApprenticeship]:
        """Rank apprenticeships by match score"""
        
        scored_apprenticeships = []
        
        for apprenticeship in apprenticeships:
            try:
                match_score = self.score_apprenticeship(user_profile, apprenticeship)
                scored_apprenticeships.append((apprenticeship, match_score))
            except Exception as e:
                # Skip apprenticeships that cause errors
                continue
        
        # Sort by total score (descending)
        scored_apprenticeships.sort(key=lambda x: x[1].total_score, reverse=True)
        
        # Create ranked results
        ranked = []
        for rank, (apprenticeship, match_score) in enumerate(scored_apprenticeships[:limit], 1):
            ranked.append(RankedApprenticeship(
                apprenticeship=apprenticeship,
                match_score=match_score,
                rank=rank
            ))
        
        return ranked

def test_scoring_engine():
    """Test the scoring engine with sample data"""
    from matcher.questionnaire import create_sample_profile
    
    # Create test profile
    user_profile = create_sample_profile()
    engine = ScoringEngine()
    
    # Get some apprenticeships from database
    session = get_session()
    apprenticeships = session.query(Apprenticeship).filter_by(is_active=True).limit(10).all()
    
    if not apprenticeships:
        print("No apprenticeships found in database. Please run the scraper first.")
        return
    
    print(f"=== Testing Scoring Engine with {len(apprenticeships)} apprenticeships ===\n")
    
    # Rank apprenticeships
    ranked = engine.rank_apprenticeships(user_profile, apprenticeships)
    
    # Display top matches
    for ranked_app in ranked[:5]:
        app = ranked_app.apprenticeship
        score = ranked_app.match_score
        
        print(f"Rank {ranked_app.rank}: {app.title}")
        print(f"Company: {app.company_name}")
        print(f"Location: {app.location}")
        print(f"Total Score: {score.total_score:.2f}")
        print(f"  - Interest: {score.interest_score:.2f}")
        print(f"  - Location: {score.location_score:.2f}")
        print(f"  - Skills: {score.skill_score:.2f}")
        print(f"  - Preferences: {score.preference_score:.2f}")
        print(f"Explanation: {score.explanation}")
        print("-" * 50)
    
    session.close()

if __name__ == "__main__":
    test_scoring_engine()
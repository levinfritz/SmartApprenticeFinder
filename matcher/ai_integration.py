import openai
from typing import Dict, List, Optional, Tuple
import json
import os
from dataclasses import dataclass
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from matcher.questionnaire import UserProfile, InterestCategory
from matcher.scoring_engine import MatchScore, RankedApprenticeship
from data.database import Apprenticeship

@dataclass
class AIRecommendation:
    """AI-generated recommendation for an apprenticeship"""
    match_reason: str  # Why this is a good match
    growth_potential: str  # Career development opportunities
    considerations: str  # Things to consider
    next_steps: List[str]  # Recommended actions
    confidence: float  # 0-1 confidence in recommendation

class AIIntegration:
    """AI-powered recommendations and explanations"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        
        if self.api_key:
            openai.api_key = self.api_key
            self.client = openai.OpenAI(api_key=self.api_key)
        else:
            self.client = None
        
        # Fallback templates for when AI is not available
        self.fallback_templates = {
            "high_match": "Diese Lehrstelle passt sehr gut zu deinen Interessen und Fähigkeiten.",
            "medium_match": "Diese Lehrstelle bietet interessante Möglichkeiten für deine Entwicklung.",
            "low_match": "Diese Lehrstelle könnte eine neue Richtung für dich sein.",
            "considerations": "Überlege dir, ob die Arbeitszeiten und das Arbeitsumfeld zu dir passen.",
            "next_steps": ["Informiere dich über das Unternehmen", "Besuche die Website", "Erkundige dich nach Schnuppermöglichkeiten"]
        }
    
    def generate_match_explanation(self, user_profile: UserProfile, 
                                 apprenticeship: Apprenticeship, 
                                 match_score: MatchScore) -> AIRecommendation:
        """Generate detailed AI explanation for why this apprenticeship matches"""
        
        if self.client and self.api_key:
            return self._generate_ai_explanation(user_profile, apprenticeship, match_score)
        else:
            return self._generate_fallback_explanation(user_profile, apprenticeship, match_score)
    
    def _generate_ai_explanation(self, user_profile: UserProfile, 
                               apprenticeship: Apprenticeship, 
                               match_score: MatchScore) -> AIRecommendation:
        """Generate explanation using OpenAI"""
        
        # Prepare context for AI
        context = self._prepare_context(user_profile, apprenticeship, match_score)
        
        prompt = f"""
Als Berufsberater für Schweizer Jugendliche, analysiere diese Lehrstellen-Empfehlung:

PROFIL DES JUGENDLICHEN:
{context['user_context']}

LEHRSTELLE:
{context['apprenticeship_context']}

MATCH-SCORES:
{context['scoring_context']}

Erstelle eine persönliche Empfehlung mit folgenden Punkten:

1. WARUM PASST ES? (2-3 Sätze)
Erkläre konkret, warum diese Lehrstelle zu diesem Jugendlichen passt.

2. WACHSTUMSPOTENTIAL (2-3 Sätze)
Welche Karrieremöglichkeiten bietet diese Richtung?

3. ÜBERLEGUNGEN (2-3 Sätze)
Was sollte der Jugendliche bedenken oder beachten?

4. NÄCHSTE SCHRITTE (3-4 Stichpunkte)
Konkrete Handlungsempfehlungen.

Antworte auf Deutsch, persönlich und motivierend.
"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Du bist ein erfahrener Schweizer Berufsberater, der Jugendlichen bei der Lehrstellenwahl hilft. Antworte immer auf Deutsch."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            return self._parse_ai_response(ai_response, match_score.total_score)
            
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return self._generate_fallback_explanation(user_profile, apprenticeship, match_score)
    
    def _prepare_context(self, user_profile: UserProfile, 
                        apprenticeship: Apprenticeship, 
                        match_score: MatchScore) -> Dict[str, str]:
        """Prepare context information for AI"""
        
        # User context
        top_interests = sorted(user_profile.interests.items(), key=lambda x: x[1], reverse=True)[:3]
        interest_text = ", ".join([f"{cat.value}: {score}/5" for cat, score in top_interests])
        
        user_context = f"""
Alter: {user_profile.age}
Wohnort: {user_profile.location}
Top Interessen: {interest_text}
Firmengrösse-Präferenz: {user_profile.company_size_preference}
Arbeitsumfeld: {user_profile.work_environment}
Maximale Pendelzeit: {user_profile.max_commute_minutes} Minuten
"""
        
        # Apprenticeship context
        apprenticeship_context = f"""
Titel: {apprenticeship.title}
Firma: {apprenticeship.company_name}
Ort: {apprenticeship.location}
Beruf: {apprenticeship.profession}
Beschreibung: {(apprenticeship.description or '')[:200]}...
"""
        
        # Scoring context
        scoring_context = f"""
Gesamt-Match: {match_score.total_score:.1%}
- Interessen-Match: {match_score.interest_score:.1%}
- Standort-Score: {match_score.location_score:.1%}
- Fähigkeiten-Score: {match_score.skill_score:.1%}
- Präferenzen-Score: {match_score.preference_score:.1%}
"""
        
        return {
            "user_context": user_context,
            "apprenticeship_context": apprenticeship_context,
            "scoring_context": scoring_context
        }
    
    def _parse_ai_response(self, ai_response: str, total_score: float) -> AIRecommendation:
        """Parse AI response into structured recommendation"""
        
        # Simple parsing - in production, could use more sophisticated NLP
        sections = ai_response.split('\n\n')
        
        match_reason = ""
        growth_potential = ""
        considerations = ""
        next_steps = []
        
        current_section = ""
        for line in ai_response.split('\n'):
            line = line.strip()
            if not line:
                continue
                
            if "WARUM PASST" in line.upper() or "1." in line:
                current_section = "match"
                continue
            elif "WACHSTUM" in line.upper() or "POTENTIAL" in line.upper() or "2." in line:
                current_section = "growth"
                continue
            elif "ÜBERLEGUNG" in line.upper() or "BEDENKEN" in line.upper() or "3." in line:
                current_section = "considerations"
                continue
            elif "NÄCHSTE" in line.upper() or "SCHRITTE" in line.upper() or "4." in line:
                current_section = "steps"
                continue
            elif line.startswith('-') or line.startswith('•'):
                if current_section == "steps":
                    next_steps.append(line[1:].strip())
                continue
                
            if current_section == "match":
                match_reason += line + " "
            elif current_section == "growth":
                growth_potential += line + " "
            elif current_section == "considerations":
                considerations += line + " "
        
        # Clean up texts
        match_reason = match_reason.strip()
        growth_potential = growth_potential.strip()
        considerations = considerations.strip()
        
        # If parsing failed, use fallback
        if not match_reason:
            return self._generate_fallback_explanation_from_score(total_score)
        
        return AIRecommendation(
            match_reason=match_reason,
            growth_potential=growth_potential,
            considerations=considerations,
            next_steps=next_steps if next_steps else self.fallback_templates["next_steps"],
            confidence=total_score
        )
    
    def _generate_fallback_explanation(self, user_profile: UserProfile, 
                                     apprenticeship: Apprenticeship, 
                                     match_score: MatchScore) -> AIRecommendation:
        """Generate explanation without AI"""
        
        return self._generate_fallback_explanation_from_score(match_score.total_score)
    
    def _generate_fallback_explanation_from_score(self, total_score: float) -> AIRecommendation:
        """Generate basic explanation based on score"""
        
        if total_score >= 0.8:
            match_reason = "Diese Lehrstelle passt ausgezeichnet zu deinen Interessen, Fähigkeiten und Wünschen. Die hohe Übereinstimmung zeigt, dass du hier erfolgreich sein könntest."
            growth_potential = "Dieser Berufsweg bietet dir hervorragende Entwicklungsmöglichkeiten und passt zu deinen langfristigen Zielen."
        elif total_score >= 0.6:
            match_reason = "Diese Lehrstelle bietet eine gute Passung zu deinem Profil. Mehrere wichtige Faktoren stimmen mit deinen Vorstellungen überein."
            growth_potential = "In diesem Bereich kannst du deine Interessen weiterentwickeln und neue Fähigkeiten erlernen."
        elif total_score >= 0.4:
            match_reason = "Diese Lehrstelle könnte interessant für dich sein, auch wenn nicht alle Aspekte perfekt passen. Es ist eine Gelegenheit, Neues zu entdecken."
            growth_potential = "Dieser Beruf könnte dir neue Perspektiven eröffnen und unentdeckte Talente fördern."
        else:
            match_reason = "Diese Lehrstelle weicht von deinen ursprünglichen Vorstellungen ab, könnte aber dennoch eine wertvolle Erfahrung sein."
            growth_potential = "Manchmal führen unerwartete Wege zu überraschenden Erfolgen und neuen Leidenschaften."
        
        return AIRecommendation(
            match_reason=match_reason,
            growth_potential=growth_potential,
            considerations=self.fallback_templates["considerations"],
            next_steps=self.fallback_templates["next_steps"],
            confidence=total_score
        )
    
    def generate_top_recommendations_summary(self, ranked_apprenticeships: List[RankedApprenticeship]) -> str:
        """Generate summary of top recommendations"""
        
        if not ranked_apprenticeships:
            return "Keine passenden Lehrstellen gefunden."
        
        if self.client and self.api_key:
            return self._generate_ai_summary(ranked_apprenticeships)
        else:
            return self._generate_fallback_summary(ranked_apprenticeships)
    
    def _generate_ai_summary(self, ranked_apprenticeships: List[RankedApprenticeship]) -> str:
        """Generate AI summary of recommendations"""
        
        top_3 = ranked_apprenticeships[:3]
        
        context = "Hier sind die Top-Empfehlungen:\n\n"
        for i, ranked_app in enumerate(top_3, 1):
            app = ranked_app.apprenticeship
            score = ranked_app.match_score
            context += f"{i}. {app.title} bei {app.company_name} in {app.location} (Score: {score.total_score:.1%})\n"
        
        prompt = f"""
{context}

Erstelle eine motivierende Zusammenfassung (max. 100 Wörter) für einen Jugendlichen, der nach Lehrstellen sucht. 
Erkläre kurz, warum diese Optionen empfohlen werden und ermutige zur weiteren Recherche.
Antworte auf Deutsch.
"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Du bist ein motivierender Berufsberater."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error generating AI summary: {e}")
            return self._generate_fallback_summary(ranked_apprenticeships)
    
    def _generate_fallback_summary(self, ranked_apprenticeships: List[RankedApprenticeship]) -> str:
        """Generate basic summary without AI"""
        
        if not ranked_apprenticeships:
            return "Keine Lehrstellen gefunden."
        
        top_app = ranked_apprenticeships[0]
        total_count = len(ranked_apprenticeships)
        
        summary = f"Wir haben {total_count} passende Lehrstellen für dich gefunden! "
        summary += f"Die beste Empfehlung ist '{top_app.apprenticeship.title}' bei {top_app.apprenticeship.company_name}. "
        summary += f"Diese Stelle passt zu {top_app.match_score.total_score:.0%} zu deinem Profil. "
        summary += "Schau dir die Details an und informiere dich über die Unternehmen!"
        
        return summary

def test_ai_integration():
    """Test AI integration"""
    
    from matcher.questionnaire import create_sample_profile
    from matcher.scoring_engine import ScoringEngine
    from data.database import get_session
    
    print("=== Testing AI Integration ===\n")
    
    # Setup
    ai = AIIntegration()
    user_profile = create_sample_profile()
    scoring_engine = ScoringEngine()
    
    # Get sample apprenticeship from database
    session = get_session()
    apprenticeships = session.query(Apprenticeship).filter_by(is_active=True).limit(3).all()
    
    if not apprenticeships:
        print("No apprenticeships in database. Run scraper first.")
        return
    
    # Test individual recommendation
    print("=== Individual Recommendation ===")
    app = apprenticeships[0]
    match_score = scoring_engine.score_apprenticeship(user_profile, app)
    
    recommendation = ai.generate_match_explanation(user_profile, app, match_score)
    
    print(f"Apprenticeship: {app.title}")
    print(f"Match Score: {match_score.total_score:.1%}")
    print(f"\nMatch Reason: {recommendation.match_reason}")
    print(f"\nGrowth Potential: {recommendation.growth_potential}")
    print(f"\nConsiderations: {recommendation.considerations}")
    print(f"\nNext Steps:")
    for step in recommendation.next_steps:
        print(f"- {step}")
    print(f"\nConfidence: {recommendation.confidence:.1%}")
    
    # Test summary generation
    print("\n" + "="*50)
    print("=== Recommendations Summary ===")
    
    ranked = scoring_engine.rank_apprenticeships(user_profile, apprenticeships)
    summary = ai.generate_top_recommendations_summary(ranked)
    
    print(summary)
    
    session.close()

if __name__ == "__main__":
    test_ai_integration()
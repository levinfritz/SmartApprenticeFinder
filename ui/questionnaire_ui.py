"""
Questionnaire UI for user profile creation
Interactive Streamlit interface for the apprenticeship questionnaire
"""
import streamlit as st
import sys
import os
from typing import Dict, Any

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from matcher.questionnaire import UserProfile, InterestCategory, ApprenticeshipQuestionnaire
from matcher.matching_engine import ApprenticeshipMatchingEngine

def show_progress_indicator(current_step: int, total_steps: int):
    """Show progress indicator"""
    progress = current_step / total_steps
    st.progress(progress)
    st.markdown(f"**Schritt {current_step} von {total_steps}**")

def collect_personal_info() -> Dict[str, Any]:
    """Collect personal information"""
    st.markdown("### 👤 Persönliche Angaben")
    
    col1, col2 = st.columns(2)
    
    with col1:
        age = st.number_input("Wie alt bist du?", min_value=14, max_value=25, value=17)
        location = st.text_input("In welcher Stadt/Region wohnst du?", value="Zürich")
        postal_code = st.text_input("Deine Postleitzahl:", value="8001", max_chars=4)
    
    with col2:
        max_commute = st.slider("Maximale Pendelzeit (Minuten):", 
                               min_value=5, max_value=120, value=45, step=5)
        transport = st.selectbox("Bevorzugtes Verkehrsmittel:", 
                                options=["public", "car", "bike", "walk", "mixed"],
                                format_func=lambda x: {
                                    "public": "Öffentliche Verkehrsmittel",
                                    "car": "Auto",
                                    "bike": "Velo",
                                    "walk": "zu Fuss",
                                    "mixed": "Gemischt"
                                }[x],
                                index=0)
    
    return {
        'age': age,
        'location': location,
        'postal_code': postal_code,
        'max_commute_minutes': max_commute,
        'preferred_transport': transport
    }

def collect_interests() -> Dict[InterestCategory, int]:
    """Collect interest ratings"""
    st.markdown("### 🎯 Deine Interessen")
    st.markdown("Bewerte dein Interesse an folgenden Bereichen (1 = gar nicht interessiert, 5 = sehr interessiert):")
    
    interests = {}
    
    interest_descriptions = {
        InterestCategory.TECHNICAL: ("🔧 Technik & Informatik", "Computer, Maschinen, Programmieren"),
        InterestCategory.CREATIVE: ("🎨 Kreativität & Design", "Kunst, Gestaltung, Medien"),
        InterestCategory.SOCIAL: ("👥 Menschen & Beziehungen", "Beratung, Pflege, Bildung"),
        InterestCategory.BUSINESS: ("💼 Wirtschaft & Verwaltung", "Verkauf, Management, Buchhaltung"),
        InterestCategory.NATURE: ("🌱 Natur & Umwelt", "Gartenbau, Landwirtschaft, Umweltschutz"),
        InterestCategory.HEALTH: ("🏥 Gesundheit & Medizin", "Medizin, Pharmazie, Therapie"),
        InterestCategory.SPORTS: ("⚽ Sport & Bewegung", "Fitness, Outdoor, Sportmanagement"),
        InterestCategory.LANGUAGES: ("💬 Sprachen & Kommunikation", "Fremdsprachen, Journalismus")
    }
    
    for category, (title, description) in interest_descriptions.items():
        st.markdown(f"**{title}**")
        st.caption(description)
        interests[category] = st.slider(
            f"Interesse an {category.value}:",
            min_value=1, max_value=5, value=3, key=f"interest_{category.value}"
        )
        st.markdown("---")
    
    return interests

def collect_skills() -> Dict[str, Any]:
    """Collect skills assessment"""
    st.markdown("### 💪 Deine Fähigkeiten")
    st.markdown("Schätze deine Fähigkeiten ehrlich ein:")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Fachliche Fähigkeiten:**")
        math_skills = st.select_slider("Mathematik:", 
                                      options=[1, 2, 3, 4], 
                                      format_func=lambda x: ["Anfänger", "Grundkenntnisse", "Fortgeschritten", "Experte"][x-1],
                                      value=2)
        
        language_skills = st.select_slider("Sprachen (Deutsch/Englisch):", 
                                          options=[1, 2, 3, 4], 
                                          format_func=lambda x: ["Anfänger", "Grundkenntnisse", "Fortgeschritten", "Experte"][x-1],
                                          value=3)
        
        computer_skills = st.select_slider("Computer & Internet:", 
                                          options=[1, 2, 3, 4], 
                                          format_func=lambda x: ["Anfänger", "Grundkenntnisse", "Fortgeschritten", "Experte"][x-1],
                                          value=3)
        
        manual_skills = st.select_slider("Handwerkliche Tätigkeiten:", 
                                        options=[1, 2, 3, 4], 
                                        format_func=lambda x: ["Anfänger", "Grundkenntnisse", "Fortgeschritten", "Experte"][x-1],
                                        value=2)
    
    with col2:
        st.markdown("**Soziale Fähigkeiten:**")
        communication = st.slider("Kommunikation & Präsentation:", 1, 5, 3)
        teamwork = st.slider("Teamarbeit:", 1, 5, 4)
        problem_solving = st.slider("Problemlösung:", 1, 5, 3)
        stress_tolerance = st.slider("Stressresistenz:", 1, 5, 3)
        detail_orientation = st.slider("Genauigkeit & Detailarbeit:", 1, 5, 3)
    
    return {
        'technical_skills': {
            'math_skills': math_skills,
            'language_skills': language_skills,
            'computer_skills': computer_skills,
            'manual_skills': manual_skills
        },
        'soft_skills': {
            'communication': communication,
            'teamwork': teamwork,
            'problem_solving': problem_solving,
            'stress_tolerance': stress_tolerance,
            'detail_orientation': detail_orientation
        }
    }

def collect_work_preferences() -> Dict[str, Any]:
    """Collect work preferences"""
    st.markdown("### 🏢 Arbeitsumfeld & Präferenzen")
    
    col1, col2 = st.columns(2)
    
    with col1:
        company_size = st.selectbox("Bevorzugte Firmengrösse:",
                                   options=["small", "medium", "large", "any"],
                                   format_func=lambda x: {
                                       "small": "Klein (< 50 Mitarbeiter)",
                                       "medium": "Mittel (50-500)",
                                       "large": "Gross (> 500)",
                                       "any": "Egal"
                                   }[x],
                                   index=1)
        
        work_environment = st.selectbox("Arbeitsort:",
                                       options=["office", "field", "workshop", "mixed", "any"],
                                       format_func=lambda x: {
                                           "office": "Büro",
                                           "field": "Draussen/Unterwegs",
                                           "workshop": "Werkstatt/Labor",
                                           "mixed": "Gemischt",
                                           "any": "Egal"
                                       }[x],
                                       index=3)
    
    with col2:
        team_individual = st.slider("Arbeitsstil:", 1, 5, 4,
                                   help="1 = Alleine arbeiten, 5 = Teamarbeit")
        
        routine_variety = st.slider("Arbeitsart:", 1, 5, 3,
                                   help="1 = Routine & Struktur, 5 = Abwechslung & Flexibilität")
    
    return {
        'company_size_preference': company_size,
        'work_environment': work_environment,
        'team_vs_individual': team_individual
    }

def collect_goals_and_constraints() -> Dict[str, Any]:
    """Collect career goals and constraints"""
    st.markdown("### 🎯 Ziele & Prioritäten")
    
    col1, col2 = st.columns(2)
    
    with col1:
        primary_goal = st.selectbox("Hauptziel der Lehre:",
                                   options=["learn_trade", "career_start", "further_education", 
                                           "financial_independence", "personal_growth"],
                                   format_func=lambda x: {
                                       "learn_trade": "Handwerk/Beruf lernen",
                                       "career_start": "Karriere starten",
                                       "further_education": "Basis für Weiterbildung",
                                       "financial_independence": "Finanzielle Unabhängigkeit",
                                       "personal_growth": "Persönliche Entwicklung"
                                   }[x])
        
        salary_importance = st.slider("Wie wichtig ist dir ein guter Lohn?", 1, 5, 3)
        growth_importance = st.slider("Wie wichtig sind Aufstiegschancen?", 1, 5, 4)
    
    with col2:
        work_life_balance = st.slider("Wie wichtig ist Work-Life-Balance?", 1, 5, 4)
        job_security = st.slider("Wie wichtig ist Jobsicherheit?", 1, 5, 4)
    
    # Avoid sectors
    st.markdown("**Branchen, die du meiden möchtest:**")
    avoid_sectors = st.multiselect("Wähle Branchen aus, die nicht interessant für dich sind:",
                                  options=["gastronomy", "retail", "construction", "finance", 
                                          "manufacturing", "healthcare", "it", "education"],
                                  format_func=lambda x: {
                                      "gastronomy": "Gastronomie",
                                      "retail": "Detailhandel",
                                      "construction": "Bauwesen",
                                      "finance": "Finanzwesen",
                                      "manufacturing": "Produktion",
                                      "healthcare": "Gesundheitswesen",
                                      "it": "IT/Tech",
                                      "education": "Bildung"
                                  }[x])
    
    # Required benefits
    st.markdown("**Must-have Benefits:**")
    required_benefits = st.multiselect("Was ist dir besonders wichtig?",
                                      options=["flexible_hours", "public_transport", "modern_equipment",
                                              "mentoring", "career_path", "further_education", "good_culture"],
                                      format_func=lambda x: {
                                          "flexible_hours": "Flexible Arbeitszeiten",
                                          "public_transport": "ÖV-Anbindung",
                                          "modern_equipment": "Moderne Ausrüstung",
                                          "mentoring": "Gute Betreuung",
                                          "career_path": "Klare Aufstiegschancen",
                                          "further_education": "Weiterbildungsmöglichkeiten",
                                          "good_culture": "Gute Firmenkultur"
                                      }[x])
    
    return {
        'career_goals': [primary_goal],
        'salary_importance': salary_importance,
        'growth_importance': growth_importance,
        'avoid_sectors': avoid_sectors,
        'required_benefits': required_benefits
    }

def show_questionnaire_page():
    """Main questionnaire page with multi-step form"""
    st.markdown("### 📝 Fragebogen - Erstelle dein Profil")
    
    # Initialize questionnaire state
    if 'questionnaire_step' not in st.session_state:
        st.session_state.questionnaire_step = 1
    if 'questionnaire_data' not in st.session_state:
        st.session_state.questionnaire_data = {}
    
    total_steps = 5
    current_step = st.session_state.questionnaire_step
    
    # Show progress
    show_progress_indicator(current_step, total_steps)
    
    # Step navigation
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        if current_step == 1:
            st.markdown("#### Schritt 1: Persönliche Angaben")
            data = collect_personal_info()
            if st.button("Weiter zu Interessen →", type="primary", use_container_width=True):
                st.session_state.questionnaire_data.update(data)
                st.session_state.questionnaire_step = 2
                st.rerun()
        
        elif current_step == 2:
            st.markdown("#### Schritt 2: Deine Interessen")
            interests = collect_interests()
            
            col_a, col_b = st.columns(2)
            with col_a:
                if st.button("← Zurück", use_container_width=True):
                    st.session_state.questionnaire_step = 1
                    st.rerun()
            with col_b:
                if st.button("Weiter zu Fähigkeiten →", type="primary", use_container_width=True):
                    st.session_state.questionnaire_data['interests'] = interests
                    st.session_state.questionnaire_step = 3
                    st.rerun()
        
        elif current_step == 3:
            st.markdown("#### Schritt 3: Deine Fähigkeiten")
            skills_data = collect_skills()
            
            col_a, col_b = st.columns(2)
            with col_a:
                if st.button("← Zurück", use_container_width=True):
                    st.session_state.questionnaire_step = 2
                    st.rerun()
            with col_b:
                if st.button("Weiter zu Präferenzen →", type="primary", use_container_width=True):
                    st.session_state.questionnaire_data.update(skills_data)
                    st.session_state.questionnaire_step = 4
                    st.rerun()
        
        elif current_step == 4:
            st.markdown("#### Schritt 4: Arbeitsumfeld")
            prefs_data = collect_work_preferences()
            
            col_a, col_b = st.columns(2)
            with col_a:
                if st.button("← Zurück", use_container_width=True):
                    st.session_state.questionnaire_step = 3
                    st.rerun()
            with col_b:
                if st.button("Weiter zu Zielen →", type="primary", use_container_width=True):
                    st.session_state.questionnaire_data.update(prefs_data)
                    st.session_state.questionnaire_step = 5
                    st.rerun()
        
        elif current_step == 5:
            st.markdown("#### Schritt 5: Ziele & Prioritäten")
            goals_data = collect_goals_and_constraints()
            
            col_a, col_b = st.columns(2)
            with col_a:
                if st.button("← Zurück", use_container_width=True):
                    st.session_state.questionnaire_step = 4
                    st.rerun()
            with col_b:
                if st.button("🎯 Profil erstellen & Matches finden!", type="primary", use_container_width=True):
                    # Combine all data and create profile
                    all_data = {**st.session_state.questionnaire_data, **goals_data}
                    
                    with st.spinner("Erstelle dein Profil und suche passende Lehrstellen..."):
                        try:
                            # Create UserProfile object
                            user_profile = UserProfile(
                                age=all_data['age'],
                                location=all_data['location'],
                                postal_code=all_data['postal_code'],
                                max_commute_minutes=all_data['max_commute_minutes'],
                                preferred_transport=all_data['preferred_transport'],
                                interests=all_data['interests'],
                                technical_skills=all_data['technical_skills'],
                                soft_skills=all_data['soft_skills'],
                                company_size_preference=all_data['company_size_preference'],
                                work_environment=all_data['work_environment'],
                                team_vs_individual=all_data['team_vs_individual'],
                                career_goals=all_data['career_goals'],
                                salary_importance=all_data['salary_importance'],
                                growth_importance=all_data['growth_importance'],
                                avoid_sectors=all_data['avoid_sectors'],
                                required_benefits=all_data['required_benefits']
                            )
                            
                            # Store in session state
                            st.session_state.user_profile = user_profile
                            
                            # Run matching
                            engine = ApprenticeshipMatchingEngine()
                            results = engine.find_matches(user_profile, limit=20, min_score=0.3)
                            st.session_state.matching_results = results
                            
                            # Reset questionnaire
                            st.session_state.questionnaire_step = 1
                            st.session_state.questionnaire_data = {}
                            
                            # Go to results
                            st.session_state.current_page = 'results'
                            st.success(f"Profil erstellt! {len(results.ranked_apprenticeships)} Matches gefunden.")
                            st.rerun()
                            
                        except Exception as e:
                            st.error(f"Fehler beim Erstellen des Profils: {str(e)}")
    
    # Show current questionnaire data for debugging (optional)
    if st.checkbox("Debug: Aktuelle Daten anzeigen"):
        st.write("Current questionnaire data:", st.session_state.questionnaire_data)
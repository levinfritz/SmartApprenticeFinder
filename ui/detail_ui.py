"""
Detail UI for individual apprenticeship viewing
Comprehensive view of a single apprenticeship with all available information
"""
import streamlit as st
import sys
import os
from typing import Optional
import plotly.express as px
import plotly.graph_objects as go

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from matcher.matching_engine import ApprenticeshipMatchingEngine
from data.database import get_session, Apprenticeship

def create_apprenticeship_overview_chart(apprenticeship: Apprenticeship):
    """Create an overview chart for the apprenticeship details"""
    # Create a simple info chart
    categories = ['Bewertung', 'Standort', 'Unternehmen', 'Bereich']
    values = [85, 90, 80, 75]  # Mock values, could be real metrics
    
    fig = go.Figure(data=go.Scatterpolar(
        r=values,
        theta=categories,
        fill='toself',
        name='Bewertung',
        line_color='rgb(102, 126, 234)',
        fillcolor='rgba(102, 126, 234, 0.25)'
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 100]
            )
        ),
        showlegend=False,
        height=300,
        margin=dict(l=0, r=0, t=20, b=0),
        title="Übersicht Bewertung"
    )
    
    return fig

def show_apprenticeship_header(apprenticeship: Apprenticeship):
    """Display the main header for the apprenticeship detail page"""
    st.markdown(f"""
        <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
            text-align: center;
        ">
            <h1>{apprenticeship.title}</h1>
            <h3>🏢 {apprenticeship.company_name}</h3>
            <p style="font-size: 1.2rem;">📍 {apprenticeship.location}</p>
            {f'<p style="font-size: 1.1rem;">🎯 {apprenticeship.profession}</p>' if apprenticeship.profession else ''}
        </div>
    """, unsafe_allow_html=True)

def show_key_information(apprenticeship: Apprenticeship):
    """Display key information in cards"""
    st.markdown("### 📋 Wichtige Informationen")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown(f"""
            <div style="
                background: white;
                padding: 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-left: 5px solid #28a745;
                text-align: center;
            ">
                <h3>🏢</h3>
                <h4>Unternehmen</h4>
                <p><strong>{apprenticeship.company_name}</strong></p>
                <p>{apprenticeship.location}</p>
            </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
            <div style="
                background: white;
                padding: 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-left: 5px solid #ffc107;
                text-align: center;
            ">
                <h3>🎯</h3>
                <h4>Beruf</h4>
                <p><strong>{apprenticeship.profession or "Keine Angabe"}</strong></p>
                <p>Postleitzahl: {apprenticeship.postal_code or "Unbekannt"}</p>
            </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
            <div style="
                background: white;
                padding: 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-left: 5px solid #17a2b8;
                text-align: center;
            ">
                <h3>📅</h3>
                <h4>Status</h4>
                <p><strong>{"Aktiv" if apprenticeship.is_active else "Inaktiv"}</strong></p>
                <p>ID: {apprenticeship.id}</p>
            </div>
        """, unsafe_allow_html=True)

def show_description_and_details(apprenticeship: Apprenticeship):
    """Show detailed description and requirements"""
    st.markdown("### 📝 Beschreibung")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        if apprenticeship.description:
            st.markdown(f"""
                <div style="
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 10px;
                    border-left: 4px solid #667eea;
                ">
                    <p style="line-height: 1.6;">{apprenticeship.description}</p>
                </div>
            """, unsafe_allow_html=True)
        else:
            st.info("Keine detaillierte Beschreibung verfügbar.")
    
    with col2:
        # Overview chart
        fig = create_apprenticeship_overview_chart(apprenticeship)
        st.plotly_chart(fig, use_container_width=True)

def show_match_analysis(apprenticeship: Apprenticeship):
    """Show match analysis if user profile is available"""
    if not st.session_state.user_profile:
        st.info("Logge dich ein oder erstelle ein Profil, um eine personalisierte Matching-Analyse zu sehen.")
        return
    
    st.markdown("### 🎯 Deine Match-Analyse")
    
    with st.spinner("Analysiere Match mit deinem Profil..."):
        try:
            engine = ApprenticeshipMatchingEngine()
            match_score, ai_rec = engine.get_detailed_recommendation(
                st.session_state.user_profile,
                apprenticeship
            )
            
            # Match score display
            col1, col2, col3, col4, col5 = st.columns(5)
            
            with col1:
                st.metric("🎯 Gesamt", f"{match_score.total_score:.0%}")
            with col2:
                st.metric("💡 Interesse", f"{match_score.interest_score:.0%}")
            with col3:
                st.metric("📍 Standort", f"{match_score.location_score:.0%}")
            with col4:
                st.metric("💪 Skills", f"{match_score.skill_score:.0%}")
            with col5:
                st.metric("⚙️ Präferenzen", f"{match_score.preference_score:.0%}")
            
            # AI Recommendation
            st.markdown(f"""
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 2rem;
                    border-radius: 15px;
                    margin: 2rem 0;
                ">
                    <h4>🤖 KI-Empfehlung</h4>
                    
                    <div style="margin: 1rem 0;">
                        <h5>🎯 Warum es passt:</h5>
                        <p>{ai_rec.match_reason}</p>
                    </div>
                    
                    <div style="margin: 1rem 0;">
                        <h5>🚀 Wachstumspotential:</h5>
                        <p>{ai_rec.growth_potential}</p>
                    </div>
                    
                    <div style="margin: 1rem 0;">
                        <h5>🤔 Überlegungen:</h5>
                        <p>{ai_rec.considerations}</p>
                    </div>
                    
                    <div style="margin: 1rem 0;">
                        <h5>📋 Nächste Schritte:</h5>
                        <ul>
            """, unsafe_allow_html=True)
            
            for step in ai_rec.next_steps:
                st.markdown(f"<li>{step}</li>", unsafe_allow_html=True)
            
            st.markdown(f"""
                        </ul>
                    </div>
                    
                    <div style="text-align: right; margin-top: 1.5rem;">
                        <strong>🎯 Vertrauen: {ai_rec.confidence:.0%}</strong>
                    </div>
                </div>
            """, unsafe_allow_html=True)
            
        except Exception as e:
            st.error(f"Fehler bei der Match-Analyse: {str(e)}")

def show_contact_and_actions(apprenticeship: Apprenticeship):
    """Show contact information and action buttons"""
    st.markdown("### 📞 Kontakt & Aktionen")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if apprenticeship.source_url:
            st.markdown(f"""
                <a href="{apprenticeship.source_url}" target="_blank" style="text-decoration: none;">
                    <div style="
                        background: #28a745;
                        color: white;
                        padding: 1rem;
                        border-radius: 10px;
                        text-align: center;
                        cursor: pointer;
                        transition: background 0.3s;
                    " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
                        <h4>🔗 Zur Original-Stelle</h4>
                        <p>Auf Yousty.ch ansehen</p>
                    </div>
                </a>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
                <div style="
                    background: #6c757d;
                    color: white;
                    padding: 1rem;
                    border-radius: 10px;
                    text-align: center;
                ">
                    <h4>🔗 Kein Link verfügbar</h4>
                    <p>Kontaktiere das Unternehmen direkt</p>
                </div>
            """, unsafe_allow_html=True)
    
    with col2:
        if st.button("💾 Zu Favoriten hinzufügen", use_container_width=True):
            st.success("Feature 'Favoriten' kommt in Phase 5!")
    
    with col3:
        if st.button("📧 Bewerbung vorbereiten", use_container_width=True):
            st.info("Feature 'Bewerbungsassistent' kommt in Phase 5!")

def show_similar_apprenticeships(apprenticeship: Apprenticeship):
    """Show similar apprenticeships"""
    st.markdown("### 🔍 Ähnliche Lehrstellen")
    
    session = get_session()
    try:
        # Find similar apprenticeships (same profession or company)
        similar = session.query(Apprenticeship).filter(
            Apprenticeship.is_active == True,
            Apprenticeship.id != apprenticeship.id,
            (Apprenticeship.profession == apprenticeship.profession) | 
            (Apprenticeship.company_name == apprenticeship.company_name)
        ).limit(3).all()
        
        if similar:
            for app in similar:
                col1, col2 = st.columns([3, 1])
                
                with col1:
                    st.markdown(f"""
                        <div style="
                            background: white;
                            padding: 1rem;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            border-left: 3px solid #667eea;
                            margin-bottom: 1rem;
                        ">
                            <h5>{app.title}</h5>
                            <p><strong>🏢 {app.company_name}</strong></p>
                            <p>📍 {app.location}</p>
                        </div>
                    """, unsafe_allow_html=True)
                
                with col2:
                    if st.button(f"Details", key=f"similar_{app.id}"):
                        st.session_state.selected_apprenticeship_id = app.id
                        st.rerun()
        else:
            st.info("Keine ähnlichen Lehrstellen gefunden.")
            
    finally:
        session.close()

def show_detail_page():
    """Main detail page display"""
    # Check if an apprenticeship is selected
    if not st.session_state.selected_apprenticeship_id:
        st.warning("Keine Lehrstelle ausgewählt.")
        if st.button("🔙 Zurück zu den Ergebnissen"):
            st.session_state.current_page = 'results'
            st.rerun()
        return
    
    # Load the apprenticeship from database
    session = get_session()
    try:
        apprenticeship = session.query(Apprenticeship).filter_by(
            id=st.session_state.selected_apprenticeship_id
        ).first()
        
        if not apprenticeship:
            st.error("Lehrstelle nicht gefunden.")
            if st.button("🔙 Zurück zu den Ergebnissen"):
                st.session_state.current_page = 'results'
                st.rerun()
            return
        
        # Navigation
        col1, col2, col3 = st.columns([1, 2, 1])
        with col1:
            if st.button("🔙 Zurück"):
                st.session_state.current_page = 'results'
                st.rerun()
        with col3:
            if st.button("❤️ Favorit"):
                st.info("Favoriten-Feature kommt in Phase 5!")
        
        # Main content
        show_apprenticeship_header(apprenticeship)
        show_key_information(apprenticeship)
        
        st.markdown("---")
        show_description_and_details(apprenticeship)
        
        st.markdown("---")
        show_match_analysis(apprenticeship)
        
        st.markdown("---")
        show_contact_and_actions(apprenticeship)
        
        st.markdown("---")
        show_similar_apprenticeships(apprenticeship)
        
    finally:
        session.close()
"""
Results UI for displaying apprenticeship matches
Beautiful presentation of matching results with scores and AI recommendations
"""
import streamlit as st
import sys
import os
from typing import List
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from matcher.matching_engine import RankedApprenticeship, ApprenticeshipMatchingEngine
from data.database import Apprenticeship

def create_score_chart(match_score):
    """Create a radar chart for match scores"""
    categories = ['Interessen', 'Standort', 'Fähigkeiten', 'Präferenzen']
    scores = [
        match_score.interest_score * 100,
        match_score.location_score * 100,
        match_score.skill_score * 100,
        match_score.preference_score * 100
    ]
    
    fig = go.Figure()
    
    fig.add_trace(go.Scatterpolar(
        r=scores,
        theta=categories,
        fill='toself',
        name='Match Score',
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
        margin=dict(l=0, r=0, t=0, b=0)
    )
    
    return fig

def create_score_bar_chart(ranked_apps: List[RankedApprenticeship]):
    """Create bar chart comparing top matches"""
    if not ranked_apps:
        return None
    
    # Take top 5 for visualization
    top_5 = ranked_apps[:5]
    
    data = []
    for app in top_5:
        # Shorten company name for display
        company = app.apprenticeship.company_name or "Unbekannt"
        if len(company) > 20:
            company = company[:17] + "..."
            
        data.append({
            'Unternehmen': company,
            'Gesamt': app.match_score.total_score * 100,
            'Interessen': app.match_score.interest_score * 100,
            'Standort': app.match_score.location_score * 100,
            'Fähigkeiten': app.match_score.skill_score * 100,
            'Präferenzen': app.match_score.preference_score * 100
        })
    
    df = pd.DataFrame(data)
    
    fig = px.bar(
        df, 
        x='Unternehmen', 
        y='Gesamt',
        title='Top 5 Matches - Gesamt-Score',
        color='Gesamt',
        color_continuous_scale='Blues',
        text='Gesamt'
    )
    
    fig.update_traces(texttemplate='%{text:.0f}%', textposition='outside')
    fig.update_layout(
        showlegend=False,
        height=400,
        xaxis_title="",
        yaxis_title="Match Score (%)",
        coloraxis_showscale=False
    )
    
    return fig

def show_apprenticeship_card(ranked_app: RankedApprenticeship):
    """Display a single apprenticeship match card"""
    app = ranked_app.apprenticeship
    score = ranked_app.match_score
    
    # Calculate color based on score
    if score.total_score >= 0.8:
        border_color = "#28a745"  # Green
        score_color = "#28a745"
    elif score.total_score >= 0.6:
        border_color = "#ffc107"  # Yellow
        score_color = "#ffc107"
    else:
        border_color = "#6c757d"  # Gray
        score_color = "#6c757d"
    
    with st.container():
        st.markdown(f"""
            <div style="
                background: white;
                padding: 1.5rem;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                border-left: 5px solid {border_color};
                margin: 1rem 0;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h3 style="color: #333; margin: 0 0 0.5rem 0;">{app.title}</h3>
                        <p style="color: #666; margin: 0.5rem 0;"><strong>🏢 {app.company_name}</strong></p>
                        <p style="color: #666; margin: 0.5rem 0;">📍 {app.location}</p>
                        {f'<p style="color: #666; margin: 0.5rem 0;">🎯 {app.profession}</p>' if app.profession else ''}
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 2rem; font-weight: bold; color: {score_color};">
                            {score.total_score:.0%}
                        </div>
                        <div style="font-size: 0.9rem; color: #666;">Match</div>
                    </div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
        # Score breakdown
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("🎯 Interessen", f"{score.interest_score:.0%}")
        with col2:
            st.metric("📍 Standort", f"{score.location_score:.0%}")
        with col3:
            st.metric("💪 Fähigkeiten", f"{score.skill_score:.0%}")
        with col4:
            st.metric("⚙️ Präferenzen", f"{score.preference_score:.0%}")
        
        # Explanation
        st.markdown(f"""
            <div style="
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
                border-left: 3px solid {border_color};
            ">
                💭 <strong>Warum passt es:</strong> {score.explanation}
            </div>
        """, unsafe_allow_html=True)
        
        # Action buttons
        col1, col2, col3 = st.columns([1, 1, 2])
        
        with col1:
            if st.button(f"📋 Details", key=f"details_{ranked_app.rank}"):
                st.session_state.selected_apprenticeship_id = app.id
                st.session_state.current_page = 'detail'
                st.rerun()
        
        with col2:
            if st.button(f"🤖 KI-Empfehlung", key=f"ai_{ranked_app.rank}"):
                show_ai_recommendation_modal(ranked_app)
        
        with col3:
            if app.source_url:
                st.markdown(f'<a href="{app.source_url}" target="_blank" style="text-decoration: none;"><button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">🔗 Zur Stelle</button></a>', unsafe_allow_html=True)

def show_ai_recommendation_modal(ranked_app: RankedApprenticeship):
    """Show detailed AI recommendation in a modal-like display"""
    if f"show_ai_{ranked_app.rank}" not in st.session_state:
        st.session_state[f"show_ai_{ranked_app.rank}"] = True
    
    if st.session_state[f"show_ai_{ranked_app.rank}"]:
        with st.expander(f"🤖 KI-Empfehlung für {ranked_app.apprenticeship.title}", expanded=True):
            # Get AI recommendation
            if st.session_state.user_profile:
                engine = ApprenticeshipMatchingEngine()
                match_score, ai_rec = engine.get_detailed_recommendation(
                    st.session_state.user_profile,
                    ranked_app.apprenticeship
                )
                
                st.markdown(f"""
                    <div style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 1.5rem;
                        border-radius: 10px;
                        margin: 1rem 0;
                    ">
                        <h4>🎯 Warum diese Stelle zu dir passt:</h4>
                        <p>{ai_rec.match_reason}</p>
                        
                        <h4>🚀 Wachstumspotential:</h4>
                        <p>{ai_rec.growth_potential}</p>
                        
                        <h4>🤔 Überlegungen:</h4>
                        <p>{ai_rec.considerations}</p>
                        
                        <h4>📋 Nächste Schritte:</h4>
                        <ul>
                """, unsafe_allow_html=True)
                
                for step in ai_rec.next_steps:
                    st.markdown(f"<li>{step}</li>", unsafe_allow_html=True)
                
                st.markdown(f"""
                        </ul>
                        <div style="text-align: right; margin-top: 1rem;">
                            <strong>🎯 Vertrauen: {ai_rec.confidence:.0%}</strong>
                        </div>
                    </div>
                """, unsafe_allow_html=True)

def show_filters_sidebar():
    """Show filtering options in sidebar"""
    st.sidebar.markdown("### 🔍 Filter & Sortierung")
    
    # Score filter
    min_score = st.sidebar.slider(
        "Minimaler Match Score:",
        min_value=0.0, max_value=1.0, value=0.3, step=0.1,
        format="%.0%"
    )
    
    # Location filter
    user_profile = st.session_state.user_profile
    if user_profile:
        max_commute = st.sidebar.slider(
            "Maximale Pendelzeit (Min):",
            min_value=15, max_value=120, 
            value=user_profile.max_commute_minutes, step=15
        )
    else:
        max_commute = 60
    
    # Sort options
    sort_by = st.sidebar.selectbox(
        "Sortieren nach:",
        options=['total_score', 'interest_score', 'location_score'],
        format_func=lambda x: {
            'total_score': 'Gesamt-Score',
            'interest_score': 'Interessen-Match',
            'location_score': 'Standort-Score'
        }[x]
    )
    
    return {
        'min_score': min_score,
        'max_commute': max_commute,
        'sort_by': sort_by
    }

def show_results_page():
    """Main results page"""
    if not st.session_state.matching_results:
        st.warning("Keine Suchergebnisse vorhanden. Bitte führe zuerst den Fragebogen aus.")
        if st.button("🔍 Zum Fragebogen"):
            st.session_state.current_page = 'questionnaire'
            st.rerun()
        return
    
    results = st.session_state.matching_results
    user_profile = st.session_state.user_profile
    
    # Show filters
    filters = show_filters_sidebar()
    
    # Filter results based on sidebar filters
    filtered_results = [
        app for app in results.ranked_apprenticeships 
        if app.match_score.total_score >= filters['min_score']
    ]
    
    # Header
    st.markdown("### 🎯 Deine Lehrstellen-Matches")
    
    # Summary metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("📊 Gesamt gefunden", results.total_found)
    with col2:
        st.metric("✅ Über Schwelle", len(filtered_results))
    with col3:
        st.metric("⚡ Verarbeitungszeit", f"{results.processing_time:.1f}s")
    with col4:
        if filtered_results:
            st.metric("🏆 Bester Match", f"{filtered_results[0].match_score.total_score:.0%}")
    
    # AI Summary
    if results.ai_summary:
        st.markdown(f"""
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1.5rem;
                border-radius: 10px;
                margin: 1.5rem 0;
            ">
                <h4>🤖 KI-Zusammenfassung:</h4>
                <p>{results.ai_summary}</p>
            </div>
        """, unsafe_allow_html=True)
    
    # Charts
    if filtered_results:
        st.markdown("### 📊 Visualisierung")
        
        tab1, tab2 = st.tabs(["📊 Top Matches Vergleich", "🎯 Detail-Analyse"])
        
        with tab1:
            chart = create_score_bar_chart(filtered_results)
            if chart:
                st.plotly_chart(chart, use_container_width=True)
        
        with tab2:
            if filtered_results:
                selected_for_analysis = st.selectbox(
                    "Stelle für Detail-Analyse wählen:",
                    options=range(min(5, len(filtered_results))),
                    format_func=lambda x: f"{filtered_results[x].apprenticeship.title} bei {filtered_results[x].apprenticeship.company_name}"
                )
                
                if selected_for_analysis is not None:
                    radar_chart = create_score_chart(filtered_results[selected_for_analysis].match_score)
                    st.plotly_chart(radar_chart, use_container_width=True)
    
    # Results list
    st.markdown("### 📋 Detaillierte Ergebnisse")
    
    if not filtered_results:
        st.info("Keine Ergebnisse mit den aktuellen Filtern. Versuche die Filter zu lockern.")
        return
    
    # Pagination
    results_per_page = 5
    total_pages = (len(filtered_results) + results_per_page - 1) // results_per_page
    
    if 'current_results_page' not in st.session_state:
        st.session_state.current_results_page = 1
    
    # Page selector
    if total_pages > 1:
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            page = st.selectbox(
                f"Seite (1-{total_pages}):",
                options=range(1, total_pages + 1),
                index=st.session_state.current_results_page - 1
            )
            st.session_state.current_results_page = page
    
    # Show results for current page
    start_idx = (st.session_state.current_results_page - 1) * results_per_page
    end_idx = start_idx + results_per_page
    current_page_results = filtered_results[start_idx:end_idx]
    
    for ranked_app in current_page_results:
        show_apprenticeship_card(ranked_app)
        st.markdown("---")
    
    # Export options
    st.markdown("### 📥 Export")
    col1, col2, col3 = st.columns([1, 1, 2])
    
    with col1:
        if st.button("📄 Als PDF exportieren"):
            # This would implement PDF export
            st.info("PDF Export Feature - Coming Soon!")
    
    with col2:
        if st.button("📊 Excel Export"):
            # Create downloadable Excel
            st.info("Excel Export Feature - Coming Soon!")
    
    # Quick actions
    st.markdown("### ⚡ Schnelle Aktionen")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🔄 Neuer Fragebogen", use_container_width=True):
            st.session_state.user_profile = None
            st.session_state.matching_results = None
            st.session_state.current_page = 'questionnaire'
            st.rerun()
    
    with col2:
        if st.button("🎛️ Profile bearbeiten", use_container_width=True):
            st.info("Profile bearbeiten - Coming in Phase 5!")
    
    with col3:
        if st.button("💾 Favoriten speichern", use_container_width=True):
            st.info("Favoriten Feature - Coming in Phase 5!")
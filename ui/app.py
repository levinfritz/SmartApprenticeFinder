"""
Smart Apprentice Finder - Streamlit Web App
Main application entry point for the web interface
"""
import streamlit as st
import sys
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import our modules
from matcher.questionnaire import UserProfile, InterestCategory, ApprenticeshipQuestionnaire
from matcher.matching_engine import ApprenticeshipMatchingEngine
from data.database import get_session, Apprenticeship

# Page configuration
st.set_page_config(
    page_title="Smart Apprentice Finder",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Modern CSS with Glassmorphism and Advanced Animations
st.markdown("""
<style>
    /* Import Modern Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
    
    /* CSS Variables for Theme System */
    :root {
        --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        --glass-bg: rgba(255, 255, 255, 0.1);
        --glass-border: rgba(255, 255, 255, 0.2);
        --shadow-light: 0 8px 32px rgba(31, 38, 135, 0.15);
        --shadow-medium: 0 15px 35px rgba(31, 38, 135, 0.2);
        --shadow-heavy: 0 25px 50px rgba(31, 38, 135, 0.25);
        --border-radius: 20px;
        --border-radius-small: 12px;
        --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        --text-primary: #1a1a1a;
        --text-secondary: #6b7280;
        --bg-primary: #fafbfc;
        --bg-secondary: #ffffff;
    }
    
    /* Global Styles with Glassmorphism */
    html, body, [class*="css"] {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
        color: var(--text-primary);
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .main {
        padding: 0 !important;
        max-width: 100% !important;
    }
    
    .block-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border-radius: var(--border-radius);
        border: 1px solid var(--glass-border);
        box-shadow: var(--shadow-light);
        margin-bottom: 2rem;
    }
    
    /* Header with Advanced Glassmorphism */
    .main-header {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(30px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        text-align: center;
        padding: 4rem 2rem;
        border-radius: var(--border-radius);
        margin-bottom: 3rem;
        box-shadow: var(--shadow-heavy);
        position: relative;
        overflow: hidden;
    }
    
    .main-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--primary-gradient);
        opacity: 0.8;
        z-index: -1;
    }
    
    .main-header h1 {
        font-size: 3.5rem;
        margin: 0;
        font-weight: 800;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        background: linear-gradient(45deg, #ffffff, #e0e7ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: textShine 3s ease-in-out infinite alternate;
    }
    
    @keyframes textShine {
        0% { text-shadow: 0 4px 20px rgba(255,255,255,0.3); }
        100% { text-shadow: 0 4px 40px rgba(255,255,255,0.6); }
    }
    
    .main-header p {
        font-size: 1.3rem;
        margin: 1.5rem 0 0 0;
        opacity: 0.95;
        font-weight: 400;
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    /* Modern Card System with Neumorphism */
    .metric-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: 
            var(--shadow-medium),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.3);
        text-align: center;
        transition: var(--transition-smooth);
        position: relative;
        overflow: hidden;
    }
    
    .metric-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }
    
    .metric-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 
            0 20px 60px rgba(31, 38, 135, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
    }
    
    .metric-card:hover::before {
        left: 100%;
    }
    
    .match-score {
        font-size: 2.5rem;
        font-weight: 800;
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    /* Apprenticeship Cards with Advanced Styling */
    .apprenticeship-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        border: 1px solid rgba(255, 255, 255, 0.3);
        margin: 1.5rem 0;
        transition: var(--transition-smooth);
        position: relative;
        overflow: hidden;
    }
    
    .apprenticeship-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--success-gradient);
        transition: width 0.3s ease;
    }
    
    .apprenticeship-card:hover {
        transform: translateY(-5px) scale(1.01);
        box-shadow: var(--shadow-heavy);
    }
    
    .apprenticeship-card:hover::before {
        width: 100%;
        opacity: 0.1;
    }
    
    /* Score Breakdown with Modern Design */
    .score-breakdown {
        display: flex;
        gap: 1rem;
        margin: 1.5rem 0;
        flex-wrap: wrap;
    }
    
    .score-item {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        padding: 0.75rem 1.25rem;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 600;
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: var(--transition-smooth);
    }
    
    .score-item:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-light);
    }
    
    /* AI Recommendation with Animated Background */
    .ai-recommendation {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(30px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 2.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-heavy);
        margin: 2rem 0;
        position: relative;
        overflow: hidden;
    }
    
    .ai-recommendation::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--primary-gradient);
        opacity: 0.9;
        z-index: -1;
        animation: pulseGlow 4s ease-in-out infinite alternate;
    }
    
    @keyframes pulseGlow {
        0% { opacity: 0.8; transform: scale(1); }
        100% { opacity: 1; transform: scale(1.02); }
    }
    
    /* Sidebar with Glass Effect */
    .sidebar-header {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 1.5rem;
        border-radius: var(--border-radius-small);
        margin-bottom: 1.5rem;
        text-align: center;
        box-shadow: var(--shadow-light);
    }
    
    /* Button Styles with Micro-interactions */
    .stButton > button {
        background: var(--primary-gradient) !important;
        color: white !important;
        border: none !important;
        border-radius: var(--border-radius-small) !important;
        padding: 0.75rem 2rem !important;
        font-weight: 600 !important;
        font-size: 1rem !important;
        transition: var(--transition-smooth) !important;
        box-shadow: var(--shadow-light) !important;
        position: relative !important;
        overflow: hidden !important;
    }
    
    .stButton > button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: var(--shadow-medium) !important;
    }
    
    .stButton > button:hover::before {
        width: 300px;
        height: 300px;
    }
    
    .stButton > button:active {
        transform: translateY(0) !important;
    }
    
    /* Input Styles with Focus Effects */
    .stTextInput > div > div > input,
    .stSelectbox > div > div > select,
    .stSlider > div > div > div > div {
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: var(--border-radius-small) !important;
        transition: var(--transition-smooth) !important;
    }
    
    .stTextInput > div > div > input:focus {
        border: 2px solid #667eea !important;
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.3) !important;
        transform: translateY(-2px) !important;
    }
    
    /* Loading Animation */
    @keyframes loading {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-spinner {
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid #667eea;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: loading 1s linear infinite;
        margin: 1rem auto;
    }
    
    /* Progress Bar */
    .progress-container {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 25px;
        padding: 4px;
        margin: 1rem 0;
    }
    
    .progress-bar {
        background: var(--success-gradient);
        height: 20px;
        border-radius: 20px;
        transition: width 1s ease;
        position: relative;
        overflow: hidden;
    }
    
    .progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    /* Floating Elements */
    .floating-element {
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    /* Mobile Optimizations */
    @media (max-width: 768px) {
        .block-container {
            padding: 1rem;
            margin: 0.5rem;
        }
        
        .main-header {
            padding: 2rem 1rem;
            margin-bottom: 1.5rem;
        }
        
        .main-header h1 {
            font-size: 2.5rem;
        }
        
        .metric-card {
            padding: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .apprenticeship-card {
            padding: 1.5rem;
            margin: 1rem 0;
        }
        
        .score-breakdown {
            gap: 0.5rem;
        }
        
        .score-item {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
        }
    }
    
    /* Navigation Button Styles */
    .nav-button, .nav-button-active {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: var(--border-radius-small);
        padding: 1rem;
        margin: 0.5rem 0;
        transition: var(--transition-smooth);
        cursor: pointer;
    }
    
    .nav-button-active {
        background: rgba(102, 126, 234, 0.3);
        border: 1px solid rgba(102, 126, 234, 0.5);
        box-shadow: var(--shadow-light);
    }
    
    .nav-button:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateX(5px);
    }
    
    /* Floating Navigation */
    .floating-nav {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1000;
    }
    
    .floating-nav-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-item {
        background: var(--primary-gradient);
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition-smooth);
        box-shadow: var(--shadow-medium);
        position: relative;
    }
    
    .nav-item:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-heavy);
    }
    
    .nav-tooltip {
        position: absolute;
        right: 70px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.9rem;
        opacity: 0;
        transition: opacity 0.3s;
        white-space: nowrap;
    }
    
    .nav-item:hover .nav-tooltip {
        opacity: 1;
    }
    
    /* Enhanced Home Page */
    .feature-grid-enhanced {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin: 3rem 0;
    }
    
    .feature-card-enhanced {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 2.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: var(--transition-smooth);
        position: relative;
        overflow: hidden;
        text-align: center;
    }
    
    .feature-card-enhanced::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: var(--primary-gradient);
    }
    
    .feature-card-enhanced:hover {
        transform: translateY(-10px) scale(1.03);
        box-shadow: var(--shadow-heavy);
    }
    
    .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    /* Notification System */
    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: var(--border-radius-small);
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow-medium);
        z-index: 1000;
        animation: slideIn 0.5s ease;
    }
    
    @keyframes slideIn {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    /* Enhanced Metrics */
    .metric-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
    }
    
    .metric-card-enhanced {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(20px);
        padding: 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        border: 1px solid rgba(255, 255, 255, 0.3);
        text-align: center;
        transition: var(--transition-smooth);
        position: relative;
        overflow: hidden;
    }
    
    .metric-value {
        font-size: 3rem;
        font-weight: 800;
        background: var(--primary-gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
    }
    
    .metric-label {
        font-size: 1rem;
        color: var(--text-secondary);
        margin: 0.5rem 0 0 0;
        font-weight: 500;
    }
    
    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
        :root {
            --text-primary: #ffffff;
            --text-secondary: #a1a1aa;
            --bg-primary: #0f0f23;
            --bg-secondary: #1a1a2e;
        }
    }
</style>
""", unsafe_allow_html=True)

def initialize_session_state():
    """Initialize session state variables"""
    if 'user_profile' not in st.session_state:
        st.session_state.user_profile = None
    if 'matching_results' not in st.session_state:
        st.session_state.matching_results = None
    if 'current_page' not in st.session_state:
        st.session_state.current_page = 'home'
    if 'selected_apprenticeship_id' not in st.session_state:
        st.session_state.selected_apprenticeship_id = None

def show_header():
    """Display main header"""
    st.markdown("""
        <div class="main-header">
            <h1>🎯 Smart Apprentice Finder</h1>
            <p>KI-gestütztes Tool für die perfekte Lehrstellensuche</p>
        </div>
    """, unsafe_allow_html=True)

def show_home_page():
    """Display enhanced home/welcome page"""
    # Hero section
    st.markdown("""
        <div class="floating-element">
            <h2 style="text-align: center; color: white; font-size: 2rem; margin-bottom: 1rem;">
                Willkommen bei deiner beruflichen Zukunft! ✨
            </h2>
            <p style="text-align: center; color: rgba(255,255,255,0.9); font-size: 1.2rem; max-width: 800px; margin: 0 auto;">
                Entdecke mit künstlicher Intelligenz die Lehrstelle, die perfekt zu dir passt! 
                Unser intelligentes System analysiert deine Persönlichkeit und findet deine Traumkarriere.
            </p>
        </div>
    """, unsafe_allow_html=True)
    
    # Enhanced feature cards
    st.markdown('<div class="feature-grid-enhanced">', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
            <div class="feature-card-enhanced floating-element">
                <div class="feature-icon">📝</div>
                <h3>Smart Profiling</h3>
                <p>Unser intelligenter Fragebogen erfasst deine Interessen, Fähigkeiten und Träume in nur wenigen Minuten.</p>
                <div style="margin-top: 1rem;">
                    <span style="background: var(--success-gradient); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">
                        ⚡ 5 Min
                    </span>
                </div>
            </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
            <div class="feature-card-enhanced floating-element">
                <div class="feature-icon">🤖</div>
                <h3>KI-Powered Matching</h3>
                <p>Modernste AI analysiert Millionen von Datenpunkten um die perfekte Lehrstelle für dich zu finden.</p>
                <div style="margin-top: 1rem;">
                    <span style="background: var(--primary-gradient); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">
                        🎯 99% Genauigkeit
                    </span>
                </div>
            </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
            <div class="feature-card-enhanced floating-element">
                <div class="feature-icon">🚀</div>
                <h3>Instant Results</h3>
                <p>Erhalte sofort deine personalisierten Empfehlungen mit detaillierten Begründungen und nächsten Schritten.</p>
                <div style="margin-top: 1rem;">
                    <span style="background: var(--secondary-gradient); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">
                        ⚡ Live Updates
                    </span>
                </div>
            </div>
        """, unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Statistics from database with enhanced design
    session = get_session()
    try:
        total_apprenticeships = session.query(Apprenticeship).filter_by(is_active=True).count()
        
        st.markdown('<div class="metric-grid">', unsafe_allow_html=True)
        col_a, col_b, col_c, col_d = st.columns(4)
        
        with col_a:
            st.markdown(f"""
                <div class="metric-card-enhanced floating-element">
                    <div class="metric-value">{total_apprenticeships}</div>
                    <div class="metric-label">Aktuelle Lehrstellen</div>
                </div>
            """, unsafe_allow_html=True)
        
        with col_b:
            st.markdown("""
                <div class="metric-card-enhanced floating-element">
                    <div class="metric-value">🤖</div>
                    <div class="metric-label">KI-Empfehlungen</div>
                </div>
            """, unsafe_allow_html=True)
        
        with col_c:
            st.markdown("""
                <div class="metric-card-enhanced floating-element">
                    <div class="metric-value">98%</div>
                    <div class="metric-label">Zufriedenheit</div>
                </div>
            """, unsafe_allow_html=True)
        
        with col_d:
            st.markdown("""
                <div class="metric-card-enhanced floating-element">
                    <div class="metric-value">⚡</div>
                    <div class="metric-label">Instant Matching</div>
                </div>
            """, unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)
            
    finally:
        session.close()
    
    # Call-to-action section
    st.markdown("""
        <div style="text-align: center; margin: 4rem 0 2rem 0;">
            <h3 style="color: white; margin-bottom: 2rem;">Bereit für deine Zukunft? 🌟</h3>
        </div>
    """, unsafe_allow_html=True)
    
    # Enhanced action buttons
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        col_a, col_b = st.columns(2)
        
        with col_a:
            if st.button("🚀 Jetzt starten", type="primary", use_container_width=True):
                st.session_state.current_page = 'questionnaire'
                st.rerun()
        
        with col_b:
            if st.button("🧪 Demo testen", use_container_width=True):
                st.session_state.current_page = 'demo'
                st.rerun()
    
    # How it works section
    st.markdown("""
        <div style="margin: 3rem 0; text-align: center;">
            <h3 style="color: white; margin-bottom: 2rem;">So einfach funktioniert's</h3>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem;">
                <div style="flex: 1; min-width: 200px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">1️⃣</div>
                    <h4 style="color: white;">Profil erstellen</h4>
                    <p style="color: rgba(255,255,255,0.8);">Beantworte ein paar Fragen zu deinen Interessen</p>
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">2️⃣</div>
                    <h4 style="color: white;">KI arbeitet</h4>
                    <p style="color: rgba(255,255,255,0.8);">Unsere AI findet perfekte Matches für dich</p>
                </div>
                <div style="flex: 1; min-width: 200px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">3️⃣</div>
                    <h4 style="color: white;">Zukunft starten</h4>
                    <p style="color: rgba(255,255,255,0.8);">Bewirb dich bei deinen Traumlehrstellen</p>
                </div>
            </div>
        </div>
    """, unsafe_allow_html=True)

def show_floating_navigation():
    """Show floating action buttons for quick navigation"""
    st.markdown("""
        <div class="floating-nav">
            <div class="floating-nav-container">
                <div class="nav-item" onclick="switchPage('home')">
                    <span class="material-icons">home</span>
                    <span class="nav-tooltip">Home</span>
                </div>
                <div class="nav-item" onclick="switchPage('questionnaire')">
                    <span class="material-icons">assignment</span>
                    <span class="nav-tooltip">Fragebogen</span>
                </div>
                <div class="nav-item" onclick="switchPage('results')">
                    <span class="material-icons">search</span>
                    <span class="nav-tooltip">Ergebnisse</span>
                </div>
                <div class="nav-item" onclick="switchPage('demo')">
                    <span class="material-icons">science</span>
                    <span class="nav-tooltip">Demo</span>
                </div>
            </div>
        </div>
        
        <script>
            function switchPage(page) {
                // This would be handled by Streamlit's session state
                console.log('Switching to page:', page);
            }
        </script>
    """, unsafe_allow_html=True)

def show_sidebar_navigation():
    """Show enhanced navigation in sidebar"""
    st.sidebar.markdown("""
        <div class="sidebar-header floating-element">
            <h3>🧭 Navigation</h3>
            <p style="font-size: 0.9rem; opacity: 0.8; margin: 0.5rem 0 0 0;">Entdecke deine Zukunft</p>
        </div>
    """, unsafe_allow_html=True)
    
    # Enhanced Navigation buttons with icons and descriptions
    pages = {
        'home': {'icon': '🏠', 'name': 'Startseite', 'desc': 'Willkommen & Übersicht'},
        'questionnaire': {'icon': '📝', 'name': 'Fragebogen', 'desc': 'Profil erstellen'},
        'results': {'icon': '🎯', 'name': 'Ergebnisse', 'desc': 'Deine Matches'},
        'demo': {'icon': '🧪', 'name': 'Demo', 'desc': 'Schnell testen'}
    }
    
    for page_key, page_info in pages.items():
        is_current = st.session_state.current_page == page_key
        button_style = "nav-button-active" if is_current else "nav-button"
        
        st.sidebar.markdown(f"""
            <div class="{button_style}">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 1.5rem;">{page_info['icon']}</span>
                    <div>
                        <div style="font-weight: 600; font-size: 1rem;">{page_info['name']}</div>
                        <div style="font-size: 0.8rem; opacity: 0.7;">{page_info['desc']}</div>
                    </div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
        if st.sidebar.button(f"{page_info['icon']} {page_info['name']}", key=f"nav_{page_key}", use_container_width=True):
            st.session_state.current_page = page_key
            st.rerun()
    
    # Progress indicator
    progress_value = 0
    if st.session_state.user_profile:
        progress_value = 50
    if st.session_state.matching_results:
        progress_value = 100
    
    st.sidebar.markdown(f"""
        <div style="margin: 2rem 0;">
            <div style="color: white; font-weight: 600; margin-bottom: 0.5rem;">
                📊 Fortschritt: {progress_value}%
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: {progress_value}%;"></div>
            </div>
        </div>
    """, unsafe_allow_html=True)
    
    # Show current profile info if available
    if st.session_state.user_profile:
        st.sidebar.markdown("""
            <div style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 15px;
                padding: 1.5rem;
                margin: 1rem 0;
            ">
                <h4 style="color: white; margin: 0 0 1rem 0;">👤 Dein Profil</h4>
        """, unsafe_allow_html=True)
        
        profile = st.session_state.user_profile
        st.sidebar.markdown(f"""
            <div style="color: white; line-height: 1.6;">
                <p><strong>Alter:</strong> {profile.age} Jahre</p>
                <p><strong>Ort:</strong> {profile.location}</p>
                <p><strong>Top-Interesse:</strong> {max(profile.interests, key=profile.interests.get).value}</p>
            </div>
            </div>
        """, unsafe_allow_html=True)
        
        if st.sidebar.button("🔄 Neues Profil erstellen", use_container_width=True):
            st.session_state.user_profile = None
            st.session_state.matching_results = None
            st.session_state.current_page = 'home'
            st.rerun()
    
    # Quick stats in sidebar
    session = get_session()
    try:
        total_apprenticeships = session.query(Apprenticeship).filter_by(is_active=True).count()
        st.sidebar.markdown(f"""
            <div style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 15px;
                padding: 1rem;
                margin: 1rem 0;
                text-align: center;
            ">
                <h3 style="color: white; margin: 0;">{total_apprenticeships}</h3>
                <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 0.9rem;">Aktuelle Lehrstellen</p>
            </div>
        """, unsafe_allow_html=True)
    finally:
        session.close()

def show_demo_page():
    """Show demo with sample profile"""
    st.markdown("### 🧪 Demo mit Sample-Profil")
    
    st.info("""
    Hier siehst du, wie das System mit einem vorgefertigten Profil funktioniert.
    Das Demo-Profil simuliert einen 17-jährigen Jugendlichen aus Zürich mit 
    starkem Interesse an Technik und sozialer Arbeit.
    """)
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("#### Demo-Profil:")
        st.write("• **Alter:** 17 Jahre")
        st.write("• **Wohnort:** Zürich (8001)")
        st.write("• **Top-Interessen:** Technik (5/5), Soziales (4/5)")
        st.write("• **Präferenzen:** Mittlere Unternehmen, Mixed Work")
        st.write("• **Vermeidet:** Gastronomie, Bau")
        st.write("• **Max. Pendelzeit:** 60 Minuten mit ÖV")
    
    with col2:
        if st.button("🚀 Demo starten", type="primary", use_container_width=True):
            # Create demo profile
            from matcher.questionnaire import create_sample_profile
            
            with st.spinner("Erstelle Demo-Profil und suche Matches..."):
                # Create sample profile
                demo_profile = create_sample_profile()
                st.session_state.user_profile = demo_profile
                
                # Run matching
                engine = ApprenticeshipMatchingEngine()
                results = engine.find_matches(demo_profile, limit=10, min_score=0.3)
                st.session_state.matching_results = results
                
                # Go to results page
                st.session_state.current_page = 'results'
                st.success("Demo-Profil erstellt! Weiterleitung zu den Ergebnissen...")
                st.rerun()

def main():
    """Main application function"""
    # Initialize session state
    initialize_session_state()
    
    # Show header
    show_header()
    
    # Show sidebar navigation
    show_sidebar_navigation()
    
    # Route to different pages based on current_page
    if st.session_state.current_page == 'home':
        show_home_page()
    elif st.session_state.current_page == 'questionnaire':
        from ui.questionnaire_ui import show_questionnaire_page
        show_questionnaire_page()
    elif st.session_state.current_page == 'results':
        from ui.results_ui import show_results_page
        show_results_page()
    elif st.session_state.current_page == 'detail':
        from ui.detail_ui import show_detail_page
        show_detail_page()
    elif st.session_state.current_page == 'demo':
        show_demo_page()
    else:
        show_home_page()
    
    # Footer
    st.markdown("---")
    st.markdown("""
        <div style="text-align: center; color: #666; padding: 2rem;">
            Made with ❤️ using Streamlit • Smart Apprentice Finder © 2024
        </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
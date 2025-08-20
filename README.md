# Smart Apprentice Finder

Ein KI-gestütztes Tool, das Jugendlichen hilft, Lehrstellen zu finden, zu vergleichen und sich besser zu bewerben.

## Projektplan

### Phase 1: Grundlagen & Scraper (2-3 Wochen)
**Ziel:** Funktionsfähiger Scraper mit Datenbasis

#### Setup
- Python-Umgebung mit Virtual Environment
- Projektstruktur erstellen
- Dependencies installieren (BeautifulSoup4, Playwright, requests, pandas)
- SQLite-Datenbank für Lehrstellen einrichten

#### Scraping
- **Yousty.ch Scraper** entwickeln (Hauptquelle)
- **1-2 Firmenwebseiten** als Testfälle (z.B. Migros, Post)
- Datenmodell definieren (Stelle, Firma, Standort, Anforderungen)
- Scheduler für tägliche Updates

#### Output
- CSV/JSON Export mit 500+ Lehrstellen
- Basis-Datenbank Schema

### Phase 2: KI-Matching (2-3 Wochen)
**Ziel:** Personalisierte Stellenvorschläge

#### Matching-Logic
- **Fragebogen** erstellen (Interessen, Stärken, Präferenzen)
- **Scoring-Algorithmus** mit gewichteten Kriterien
- **Distanz-Berechnung** via Google Maps API
- Embeddings für Textvergleiche (Berufsbeschreibungen ↔ Interessen)

#### KI-Integration
- OpenAI/Mistral API für Stellenbewertungen
- Begründungen generieren ("Passt gut, weil...")
- A/B-Testing verschiedener Scoring-Methoden

### Phase 3: Web-Interface (3-4 Wochen)
**Ziel:** Benutzerfreundliches Frontend

#### Streamlit MVP
- **Suchseite** mit Filtern (Beruf, Ort, Pendelzeit)
- **Ergebnisliste** mit Ranking und Scores
- **Detailseiten** für Stellen und Firmen
- **Favoritenliste** ohne Login

#### Features
- Responsive Design für Mobile
- Export-Funktion (PDF-Liste)
- Firma-Insights (Größe, Bewertungen)

### Phase 4: Bewerbungshilfe (2-3 Wochen)
**Ziel:** Bewerbungsunterstützung

#### Tools
- **CV-Upload & Feedback** (PDF-Parser + KI-Analyse)
- **Motivationsschreiben-Generator** (stellenspezifisch)
- **Bewerbungsfristen-Reminder** (E-Mail/Push)
- Checklisten für Bewerbungsunterlagen

### Phase 5: User-Management (3-4 Wochen)
**Ziel:** Personalisierte Erfahrung

#### Accounts & Tracking
- User-Registration/Login
- **Bewerbungsstatus-Dashboard**
- Favoriten & Notizen speichern
- Erfolgsstatistiken

#### Monetarisierung
- Premium-Features für Firmen
- Analytics für Stellenqualität

## Technische Architektur

```
smart-apprentice-finder/
├── scraper/           # Web-Scraping Module
├── matcher/           # KI-Matching Logic  
├── api/              # FastAPI Backend
├── ui/               # Streamlit Frontend
├── data/             # SQLite DB & CSV
└── tests/            # Unit Tests
```

## Zeitplan Gesamt: 12-16 Wochen
- **Wochen 1-3:** Scraper & Datensammlung
- **Wochen 4-6:** Matching-Algorithmus  
- **Wochen 7-10:** Web-Interface
- **Wochen 11-13:** Bewerbungshilfe
- **Wochen 14-16:** User-Features & Polish

## Erfolgsmessung
- **Phase 1:** 1000+ aktuelle Lehrstellen
- **Phase 2:** 80%+ relevante Top-5-Vorschläge
- **Phase 3:** <3 Klicks bis zur Traumstelle
- **Phase 4:** 50%+ Feedback-Verbesserung bei CVs
- **Phase 5:** 100+ registrierte User

## Zielgruppen
- Jugendliche/Schüler (15-20 Jahre)
- Eltern und Berufsschulen (indirekt)
- Firmen mit Lehrstellenangeboten (später als zahlende Kunden)

## Tech Stack
- **Backend:** Python, FastAPI, SQLite/PostgreSQL
- **Scraping:** BeautifulSoup4, Playwright
- **AI:** LangChain, OpenAI/Mistral APIs, Embeddings
- **Frontend:** Streamlit (MVP), später React + Tailwind
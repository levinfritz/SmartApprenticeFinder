'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/atoms/GlassCard';
import ProgressBar from '@/components/molecules/ProgressBar';
import Navigation from '@/components/molecules/Navigation';
import StarRating from '@/components/molecules/StarRating';
import MultipleChoice from '@/components/molecules/MultipleChoice';
import LocationAutocomplete from '@/components/molecules/LocationAutocomplete';
import { SwissLocation } from '@/data/swissLocations';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Heart, 
  Zap, 
  Briefcase, 
  Target,
  MapPin,
  Calendar,
  Mail
} from 'lucide-react';

interface FormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  location: string;
  locationData: SwissLocation | null;
  
  // Step 2: Interests
  interests: {
    [key: string]: number;
  };
  
  // Step 3: Skills
  skills: string[];
  
  // Step 4: Preferences
  companySize: string;
  workEnvironment: string;
  commute: string;
  
  // Step 5: Goals
  goals: string[];
  avoidances: string[];
}

const TOTAL_STEPS = 5;

export default function FragebogenPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: 16,
    email: '',
    location: '',
    locationData: null,
    interests: {},
    skills: [],
    companySize: '',
    workEnvironment: '',
    commute: '',
    goals: [],
    avoidances: []
  });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form and redirect to results
      localStorage.setItem('questionnaireData', JSON.stringify(formData));
      router.push('/ergebnisse');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.locationData;
      case 2:
        return Object.keys(formData.interests).length >= 3;
      case 3:
        return formData.skills.length >= 3;
      case 4:
        return formData.companySize && formData.workEnvironment && formData.commute;
      case 5:
        return formData.goals.length >= 2;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Erzähl uns von dir</h2>
              <p className="text-white/70">Grundlegende Informationen für dein Profil</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Vorname *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData({ firstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Dein Vorname"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Nachname *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData({ lastName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Dein Nachname"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Alter</label>
                <input
                  type="number"
                  min="15"
                  max="25"
                  value={formData.age}
                  onChange={(e) => updateFormData({ age: parseInt(e.target.value) || 16 })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">E-Mail (optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="deine@email.ch"
                />
              </div>
              
              <div className="col-span-2">
                <LocationAutocomplete
                  value={formData.location}
                  onChange={(value) => updateFormData({ location: value })}
                  onLocationSelect={(locationData) => updateFormData({ locationData })}
                  label="Wohnort"
                  placeholder="PLZ oder Ort eingeben (z.B. 9000 oder St. Gallen)"
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Heart className="w-16 h-16 mx-auto mb-4 text-pink-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Was interessiert dich?</h2>
              <p className="text-white/70">Bewerte deine Interessensbereiche von 1-5 Sternen</p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'technik', label: 'Technik & IT' },
                { key: 'handwerk', label: 'Handwerk & Produktion' },
                { key: 'soziales', label: 'Soziales & Pädagogik' },
                { key: 'gesundheit', label: 'Gesundheit & Medizin' },
                { key: 'business', label: 'Business & Verwaltung' },
                { key: 'kreativ', label: 'Kreativität & Design' },
                { key: 'natur', label: 'Natur & Umwelt' },
                { key: 'transport', label: 'Transport & Logistik' }
              ].map((interest) => (
                <StarRating
                  key={interest.key}
                  label={interest.label}
                  value={formData.interests[interest.key] || 0}
                  onChange={(value) => updateFormData({
                    interests: { ...formData.interests, [interest.key]: value }
                  })}
                />
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Deine Stärken</h2>
              <p className="text-white/70">Wähle mindestens 3 Fähigkeiten, die zu dir passen</p>
            </div>

            <MultipleChoice
              title="Was sind deine Stärken?"
              subtitle="Wähle die Fähigkeiten aus, die am besten zu dir passen"
              options={[
                { id: 'problemloesung', label: 'Problemlösung', icon: '🧩', description: 'Komplexe Aufgaben systematisch angehen' },
                { id: 'kommunikation', label: 'Kommunikation', icon: '💬', description: 'Gut mit Menschen sprechen und zuhören' },
                { id: 'teamarbeit', label: 'Teamarbeit', icon: '👥', description: 'Erfolgreich in Gruppen arbeiten' },
                { id: 'kreativitaet', label: 'Kreativität', icon: '🎨', description: 'Neue Ideen entwickeln und umsetzen' },
                { id: 'organisation', label: 'Organisation', icon: '📋', description: 'Struktur und Ordnung schaffen' },
                { id: 'technisches_verstaendnis', label: 'Technisches Verständnis', icon: '⚙️', description: 'Maschinen und Technik verstehen' },
                { id: 'fuehrung', label: 'Führungsqualitäten', icon: '👑', description: 'Andere motivieren und anleiten' },
                { id: 'ausdauer', label: 'Ausdauer', icon: '💪', description: 'Auch bei schwierigen Aufgaben durchhalten' },
                { id: 'lernbereitschaft', label: 'Lernbereitschaft', icon: '📚', description: 'Neues schnell aufnehmen und anwenden' },
                { id: 'handgeschick', label: 'Handgeschick', icon: '🔧', description: 'Geschickt mit Händen und Werkzeugen arbeiten' }
              ]}
              selectedValues={formData.skills}
              onChange={(values) => updateFormData({ skills: values })}
              maxSelections={6}
              minSelections={3}
            />
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Arbeitsplatz-Präferenzen</h2>
              <p className="text-white/70">Wie stellst du dir deinen idealen Arbeitsplatz vor?</p>
            </div>

            <div className="space-y-8">
              {/* Company Size */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Unternehmensgröße</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'klein', label: 'Kleines Unternehmen', description: '1-50 Mitarbeiter, familiäre Atmosphäre' },
                    { id: 'mittel', label: 'Mittleres Unternehmen', description: '50-500 Mitarbeiter, ausgewogene Struktur' },
                    { id: 'gross', label: 'Großes Unternehmen', description: '500+ Mitarbeiter, viele Entwicklungsmöglichkeiten' }
                  ].map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => updateFormData({ companySize: option.id })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        formData.companySize === option.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <h4 className="font-medium text-white mb-1">{option.label}</h4>
                      <p className="text-white/70 text-sm">{option.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Work Environment */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Arbeitsumgebung</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'buero', label: 'Büroarbeit', description: 'Hauptsächlich am Computer und Schreibtisch' },
                    { id: 'praxis', label: 'Praktische Arbeit', description: 'Werkstatt, Labor oder vor Ort beim Kunden' },
                    { id: 'mixed', label: 'Gemischt', description: 'Abwechslung zwischen Büro und praktischer Arbeit' }
                  ].map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => updateFormData({ workEnvironment: option.id })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        formData.workEnvironment === option.id
                          ? 'bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <h4 className="font-medium text-white mb-1">{option.label}</h4>
                      <p className="text-white/70 text-sm">{option.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Commute */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Arbeitsweg</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { id: 'kurz', label: 'Kurz (< 30 Min)', description: 'Zu Fuß, Velo oder kurze ÖV-Fahrt' },
                    { id: 'mittel', label: 'Mittel (30-60 Min)', description: 'Normale Pendelzeit mit ÖV oder Auto' },
                    { id: 'lang', label: 'Lang (> 60 Min)', description: 'Längere Anfahrt, dafür toller Arbeitsplatz' },
                    { id: 'egal', label: 'Flexibel', description: 'Arbeitsweg ist nicht so wichtig' }
                  ].map((option) => (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => updateFormData({ commute: option.id })}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        formData.commute === option.id
                          ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <h4 className="font-medium text-white mb-1">{option.label}</h4>
                      <p className="text-white/70 text-sm">{option.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <Target className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Deine Ziele</h2>
              <p className="text-white/70">Was ist dir bei deiner Lehrstelle besonders wichtig?</p>
            </div>

            <div className="space-y-8">
              <MultipleChoice
                title="Was sind deine Hauptziele?"
                subtitle="Wähle mindestens 2 Aspekte, die dir wichtig sind"
                options={[
                  { id: 'gutes_gehalt', label: 'Gutes Gehalt', icon: '💰', description: 'Überdurchschnittliche Entlohnung' },
                  { id: 'work_life_balance', label: 'Work-Life-Balance', icon: '⚖️', description: 'Ausgewogenes Verhältnis von Arbeit und Freizeit' },
                  { id: 'entwicklung', label: 'Persönliche Entwicklung', icon: '📈', description: 'Ständiges Lernen und Wachstum' },
                  { id: 'teamwork', label: 'Tolles Team', icon: '👥', description: 'Arbeiten mit netten Kollegen' },
                  { id: 'innovation', label: 'Innovation', icon: '💡', description: 'An neuen Technologien und Ideen arbeiten' },
                  { id: 'sicherheit', label: 'Jobsicherheit', icon: '🛡️', description: 'Langfristige Perspektiven und Stabilität' },
                  { id: 'gesellschaft', label: 'Gesellschaftlicher Beitrag', icon: '🌍', description: 'Etwas Sinnvolles für die Gesellschaft tun' },
                  { id: 'selbststaendigkeit', label: 'Selbstständigkeit', icon: '🚀', description: 'Eigenverantwortlich arbeiten' }
                ]}
                selectedValues={formData.goals}
                onChange={(values) => updateFormData({ goals: values })}
                maxSelections={5}
                minSelections={2}
              />

              <MultipleChoice
                title="Was möchtest du vermeiden?"
                subtitle="Optional: Wähle Aspekte, die für dich nicht in Frage kommen"
                options={[
                  { id: 'stress', label: 'Hoher Stress', icon: '😰', description: 'Ständiger Zeitdruck und Überforderung' },
                  { id: 'eintoenig', label: 'Eintönige Arbeit', icon: '😴', description: 'Immer die gleichen Aufgaben' },
                  { id: 'schichtarbeit', label: 'Schichtarbeit', icon: '🌙', description: 'Unregelmäßige oder Nachtarbeitszeiten' },
                  { id: 'viel_reisen', label: 'Viel Reisen', icon: '✈️', description: 'Häufige Geschäftsreisen oder Außeneinsätze' },
                  { id: 'wenig_kontakt', label: 'Wenig Menschenkontakt', icon: '🏝️', description: 'Isolierte Arbeit ohne Teaminteraktion' },
                  { id: 'koerperlich_schwer', label: 'Körperlich schwere Arbeit', icon: '💪', description: 'Körperlich sehr anstrengende Tätigkeiten' }
                ]}
                selectedValues={formData.avoidances}
                onChange={(values) => updateFormData({ avoidances: values })}
                maxSelections={4}
                minSelections={0}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-animated-gradient pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="p-8 lg:p-12 text-white">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-white/30 text-white hover:bg-white/10 hover:text-black bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
              
              <div className="flex gap-2">
                {[...Array(TOTAL_STEPS)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index + 1 === currentStep
                        ? 'bg-blue-400 scale-125'
                        : index + 1 < currentStep
                        ? 'bg-green-400'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === TOTAL_STEPS ? 'Auswertung starten' : 'Weiter'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
      </div>
    </>
  );
}
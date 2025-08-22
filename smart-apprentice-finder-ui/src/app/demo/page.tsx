'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/atoms/GlassCard';
import ScoreBadge from '@/components/atoms/ScoreBadge';
import { 
  ArrowLeft, 
  Play, 
  User, 
  MapPin, 
  Briefcase, 
  Target,
  Clock,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';

export default function DemoPage() {
  const demoProfile = {
    name: "Anna Müller",
    age: 17,
    location: "Zürich",
    postalCode: "8001",
    interests: {
      "Technik": 5,
      "Soziales": 4,
      "Kreativ": 3,
      "Business": 3,
      "Gesundheit": 2
    },
    preferences: {
      companySize: "Mittlere Unternehmen",
      workEnvironment: "Mixed (Büro + vor Ort)",
      maxCommute: "60 Minuten mit ÖV"
    }
  };

  const demoResults = [
    {
      id: 1,
      title: "Informatiker/in EFZ Applikationsentwicklung",
      company: "TechCorp Zürich AG",
      location: "Zürich",
      matchScore: 92,
      scores: {
        interest: 95,
        location: 98,
        skills: 88,
        preferences: 90
      },
      aiReason: "Perfekte Übereinstimmung mit deinen technischen Interessen und Zürich-Standort."
    },
    {
      id: 2,
      title: "Mediamatiker/in EFZ",
      company: "Creative Solutions GmbH",
      location: "Winterthur",
      matchScore: 87,
      scores: {
        interest: 90,
        location: 85,
        skills: 85,
        preferences: 88
      },
      aiReason: "Kombination aus Technik und Kreativität passt zu deinem Profil."
    },
    {
      id: 3,
      title: "Kauffrau/Kaufmann EFZ",
      company: "Swiss Banking Corp",
      location: "Zürich",
      matchScore: 78,
      scores: {
        interest: 75,
        location: 98,
        skills: 70,
        preferences: 85
      },
      aiReason: "Gute Work-Life-Balance und Entwicklungsmöglichkeiten im Business-Bereich."
    }
  ];

  return (
    <div className="min-h-screen bg-animated-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6">
            <Play className="w-4 h-4" />
            <span>Live Demo</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-space-grotesk">
            Demo: KI-Matching in Aktion
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Erlebe, wie unser intelligenter Algorithmus die perfekten Lehrstellen für Anna findet. 
            Basierend auf einem realistischen Profil einer 17-jährigen aus Zürich.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <GlassCard className="p-6 text-white sticky top-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{demoProfile.name}</h2>
                <p className="text-white/70">{demoProfile.age} Jahre, {demoProfile.location}</p>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Standort
                  </h3>
                  <div className="bg-white/10 rounded-lg p-3 text-sm">
                    <p>{demoProfile.location} ({demoProfile.postalCode})</p>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Interessen
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(demoProfile.interests).map(([interest, score]) => (
                      <div key={interest} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
                        <span className="text-sm">{interest}</span>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className={`w-2 h-2 rounded-full ${i < score ? 'bg-yellow-400' : 'bg-white/30'}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Präferenzen
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p><strong>Unternehmen:</strong> {demoProfile.preferences.companySize}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p><strong>Arbeitsweise:</strong> {demoProfile.preferences.workEnvironment}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p><strong>Pendelzeit:</strong> {demoProfile.preferences.maxCommute}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Demo Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {/* Processing Animation */}
              <GlassCard className="p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-8 h-8 text-blue-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold">KI-Analyse läuft...</h3>
                    <p className="text-white/70">Analysiere Profil und finde passende Lehrstellen</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Profil-Analyse</span>
                    <span className="text-green-400">✓ Abgeschlossen</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stellensuche</span>
                    <span className="text-green-400">✓ 1,247 Stellen durchsucht</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>KI-Matching</span>
                    <span className="text-green-400">✓ Top 3 gefunden</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Verarbeitungszeit</span>
                    <span className="text-blue-400">3.2 Sekunden</span>
                  </div>
                </div>
              </GlassCard>

              {/* Results */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl font-bold">Top Matches für Anna</h3>
                </div>

                {demoResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.2 }}
                  >
                    <GlassCard className="p-6 text-white hover-lift">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                              #{index + 1}
                            </span>
                            <ScoreBadge score={result.matchScore} size="lg" />
                          </div>
                          <h4 className="text-xl font-bold mb-1">{result.title}</h4>
                          <p className="text-white/80 mb-2">{result.company}</p>
                          <div className="flex items-center gap-2 text-white/70">
                            <MapPin className="w-4 h-4" />
                            <span>{result.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{result.scores.interest}%</div>
                          <div className="text-xs text-white/70">Interesse</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{result.scores.location}%</div>
                          <div className="text-xs text-white/70">Standort</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{result.scores.skills}%</div>
                          <div className="text-xs text-white/70">Skills</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-400">{result.scores.preferences}%</div>
                          <div className="text-xs text-white/70">Präferenzen</div>
                        </div>
                      </div>

                      {/* AI Recommendation */}
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium">KI-Empfehlung</span>
                        </div>
                        <p className="text-white/80 text-sm">{result.aiReason}</p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <GlassCard className="p-8 text-center text-white">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h3 className="text-2xl font-bold mb-4">Beeindruckt von den Ergebnissen?</h3>
                  <p className="text-white/80 mb-6 max-w-md mx-auto">
                    Erstelle jetzt dein eigenes Profil und finde deine perfekte Lehrstelle mit unserer KI-Technologie.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/fragebogen">
                      <Button size="lg" className="bg-white text-black hover:bg-white/90">
                        <Target className="w-5 h-5 mr-2" />
                        Mein Profil erstellen
                      </Button>
                    </Link>
                    
                    <Link href="/">
                      <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-black bg-transparent">
                        <Clock className="w-5 h-5 mr-2" />
                        Mehr erfahren
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
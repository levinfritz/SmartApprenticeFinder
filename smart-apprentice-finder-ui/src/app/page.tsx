'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/atoms/GlassCard';
import GradientText from '@/components/atoms/GradientText';
import ScoreBadge from '@/components/atoms/ScoreBadge';
import Footer from '@/components/organisms/Footer';
import Navigation from '@/components/molecules/Navigation';
import { 
  Sparkles, 
  Target, 
  Rocket, 
  Brain, 
  Users, 
  TrendingUp,
  ArrowRight,
  Play
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen relative overflow-hidden pt-16">
      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Main Headline */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-white/90 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                <span>KI-gestützte Lehrstellensuche</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold font-space-grotesk text-white leading-tight">
                Deine{' '}
                <GradientText variant="secondary" as="span">
                  Traumlehrstelle
                </GradientText>
                <br />
                wartet auf dich
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Entdecke mit künstlicher Intelligenz die perfekte Lehrstelle in der Schweiz. 
                Personalisierte Empfehlungen in nur wenigen Minuten.
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/fragebogen">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90 h-14 px-8 text-lg font-semibold group"
                >
                  <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Jetzt starten
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/demo">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-black h-14 px-8 text-lg bg-transparent"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Demo ansehen
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5+</div>
                <div className="text-white/70">Aktuelle Lehrstellen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-white/70">Zufriedenheit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">⚡</div>
                <div className="text-white/70">In 5 Minuten</div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-space-grotesk">
              Wie es funktioniert
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Modernste KI-Technologie trifft auf persönliche Berufsberatung
            </p>
          </motion.div>

          <div className="bento-grid">
            {/* Smart Profiling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <GlassCard className="bento-item-large p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Smart Profiling</h3>
                      <ScoreBadge score={95} label="Genauigkeit" size="sm" />
                    </div>
                  </div>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    Unser intelligenter Fragebogen analysiert deine Persönlichkeit, Interessen und Fähigkeiten. 
                    Machine Learning erstellt dein einzigartiges Profil in nur 5 Minuten.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">🧠 Persönlichkeitsanalyse</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">💪 Stärken-Assessment</span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">🎯 Präferenz-Matching</span>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10">
                  <Brain className="w-32 h-32" />
                </div>
              </GlassCard>
            </motion.div>

            {/* AI Matching */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="bento-item p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-emerald-400" />
                  <h3 className="text-xl font-bold">KI-Matching</h3>
                </div>
                <p className="text-white/80 mb-4">
                  Intelligente Algorithmen finden perfekte Matches basierend auf deinem Profil.
                </p>
                <ScoreBadge score={68} label="Durchschnittlicher Match" />
              </GlassCard>
            </motion.div>

            {/* Instant Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <GlassCard className="bento-item p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                  <h3 className="text-xl font-bold">Sofort Ergebnisse</h3>
                </div>
                <p className="text-white/80 mb-4">
                  Erhalte personalisierte Empfehlungen mit AI-generierten Begründungen.
                </p>
                <div className="text-sm text-white/70">⚡ Verarbeitung in ~4 Sekunden</div>
              </GlassCard>
            </motion.div>

            {/* Success Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard className="bento-item-tall p-6 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-8 h-8 text-purple-400" />
                  <h3 className="text-xl font-bold">Erfolgsquote</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">98%</div>
                    <div className="text-white/70">Zufriedene Nutzer</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Match-Qualität</span>
                      <span>96%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full w-[96%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Bewerbungserfolg</span>
                      <span>84%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-emerald-400 h-2 rounded-full w-[84%]"></div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Popular Apprenticeships Section */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-space-grotesk">
              🎓 Beliebte Lehrberufe
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Entdecke die gefragtesten Ausbildungen in der Schweiz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Informatiker/in EFZ",
                category: "Applikationsentwicklung",
                demand: "Sehr hoch",
                openPositions: "1,247",
                avgSalary: "CHF 65,000",
                icon: "💻",
                color: "from-blue-500/20 to-purple-500/20"
              },
              {
                title: "Kauffrau/Kaufmann EFZ",
                category: "Dienstleistung & Administration",
                demand: "Hoch",
                openPositions: "892",
                avgSalary: "CHF 55,000",
                icon: "📊",
                color: "from-green-500/20 to-teal-500/20"
              },
              {
                title: "Polymechaniker/in EFZ",
                category: "Maschinen- & Metallbau",
                demand: "Hoch",
                openPositions: "634",
                avgSalary: "CHF 62,000",
                icon: "⚙️",
                color: "from-orange-500/20 to-red-500/20"
              },
              {
                title: "Fachfrau/Fachmann Gesundheit EFZ",
                category: "Gesundheit & Soziales",
                demand: "Sehr hoch",
                openPositions: "756",
                avgSalary: "CHF 58,000",
                icon: "🏥",
                color: "from-pink-500/20 to-rose-500/20"
              },
              {
                title: "Elektroniker/in EFZ",
                category: "Elektrotechnik",
                demand: "Hoch",
                openPositions: "423",
                avgSalary: "CHF 64,000",
                icon: "⚡",
                color: "from-yellow-500/20 to-orange-500/20"
              },
              {
                title: "Logistiker/in EFZ",
                category: "Transport & Logistik",
                demand: "Mittel-Hoch",
                openPositions: "348",
                avgSalary: "CHF 52,000",
                icon: "📦",
                color: "from-indigo-500/20 to-blue-500/20"
              }
            ].map((beruf, index) => (
              <motion.div
                key={beruf.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <GlassCard className="p-6 text-white hover-lift h-full">
                  <div className={`bg-gradient-to-br ${beruf.color} rounded-lg p-4 mb-4 border border-white/10`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{beruf.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold">{beruf.title}</h3>
                        <p className="text-white/70 text-sm">{beruf.category}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-white/60">Nachfrage</div>
                        <div className="font-medium">{beruf.demand}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Offene Stellen</div>
                        <div className="font-medium">{beruf.openPositions}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-white/60">Durchschnittslohn</div>
                        <div className="font-medium text-green-400">{beruf.avgSalary}</div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center mt-12"
          >
            <Link href="/demo">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                <Target className="w-5 h-5 mr-2" />
                Alle Lehrberufe entdecken
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Swiss Education System Section */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-space-grotesk">
              🇨🇭 Das Schweizer Bildungssystem
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Verstehe die einzigartigen Vorteile der dualen Berufsbildung in der Schweiz
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Dual Education Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard className="p-8 text-white h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-2xl font-bold">Duale Berufsbildung</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <div>
                      <h4 className="font-medium">Praxis & Theorie kombiniert</h4>
                      <p className="text-white/70 text-sm">3-4 Tage im Betrieb, 1-2 Tage in der Berufsschule</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <div>
                      <h4 className="font-medium">Lehrlingslohn ab Tag 1</h4>
                      <p className="text-white/70 text-sm">Eigenes Einkommen während der Ausbildung</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <div>
                      <h4 className="font-medium">Höchste Übernahmequote weltweit</h4>
                      <p className="text-white/70 text-sm">96% finden direkt nach der Lehre eine Stelle</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <div>
                      <h4 className="font-medium">Durchlässiges System</h4>
                      <p className="text-white/70 text-sm">Berufsmatura → Fachhochschule → Universität möglich</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Swiss Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GlassCard className="p-8 text-white h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-bold">Schweizer Erfolgsmodell</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">230+</div>
                    <div className="text-white/70 text-sm">Verschiedene Lehrberufe</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">2.8%</div>
                    <div className="text-white/70 text-sm">Jugendarbeitslosigkeit</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">68%</div>
                    <div className="text-white/70 text-sm">Wählen Berufsbildung</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-2">CHF 5.2k</div>
                    <div className="text-white/70 text-sm">Ø Einstiegslohn</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium mb-2">🏆 International anerkannt</h4>
                    <p className="text-white/70 text-sm">
                      Das Schweizer Berufsbildungssystem gilt weltweit als Goldstandard 
                      und wird von vielen Ländern als Vorbild übernommen.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Education Path Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <GlassCard className="p-8 text-white">
              <h3 className="text-2xl font-bold text-center mb-8">Dein Weg nach der Lehre</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-bold mb-2">Berufseinstieg</h4>
                  <p className="text-white/70 text-sm">Direkter Einstieg ins Berufsleben mit EFZ-Abschluss</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h4 className="font-bold mb-2">Berufsmaturität</h4>
                  <p className="text-white/70 text-sm">Erweiterte Allgemeinbildung parallel zur Lehre</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h4 className="font-bold mb-2">Fachhochschule</h4>
                  <p className="text-white/70 text-sm">Praxisorientiertes Studium mit Berufsmatura</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h4 className="font-bold mb-2">Weiterbildung</h4>
                  <p className="text-white/70 text-sm">Spezialisierung, Führung oder eigenes Unternehmen</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <GlassCard className="max-w-4xl mx-auto p-12 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
                Bereit für deine{' '}
                <GradientText variant="secondary" as="span">
                  Zukunft?
                </GradientText>
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Starte jetzt deine Reise zur perfekten Lehrstelle. Kostenlos, schnell und mit KI-Power.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/fragebogen">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 h-14 px-8 text-lg font-semibold">
                    <Rocket className="w-5 h-5 mr-2" />
                    Fragebogen starten
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-black h-14 px-8 text-lg bg-transparent">
                    Demo ausprobieren
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float"></div>
        <div className="absolute top-1/2 -left-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute -bottom-4 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl float" style={{ animationDelay: '-1.5s' }}></div>
      </div>

      {/* Footer */}
      <Footer />
      </div>
    </>
  );
}
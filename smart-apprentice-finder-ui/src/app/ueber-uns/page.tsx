'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '@/components/atoms/GlassCard';
import { ArrowLeft, Users, Target, Heart, Sparkles } from 'lucide-react';

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-animated-gradient">
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
            <div className="text-center mb-8">
              <Users className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h1 className="text-4xl font-bold font-space-grotesk">
                Über uns
              </h1>
              <p className="text-white/80 mt-4">
                Die Vision hinter Smart Apprentice Finder
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-400" />
                  Unsere Mission
                </h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-white/80 text-lg leading-relaxed">
                    Wir glauben, dass jeder junge Mensch das Recht auf eine erfüllende Karriere hat. 
                    Mit moderner KI-Technologie revolutionieren wir die Lehrstellensuche in der Schweiz 
                    und helfen dabei, die perfekte Verbindung zwischen Talenten und Unternehmen zu schaffen.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-400" />
                  Was uns antreibt
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">🎯 Präzision</h3>
                    <p className="text-white/70 text-sm">
                      Unsere KI findet die wirklich passenden Lehrstellen basierend auf Persönlichkeit und Interessen.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">⚡ Geschwindigkeit</h3>
                    <p className="text-white/70 text-sm">
                      In wenigen Minuten zu personalisierten Empfehlungen statt wochenlanger Suche.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">🤝 Fairness</h3>
                    <p className="text-white/70 text-sm">
                      Jeder verdient eine Chance - unabhängig von Herkunft oder Netzwerk.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">🌱 Innovation</h3>
                    <p className="text-white/70 text-sm">
                      Wir nutzen neueste Technologie für bessere Matching-Ergebnisse.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Unser Team
                </h2>
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6 border border-white/10">
                  <p className="text-white/80 mb-4">
                    Hinter Smart Apprentice Finder steht ein Team aus Bildungsexperten, KI-Entwicklern 
                    und UX-Designern, die alle das gleiche Ziel verfolgen: Die Zukunft der Berufswahl 
                    zu revolutionieren.
                  </p>
                  <p className="text-white/70">
                    Basiert in Zürich, entwickeln wir mit Leidenschaft Technologie, die jungen Menschen 
                    hilft, ihren Weg zu finden.
                  </p>
                </div>
              </section>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
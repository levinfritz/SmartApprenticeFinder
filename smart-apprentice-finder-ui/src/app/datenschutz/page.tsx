'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '@/components/atoms/GlassCard';
import { ArrowLeft, Shield, Eye, Lock, UserCheck } from 'lucide-react';

export default function DatenschutzPage() {
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
              <Shield className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h1 className="text-4xl font-bold font-space-grotesk">
                Datenschutzerklärung
              </h1>
              <p className="text-white/80 mt-4">
                Wir nehmen den Schutz deiner persönlichen Daten sehr ernst
              </p>
            </div>

            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <UserCheck className="w-6 h-6 text-green-400" />
                  Verantwortlicher
                </h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="mb-4">
                    Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
                  </p>
                  <div className="space-y-2">
                    <p><strong>Smart Apprentice Finder GmbH</strong></p>
                    <p>Musterstrasse 123, 8001 Zürich, Schweiz</p>
                    <p>E-Mail: privacy@smartapprenticefinder.ch</p>
                    <p>Telefon: +41 44 123 45 67</p>
                  </div>
                </div>
              </section>

              {/* Data Collection */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-yellow-400" />
                  Welche Daten sammeln wir?
                </h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">Persönliche Daten</h3>
                    <ul className="space-y-2 text-white/80">
                      <li>• <strong>Profildaten:</strong> Name, Alter, Wohnort, Postleitzahl</li>
                      <li>• <strong>Interessensprofil:</strong> Berufliche Interessen und Präferenzen</li>
                      <li>• <strong>Kontaktdaten:</strong> E-Mail-Adresse (optional für Newsletter)</li>
                      <li>• <strong>Nutzungsdaten:</strong> Fragebogen-Antworten, Suchverlauf</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">Technische Daten</h3>
                    <ul className="space-y-2 text-white/80">
                      <li>• <strong>IP-Adresse:</strong> Wird anonymisiert gespeichert</li>
                      <li>• <strong>Browser-Informationen:</strong> User-Agent, Bildschirmauflösung</li>
                      <li>• <strong>Cookies:</strong> Nur essenzielle Cookies für Funktionalität</li>
                      <li>• <strong>Session-Daten:</strong> Temporäre Speicherung für User Experience</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Data Usage */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-purple-400" />
                  Wie verwenden wir deine Daten?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-medium mb-3">🎯 Matching-Algorithmus</h3>
                    <p className="text-white/80">
                      Deine Profildaten werden verwendet, um personalisierte Lehrstellenempfehlungen 
                      zu erstellen und die besten Matches für dich zu finden.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-medium mb-3">🤖 KI-Verbesserung</h3>
                    <p className="text-white/80">
                      Anonymisierte Daten helfen uns, unsere KI-Algorithmen zu verbessern und 
                      bessere Empfehlungen für alle Nutzer zu entwickeln.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-medium mb-3">📧 Kommunikation</h3>
                    <p className="text-white/80">
                      Mit deiner Einwilligung senden wir dir Updates zu neuen Lehrstellen und 
                      Platform-Features per E-Mail.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-medium mb-3">📊 Analytics</h3>
                    <p className="text-white/80">
                      Anonymisierte Nutzungsstatistiken helfen uns, die User Experience zu 
                      verbessern und technische Probleme zu identifizieren.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Protection */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">🔐 Datenschutz & Sicherheit</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">Technische Sicherheit</h3>
                    <ul className="space-y-2 text-white/80">
                      <li>• <strong>Verschlüsselung:</strong> Alle Datenübertragungen erfolgen über HTTPS</li>
                      <li>• <strong>Server-Sicherheit:</strong> Hosting in sicheren Schweizer Rechenzentren</li>
                      <li>• <strong>Zugriffskontrolle:</strong> Strenge Beschränkung auf autorisiertes Personal</li>
                      <li>• <strong>Backups:</strong> Regelmäßige, verschlüsselte Datensicherung</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">Deine Rechte</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <p><strong>📋 Auskunftsrecht:</strong> Übersicht über gespeicherte Daten</p>
                        <p><strong>✏️ Berichtigungsrecht:</strong> Korrektur fehlerhafter Daten</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🗑️ Löschungsrecht:</strong> Vollständige Datenlöschung</p>
                        <p><strong>📤 Datenportabilität:</strong> Export in maschinenlesbarem Format</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">🍪 Cookies & Tracking</h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">✅</span>
                      </div>
                      <h3 className="font-medium">Essenzielle Cookies</h3>
                      <p className="text-sm text-white/70 mt-1">Für grundlegende Funktionalität</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">⚙️</span>
                      </div>
                      <h3 className="font-medium">Funktionale Cookies</h3>
                      <p className="text-sm text-white/70 mt-1">Für erweiterte Features</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">❌</span>
                      </div>
                      <h3 className="font-medium">Tracking Cookies</h3>
                      <p className="text-sm text-white/70 mt-1">Verwenden wir nicht</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">📞 Datenschutz-Kontakt</h2>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-white/10">
                  <p className="mb-4">
                    Bei Fragen zum Datenschutz oder zur Ausübung deiner Rechte kannst du uns kontaktieren:
                  </p>
                  <div className="space-y-2">
                    <p><strong>E-Mail:</strong> privacy@smartapprenticefinder.ch</p>
                    <p><strong>Post:</strong> Smart Apprentice Finder GmbH, Datenschutz, Musterstrasse 123, 8001 Zürich</p>
                    <p><strong>Telefon:</strong> +41 44 123 45 67 (Mo-Fr, 9-17 Uhr)</p>
                  </div>
                </div>
              </section>

              {/* Update Date */}
              <section className="text-center pt-8 border-t border-white/10">
                <p className="text-white/60">
                  <strong>Stand der Datenschutzerklärung:</strong> {new Date().toLocaleDateString('de-CH')}
                </p>
                <p className="text-sm text-white/50 mt-2">
                  Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren.
                </p>
              </section>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
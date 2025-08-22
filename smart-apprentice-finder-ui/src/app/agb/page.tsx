'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '@/components/atoms/GlassCard';
import { ArrowLeft, FileText, Scale, Shield } from 'lucide-react';

export default function AGBPage() {
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
              <Scale className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h1 className="text-4xl font-bold font-space-grotesk">
                Allgemeine Geschäftsbedingungen (AGB)
              </h1>
              <p className="text-white/80 mt-4">
                Gültig ab {new Date().toLocaleDateString('de-CH')}
              </p>
            </div>

            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-400" />
                  § 1 Geltungsbereich
                </h2>
                <div className="bg-white/5 rounded-lg p-6 space-y-4">
                  <p>
                    Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle 
                    Leistungen der Smart Apprentice Finder GmbH (nachfolgend "Anbieter") gegenüber 
                    ihren Kunden (nachfolgend "Nutzer").
                  </p>
                  <p>
                    Der Anbieter erbringt seine Leistungen ausschließlich auf der Grundlage dieser AGB. 
                    Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des 
                    Nutzers werden nicht Vertragsbestandteil, es sei denn, der Anbieter hätte 
                    ausdrücklich schriftlich ihrer Geltung zugestimmt.
                  </p>
                </div>
              </section>

              {/* Service Description */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">§ 2 Leistungsbeschreibung</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">2.1 Kernleistungen</h3>
                    <ul className="space-y-2 text-white/80">
                      <li>• KI-gestützte Analyse von Nutzerprofilen für die Lehrstellensuche</li>
                      <li>• Personalisierte Empfehlungen basierend auf Interessen und Fähigkeiten</li>
                      <li>• Matching-Algorithmus für optimale Lehrstellen-Kandidaten-Verbindung</li>
                      <li>• Bereitstellung einer Plattform zur Lehrstellensuche</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">2.2 Verfügbarkeit</h3>
                    <p className="text-white/80">
                      Der Anbieter ist bemüht, den Dienst mit einer Verfügbarkeit von 99% zu 
                      erbringen. Ausgenommen hiervon sind Zeiten, in denen der Webserver aufgrund 
                      von technischen oder sonstigen Problemen, die nicht im Einflussbereich des 
                      Anbieters liegen, nicht erreichbar ist.
                    </p>
                  </div>
                </div>
              </section>

              {/* User Obligations */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">§ 3 Pflichten des Nutzers</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">3.1 Korrekte Angaben</h3>
                    <p className="text-white/80 mb-3">
                      Der Nutzer verpflichtet sich, nur wahrheitsgemäße und vollständige Angaben zu machen.
                    </p>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Persönliche Daten müssen aktuell und korrekt sein</li>
                      <li>• Interessensangaben sollen ehrlich und realistisch erfolgen</li>
                      <li>• Änderungen sind umgehend zu aktualisieren</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">3.2 Verbotene Nutzung</h3>
                    <p className="text-white/80 mb-3">Der Nutzer verpflichtet sich, die Plattform nicht zu missbrauchen:</p>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Keine Übermittlung von Malware oder schädlichem Code</li>
                      <li>• Keine Manipulation der Matching-Algorithmen</li>
                      <li>• Keine missbräuchliche Nutzung der KI-Funktionen</li>
                      <li>• Kein Spam oder unerwünschte Kommunikation</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Privacy & Data */}
              <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-purple-400" />
                  § 4 Datenschutz
                </h2>
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6 border border-white/10">
                  <p className="text-white/80 mb-4">
                    Der Schutz der Daten unserer Nutzer hat höchste Priorität. Details zur 
                    Datenerhebung und -verarbeitung finden sich in unserer 
                    <Link href="/datenschutz" className="text-blue-400 hover:text-blue-300 underline ml-1">
                      Datenschutzerklärung
                    </Link>.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Datenminimierung</h4>
                      <p className="text-sm text-white/70">Wir erheben nur notwendige Daten für das Matching</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Zweckbindung</h4>
                      <p className="text-sm text-white/70">Daten werden nur für die Lehrstellensuche verwendet</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Liability */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">§ 5 Haftung</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">5.1 Haftungsausschluss</h3>
                    <p className="text-white/80">
                      Der Anbieter übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit und 
                      Aktualität der auf der Plattform zur Verfügung gestellten Informationen. 
                      Die Nutzung der Empfehlungen erfolgt auf eigene Verantwortung des Nutzers.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-3">5.2 Beschränkung</h3>
                    <p className="text-white/80">
                      Die Haftung des Anbieters ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. 
                      Die Plattform dient als Hilfsmittel bei der Lehrstellensuche und ersetzt nicht 
                      die eigene Recherche und Bewerbungsaktivitäten.
                    </p>
                  </div>
                </div>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">§ 6 Beendigung</h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Nutzer-Kündigung</h3>
                      <p className="text-white/80 text-sm">
                        Nutzer können ihre Registrierung jederzeit ohne Angabe von Gründen beenden. 
                        Eine E-Mail an hello@smartapprenticefinder.ch genügt.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Anbieter-Kündigung</h3>
                      <p className="text-white/80 text-sm">
                        Der Anbieter kann die Nutzung bei Verstößen gegen diese AGB mit 
                        sofortiger Wirkung beenden.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Changes */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">§ 7 Änderungen der AGB</h2>
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-white/80">
                    Der Anbieter behält sich vor, diese AGB bei Bedarf zu ändern. Nutzer werden über 
                    Änderungen per E-Mail informiert. Widerspricht der Nutzer nicht innerhalb von 
                    30 Tagen, gelten die Änderungen als angenommen.
                  </p>
                </div>
              </section>

              {/* Final Provisions */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">§ 8 Schlussbestimmungen</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p><strong>Anwendbares Recht:</strong> Es gilt schweizerisches Recht.</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p><strong>Gerichtsstand:</strong> Ausschließlicher Gerichtsstand ist Zürich.</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p><strong>Salvatorische Klausel:</strong> Sollten einzelne Bestimmungen unwirksam sein, 
                    bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="text-center pt-8 border-t border-white/10">
                <h3 className="text-xl font-semibold mb-4">Fragen zu den AGB?</h3>
                <p className="text-white/80 mb-4">
                  Bei Fragen zu diesen Geschäftsbedingungen können Sie uns gerne kontaktieren:
                </p>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-white/10 max-w-md mx-auto">
                  <p><strong>E-Mail:</strong> legal@smartapprenticefinder.ch</p>
                  <p><strong>Telefon:</strong> +41 44 123 45 67</p>
                </div>
                
                <p className="text-white/60 mt-6">
                  <strong>Stand der AGB:</strong> {new Date().toLocaleDateString('de-CH')}
                </p>
              </section>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
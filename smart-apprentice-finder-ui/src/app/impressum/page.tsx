'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '@/components/atoms/GlassCard';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function ImpressumPage() {
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
            <h1 className="text-4xl font-bold mb-8 text-center font-space-grotesk">
              Impressum
            </h1>

            <div className="space-y-8">
              {/* Company Information */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Angaben gemäß Art. 8 des Bundesgesetzes über den Datenschutz (DSG)</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Betreiber und Kontakt</h3>
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      <p><strong>Smart Apprentice Finder GmbH</strong></p>
                      <p>Musterstrasse 123</p>
                      <p>8001 Zürich</p>
                      <p>Schweiz</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium">E-Mail</p>
                        <p className="text-white/80">hello@smartapprenticefinder.ch</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium">Telefon</p>
                        <p className="text-white/80">+41 44 123 45 67</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="font-medium">Standort</p>
                        <p className="text-white/80">Zürich, CH</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Legal Information */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Rechtliche Informationen</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p><strong>Handelsregistereintrag:</strong> CHE-123.456.789</p>
                    <p><strong>Registergericht:</strong> Handelsregister des Kantons Zürich</p>
                    <p><strong>Geschäftsführung:</strong> Max Mustermann, Anna Musterfrau</p>
                  </div>
                </div>
              </section>

              {/* Content Responsibility */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Verantwortlich für den Inhalt</h2>
                <div className="bg-white/5 rounded-lg p-4">
                  <p><strong>Max Mustermann</strong></p>
                  <p>Geschäftsführer</p>
                  <p>Smart Apprentice Finder GmbH</p>
                  <p>hello@smartapprenticefinder.ch</p>
                </div>
              </section>

              {/* Disclaimer */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Haftungsausschluss</h2>
                <div className="space-y-4 text-white/80">
                  <div>
                    <h3 className="font-medium text-white mb-2">Haftung für Inhalte</h3>
                    <p>
                      Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                      Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-white mb-2">Haftung für Links</h3>
                    <p>
                      Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                      Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-white mb-2">Urheberrecht</h3>
                    <p>
                      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                      dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede 
                      Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                      Zustimmung des jeweiligen Autors bzw. Erstellers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Technology Credits */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">Technologie & Credits</h2>
                <div className="bg-white/5 rounded-lg p-4 text-white/80">
                  <p>Diese Website wurde entwickelt mit:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Next.js 15 - React Framework</li>
                    <li>Tailwind CSS - Styling Framework</li>
                    <li>Framer Motion - Animations</li>
                    <li>TypeScript - Type Safety</li>
                    <li>Vercel - Hosting Platform</li>
                  </ul>
                </div>
              </section>

              {/* Update Date */}
              <section className="text-center pt-8 border-t border-white/10">
                <p className="text-white/60">
                  <strong>Letzte Aktualisierung:</strong> {new Date().toLocaleDateString('de-CH')}
                </p>
              </section>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
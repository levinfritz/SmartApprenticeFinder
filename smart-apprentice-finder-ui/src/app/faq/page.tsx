'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '@/components/atoms/GlassCard';
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: "Wie funktioniert das KI-Matching?",
      answer: "Unser intelligenter Algorithmus analysiert dein Profil und gleicht es mit verfügbaren Lehrstellen ab. Dabei werden Persönlichkeit, Interessen, Fähigkeiten und Präferenzen berücksichtigt."
    },
    {
      question: "Ist die Nutzung kostenlos?",
      answer: "Ja, die Grundfunktionen sind komplett kostenlos. Du kannst dein Profil erstellen und Lehrstellenempfehlungen erhalten ohne Kosten."
    },
    {
      question: "Wie lange dauert der Fragebogen?",
      answer: "Der Fragebogen dauert etwa 5-7 Minuten. Wir haben ihn so optimiert, dass er schnell ausfüllbar ist, aber trotzdem aussagekräftige Ergebnisse liefert."
    },
    {
      question: "Welche Daten werden gespeichert?",
      answer: "Wir speichern nur die notwendigen Daten für das Matching. Details findest du in unserer Datenschutzerklärung."
    }
  ];

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
              <HelpCircle className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h1 className="text-4xl font-bold font-space-grotesk">
                Häufig gestellte Fragen
              </h1>
              <p className="text-white/80 mt-4">
                Antworten auf die wichtigsten Fragen zur Nutzung
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ChevronDown className="w-5 h-5 text-blue-400" />
                    {faq.question}
                  </h3>
                  <p className="text-white/80 pl-7">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <p className="text-white/70">
                Weitere Fragen? Kontaktiere uns unter{' '}
                <a href="mailto:hello@smartapprenticefinder.ch" className="text-blue-400 hover:text-blue-300">
                  hello@smartapprenticefinder.ch
                </a>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
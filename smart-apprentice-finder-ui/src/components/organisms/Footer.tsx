'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassCard from '@/components/atoms/GlassCard';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Fragebogen', href: '/fragebogen' },
      { name: 'Demo ansehen', href: '/demo' },
      { name: 'Für Unternehmen', href: '/unternehmen' },
      { name: 'API Zugang', href: '/api' },
    ],
    support: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Impressum', href: '/impressum' },
      { name: 'Datenschutz', href: '/datenschutz' },
      { name: 'AGB', href: '/agb' },
      { name: 'Cookies', href: '/cookies' },
    ],
    company: [
      { name: 'Über uns', href: '/ueber-uns' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-400' },
  ];

  return (
    <footer className="relative mt-20 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <GlassCard className="p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Company Info */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Smart Apprentice Finder
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed">
                    Die moderne Plattform für KI-gestützte Lehrstellensuche in der Schweiz. 
                    Finde deine Traumkarriere mit personalisierten Empfehlungen.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/70">
                    <Mail className="w-5 h-5" />
                    <span>hello@smartapprenticefinder.ch</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <Phone className="w-5 h-5" />
                    <span>+41 44 123 45 67</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70">
                    <MapPin className="w-5 h-5" />
                    <span>Zürich, Schweiz</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.name}
                      href={social.href}
                      className={`p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                        text-white/70 transition-all duration-200 hover:scale-110 ${social.color}`}
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Footer Links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Product Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h4 className="text-white font-semibold text-lg mb-4">Produkt</h4>
                  <ul className="space-y-3">
                    {footerLinks.product.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200 
                            flex items-center gap-1 hover:gap-2"
                        >
                          {link.name}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Support Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h4 className="text-white font-semibold text-lg mb-4">Support</h4>
                  <ul className="space-y-3">
                    {footerLinks.support.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Legal Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h4 className="text-white font-semibold text-lg mb-4">Rechtliches</h4>
                  <ul className="space-y-3">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Company Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h4 className="text-white font-semibold text-lg mb-4">Unternehmen</h4>
                  <ul className="space-y-3">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white/70 hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <motion.div 
            className="mt-12 pt-8 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-white font-semibold text-lg mb-2">
                  Bleib auf dem Laufenden
                </h4>
                <p className="text-white/70">
                  Erhalte Updates zu neuen Features und Lehrstellen direkt in dein Postfach.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input
                  type="email"
                  placeholder="Deine E-Mail Adresse"
                  className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 
                    text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 
                    transition-all duration-200 w-full lg:w-80"
                />
                <button className="px-6 py-3 bg-white text-black rounded-xl font-semibold 
                  hover:bg-white/90 transition-all duration-200 whitespace-nowrap">
                  Abonnieren
                </button>
              </div>
            </div>
          </motion.div>
        </GlassCard>

        {/* Bottom Bar */}
        <motion.div 
          className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row 
            items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-white/60 text-sm">
            © {currentYear} Smart Apprentice Finder. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <span>Made with ❤️ in Switzerland</span>
            <span>•</span>
            <Link href="/status" className="hover:text-white transition-colors">
              System Status
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
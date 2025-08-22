'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from '@/components/atoms/GlassCard';
import { ArrowLeft, Activity, CheckCircle, AlertCircle } from 'lucide-react';

export default function StatusPage() {
  const services = [
    { name: 'Website', status: 'operational', uptime: '99.9%' },
    { name: 'KI-Matching Engine', status: 'operational', uptime: '99.8%' },
    { name: 'Datenbank', status: 'operational', uptime: '100%' },
    { name: 'API Services', status: 'maintenance', uptime: '98.5%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400';
      case 'maintenance': return 'text-yellow-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'maintenance': return AlertCircle;
      case 'down': return AlertCircle;
      default: return Activity;
    }
  };

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
              <Activity className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h1 className="text-4xl font-bold font-space-grotesk">
                System Status
              </h1>
              <p className="text-white/80 mt-4">
                Aktuelle Verfügbarkeit unserer Services
              </p>
            </div>

            {/* Overall Status */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-white/10 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-semibold">Alle Systeme betriebsbereit</h2>
              </div>
              <p className="text-white/70">
                Letzte Aktualisierung: {new Date().toLocaleString('de-CH')}
              </p>
            </div>

            {/* Service Status */}
            <div className="space-y-4">
              {services.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                        <h3 className="font-semibold">{service.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${getStatusColor(service.status)}`}>
                          {service.status === 'operational' ? 'Betriebsbereit' :
                           service.status === 'maintenance' ? 'Wartung' : 'Störung'}
                        </div>
                        <div className="text-sm text-white/60">
                          Verfügbarkeit: {service.uptime}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Updates */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold mb-4">Letzte Updates</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-white/60">{new Date(Date.now() - 86400000).toLocaleDateString('de-CH')} 14:30</span>
                  <span className="text-white/80 ml-3">Planmäßige Wartung der API Services abgeschlossen</span>
                </div>
                <div className="text-sm">
                  <span className="text-white/60">{new Date(Date.now() - 172800000).toLocaleDateString('de-CH')} 09:15</span>
                  <span className="text-white/80 ml-3">KI-Engine Performance-Updates implementiert</span>
                </div>
                <div className="text-sm">
                  <span className="text-white/60">{new Date(Date.now() - 259200000).toLocaleDateString('de-CH')} 16:45</span>
                  <span className="text-white/80 ml-3">Neue Sicherheits-Features aktiviert</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/atoms/GlassCard';
import ScoreBadge from '@/components/atoms/ScoreBadge';
import Navigation from '@/components/molecules/Navigation';
import { SwissLocation, calculateDistance, getRegionScore, swissLocations } from '@/data/swissLocations';
import { 
  ArrowLeft, 
  Brain, 
  Target, 
  MapPin, 
  Users, 
  TrendingUp,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface QuestionnaireData {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  location: string;
  locationData: SwissLocation | null;
  interests: { [key: string]: number };
  skills: string[];
  companySize: string;
  workEnvironment: string;
  commute: string;
  goals: string[];
  avoidances: string[];
}

interface MatchResult {
  id: number;
  title: string;
  company: string;
  location: string;
  distance: string;
  matchScore: number;
  scores: {
    interest: number;
    skills: number;
    location: number;
    preferences: number;
  };
  aiReason: string;
  salary: string;
  openPositions: number;
  companySize: string;
  industry: string;
}

// Helper function to convert job title to URL slug
const getJobSlug = (jobTitle: string): string => {
  return jobTitle
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export default function ErgebnissePage() {
  const [data, setData] = useState<QuestionnaireData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<MatchResult[]>([]);

  useEffect(() => {
    // Load questionnaire data from localStorage
    const savedData = localStorage.getItem('questionnaireData');
    if (savedData) {
      const questionnaireData = JSON.parse(savedData) as QuestionnaireData;
      setData(questionnaireData);
      
      // Simulate AI processing and generate results
      setTimeout(() => {
        const simulatedResults = generateResults(questionnaireData);
        setResults(simulatedResults);
        setIsLoading(false);
      }, 5000); // 5 second loading simulation for thorough matching
    } else {
      setIsLoading(false);
    }
  }, []);

  const generateResults = (userData: QuestionnaireData): MatchResult[] => {
    if (!userData.locationData) return [];

    // Erweiterte Job-Datenbank mit realistischen Schweizer Standorten
    const getJobsForRegion = (userLocation: SwissLocation) => {
      const baseJobs = [
        {
          id: 1,
          title: "Informatiker/in EFZ Applikationsentwicklung",
          industry: "IT & Software",
          baseScore: userData.interests.technik || 0,
          salary: "CHF 750-900/Monat"
        },
        {
          id: 2,
          title: "Kauffrau/Kaufmann EFZ",
          industry: "Banking & Finance",
          baseScore: userData.interests.business || 0,
          salary: "CHF 650-800/Monat"
        },
        {
          id: 3,
          title: "Fachfrau/Fachmann Gesundheit EFZ",
          industry: "Gesundheitswesen",
          baseScore: userData.interests.gesundheit || 0,
          salary: "CHF 700-850/Monat"
        },
        {
          id: 4,
          title: "Polymechaniker/in EFZ",
          industry: "Maschinenbau",
          baseScore: userData.interests.handwerk || 0,
          salary: "CHF 800-950/Monat"
        },
        {
          id: 5,
          title: "Mediamatiker/in EFZ",
          industry: "Medien & Design",
          baseScore: (userData.interests.kreativ || 0) + (userData.interests.technik || 0) / 2,
          salary: "CHF 700-850/Monat"
        },
        {
          id: 6,
          title: "Logistiker/in EFZ",
          industry: "Transport & Logistik",
          baseScore: userData.interests.transport || 0,
          salary: "CHF 600-750/Monat"
        }
      ];

      // Companies in different regions
      const companiesByRegion: Record<string, Array<{name: string; size: string; locations: SwissLocation[]}>> = {
        'Ostschweiz': [
          // IT & Software
          { name: "OST-Tech Solutions AG", size: "Mittel (120 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          { name: "Digital Innovation St. Gallen", size: "Klein (45 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          { name: "SwissTech Solutions Rheintal", size: "Mittel (95 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9400')!] },
          // Banking & Finance
          { name: "St. Galler Kantonalbank", size: "Gross (1500 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          { name: "Raiffeisen Bank Ostschweiz", size: "Mittel (380 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          { name: "Credit Suisse St. Gallen", size: "Gross (2200 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          // Gesundheitswesen
          { name: "Kantonsspital St. Gallen", size: "Gross (5000 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          { name: "Spital Grabs", size: "Mittel (450 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9400')!] },
          { name: "Gesundheitszentrum Rheintal", size: "Klein (120 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9400')!] },
          // Maschinenbau
          { name: "Precision Engineering Gossau", size: "Klein (85 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9200')!] },
          { name: "Rheintal Precision Tools", size: "Mittel (160 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9400')!] },
          { name: "Swiss Engineering Solutions", size: "Klein (75 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          // Medien & Design
          { name: "Creative St. Gallen GmbH", size: "Klein (25 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          { name: "Media Design Ostschweiz", size: "Klein (35 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          { name: "Studio Rheintal Creative", size: "Klein (18 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9400')!] },
          // Transport & Logistik
          { name: "Rheintal Logistics AG", size: "Mittel (250 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9400')!] },
          { name: "Swiss Post Ostschweiz", size: "Gross (800 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] },
          { name: "Transport Solutions St. Gallen", size: "Mittel (140 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '9000')!] }
        ],
        'Zürich': [
          // IT & Software
          { name: "SwissTech Solutions AG", size: "Mittel (320 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8001')!] },
          { name: "Digital Zürich Technologies", size: "Gross (500 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8003')!] },
          { name: "Innovation Tech Winterthur", size: "Mittel (180 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8400')!] },
          // Banking & Finance
          { name: "Credit Suisse AG", size: "Gross (8000 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8001')!] },
          { name: "UBS Zürich", size: "Gross (12000 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8001')!] },
          { name: "Zürcher Kantonalbank", size: "Gross (5200 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8001')!] },
          // Gesundheitswesen
          { name: "Universitätsspital Zürich", size: "Gross (10000 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8001')!] },
          { name: "Klinik Hirslanden", size: "Gross (2500 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8003')!] },
          { name: "Stadtspital Winterthur", size: "Mittel (800 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8400')!] },
          // Maschinenbau
          { name: "Precision Tools Winterthur", size: "Mittel (180 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8400')!] },
          { name: "Swiss Engineering Zürich", size: "Gross (420 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8005')!] },
          { name: "Precision Manufacturing AG", size: "Mittel (240 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8001')!] },
          // Medien & Design
          { name: "Zürich Media Labs", size: "Klein (45 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8003')!] },
          { name: "Creative Studio Zürich", size: "Mittel (85 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8005')!] },
          { name: "Media House Winterthur", size: "Klein (32 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8400')!] },
          // Transport & Logistik
          { name: "Swiss Post Logistics", size: "Gross (5000 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8001')!] },
          { name: "SBB Cargo Zürich", size: "Gross (3500 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8001')!] },
          { name: "Zürich Transport Solutions", size: "Mittel (280 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '8003')!] }
        ],
        'Basel': [
          // IT & Software
          { name: "Basel Digital AG", size: "Mittel (150 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4001')!] },
          { name: "Pharma Tech Solutions", size: "Gross (450 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4052')!] },
          { name: "Rhine Digital Innovation", size: "Klein (75 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4052')!] },
          // Banking & Finance
          { name: "UBS Basel", size: "Gross (3000 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4002')!] },
          { name: "Basler Kantonalbank", size: "Mittel (1200 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4001')!] },
          { name: "Credit Suisse Basel", size: "Gross (2800 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4051')!] },
          // Gesundheitswesen
          { name: "Universitätsspital Basel", size: "Gross (7000 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4001')!] },
          { name: "Claraspital", size: "Mittel (900 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4051')!] },
          { name: "Bethesda Spital", size: "Mittel (650 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4052')!] },
          // Maschinenbau
          { name: "Basel Precision Works", size: "Klein (90 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4103')!] },
          { name: "Rhine Engineering Solutions", size: "Mittel (160 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4142')!] },
          { name: "Swiss Precision Basel", size: "Klein (110 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4001')!] },
          // Medien & Design
          { name: "Rhine Creative Studio", size: "Klein (30 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4052')!] },
          { name: "Basel Media House", size: "Klein (42 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4051')!] },
          { name: "Creative Basel Solutions", size: "Klein (25 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4001')!] },
          // Transport & Logistik
          { name: "Rhine Valley Transport", size: "Mittel (200 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4142')!] },
          { name: "Swiss Post Basel", size: "Gross (1200 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4001')!] },
          { name: "Basel Logistics Center", size: "Mittel (320 Mitarbeiter)", locations: [swissLocations.find(l => l.postalCode === '4052')!] }
        ]
      };

      // Get companies for user's region and nearby regions
      const userRegionCompanies = companiesByRegion[userLocation.region] || [];
      const nearbyRegionCompanies = Object.values(companiesByRegion).flat().filter(company => 
        !userRegionCompanies.includes(company) && 
        company.locations.some(loc => 
          loc && loc.coordinates && userLocation.coordinates &&
          calculateDistance(userLocation.coordinates, loc.coordinates) <= 150
        )
      );
      
      const allCompanies = [...userRegionCompanies, ...nearbyRegionCompanies.slice(0, 8)];

      // Create jobs by combining base jobs with companies (3 companies per profession)
      const expandedJobs = baseJobs.flatMap(baseJob => {
        // Select companies that make sense for this job type
        const relevantCompanies = allCompanies.filter(company => {
          const companyName = company.name.toLowerCase();
          
          switch (baseJob.industry) {
            case 'IT & Software':
              return companyName.includes('tech') || companyName.includes('digital') || companyName.includes('solutions');
            case 'Banking & Finance':
              return companyName.includes('bank') || companyName.includes('ubs') || companyName.includes('credit');
            case 'Gesundheitswesen':
              return companyName.includes('spital') || companyName.includes('gesundheit') || companyName.includes('klinik');
            case 'Maschinenbau':
              return companyName.includes('precision') || companyName.includes('engineering') || companyName.includes('tools');
            case 'Medien & Design':
              return companyName.includes('creative') || companyName.includes('media') || companyName.includes('studio');
            case 'Transport & Logistik':
              return companyName.includes('logistics') || companyName.includes('transport') || companyName.includes('post');
            default:
              return true;
          }
        });

        // Fall back to all companies if no relevant ones found, take up to 3
        const selectedCompanies = relevantCompanies.length >= 3 
          ? relevantCompanies.slice(0, 3)
          : allCompanies.slice(0, 3);

        return selectedCompanies.map((company, index) => {
          const jobLocation = company.locations[0];
          const distance = jobLocation?.coordinates && userLocation.coordinates 
            ? calculateDistance(userLocation.coordinates, jobLocation.coordinates)
            : 0;
          
          return {
            ...baseJob,
            id: baseJob.id + index * 100,
            company: company.name,
            location: `${jobLocation.city}`,
            distance: `${distance} km`,
            companySize: company.size,
            openPositions: Math.floor(Math.random() * 8) + 1,
            locationData: jobLocation
          };
        });
      });

      return expandedJobs;
    };

    const allJobs = getJobsForRegion(userData.locationData);

    // Calculate match scores with improved location logic
    const scoredJobs = allJobs.map(job => {
      const interestScore = Math.min(100, job.baseScore * 20 + Math.random() * 20);
      const skillsScore = Math.min(100, 70 + Math.random() * 30);
      const locationScore = getRegionScore(userData.locationData!, job.locationData);
      const preferencesScore = Math.min(100, 75 + Math.random() * 25);
      
      const overallScore = Math.round(
        (interestScore * 0.4 + skillsScore * 0.3 + locationScore * 0.2 + preferencesScore * 0.1)
      );

      return {
        ...job,
        matchScore: overallScore,
        scores: {
          interest: Math.round(interestScore),
          skills: Math.round(skillsScore),
          location: Math.round(locationScore),
          preferences: Math.round(preferencesScore)
        },
        aiReason: generateAIReason(job.title, userData, overallScore, job.distance)
      };
    });

    // Group jobs by profession and get top 3 companies per profession
    const jobsByProfession = scoredJobs.reduce((acc, job) => {
      if (!acc[job.title]) {
        acc[job.title] = [];
      }
      acc[job.title].push(job);
      return acc;
    }, {} as Record<string, typeof scoredJobs>);

    // Get top 3 companies per profession, then top 3 professions
    const topProfessions = Object.entries(jobsByProfession)
      .map(([profession, jobs]) => ({
        profession,
        avgScore: jobs.reduce((sum, job) => sum + job.matchScore, 0) / jobs.length,
        jobs: jobs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3);

    // Flatten the results
    return topProfessions.flatMap(({ jobs }) => jobs);
  };

  const generateAIReason = (jobTitle: string, userData: QuestionnaireData, score: number, distance: string): string => {
    const userCity = userData.locationData?.city || 'deinem Standort';
    const topSkill = userData.skills[0]?.replace('_', ' ') || 'deinen Fähigkeiten';
    
    const reasons = [
      `Perfekte Übereinstimmung mit deinen Interessen und nur ${distance} von ${userCity} entfernt.`,
      `Deine Stärken in ${topSkill} passen ideal zu den Anforderungen dieser Position.`,
      `Starke Korrelation zwischen deinem Profil und den Stellenanforderungen in der Region.`,
      `Optimale Kombination aus Interessen, Standort und Entwicklungsmöglichkeiten.`,
      `${score >= 85 ? 'Außergewöhnlich' : 'Sehr'} gute Übereinstimmung basierend auf deinen Zielen.`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  if (!data && !isLoading) {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
        <GlassCard className="p-8 text-center text-white max-w-md">
          <h1 className="text-2xl font-bold mb-4">Keine Daten gefunden</h1>
          <p className="text-white/80 mb-6">
            Du musst zuerst den Fragebogen ausfüllen, um deine Ergebnisse zu sehen.
          </p>
          <Link href="/fragebogen">
            <Button className="bg-white text-black hover:bg-white/90">
              Fragebogen starten
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-animated-gradient pt-16">
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
            <Sparkles className="w-4 h-4" />
            <span>KI-Analyse abgeschlossen</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-space-grotesk">
            Deine Ergebnisse
          </h1>
          
          {data && (
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Hallo {data.firstName}! Basierend auf deinen Antworten haben wir die perfekten 
              Lehrstellen für dich gefunden.
            </p>
          )}
        </motion.div>

        {isLoading ? (
          // Loading State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <GlassCard className="p-12 text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6"
              >
                <Brain className="w-16 h-16 text-blue-400" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-4">KI analysiert dein Profil...</h2>
              <p className="text-white/80 mb-6">
                Durchsuche 1,850+ aktuelle Lehrstellen und finde die besten 3 Firmen pro Beruf
              </p>
              
              <div className="space-y-3 max-w-md mx-auto">
                {[
                  "Analysiere Persönlichkeitsprofil...",
                  "Bewerte Interessensübereinstimmungen...",
                  "Finde passende Berufe in deiner Region...",
                  "Suche top 3 Firmen pro Beruf...",
                  "Berechne Standort-Kompatibilität...",
                  "Erstelle personalisierte Empfehlungen..."
                ].map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.7 }}
                    className="flex items-center gap-3 text-left"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/80">{step}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          // Results Display
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Summary */}
            {data && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <GlassCard className="p-6 text-white sticky top-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl font-bold">{data.firstName} {data.lastName}</h2>
                    <p className="text-white/70">{data.age} Jahre, {data.locationData?.city || data.location}</p>
                    {data.locationData && (
                      <p className="text-white/60 text-sm">{data.locationData.canton} • {data.locationData.region}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Top Interessen
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(data.interests)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 3)
                          .map(([interest, score]) => (
                            <div key={interest} className="flex justify-between bg-white/10 rounded p-2 text-sm">
                              <span className="capitalize">{interest.replace('_', ' ')}</span>
                              <span>{score}/5</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Top Fähigkeiten</h3>
                      <div className="flex flex-wrap gap-2">
                        {data.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-white/20 rounded text-xs">
                            {skill.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="space-y-6">
                {/* Success Header */}
                <GlassCard className="p-6 text-white">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-12 h-12 text-green-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Perfekte Matches gefunden!</h3>
                      <p className="text-white/80">
                        {results.length} top Lehrstellen von {Math.floor(results.length / 3)} passenden Berufen - jeweils die 3 besten Firmen
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Job Results - Grouped by Profession */}
                {Object.entries(
                  results.reduce((acc, result) => {
                    if (!acc[result.title]) {
                      acc[result.title] = [];
                    }
                    acc[result.title].push(result);
                    return acc;
                  }, {} as Record<string, typeof results>)
                ).map(([profession, jobs], professionIndex) => (
                  <div key={profession} className="space-y-4">
                    {/* Profession Header */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + professionIndex * 0.3 }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {professionIndex + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{profession}</h3>
                          <p className="text-white/70">Top 3 Firmen für diesen Beruf</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Companies for this profession */}
                    {jobs.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.2 }}
                  >
                    <GlassCard className="p-6 text-white hover-lift">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                              #{index + 1}
                            </span>
                            <ScoreBadge score={result.matchScore} size="lg" />
                          </div>
                          
                          <h4 className="text-xl font-bold mb-2">{result.title}</h4>
                          <p className="text-white/80 mb-1">{result.company}</p>
                          
                          <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {result.location} ({result.distance})
                            </span>
                            <span>💰 {result.salary}</span>
                            <span>👥 {result.openPositions} offene Stellen</span>
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
                          <div className="text-2xl font-bold text-blue-400">{result.scores.skills}%</div>
                          <div className="text-xs text-white/70">Fähigkeiten</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{result.scores.location}%</div>
                          <div className="text-xs text-white/70">Standort</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-400">{result.scores.preferences}%</div>
                          <div className="text-xs text-white/70">Präferenzen</div>
                        </div>
                      </div>

                      {/* AI Reason */}
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-white/10 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium">KI-Empfehlung</span>
                        </div>
                        <p className="text-white/80 text-sm">{result.aiReason}</p>
                      </div>

                      {/* Job Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Unternehmensgröße:</span>
                          <span className="ml-2">{result.companySize}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Branche:</span>
                          <span className="ml-2">{result.industry}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                        <Link href={`/beruf/${getJobSlug(result.title)}/firmen`}>
                          <Button size="sm" className="bg-white text-black hover:bg-white/90">
                            Firmen ansehen
                          </Button>
                        </Link>
                        <Link href={`/beruf/${getJobSlug(result.title)}`}>
                          <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:text-black bg-transparent">
                            Mehr Details
                          </Button>
                        </Link>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
                  </div>
                ))}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <GlassCard className="p-6 text-center text-white">
                    <h3 className="text-xl font-bold mb-4">Was möchtest du als nächstes tun?</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className="bg-white text-black hover:bg-white/90">
                        <Download className="w-5 h-5 mr-2" />
                        Ergebnisse herunterladen
                      </Button>
                      
                      <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-black bg-transparent">
                        <Share2 className="w-5 h-5 mr-2" />
                        Ergebnisse teilen
                      </Button>
                      
                      <Link href="/fragebogen">
                        <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-black bg-transparent">
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Fragebogen wiederholen
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
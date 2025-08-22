'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/atoms/GlassCard';
import Navigation from '@/components/molecules/Navigation';
import { 
  ArrowLeft, 
  MapPin,
  Users,
  Building,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  Target
} from 'lucide-react';
import { 
  companies, 
  jobPostings, 
  getJobCategoryById,
  JobCategory,
  Company,
  JobPosting 
} from '@/data/jobsAndCompanies';
import { SwissLocation, calculateDistance } from '@/data/swissLocations';

// Helper function to convert slug back to job ID
const getJobIdFromSlug = (slug: string): string => {
  const slugMap: Record<string, string> = {
    'informatiker-in-efz-applikationsentwicklung': 'informatiker-efz',
    'kauffrau-kaufmann-efz': 'kauffrau-efz',
    'fachfrau-fachmann-gesundheit-efz': 'fachfrau-gesundheit-efz',
    'polymechaniker-in-efz': 'polymechaniker-efz',
    'mediamatiker-in-efz': 'mediamatiker-efz',
    'logistiker-in-efz': 'logistiker-efz'
  };
  
  return slugMap[slug] || slug;
};

interface CompanyWithJobs extends Company {
  jobPostings: JobPosting[];
  distance?: number;
}

export default function BerufsaubildungFirmenPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const jobId = getJobIdFromSlug(slug);
  
  const [jobCategory, setJobCategory] = useState<JobCategory | null>(null);
  const [availableCompanies, setAvailableCompanies] = useState<CompanyWithJobs[]>([]);
  const [userLocation, setUserLocation] = useState<SwissLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get job category info
    const category = getJobCategoryById(jobId);
    setJobCategory(category);

    // Load user location from localStorage
    const savedData = localStorage.getItem('questionnaireData');
    let userData = null;
    
    if (savedData) {
      userData = JSON.parse(savedData);
      setUserLocation(userData.locationData);
    }

    if (category) {
      // Find companies offering this job type
      const companiesWithJobs = companies
        .map(company => {
          const companyJobs = jobPostings.filter(posting => 
            posting.companyId === company.id && 
            posting.categoryId === category.id
          );
          
          if (companyJobs.length === 0) return null;
          
          const distance = userData?.locationData && company.locations[0]
            ? calculateDistance(userData.locationData.coordinates, company.locations[0].coordinates)
            : undefined;

          return {
            ...company,
            jobPostings: companyJobs,
            distance
          };
        })
        .filter((company): company is CompanyWithJobs => company !== null)
        .sort((a, b) => {
          // Sort by distance if available, otherwise by name
          if (a.distance !== undefined && b.distance !== undefined) {
            return a.distance - b.distance;
          }
          return a.name.localeCompare(b.name);
        });

      setAvailableCompanies(companiesWithJobs);
    }

    setIsLoading(false);
  }, [jobId, slug]);

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-animated-gradient pt-16 flex items-center justify-center">
          <GlassCard className="p-8 text-center text-white">
            <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Lade Firmen...</p>
          </GlassCard>
        </div>
      </>
    );
  }

  if (!jobCategory) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-animated-gradient pt-16 flex items-center justify-center">
          <GlassCard className="p-8 text-center text-white max-w-md">
            <h1 className="text-2xl font-bold mb-4">Beruf nicht gefunden</h1>
            <p className="text-white/80 mb-6">
              Der angeforderte Beruf konnte nicht gefunden werden.
            </p>
            <Link href="/">
              <Button className="bg-white text-black hover:bg-white/90">
                Zur Startseite
              </Button>
            </Link>
          </GlassCard>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-animated-gradient pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              href={`/beruf/${slug}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Berufsübersicht
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-space-grotesk">
              Firmen für {jobCategory.title}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Entdecke die besten Ausbildungsbetriebe für deine berufliche Zukunft
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium">
              <Building className="w-4 h-4" />
              <span>{availableCompanies.length} {availableCompanies.length === 1 ? 'Firma' : 'Firmen'} gefunden</span>
            </div>
          </motion.div>

          {/* Companies List */}
          <div className="space-y-6">
            {availableCompanies.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-8 text-center text-white">
                  <Building className="w-16 h-16 mx-auto mb-4 text-white/50" />
                  <h4 className="text-xl font-bold mb-2">Keine Firmen gefunden</h4>
                  <p className="text-white/70 mb-4">
                    Leider sind derzeit keine Ausbildungsbetriebe für {jobCategory.title} verfügbar.
                  </p>
                  <p className="text-white/60 text-sm mb-6">
                    Schaue regelmäßig vorbei, da sich das Angebot laufend ändert.
                  </p>
                  <Link href="/fragebogen">
                    <Button className="bg-white text-black hover:bg-white/90">
                      Andere Berufe entdecken
                    </Button>
                  </Link>
                </GlassCard>
              </motion.div>
            ) : (
              availableCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <GlassCard className="p-6 text-white hover-lift">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold">{company.name}</h4>
                            <p className="text-white/70 text-sm">{company.industry}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm mb-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {company.locations?.[0]?.city || 'Standort nicht verfügbar'}
                            {company.distance !== undefined && ` (${company.distance} km)`}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {company.size} ({company.employees} MA)
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {company.jobPostings.length} {company.jobPostings.length === 1 ? 'Stelle' : 'Stellen'}
                          </span>
                        </div>
                        
                        <p className="text-white/80 mb-4 leading-relaxed">
                          {company.description}
                        </p>
                      </div>
                    </div>

                    {/* Job Postings Preview */}
                    <div className="space-y-3 mb-6">
                      {company.jobPostings.slice(0, 2).map((posting) => (
                        <div key={posting.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold">{posting.title}</h5>
                            <span className="text-green-400 font-medium">{posting.salaryRange}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-white/60 text-sm mb-3">
                            <span>Start: {new Date(posting.startDate).toLocaleDateString('de-CH')}</span>
                            <span>Bewerbung bis: {new Date(posting.applicationDeadline).toLocaleDateString('de-CH')}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {posting.preferredSkills.slice(0, 3).map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-2 py-1 bg-white/10 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {company.jobPostings.length > 2 && (
                        <p className="text-white/60 text-sm text-center">
                          +{company.jobPostings.length - 2} weitere {company.jobPostings.length - 2 === 1 ? 'Stelle' : 'Stellen'}
                        </p>
                      )}
                    </div>

                    {/* Company Benefits Preview */}
                    <div className="mb-6">
                      <h5 className="font-semibold mb-3">Was wir bieten:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {company.benefits.slice(0, 4).map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center gap-2 text-sm text-white/80">
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact & Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="text-sm text-white/70">
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="w-3 h-3" />
                          <span>{company.contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{company.contact.email}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link href={`/firma/${company.id}`}>
                          <Button size="sm" className="bg-white text-black hover:bg-white/90">
                            Details & Bewerbung
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-white/30 text-white hover:bg-white/10 hover:text-black bg-transparent"
                          onClick={() => window.open(company.website, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Website
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>

          {/* Bottom CTA */}
          {availableCompanies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12"
            >
              <GlassCard className="p-8 text-white text-center">
                <div className="max-w-2xl mx-auto">
                  <Target className="w-16 h-16 mx-auto mb-6 text-purple-400" />
                  <h3 className="text-2xl font-bold mb-4">Finde deine perfekte Lehrstelle</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">
                    Nutze unseren intelligenten Fragebogen um herauszufinden, welche dieser Firmen 
                    am besten zu deinen Interessen und Zielen passt.
                  </p>
                  <Link href="/fragebogen">
                    <Button size="lg" className="bg-white text-black hover:bg-white/90">
                      Persönliche Empfehlungen erhalten
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
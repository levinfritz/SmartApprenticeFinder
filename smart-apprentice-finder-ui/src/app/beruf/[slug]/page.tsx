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
  Clock, 
  TrendingUp, 
  MapPin,
  Users,
  Building,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  Star,
  BookOpen,
  Target,
  Award
} from 'lucide-react';
import { 
  jobCategories, 
  companies, 
  jobPostings, 
  getJobCategoryById,
  getCompanyById,
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

interface CompanyWithDistance extends Company {
  distance: number;
  jobPostings: JobPosting[];
}

export default function BerufDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [jobCategory, setJobCategory] = useState<JobCategory | null>(null);
  const [availableCompanies, setAvailableCompanies] = useState<CompanyWithDistance[]>([]);
  const [userLocation, setUserLocation] = useState<SwissLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage to get location
    const savedData = localStorage.getItem('questionnaireData');
    let userData = null;
    
    if (savedData) {
      userData = JSON.parse(savedData);
      setUserLocation(userData.locationData);
    }

    // Get job category by slug
    const jobId = getJobIdFromSlug(slug);
    const job = getJobCategoryById(jobId);
    
    if (job) {
      setJobCategory(job);
      
      // Find companies that offer this job
      const relevantPostings = jobPostings.filter(posting => posting.jobCategoryId === jobId);
      const companiesWithJobs: CompanyWithDistance[] = [];
      
      relevantPostings.forEach(posting => {
        const company = getCompanyById(posting.companyId);
        if (company) {
          const existingCompany = companiesWithJobs.find(c => c.id === company.id);
          
          if (existingCompany) {
            existingCompany.jobPostings.push(posting);
          } else {
            // Safely calculate distance, fallback if location data is missing
            let distance = 0;
            if (userData?.locationData && posting.location && posting.location.coordinates) {
              distance = calculateDistance(userData.locationData.coordinates, posting.location.coordinates);
            } else if (userData?.locationData && company.locations[0]) {
              // Fallback to company's main location if posting location is missing
              distance = calculateDistance(userData.locationData.coordinates, company.locations[0].coordinates);
            }
              
            companiesWithJobs.push({
              ...company,
              distance,
              jobPostings: [posting]
            });
          }
        }
      });
      
      // Sort by distance
      companiesWithJobs.sort((a, b) => a.distance - b.distance);
      setAvailableCompanies(companiesWithJobs);
    }
    
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
        <GlassCard className="p-8 text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Lade Berufsinformationen...</p>
        </GlassCard>
      </div>
    );
  }

  if (!jobCategory) {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
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
            href="/ergebnisse"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zu den Ergebnissen
          </Link>
        </motion.div>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm font-medium mb-6">
            <span className="text-2xl">{jobCategory.icon}</span>
            <span>{jobCategory.industry}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-space-grotesk">
            {jobCategory.title}
          </h1>
          
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            {jobCategory.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Information Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Quick Facts */}
            <GlassCard className="p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Auf einen Blick
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Dauer</span>
                  <span className="font-medium">{jobCategory.duration}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Schule/Woche</span>
                  <span className="font-medium">{jobCategory.schoolDays} {jobCategory.schoolDays === 1 ? 'Tag' : 'Tage'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Betrieb/Woche</span>
                  <span className="font-medium">{jobCategory.workDays} {jobCategory.workDays === 1 ? 'Tag' : 'Tage'}</span>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="text-white/70 mb-2">Lehrlingslohn</div>
                  <div className="font-medium text-green-400">{jobCategory.averageSalary.apprentice}</div>
                </div>
                
                <div>
                  <div className="text-white/70 mb-2">Nach der Lehre</div>
                  <div className="text-sm space-y-1">
                    <div>Junior: <span className="text-green-400">{jobCategory.averageSalary.junior}</span></div>
                    <div>Senior: <span className="text-green-400">{jobCategory.averageSalary.senior}</span></div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Requirements */}
            <GlassCard className="p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Voraussetzungen
              </h3>
              
              <ul className="space-y-3">
                {jobCategory.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-white/80 text-sm">{requirement}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Career Prospects */}
            <GlassCard className="p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Perspektiven
              </h3>
              
              <ul className="space-y-3">
                {jobCategory.prospects.map((prospect, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <span className="text-white/80 text-sm">{prospect}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          {/* Main Content - Company Listings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            {/* Daily Tasks */}
            <GlassCard className="p-8 text-white mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-orange-400" />
                Deine täglichen Aufgaben
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobCategory.dailyTasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-xs font-bold text-orange-400">{index + 1}</span>
                      </div>
                      <span className="text-white/90">{task}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Available Companies */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-white">
                <Building className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold">
                  Verfügbare Lehrstellen
                  {userLocation && ` in deiner Region`}
                </h3>
                <span className="px-3 py-1 bg-blue-500/20 rounded-full text-sm">
                  {availableCompanies.length} {availableCompanies.length === 1 ? 'Firma' : 'Firmen'}
                </span>
              </div>

              {availableCompanies.length === 0 ? (
                <GlassCard className="p-8 text-center text-white">
                  <Building className="w-16 h-16 mx-auto mb-4 text-white/50" />
                  <h3 className="text-xl font-bold mb-2">Keine Lehrstellen verfügbar</h3>
                  <p className="text-white/70">
                    Aktuell sind keine Lehrstellen für diesen Beruf in der Datenbank verfügbar.
                  </p>
                </GlassCard>
              ) : (
                availableCompanies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <GlassCard className="p-6 text-white hover-lift">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold">{company.name}</h4>
                            {company.jobPostings.some(jp => jp.isHighlighted) && (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                                ⭐ Empfohlen
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
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

                      {/* Job Postings */}
                      {company.jobPostings.map((posting) => (
                        <div key={posting.id} className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold">{posting.title}</h5>
                            <span className="text-green-400 font-medium">{posting.salaryRange}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-white/60 text-sm mb-3">
                            <span>Start: {new Date(posting.startDate).toLocaleDateString('de-CH')}</span>
                            <span>Bewerbung bis: {new Date(posting.applicationDeadline).toLocaleDateString('de-CH')}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {posting.preferredSkills.slice(0, 3).map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-2 py-1 bg-white/10 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Company Benefits */}
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
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
}
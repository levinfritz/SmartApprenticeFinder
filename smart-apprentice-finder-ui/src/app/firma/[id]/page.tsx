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
  Clock,
  Award,
  Target,
  Star,
  Download,
  Send,
  AlertCircle,
  TrendingUp,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import { 
  companies, 
  jobPostings,
  getCompanyById,
  Company,
  JobPosting 
} from '@/data/jobsAndCompanies';
import { SwissLocation, calculateDistance } from '@/data/swissLocations';

interface CompanyWithJobs extends Company {
  availableJobs: JobPosting[];
  distance?: number;
}

export default function FirmaDetailPage() {
  const params = useParams();
  const companyId = params?.id as string;
  
  const [company, setCompany] = useState<CompanyWithJobs | null>(null);
  const [userLocation, setUserLocation] = useState<SwissLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);

  useEffect(() => {
    // Load user data from localStorage to get location
    const savedData = localStorage.getItem('questionnaireData');
    let userData = null;
    
    if (savedData) {
      userData = JSON.parse(savedData);
      setUserLocation(userData.locationData);
    }

    // Get company by ID
    const foundCompany = getCompanyById(companyId);
    
    if (foundCompany) {
      // Find available job postings for this company
      const companyJobs = jobPostings.filter(posting => posting.companyId === companyId);
      
      const distance = userData?.locationData && foundCompany.locations[0]
        ? calculateDistance(userData.locationData.coordinates, foundCompany.locations[0].coordinates)
        : undefined;

      const companyWithJobs: CompanyWithJobs = {
        ...foundCompany,
        availableJobs: companyJobs,
        distance
      };
      
      setCompany(companyWithJobs);
      
      // Select first job by default
      if (companyJobs.length > 0) {
        setSelectedJob(companyJobs[0]);
      }
    }
    
    setIsLoading(false);
  }, [companyId]);

  const handleJobSelect = (job: JobPosting) => {
    setSelectedJob(job);
  };

  const isApplicationDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 30;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
        <GlassCard className="p-8 text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Lade Firmendetails...</p>
        </GlassCard>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-animated-gradient flex items-center justify-center">
        <GlassCard className="p-8 text-center text-white max-w-md">
          <h1 className="text-2xl font-bold mb-4">Firma nicht gefunden</h1>
          <p className="text-white/80 mb-6">
            Die angeforderte Firma konnte nicht gefunden werden.
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
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </button>
        </motion.div>

        {/* Company Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Company Logo Placeholder */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-space-grotesk">
            {company.name}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-white/70 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{company.locations?.[0]?.city || 'Standort nicht verfügbar'}</span>
              {company.distance && <span>({company.distance} km)</span>}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{company.size} • {company.employees} Mitarbeiter</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Gegründet {company.foundedYear}</span>
            </div>
          </div>
          
          <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
            {company.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Information Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Available Positions */}
            <GlassCard className="p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Offene Lehrstellen
              </h3>
              
              <div className="space-y-3">
                {company.availableJobs.map((job) => (
                  <motion.button
                    key={job.id}
                    onClick={() => handleJobSelect(job)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedJob?.id === job.id
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{job.title}</h4>
                      {job.isHighlighted && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    
                    <div className="text-sm text-white/70 space-y-1">
                      <div>Start: {new Date(job.startDate).toLocaleDateString('de-CH')}</div>
                      <div className="flex items-center gap-2">
                        <span>Bewerbung bis:</span>
                        <span className={isApplicationDeadlineSoon(job.applicationDeadline) ? 'text-orange-400' : ''}>
                          {new Date(job.applicationDeadline).toLocaleDateString('de-CH')}
                        </span>
                        {isApplicationDeadlineSoon(job.applicationDeadline) && (
                          <AlertCircle className="w-3 h-3 text-orange-400" />
                        )}
                      </div>
                      <div className="text-green-400 font-medium">{job.salaryRange}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </GlassCard>

            {/* Contact Information */}
            <GlassCard className="p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-400" />
                Kontakt
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="font-medium">{company.contact.person}</div>
                  <div className="text-white/70 text-sm">{company.contact.title}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-white/50" />
                    <span>{company.contact.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-white/50" />
                    <span>{company.contact.email}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:text-black bg-transparent"
                  onClick={() => window.open(company.website, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Firmenwebsite
                </Button>
              </div>
            </GlassCard>

            {/* Company Stats */}
            <GlassCard className="p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Ausbildungsqualität
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Übernahmequote</span>
                  <span className="font-bold text-green-400">
                    {company.apprenticeProgram.jobGuaranteeAfterCompletion}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Mentoring</span>
                  <span className="flex items-center gap-1">
                    {company.apprenticeProgram.mentoring ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Ja</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Nein</span>
                      </>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Abteilungswechsel</span>
                  <span className="flex items-center gap-1">
                    {company.apprenticeProgram.crossDepartmentRotation ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Ja</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Nein</span>
                      </>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Interne Schulungen</span>
                  <span className="flex items-center gap-1">
                    {company.apprenticeProgram.internalTraining ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Ja</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>Nein</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Selected Job Details */}
            {selectedJob && (
              <GlassCard className="p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">{selectedJob.title}</h3>
                  {isApplicationDeadlineSoon(selectedJob.applicationDeadline) && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 rounded-full text-orange-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Bewerbung bald fällig</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{selectedJob.salaryRange}</div>
                    <div className="text-white/60 text-sm">Lehrlingslohn</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {new Date(selectedJob.startDate).toLocaleDateString('de-CH', { month: 'long', year: 'numeric' })}
                    </div>
                    <div className="text-white/60 text-sm">Lehrbeginn</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {new Date(selectedJob.applicationDeadline).toLocaleDateString('de-CH', { day: 'numeric', month: 'long' })}
                    </div>
                    <div className="text-white/60 text-sm">Bewerbungsfrist</div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Anforderungen</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedJob.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-white/80">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Von Vorteil</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.preferredSkills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Application Process */}
            <GlassCard className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Send className="w-6 h-6 text-green-400" />
                Bewerbungsprozess
              </h3>
              
              <div className="space-y-6">
                {company.applicationProcess.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white/90">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="font-medium">Dauer des Bewerbungsprozesses</span>
                </div>
                <p className="text-white/80">{company.applicationProcess.timeline}</p>
              </div>
            </GlassCard>

            {/* Application CTA */}
            <GlassCard className="p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Bereit für deine Bewerbung?</h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                {company.apprenticeProgram.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90"
                  onClick={() => window.open(`mailto:${company.contact.email}?subject=Bewerbung für ${selectedJob?.title || 'Lehrstelle'}`, '_blank')}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Jetzt bewerben
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 hover:text-black bg-transparent"
                  onClick={() => window.open(`tel:${company.contact.phone}`)}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Anrufen
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
      </div>
    </>
  );
}
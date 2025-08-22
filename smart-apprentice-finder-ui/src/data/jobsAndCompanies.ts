import { SwissLocation, swissLocations } from './swissLocations';

export interface JobCategory {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  dailyTasks: string[];
  prospects: string[];
  averageSalary: {
    apprentice: string;
    junior: string;
    senior: string;
  };
  duration: string;
  schoolDays: number;
  workDays: number;
  relatedJobs: string[];
  industry: string;
  icon: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  size: string;
  employees: number;
  industry: string;
  website: string;
  foundedYear: number;
  locations: SwissLocation[];
  specialties: string[];
  benefits: string[];
  workEnvironment: string[];
  contact: {
    person: string;
    title: string;
    email: string;
    phone: string;
  };
  applicationProcess: {
    steps: string[];
    requirements: string[];
    timeline: string;
    applicationDeadline?: string;
  };
  apprenticeProgram: {
    description: string;
    mentoring: boolean;
    internalTraining: boolean;
    crossDepartmentRotation: boolean;
    jobGuaranteeAfterCompletion: number; // percentage
  };
  currentOpenings: number;
}

export interface JobPosting {
  id: string;
  jobCategoryId: string;
  companyId: string;
  title: string;
  location: SwissLocation;
  startDate: string;
  applicationDeadline: string;
  requirements: string[];
  preferredSkills: string[];
  salaryRange: string;
  isHighlighted: boolean;
  postedDate: string;
}

// Detaillierte Berufsbeschreibungen
export const jobCategories: JobCategory[] = [
  {
    id: 'informatiker-efz',
    title: 'Informatiker/in EFZ Applikationsentwicklung',
    description: 'Als Informatiker/in EFZ entwickelst du Software-Lösungen, programmierst Anwendungen und hilfst bei der Digitalisierung von Geschäftsprozessen. Du lernst verschiedene Programmiersprachen und arbeitest in agilen Teams.',
    requirements: [
      'Abgeschlossene Sekundarschule (Niveau A oder B)',
      'Gute Mathematik- und Logikkenntnisse',
      'Interesse an Technik und Computern',
      'Analytisches Denkvermögen',
      'Teamfähigkeit und Kommunikationsstärke'
    ],
    dailyTasks: [
      'Programmieren von Software-Anwendungen',
      'Testen und Debuggen von Code',
      'Dokumentation von Entwicklungsprozessen',
      'Zusammenarbeit mit dem Entwicklungsteam',
      'Kundenanforderungen analysieren und umsetzen'
    ],
    prospects: [
      'Weiterbildung zum Informatik-Techniker HF',
      'Studium an einer Fachhochschule (mit BMS)',
      'Spezialisierung in verschiedenen IT-Bereichen',
      'Führungsposition als Team Lead oder Projekt Manager',
      'Selbstständigkeit als IT-Berater oder Freelancer'
    ],
    averageSalary: {
      apprentice: 'CHF 750-950/Monat',
      junior: 'CHF 65,000-75,000/Jahr',
      senior: 'CHF 85,000-120,000/Jahr'
    },
    duration: '4 Jahre',
    schoolDays: 1,
    workDays: 4,
    relatedJobs: ['mediamatiker-efz', 'elektroniker-efz'],
    industry: 'IT & Software',
    icon: '💻'
  },
  {
    id: 'kauffrau-efz',
    title: 'Kauffrau/Kaufmann EFZ',
    description: 'Als Kauffrau/Kaufmann EFZ arbeitest du in der Verwaltung, im Kundenservice oder im Marketing. Du organisierst Termine, bearbeitest Korrespondenz und unterstützt bei betriebswirtschaftlichen Aufgaben.',
    requirements: [
      'Abgeschlossene Sekundarschule (Niveau A oder B)',
      'Gute Deutschkenntnisse in Wort und Schrift',
      'Fremdsprachenkenntnisse (Französisch/Englisch)',
      'Organisationstalent und Zuverlässigkeit',
      'Freude am Kundenkontakt'
    ],
    dailyTasks: [
      'Korrespondenz bearbeiten und verfassen',
      'Termine koordinieren und Meetings organisieren',
      'Kundenbetreuung am Telefon und per E-Mail',
      'Rechnungen erstellen und verbuchen',
      'Marketingaktivitäten unterstützen'
    ],
    prospects: [
      'Weiterbildung zur/zum Betriebswirt/in HF',
      'Studium in Betriebsökonomie (mit BMS)',
      'Spezialisierung in HR, Marketing oder Finanzen',
      'Führungsposition als Teamleiter/in',
      'Selbstständigkeit als Unternehmensberater/in'
    ],
    averageSalary: {
      apprentice: 'CHF 650-850/Monat',
      junior: 'CHF 55,000-65,000/Jahr',
      senior: 'CHF 70,000-90,000/Jahr'
    },
    duration: '3 Jahre',
    schoolDays: 2,
    workDays: 3,
    relatedJobs: ['mediamatiker-efz', 'logistiker-efz'],
    industry: 'Administration & Business',
    icon: '💼'
  },
  {
    id: 'fachfrau-gesundheit-efz',
    title: 'Fachfrau/Fachmann Gesundheit EFZ',
    description: 'Als Fachfrau/Fachmann Gesundheit EFZ pflegst und betreust du kranke, betagte oder behinderte Menschen. Du arbeitest in Spitälern, Pflegeheimen oder in der Spitex und unterstützt bei der medizinischen Versorgung.',
    requirements: [
      'Abgeschlossene Sekundarschule (Niveau A)',
      'Einfühlungsvermögen und Geduld',
      'Körperliche und psychische Belastbarkeit',
      'Verantwortungsbewusstsein',
      'Teamfähigkeit und Zuverlässigkeit'
    ],
    dailyTasks: [
      'Patienten pflegen und betreuen',
      'Medikamente vorbereiten und verabreichen',
      'Vitalzeichen messen und dokumentieren',
      'Bei medizinischen Eingriffen assistieren',
      'Angehörige beraten und unterstützen'
    ],
    prospects: [
      'Weiterbildung zur/zum dipl. Pflegefachfrau/mann HF',
      'Studium in Pflege oder Gesundheitswissenschaften (mit BMS)',
      'Spezialisierung in verschiedenen Fachbereichen',
      'Führungsposition als Abteilungsleitung',
      'Selbstständigkeit in der ambulanten Pflege'
    ],
    averageSalary: {
      apprentice: 'CHF 700-900/Monat',
      junior: 'CHF 58,000-68,000/Jahr',
      senior: 'CHF 72,000-85,000/Jahr'
    },
    duration: '3 Jahre',
    schoolDays: 1,
    workDays: 4,
    relatedJobs: [],
    industry: 'Gesundheitswesen',
    icon: '🏥'
  },
  {
    id: 'polymechaniker-efz',
    title: 'Polymechaniker/in EFZ',
    description: 'Als Polymechaniker/in EFZ fertigst du Einzelteile und baust Geräte, Maschinen und Anlagen zusammen. Du arbeitest mit verschiedenen Werkstoffen und modernsten Produktionsmaschinen.',
    requirements: [
      'Abgeschlossene Sekundarschule (Niveau A oder B)',
      'Gute Mathematik- und Physikkenntnisse',
      'Handwerkliches Geschick',
      'Räumliches Vorstellungsvermögen',
      'Präzision und Sorgfalt'
    ],
    dailyTasks: [
      'Werkstücke nach technischen Zeichnungen fertigen',
      'CNC-Maschinen programmieren und bedienen',
      'Qualitätskontrollen durchführen',
      'Maschinen warten und instand halten',
      'Mit CAD-Software arbeiten'
    ],
    prospects: [
      'Weiterbildung zum Techniker HF Maschinenbau',
      'Studium in Maschinentechnik (mit BMS)',
      'Spezialisierung in Automatisierung oder Robotik',
      'Führungsposition als Produktionsleiter',
      'Selbstständigkeit als Maschinenbau-Unternehmer'
    ],
    averageSalary: {
      apprentice: 'CHF 800-1000/Monat',
      junior: 'CHF 62,000-72,000/Jahr',
      senior: 'CHF 78,000-95,000/Jahr'
    },
    duration: '4 Jahre',
    schoolDays: 1,
    workDays: 4,
    relatedJobs: ['elektroniker-efz'],
    industry: 'Maschinenbau',
    icon: '⚙️'
  },
  {
    id: 'mediamatiker-efz',
    title: 'Mediamatiker/in EFZ',
    description: 'Als Mediamatiker/in EFZ gestaltest du multimediale Inhalte, entwickelst Websites und produzierst Print- sowie digitale Medien. Du kombinierst Kreativität mit technischem Know-how.',
    requirements: [
      'Abgeschlossene Sekundarschule (Niveau A oder B)',
      'Kreativität und ästhetisches Empfinden',
      'Interesse an digitalen Medien',
      'Grundkenntnisse in Informatik',
      'Kommunikationsstärke'
    ],
    dailyTasks: [
      'Websites und Apps gestalten und programmieren',
      'Grafiken und Videos erstellen',
      'Social Media Kanäle betreuen',
      'Print-Produkte layouten und produzieren',
      'Multimedia-Präsentationen entwickeln'
    ],
    prospects: [
      'Weiterbildung zum Techniker HF Medien',
      'Studium in Multimedia Production (mit BMS)',
      'Spezialisierung in UX/UI Design oder Videoproduktion',
      'Führungsposition als Creative Director',
      'Selbstständigkeit als Multimedia-Agentur'
    ],
    averageSalary: {
      apprentice: 'CHF 700-900/Monat',
      junior: 'CHF 58,000-68,000/Jahr',
      senior: 'CHF 72,000-88,000/Jahr'
    },
    duration: '4 Jahre',
    schoolDays: 2,
    workDays: 3,
    relatedJobs: ['informatiker-efz', 'kauffrau-efz'],
    industry: 'Medien & Design',
    icon: '🎨'
  },
  {
    id: 'logistiker-efz',
    title: 'Logistiker/in EFZ',
    description: 'Als Logistiker/in EFZ organisierst du den Warenfluss, lagerst Güter fachgerecht und sorgst für eine effiziente Verteilung. Du arbeitest mit modernen Lagerverwaltungssystemen.',
    requirements: [
      'Abgeschlossene Sekundarschule (Niveau A oder B)',
      'Organisationstalent',
      'Körperliche Fitness',
      'Zuverlässigkeit und Pünktlichkeit',
      'Teamfähigkeit'
    ],
    dailyTasks: [
      'Waren annehmen und kontrollieren',
      'Güter fachgerecht lagern und kommissionieren',
      'Lieferungen planen und durchführen',
      'Lagerverwaltungssysteme bedienen',
      'Inventuren durchführen'
    ],
    prospects: [
      'Weiterbildung zum Techniker HF Logistik',
      'Studium in Supply Chain Management (mit BMS)',
      'Spezialisierung in internationale Logistik',
      'Führungsposition als Lagerleiter',
      'Selbstständigkeit als Logistik-Dienstleister'
    ],
    averageSalary: {
      apprentice: 'CHF 600-800/Monat',
      junior: 'CHF 52,000-62,000/Jahr',
      senior: 'CHF 65,000-78,000/Jahr'
    },
    duration: '3 Jahre',
    schoolDays: 1,
    workDays: 4,
    relatedJobs: ['kauffrau-efz'],
    industry: 'Transport & Logistik',
    icon: '📦'
  }
];

// Helper function to safely get location
const getLocationByPostalCode = (postalCode: string): SwissLocation => {
  const location = swissLocations.find(l => l.postalCode === postalCode);
  if (!location) {
    console.warn(`Location with postal code ${postalCode} not found, using fallback`);
    // Fallback to St. Gallen if location not found
    return swissLocations.find(l => l.postalCode === '9000') || {
      postalCode: '9000',
      city: 'St. Gallen',
      canton: 'SG',
      coordinates: { lat: 47.4239, lng: 9.3767 },
      region: 'Ostschweiz',
      majorCity: true
    };
  }
  return location;
};

// Erweiterte Firmen-Datenbank
export const companies: Company[] = [
  // Ostschweiz Companies
  {
    id: 'ost-tech-solutions',
    name: 'OST-Tech Solutions AG',
    description: 'Führender Anbieter von innovativen IT-Lösungen in der Ostschweiz. Wir entwickeln massgeschneiderte Software für KMU und Grossunternehmen und sind spezialisiert auf Cloud-Computing und künstliche Intelligenz.',
    size: 'Mittel',
    employees: 120,
    industry: 'IT & Software',
    website: 'https://ost-tech-solutions.ch',
    foundedYear: 2010,
    locations: [getLocationByPostalCode('9000')],
    specialties: ['Cloud Computing', 'KI-Entwicklung', 'Mobile Apps', 'Web Development'],
    benefits: [
      'Flexible Arbeitszeiten und Homeoffice',
      'Moderne Arbeitsplätze mit neuester Technik',
      'Weiterbildungsbudget CHF 2,000/Jahr',
      'Team-Events und Firmenausflüge',
      '13. Monatslohn und Erfolgsbeteiligung'
    ],
    workEnvironment: [
      'Agile Entwicklungsmethoden (Scrum)',
      'Open-Space Büros mit Rückzugsmöglichkeiten',
      'Moderne Entwicklungstools und Hardware',
      'Internationale Projekte und Kunden'
    ],
    contact: {
      person: 'Sarah Müller',
      title: 'Leiterin Ausbildung',
      email: 'ausbildung@ost-tech-solutions.ch',
      phone: '+41 71 123 45 67'
    },
    applicationProcess: {
      steps: [
        'Online-Bewerbung mit Lebenslauf und Zeugnissen',
        'Telefon-Interview (30 Minuten)',
        'Schnuppertag im Entwicklungsteam',
        'Persönliches Gespräch mit Team und HR'
      ],
      requirements: [
        'Motivationsschreiben (max. 1 Seite)',
        'Lebenslauf mit Foto',
        'Kopien der letzten 2 Schulzeugnisse',
        'Referenzen von Lehrpersonen (optional)'
      ],
      timeline: '2-3 Wochen vom Interview bis zur Zusage',
      applicationDeadline: '31. März 2024'
    },
    apprenticeProgram: {
      description: 'Unser 4-jähriges Informatik-Lehrprogramm kombiniert praktische Projektarbeit mit fundierter theoretischer Ausbildung. Du durchläufst verschiedene Abteilungen und arbeitest an echten Kundenprojekten.',
      mentoring: true,
      internalTraining: true,
      crossDepartmentRotation: true,
      jobGuaranteeAfterCompletion: 95
    },
    currentOpenings: 3
  },
  {
    id: 'st-galler-kantonalbank',
    name: 'St. Galler Kantonalbank',
    description: 'Die St. Galler Kantonalbank ist die führende Bank der Ostschweiz und bietet umfassende Finanzdienstleistungen für Privat- und Firmenkunden. Mit über 150 Jahren Erfahrung sind wir ein verlässlicher Partner.',
    size: 'Gross',
    employees: 1500,
    industry: 'Banking & Finance',
    website: 'https://www.sgkb.ch',
    foundedYear: 1868,
    locations: [
      getLocationByPostalCode('9000'),
      getLocationByPostalCode('9200')
    ],
    specialties: ['Retail Banking', 'Corporate Banking', 'Investment Services', 'Digital Banking'],
    benefits: [
      'Attraktive Lehrlingsentschädigung',
      'Umfassende Sozialleistungen',
      'Interne Weiterbildungsmöglichkeiten',
      'Mentoring-Programm',
      'Übernahmechancen nach der Lehre'
    ],
    workEnvironment: [
      'Moderne Bankfilialen und Hauptsitz',
      'Digitale Arbeitsplätze',
      'Kundenorientierte Arbeitsweise',
      'Teamarbeit in verschiedenen Abteilungen'
    ],
    contact: {
      person: 'Thomas Weber',
      title: 'Leiter Berufsbildung',
      email: 'berufsbildung@sgkb.ch',
      phone: '+41 71 231 45 89'
    },
    applicationProcess: {
      steps: [
        'Online-Bewerbung über SGKB-Website',
        'Eignungstest und Assessment',
        'Schnupperlehre (1 Woche)',
        'Bewerbungsgespräch mit Ausbildungsverantwortlichen'
      ],
      requirements: [
        'Bewerbungsschreiben',
        'Lebenslauf',
        'Schulzeugnisse der letzten 2 Jahre',
        'Resultat Multicheck oder Stellwerk-Test'
      ],
      timeline: '3-4 Wochen Bewerbungsprozess',
      applicationDeadline: '15. April 2024'
    },
    apprenticeProgram: {
      description: 'Unsere Kaufmännische Lehre bietet Einblicke in alle Bankbereiche. Du lernst Kundenberatung, Kreditwesen und moderne Finanzdienstleistungen kennen.',
      mentoring: true,
      internalTraining: true,
      crossDepartmentRotation: true,
      jobGuaranteeAfterCompletion: 90
    },
    currentOpenings: 5
  },
  {
    id: 'kantonsspital-st-gallen',
    name: 'Kantonsspital St. Gallen',
    description: 'Das Kantonsspital St. Gallen ist das grösste Spital der Ostschweiz und ein führendes Zentrum für Medizin, Lehre und Forschung. Wir bieten höchste medizinische Qualität und innovative Behandlungsmethoden.',
    size: 'Gross',
    employees: 5000,
    industry: 'Gesundheitswesen',
    website: 'https://www.kssg.ch',
    foundedYear: 1873,
    locations: [getLocationByPostalCode('9000')],
    specialties: ['Akutmedizin', 'Chirurgie', 'Onkologie', 'Kardiologie'],
    benefits: [
      'Umfassende medizinische Ausbildung',
      'Erfahrene Berufsbildner/innen',
      'Moderne Ausbildungsplätze',
      'Gute Übernahmechancen',
      'Weiterbildungsmöglichkeiten'
    ],
    workEnvironment: [
      'Hochmoderne medizinische Ausstattung',
      'Interdisziplinäre Teamarbeit',
      'Patientenorientierte Pflege',
      'Kontinuierliche Weiterbildung'
    ],
    contact: {
      person: 'Maria Schneider',
      title: 'Leiterin Berufsbildung Pflege',
      email: 'berufsbildung@kssg.ch',
      phone: '+41 71 494 11 11'
    },
    applicationProcess: {
      steps: [
        'Online-Bewerbung',
        'Schnupperpraktikum (2-3 Tage)',
        'Eignungsgespräch',
        'Gesundheitszeugnis und Strafregisterauszug'
      ],
      requirements: [
        'Motivationsschreiben',
        'Lebenslauf',
        'Schulzeugnisse',
        'Nachweis über Praktika im Gesundheitsbereich'
      ],
      timeline: '4-6 Wochen',
      applicationDeadline: '28. Februar 2024'
    },
    apprenticeProgram: {
      description: 'Unsere FaGe-Ausbildung erfolgt in verschiedenen Abteilungen des Spitals. Du lernst die vielfältigen Aspekte der Patientenpflege und medizinischen Betreuung kennen.',
      mentoring: true,
      internalTraining: true,
      crossDepartmentRotation: true,
      jobGuaranteeAfterCompletion: 85
    },
    currentOpenings: 8
  }
  // Weitere Firmen würden hier folgen...
];

// Aktuelle Stellenausschreibungen
export const jobPostings: JobPosting[] = [
  {
    id: 'ost-tech-informatiker-2024',
    jobCategoryId: 'informatiker-efz',
    companyId: 'ost-tech-solutions',
    title: 'Informatiker/in EFZ Applikationsentwicklung',
    location: swissLocations.find(l => l.postalCode === '9000')!,
    startDate: '2024-08-01',
    applicationDeadline: '2024-03-31',
    requirements: [
      'Abgeschlossene Sekundarschule A oder B',
      'Gute Mathematikkenntnisse',
      'Interesse an Programmierung',
      'Teamfähigkeit'
    ],
    preferredSkills: [
      'Erste Programmiererfahrung',
      'Englischkenntnisse',
      'Logisches Denkvermögen'
    ],
    salaryRange: 'CHF 750-950/Monat',
    isHighlighted: true,
    postedDate: '2024-01-15'
  },
  {
    id: 'sgkb-kauffrau-2024',
    jobCategoryId: 'kauffrau-efz',
    companyId: 'st-galler-kantonalbank',
    title: 'Kauffrau/Kaufmann EFZ Banking & Finance',
    location: swissLocations.find(l => l.postalCode === '9000')!,
    startDate: '2024-08-01',
    applicationDeadline: '2024-04-15',
    requirements: [
      'Abgeschlossene Sekundarschule A',
      'Gute Deutschkenntnisse',
      'Fremdsprachenkenntnisse',
      'Kundenorientierung'
    ],
    preferredSkills: [
      'Interesse an Finanzthemen',
      'MS Office Kenntnisse',
      'Kommunikationsstärke'
    ],
    salaryRange: 'CHF 650-800/Monat',
    isHighlighted: true,
    postedDate: '2024-01-20'
  },
  {
    id: 'kssg-fage-2024',
    jobCategoryId: 'fachfrau-gesundheit-efz',
    companyId: 'kantonsspital-st-gallen',
    title: 'Fachfrau/Fachmann Gesundheit EFZ',
    location: swissLocations.find(l => l.postalCode === '9000')!,
    startDate: '2024-08-01',
    applicationDeadline: '2024-02-28',
    requirements: [
      'Abgeschlossene Sekundarschule A',
      'Einfühlungsvermögen',
      'Belastbarkeit',
      'Teamfähigkeit'
    ],
    preferredSkills: [
      'Praktikum im Gesundheitsbereich',
      'Erste Hilfe Kenntnisse',
      'Mehrsprachigkeit'
    ],
    salaryRange: 'CHF 700-850/Monat',
    isHighlighted: false,
    postedDate: '2024-01-10'
  }
];

// Hilfsfunktionen
export const getJobCategoryById = (id: string): JobCategory | undefined => {
  return jobCategories.find(job => job.id === id);
};

export const getCompanyById = (id: string): Company | undefined => {
  return companies.find(company => company.id === id);
};

export const getJobPostingsByCategory = (categoryId: string): JobPosting[] => {
  return jobPostings.filter(posting => posting.jobCategoryId === categoryId);
};

export const getJobPostingsByLocation = (userLocation: SwissLocation, maxDistance: number = 100): JobPosting[] => {
  return jobPostings.filter(posting => {
    const distance = calculateDistance(userLocation.coordinates, posting.location.coordinates);
    return distance <= maxDistance;
  });
};

// Import distance calculation from swissLocations
const calculateDistance = (
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number => {
  const R = 6371;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c;

  return Math.round(distance);
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI/180);
};
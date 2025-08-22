// Smart Apprentice Finder - Type Definitions

export interface UserProfile {
  id?: string;
  name: string;
  age: number;
  location: string;
  postalCode: string;
  interests: Record<InterestCategory, number>;
  skills: string[];
  workPreferences: WorkPreferences;
  avoidIndustries: string[];
  careerGoals: string;
  maxCommuteTime: number;
  transportMode: 'public' | 'car' | 'bike' | 'walk';
}

export interface WorkPreferences {
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  workEnvironment: 'office' | 'remote' | 'hybrid' | 'field' | 'mixed';
  teamSize: 'solo' | 'small' | 'medium' | 'large';
  learningStyle: 'hands-on' | 'theoretical' | 'mixed';
}

export enum InterestCategory {
  TECHNICAL = 'technical',
  CREATIVE = 'creative', 
  SOCIAL = 'social',
  BUSINESS = 'business',
  HEALTH = 'health',
  EDUCATION = 'education',
  OUTDOOR = 'outdoor',
  SERVICE = 'service'
}

export interface Apprenticeship {
  id: string;
  title: string;
  companyName: string;
  location: string;
  postalCode?: string;
  profession?: string;
  description?: string;
  requirements?: string[];
  benefits?: string[];
  sourceUrl?: string;
  isActive: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  duration?: string;
  startDate?: string;
  applicationDeadline?: string;
}

export interface MatchScore {
  totalScore: number;
  interestScore: number;
  locationScore: number;
  skillScore: number;
  preferenceScore: number;
  breakdown: {
    interests: Record<string, number>;
    location: {
      distance: number;
      commuteTime: number;
      transportMode: string;
    };
    skills: string[];
    preferences: Record<string, number>;
  };
}

export interface AIRecommendation {
  matchReason: string;
  growthPotential: string;
  considerations: string;
  nextSteps: string[];
  confidence: number;
}

export interface MatchResult {
  apprenticeship: Apprenticeship;
  matchScore: MatchScore;
  aiRecommendation?: AIRecommendation;
  rank: number;
}

export interface QuestionnaireStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  isComplete: boolean;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'slider' | 'multiselect' | 'textarea' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

export interface FilterOptions {
  location?: string;
  maxDistance?: number;
  profession?: string;
  companySize?: string;
  minScore?: number;
  sortBy: 'score' | 'distance' | 'company' | 'title' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Animation and UI Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  type?: 'spring' | 'tween';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

// State Management Types
export interface AppState {
  user: {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
  };
  questionnaire: {
    currentStep: number;
    steps: QuestionnaireStep[];
    answers: Record<string, any>;
    isComplete: boolean;
  };
  matching: {
    results: MatchResult[];
    isLoading: boolean;
    error: string | null;
    filters: FilterOptions;
    selectedApprenticeshipId: string | null;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    sidebarOpen: boolean;
    toasts: ToastMessage[];
  };
}
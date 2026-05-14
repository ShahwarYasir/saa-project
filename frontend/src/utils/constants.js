export const APP_NAME = 'Study Abroad Assistant';

export const DEGREE_LEVELS = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Foundation'];

export const COUNTRIES = [
  'Germany', 'Canada', 'United Kingdom', 'United States', 'Australia',
  'Turkey', 'France', 'Netherlands', 'Sweden', 'Norway', 'Finland',
  'Ireland', 'New Zealand', 'Japan', 'South Korea', 'Malaysia',
  'Italy', 'Spain', 'Austria', 'Switzerland'
];

export const BUDGET_RANGES = [
  { label: 'Under $5,000', min: 0, max: 5000 },
  { label: '$5,000 - $10,000', min: 5000, max: 10000 },
  { label: '$10,000 - $20,000', min: 10000, max: 20000 },
  { label: '$20,000 - $35,000', min: 20000, max: 35000 },
  { label: '$35,000 - $50,000', min: 35000, max: 50000 },
  { label: 'Over $50,000', min: 50000, max: Infinity }
];

export const COVERAGE_TYPES = ['Fully Funded', 'Partial Funding', 'Stipend Only', 'Tuition Waiver'];

export const DOCUMENT_TYPES = [
  { id: 'personal_statement', label: 'Personal Statement', icon: 'bi-file-person', description: 'A reflective essay about your background, interests, and goals.' },
  { id: 'sop', label: 'Statement of Purpose', icon: 'bi-bullseye', description: 'A focused document explaining why you chose this program and university.' },
  { id: 'motivation_letter', label: 'Motivation Letter', icon: 'bi-lightning-fill', description: 'A letter explaining your motivation for applying to a specific opportunity.' },
  { id: 'cover_letter', label: 'Cover Letter', icon: 'bi-envelope-paper', description: 'A formal letter accompanying your application documents.' }
];

export const MILESTONE_STATUSES = ['Not Started', 'In Progress', 'Done'];

export const QUALIFICATION_LEVELS = [
  'High School / A-Levels',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD / Doctorate'
];

export const FIELDS_OF_INTEREST = [
  'Computer Science', 'Artificial Intelligence', 'Data Science',
  'Software Engineering', 'Electrical Engineering', 'Mechanical Engineering',
  'Civil Engineering', 'Business Administration', 'Economics',
  'Medicine', 'Law', 'Psychology', 'Education',
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Environmental Science', 'Architecture', 'Design'
];

export const COUNTRY_FLAGS = {
  'Germany': '🇩🇪', 'Canada': '🇨🇦', 'United Kingdom': '🇬🇧', 'United States': '🇺🇸',
  'Australia': '🇦🇺', 'Turkey': '🇹🇷', 'France': '🇫🇷', 'Netherlands': '🇳🇱',
  'Sweden': '🇸🇪', 'Norway': '🇳🇴', 'Finland': '🇫🇮', 'Ireland': '🇮🇪',
  'New Zealand': '🇳🇿', 'Japan': '🇯🇵', 'South Korea': '🇰🇷', 'Malaysia': '🇲🇾',
  'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Austria': '🇦🇹', 'Switzerland': '🇨🇭',
  'Pakistan': '🇵🇰', 'India': '🇮🇳', 'Nigeria': '🇳🇬', 'Bangladesh': '🇧🇩'
};

export const RANKING_PREFERENCES = ['Top 100', 'Top 200', 'Top 500', 'Any'];

export const INTAKE_SEASONS = ['Fall 2026', 'Spring 2027', 'Fall 2027', 'Spring 2028'];

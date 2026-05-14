import { useMemo } from 'react';

const PROFILE_FIELDS = [
  'nationality', 'current_country', 'current_qualification', 'gpa',
  'field_of_interest', 'degree_level', 'preferred_countries',
  'annual_budget_usd', 'ielts_score', 'target_intake'
];

export function useProfileCompletion(profile) {
  const { percentage, filledCount, totalCount } = useMemo(() => {
    if (!profile) return { percentage: 0, filledCount: 0, totalCount: PROFILE_FIELDS.length };
    let filled = 0;
    PROFILE_FIELDS.forEach(field => {
      const val = profile[field];
      if (val !== null && val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0)) {
        filled++;
      }
    });
    return {
      percentage: Math.round((filled / PROFILE_FIELDS.length) * 100),
      filledCount: filled,
      totalCount: PROFILE_FIELDS.length
    };
  }, [profile]);

  return { percentage, filledCount, totalCount };
}

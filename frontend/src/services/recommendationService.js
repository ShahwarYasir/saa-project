import { apiRequest } from './apiClient';
import { mockUniversities } from '../mocks/mockUniversities';
import { mockScholarships } from '../mocks/mockScholarships';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function getUniversities(filters = {}) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 700));
    let results = [...mockUniversities];
    if (filters.country) results = results.filter(u => u.country === filters.country);
    if (filters.degree_level) results = results.filter(u => u.degree_levels.includes(filters.degree_level));
    if (filters.max_tuition) results = results.filter(u => u.tuition_fee_usd <= Number(filters.max_tuition));
    if (filters.min_gpa) results = results.filter(u => u.gpa_requirement <= Number(filters.min_gpa));
    if (filters.program) results = results.filter(u => u.programs.some(p => p.toLowerCase().includes(filters.program.toLowerCase())));
    return { success: true, data: results };
  }
  const params = new URLSearchParams(filters).toString();
  return apiRequest(`/recommendations/universities${params ? '?' + params : ''}`);
}

export async function getScholarships(filters = {}) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 700));
    let results = [...mockScholarships];
    if (filters.funding_country) results = results.filter(s => s.funding_country === filters.funding_country);
    if (filters.degree_level) results = results.filter(s => s.degree_levels.includes(filters.degree_level));
    if (filters.coverage) results = results.filter(s => s.coverage === filters.coverage);
    return { success: true, data: results };
  }
  const params = new URLSearchParams(filters).toString();
  return apiRequest(`/recommendations/scholarships${params ? '?' + params : ''}`);
}

import { apiRequest } from './apiClient';
import { mockUniversities } from '../mocks/mockUniversities';
import { mockScholarships } from '../mocks/mockScholarships';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

let mockShortlist = {
  universities: [1, 3, 5],
  scholarships: [2, 4]
};

export async function getShortlist() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return {
      success: true,
      data: {
        universities: mockUniversities.filter(u => mockShortlist.universities.includes(u.id)),
        scholarships: mockScholarships.filter(s => mockShortlist.scholarships.includes(s.id))
      }
    };
  }
  return apiRequest('/shortlist');
}

export async function addToShortlist(entityType, entityId) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 300));
    if (entityType === 'university') mockShortlist.universities.push(entityId);
    else mockShortlist.scholarships.push(entityId);
    return { success: true, message: 'Added to shortlist' };
  }
  return apiRequest('/shortlist', { method: 'POST', body: JSON.stringify({ entity_type: entityType, entity_id: entityId }) });
}

export async function removeFromShortlist(entityType, entityId) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 300));
    if (entityType === 'university') mockShortlist.universities = mockShortlist.universities.filter(id => id !== entityId);
    else mockShortlist.scholarships = mockShortlist.scholarships.filter(id => id !== entityId);
    return { success: true, message: 'Removed from shortlist' };
  }
  return apiRequest(`/shortlist/${entityId}`, { method: 'DELETE' });
}

export function isInShortlist(entityType, entityId) {
  if (entityType === 'university') return mockShortlist.universities.includes(entityId);
  return mockShortlist.scholarships.includes(entityId);
}

import { apiRequest } from './apiClient';
import { mockProfile } from '../mocks/mockProfile';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function getProfile() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, data: { ...mockProfile } };
  }
  return apiRequest('/student/profile');
}

export async function updateProfile(profileData) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 800));
    return { success: true, message: 'Profile updated successfully', data: { ...mockProfile, ...profileData } };
  }
  return apiRequest('/student/profile', { method: 'PUT', body: JSON.stringify(profileData) });
}

export async function getDashboard() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return {
      success: true,
      data: {
        saved_universities: 4,
        saved_scholarships: 3,
        profile_completion: 70,
        roadmap_progress: 25,
        recent_activity: [
          { id: 1, action: 'Saved University of Toronto to shortlist', time: '2 hours ago', icon: 'bi-bookmark-fill' },
          { id: 2, action: 'Updated profile — added IELTS score', time: '5 hours ago', icon: 'bi-pencil-fill' },
          { id: 3, action: 'Generated SOP draft for TU Munich', time: '1 day ago', icon: 'bi-file-text-fill' },
          { id: 4, action: 'Completed milestone: Finalize university list', time: '2 days ago', icon: 'bi-check-circle-fill' },
          { id: 5, action: 'Saved DAAD Scholarship to shortlist', time: '3 days ago', icon: 'bi-bookmark-fill' }
        ]
      }
    };
  }
  return apiRequest('/student/dashboard');
}

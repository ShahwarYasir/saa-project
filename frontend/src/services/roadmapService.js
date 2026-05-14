import { apiRequest } from './apiClient';
import { mockRoadmap } from '../mocks/mockRoadmap';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

let localMilestones = null;

export async function getRoadmap() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    if (!localMilestones) localMilestones = [...mockRoadmap];
    return { success: true, data: { milestones: localMilestones, target_intake: 'Fall 2027' } };
  }
  return apiRequest('/roadmap');
}

export async function generateRoadmap(targetIntake) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 1000));
    localMilestones = [...mockRoadmap];
    return { success: true, message: 'Roadmap generated', data: { milestones: localMilestones } };
  }
  return apiRequest('/roadmap/generate', { method: 'POST', body: JSON.stringify({ target_intake: targetIntake }) });
}

export async function updateMilestoneStatus(milestoneId, status) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 300));
    if (localMilestones) {
      const m = localMilestones.find(m => m.id === milestoneId);
      if (m) m.status = status;
    }
    return { success: true, message: 'Milestone updated' };
  }
  return apiRequest(`/roadmap/milestones/${milestoneId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

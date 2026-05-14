import { apiRequest } from './apiClient';
import { mockUniversities } from '../mocks/mockUniversities';
import { mockScholarships } from '../mocks/mockScholarships';
import { mockUsers } from '../mocks/mockUsers';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function getAdminDashboard() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return {
      success: true,
      data: {
        total_students: 156,
        total_universities: mockUniversities.length,
        total_scholarships: mockScholarships.length,
        active_sessions: 23,
        recent_registrations: [
          { id: 1, full_name: 'Hasana Zahid', email: 'hasana@example.com', registered_at: '2026-05-12', status: 'active' },
          { id: 2, full_name: 'Ahmed Khan', email: 'ahmed@example.com', registered_at: '2026-05-11', status: 'active' },
          { id: 3, full_name: 'Sara Ali', email: 'sara@example.com', registered_at: '2026-05-10', status: 'active' },
          { id: 4, full_name: 'John Smith', email: 'john@example.com', registered_at: '2026-05-09', status: 'inactive' },
          { id: 5, full_name: 'Maria Garcia', email: 'maria@example.com', registered_at: '2026-05-08', status: 'active' }
        ]
      }
    };
  }
  return apiRequest('/admin/dashboard');
}

export async function getAdminUniversities() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, data: [...mockUniversities] };
  }
  return apiRequest('/admin/universities');
}

export async function createUniversity(data) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 800));
    return { success: true, message: 'University created', data: { id: Date.now(), ...data } };
  }
  return apiRequest('/admin/universities', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateUniversity(id, data) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 800));
    return { success: true, message: 'University updated', data: { id, ...data } };
  }
  return apiRequest(`/admin/universities/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteUniversity(id) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, message: 'University deleted' };
  }
  return apiRequest(`/admin/universities/${id}`, { method: 'DELETE' });
}

export async function getAdminScholarships() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, data: [...mockScholarships] };
  }
  return apiRequest('/admin/scholarships');
}

export async function createScholarship(data) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 800));
    return { success: true, message: 'Scholarship created', data: { id: Date.now(), ...data } };
  }
  return apiRequest('/admin/scholarships', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateScholarship(id, data) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 800));
    return { success: true, message: 'Scholarship updated', data: { id, ...data } };
  }
  return apiRequest(`/admin/scholarships/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteScholarship(id) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, message: 'Scholarship deleted' };
  }
  return apiRequest(`/admin/scholarships/${id}`, { method: 'DELETE' });
}

export async function getAdminStudents() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    const students = mockUsers.filter(u => u.role === 'student').map(u => ({
      id: u.id, full_name: u.full_name, email: u.email, status: 'active', registered_at: '2026-05-01'
    }));
    return { success: true, data: students };
  }
  return apiRequest('/admin/students');
}

export async function updateStudentStatus(id, status) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 400));
    return { success: true, message: `Student ${status}` };
  }
  return apiRequest(`/admin/students/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function deleteStudent(id) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, message: 'Student deleted' };
  }
  return apiRequest(`/admin/students/${id}`, { method: 'DELETE' });
}

import { apiRequest } from './apiClient';
import { mockUsers } from '../mocks/mockUsers';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function login(credentials) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 800));
    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    if (!user) throw { status: 401, message: 'Invalid email or password', errors: {} };
    const { password, ...userData } = user;
    return { success: true, message: 'Login successful', data: { token: 'mock_jwt_token_' + Date.now(), user: userData } };
  }
  return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function register(data) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 1000));
    if (mockUsers.find(u => u.email === data.email)) {
      throw { status: 422, message: 'Validation failed', errors: { email: ['The email has already been taken.'] } };
    }
    return { success: true, message: 'Account created successfully. Please login.', data: { user_id: 99 } };
  }
  return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export async function adminLogin(credentials) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 800));
    const admin = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password && u.role === 'admin');
    if (!admin) throw { status: 401, message: 'Invalid admin credentials', errors: {} };
    const { password, ...userData } = admin;
    return { success: true, message: 'Admin login successful', data: { token: 'mock_admin_jwt_' + Date.now(), user: userData } };
  }
  return apiRequest('/admin/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function getMe() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 300));
    const stored = localStorage.getItem('saa_user');
    if (stored) return { success: true, data: JSON.parse(stored) };
    throw { status: 401, message: 'Unauthenticated' };
  }
  return apiRequest('/auth/me');
}

export async function logout() {
  if (USE_MOCKS) {
    return { success: true, message: 'Logged out' };
  }
  return apiRequest('/auth/logout', { method: 'POST' });
}

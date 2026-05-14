import { apiRequest } from './apiClient';
import { mockWritingSample } from '../mocks/mockWriting';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function generateDocument(payload) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 2000));
    return {
      success: true,
      data: {
        id: 1,
        document_type: payload.document_type,
        content: mockWritingSample.content,
        word_count: mockWritingSample.word_count,
        created_at: new Date().toISOString()
      }
    };
  }
  return apiRequest('/writing/generate', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateDocument(id, content) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 500));
    return { success: true, message: 'Document saved' };
  }
  return apiRequest(`/writing/${id}`, { method: 'PUT', body: JSON.stringify({ content }) });
}

export async function refineDocument(id, instructions) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 1500));
    return {
      success: true,
      data: {
        id,
        content: mockWritingSample.content + '\n\n[Refined based on your instructions: ' + instructions + ']',
        word_count: mockWritingSample.word_count + 50
      }
    };
  }
  return apiRequest(`/writing/${id}/refine`, { method: 'POST', body: JSON.stringify({ instructions }) });
}

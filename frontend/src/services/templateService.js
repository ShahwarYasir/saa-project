import { apiRequest } from './apiClient';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const mockTemplates = [
  { id: 1, name: 'Academic CV', description: 'A structured CV template designed for academic applications, highlighting education, research, and publications.', category: 'CV', format: ['pdf', 'docx'] },
  { id: 2, name: 'Personal Statement', description: 'A template for writing compelling personal statements for university admissions.', category: 'Essay', format: ['pdf', 'docx'] },
  { id: 3, name: 'Statement of Purpose', description: 'A structured SOP template with sections for background, motivation, goals, and fit.', category: 'Essay', format: ['pdf', 'docx'] },
  { id: 4, name: 'Motivation Letter', description: 'A formal motivation letter template for scholarship and university applications.', category: 'Letter', format: ['pdf', 'docx'] },
  { id: 5, name: 'Reference Request Email', description: 'A professional email template for requesting recommendation letters from professors.', category: 'Email', format: ['pdf', 'docx'] }
];

export async function getTemplates() {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 400));
    return { success: true, data: mockTemplates };
  }
  return apiRequest('/templates');
}

export async function downloadTemplate(id, format) {
  if (USE_MOCKS) {
    await new Promise(r => setTimeout(r, 300));
    throw { status: 501, message: 'Template downloads coming soon!' };
  }
  return apiRequest(`/templates/${id}/download?format=${format}`);
}

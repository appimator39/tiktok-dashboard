import { requestClient } from '#/api/request';

export function getLanguages() {
  return requestClient.get('/admin/api/languages');
}

export function createLanguage(payload: Record<string, any>) {
  return requestClient.post('/admin/api/languages', payload);
}

export function getLanguageDetail(id: number) {
  return requestClient.get(`/admin/api/languages/${id}`);
}

export function updateLanguage(id: number, payload: Record<string, any>) {
  return requestClient.put(`/admin/api/languages/${id}`, payload);
}

export function deleteLanguage(id: number) {
  return requestClient.delete(`/admin/api/languages/${id}`);
}

export function getLanguagePageToggles(id: number) {
  return requestClient.get(`/admin/api/languages/${id}/page-toggles`);
}

export function updateLanguagePageToggles(id: number, payload: Record<string, any>) {
  return requestClient.put(`/admin/api/languages/${id}/page-toggles`, payload);
}

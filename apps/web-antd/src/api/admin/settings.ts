import { requestClient } from '#/api/request';

export function getGeneralSettings() {
  return requestClient.get('/admin/api/settings/general');
}

export function updateGeneralSettings(payload: Record<string, any>) {
  return requestClient.put('/admin/api/settings/general', payload);
}

export function getApiProviders() {
  return requestClient.get('/admin/api/settings/api-providers');
}

export function createApiProvider(payload: Record<string, any>) {
  return requestClient.post('/admin/api/settings/api-providers', payload);
}

export function updateApiProvider(id: number, payload: Record<string, any>) {
  return requestClient.put(`/admin/api/settings/api-providers/${id}`, payload);
}

export function deleteApiProvider(id: number) {
  return requestClient.delete(`/admin/api/settings/api-providers/${id}`);
}

export function testApiProvider(payload: { provider_id: number; url?: string }) {
  return requestClient.post('/admin/api/settings/api-providers/test', payload);
}

export function getGlobalContent() {
  return requestClient.get('/admin/api/settings/global-content');
}

export function updateGlobalContent(payload: Record<string, any>) {
  return requestClient.put('/admin/api/settings/global-content', payload);
}

export function getGlobalHeader() {
  return requestClient.get('/admin/api/settings/global-header');
}

export function updateGlobalHeader(payload: Record<string, any>) {
  return requestClient.put('/admin/api/settings/global-header', payload);
}

export function getGlobalFooter() {
  return requestClient.get('/admin/api/settings/global-footer');
}

export function updateGlobalFooter(payload: Record<string, any>) {
  return requestClient.put('/admin/api/settings/global-footer', payload);
}

export function getRobotsSettings() {
  return requestClient.get('/admin/api/settings/robots');
}

export function updateRobotsSettings(payload: Record<string, any>) {
  return requestClient.put('/admin/api/settings/robots', payload);
}

export function changePassword(payload: Record<string, any>) {
  return requestClient.post('/admin/api/settings/change-password', payload);
}

export function getLogoFavicon() {
  return requestClient.get('/admin/api/settings/logo-favicon');
}

export function uploadLogoFavicon(payload: FormData) {
  return requestClient.post('/admin/api/settings/logo-favicon', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

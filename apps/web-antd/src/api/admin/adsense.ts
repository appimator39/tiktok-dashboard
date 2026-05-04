import { requestClient } from '#/api/request';

export function getAdsenseItems() {
  return requestClient.get('/admin/api/google-adsense');
}

export function createAdsenseItem(payload: Record<string, any>) {
  return requestClient.post('/admin/api/google-adsense', payload);
}

export function updateAdsenseItem(id: number, payload: Record<string, any>) {
  return requestClient.put(`/admin/api/google-adsense/${id}`, payload);
}

export function deleteAdsenseItem(id: number) {
  return requestClient.delete(`/admin/api/google-adsense/${id}`);
}

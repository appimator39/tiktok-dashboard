import { requestClient } from '#/api/request';

export function getContactMessages(params?: Record<string, any>) {
  return requestClient.get('/admin/api/contact-messages', { params });
}

export function updateContactMessage(id: number, payload: Record<string, any>) {
  return requestClient.patch(`/admin/api/contact-messages/${id}`, payload);
}

export function deleteContactMessage(id: number) {
  return requestClient.delete(`/admin/api/contact-messages/${id}`);
}

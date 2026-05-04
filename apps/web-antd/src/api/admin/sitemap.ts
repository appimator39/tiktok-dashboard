import { requestClient } from '#/api/request';

export function getSitemapSummary() {
  return requestClient.get('/admin/api/sitemap-generator');
}

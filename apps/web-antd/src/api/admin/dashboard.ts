import { requestClient } from '#/api/request';

export type ActivityLogParams = {
  action?: string;
  page?: number;
  per_page?: number;
};

export function getStatsSummary() {
  return requestClient.get('/admin/api/stats');
}

export function getRecentDownloads() {
  return requestClient.get('/admin/api/recent-downloads');
}

export function getActivityLog(params: ActivityLogParams) {
  return requestClient.get('/admin/api/activity-log', { params });
}

export function getDashboardChart() {
  return requestClient.get('/admin/api/dashboard-data');
}

export function getAnalyticsData(period: number) {
  return requestClient.get('/admin/api/analytics-data', { params: { period } });
}

import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  const response = await requestClient.get<{
    authenticated?: boolean;
    user?: { email?: string | null; id: number; username: string };
  }>('/admin/api/auth/me');

  if (!response?.authenticated || !response?.user) {
    throw new Error('Not authenticated');
  }

  return {
    avatar: '',
    desc: 'Admin',
    homePath: '/admin/dashboard',
    realName: response.user.username,
    roles: ['admin'],
    token: 'session',
    userId: String(response.user.id),
    username: response.user.username,
  } satisfies UserInfo;
}

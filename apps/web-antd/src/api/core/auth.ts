import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  const response = await requestClient.post<{ error?: string; success?: boolean }>(
    '/admin/api/auth/login',
    data,
  );
  if (response?.success) {
    return { accessToken: 'session' };
  }
  throw new Error(response?.error || 'Login failed');
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/admin/api/auth/me',
  );
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/admin/api/auth/logout');
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return [];
}

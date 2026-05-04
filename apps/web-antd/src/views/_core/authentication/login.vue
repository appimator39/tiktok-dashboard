<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, onMounted, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const loginRef = ref<any>(null);

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
  ];
});

onMounted(() => {
  const formApi = loginRef.value?.getFormApi?.();
  if (formApi?.setFieldValue) {
    formApi.setFieldValue('username', 'admin');
    formApi.setFieldValue('password', 'admin123');
  }
});
</script>

<template>
  <AuthenticationLogin
    ref="loginRef"
    :show-code-login="false"
    :show-forget-password="false"
    :show-qrcode-login="false"
    :show-register="false"
    :show-third-party-login="false"
    :show-remember-me="true"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    submit-button-text="Sign in"
    sub-title="Plug-and-play control for your TikTok tools."
    title="TikTokIO Admin"
    @submit="authStore.authLogin"
  />
</template>

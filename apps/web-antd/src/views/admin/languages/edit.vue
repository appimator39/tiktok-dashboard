<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, Select, message } from 'ant-design-vue';

import { getLanguageDetail, getLanguages, updateLanguage } from '#/api';

type Language = {
  id: number;
  name: string;
};

const route = useRoute();
const languages = ref<Language[]>([]);
const languageId = ref<number | null>(null);
const loading = ref(false);
const saving = ref(false);
const formState = ref<Record<string, any>>({
  name: '',
  code: '',
  direction: 'LTR',
  download_label: '',
  paste_label: '',
  download_app_title: '',
  download_app_description: '',
});

async function loadLanguages() {
  const response = await getLanguages();
  languages.value = (response as any).languages ?? [];
  const queryId = route.query.id ? Number(route.query.id) : null;
  if (!languageId.value && queryId) {
    languageId.value = queryId;
  }
}

async function loadDetail() {
  if (!languageId.value) return;
  loading.value = true;
  try {
    const response = await getLanguageDetail(languageId.value);
    formState.value = {
      ...formState.value,
      ...(response as any).language,
    };
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!languageId.value) return;
  saving.value = true;
  try {
    await updateLanguage(languageId.value, formState.value);
    message.success('Language updated');
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await loadLanguages();
  await loadDetail();
});
watch(languageId, loadDetail);
</script>

<template>
  <Page description="Edit a language entry" title="Edit Language">
    <Card class="mb-4">
      <div class="flex items-center gap-3">
        <Select
          v-model:value="languageId"
          class="min-w-[240px]"
          placeholder="Select language"
        >
          <Select.Option v-for="lang in languages" :key="lang.id" :value="lang.id">
            {{ lang.name }}
          </Select.Option>
        </Select>
      </div>
    </Card>

    <Card :loading="loading">
      <Form layout="vertical">
        <Form.Item label="Language name">
          <Input v-model:value="formState.name" />
        </Form.Item>
        <Form.Item label="Language code">
          <Input v-model:value="formState.code" />
        </Form.Item>
        <Form.Item label="Direction">
          <Select v-model:value="formState.direction">
            <Select.Option value="LTR">LTR</Select.Option>
            <Select.Option value="RTL">RTL</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Download label">
          <Input v-model:value="formState.download_label" />
        </Form.Item>
        <Form.Item label="Paste label">
          <Input v-model:value="formState.paste_label" />
        </Form.Item>
        <Form.Item label="Download app title">
          <Input v-model:value="formState.download_app_title" />
        </Form.Item>
        <Form.Item label="Download app description">
          <Input.TextArea v-model:value="formState.download_app_description" :rows="3" />
        </Form.Item>
        <Button type="primary" :loading="saving" :disabled="!languageId" @click="save">
          Save language
        </Button>
      </Form>
    </Card>
  </Page>
</template>

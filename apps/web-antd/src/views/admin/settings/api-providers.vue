<script setup lang="ts">
import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Switch,
  Table,
} from 'ant-design-vue';

import {
  createApiProvider,
  deleteApiProvider,
  getApiProviders,
  testApiProvider,
  updateApiProvider,
} from '#/api';
import { message } from 'ant-design-vue';

type Provider = {
  api_url: string;
  id: number;
  is_default: boolean;
  provider: string;
};

const loading = ref(false);
const providers = ref<Provider[]>([]);
const formState = ref({ provider: '', api_url: '', is_default: true });
const editVisible = ref(false);
const editTarget = ref<Provider | null>(null);
const editState = ref({ provider: '', api_url: '', is_default: false });
const testUrl = ref('https://www.tiktok.com/@tiktok/video/7583293985133841671');
const testLoading = ref<number | null>(null);

const columns = [
  { title: 'Provider', dataIndex: 'provider', key: 'provider' },
  { title: 'API URL', dataIndex: 'api_url', key: 'api_url' },
  {
    title: 'Default',
    dataIndex: 'is_default',
    key: 'is_default',
    customRender: ({ text }: { text: boolean }) => (text ? 'Yes' : 'No'),
  },
  {
    title: 'Actions',
    key: 'actions',
    customRender: ({ record }: { record: Provider }) =>
      h(
        'div',
        { class: 'flex gap-2' },
        [
          h(
            Button,
            { size: 'small', onClick: () => openEdit(record) },
            () => 'Edit',
          ),
          h(
            Button,
            {
              size: 'small',
              loading: testLoading.value === record.id,
              onClick: () => runTest(record),
            },
            () => 'Test',
          ),
          h(
            Button,
            { size: 'small', danger: true, onClick: () => remove(record.id) },
            () => 'Delete',
          ),
        ],
      ),
  },
];

async function loadProviders() {
  loading.value = true;
  try {
    const response = await getApiProviders();
    providers.value = (response as any).providers ?? [];
  } finally {
    loading.value = false;
  }
}

async function createProvider() {
  await createApiProvider(formState.value);
  formState.value = { provider: '', api_url: '', is_default: true };
  await loadProviders();
}

function openEdit(record: Provider) {
  editTarget.value = record;
  editState.value = {
    provider: record.provider,
    api_url: record.api_url,
    is_default: record.is_default,
  };
  editVisible.value = true;
}

async function saveEdit() {
  if (!editTarget.value) return;
  await updateApiProvider(editTarget.value.id, editState.value);
  editVisible.value = false;
  await loadProviders();
}

async function runTest(record: Provider) {
  testLoading.value = record.id;
  try {
    const response = (await testApiProvider({
      provider_id: record.id,
      url: testUrl.value,
    })) as any;
    if (response?.success) {
      message.success(response.message || 'Provider is responding.');
      if (response?.suggested_api_url) {
        message.info(`Suggested API URL: ${response.suggested_api_url}`);
      }
    } else {
      message.error(response?.message || 'Provider test failed.');
    }
  } catch (err: any) {
    message.error(err?.message || 'Provider test failed.');
  } finally {
    testLoading.value = null;
  }
}

async function remove(id: number) {
  await deleteApiProvider(id);
  await loadProviders();
}

onMounted(loadProviders);
</script>

<template>
  <Page description="Manage API provider endpoints" title="API Providers">
    <Card class="mb-4" title="Add provider">
      <Form layout="vertical">
        <Form.Item label="Provider name">
          <Input v-model:value="formState.provider" />
        </Form.Item>
        <Form.Item label="API URL">
          <Input v-model:value="formState.api_url" />
        </Form.Item>
        <Form.Item label="Set as default">
          <Switch v-model:checked="formState.is_default" />
        </Form.Item>
        <Form.Item label="Test TikTok URL">
          <Input v-model:value="testUrl" />
        </Form.Item>
        <Button type="primary" @click="createProvider">Save provider</Button>
      </Form>
    </Card>

    <Card title="Configured providers">
      <Table
        :columns="columns"
        :data-source="providers"
        :loading="loading"
        row-key="id"
      />
    </Card>

    <Modal
      v-model:open="editVisible"
      title="Edit Provider"
      @ok="saveEdit"
    >
      <Form layout="vertical">
        <Form.Item label="Provider name">
          <Input v-model:value="editState.provider" />
        </Form.Item>
        <Form.Item label="API URL">
          <Input v-model:value="editState.api_url" />
        </Form.Item>
        <Form.Item label="Set as default">
          <Switch v-model:checked="editState.is_default" />
        </Form.Item>
      </Form>
    </Modal>
  </Page>
</template>

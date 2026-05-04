<script setup lang="ts">
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, Select, Table, Tag } from 'ant-design-vue';

import { createLanguage, deleteLanguage, getLanguages, updateLanguage } from '#/api';

type Language = {
  code: string;
  created_at: string | null;
  direction: string;
  id: number;
  image_path: string | null;
  is_default: boolean;
  name: string;
};

const router = useRouter();
const loading = ref(false);
const languages = ref<Language[]>([]);
const formState = ref({
  name: '',
  code: '',
  direction: 'LTR',
  is_default: false,
});

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  {
    title: 'Default',
    dataIndex: 'is_default',
    key: 'is_default',
    customRender: ({ text }: { text: boolean }) =>
      text ? h(Tag, { color: 'blue' }, () => 'Default') : '-',
  },
  {
    title: 'Actions',
    key: 'actions',
    customRender: ({ record }: { record: Language }) =>
      h(
        'div',
        { class: 'flex gap-2' },
        [
          h(
            Button,
            {
              size: 'small',
              onClick: () =>
                router.push({ path: '/admin/edit-language', query: { id: record.id } }),
            },
            () => 'Edit',
          ),
          h(
            Button,
            {
              size: 'small',
              onClick: () =>
                router.push({ path: '/admin/language-pages', query: { id: record.id } }),
            },
            () => 'Pages',
          ),
          h(
            Button,
            {
              size: 'small',
              onClick: () => updateLanguage(record.id, { is_default: true }).then(loadLanguages),
            },
            () => 'Set default',
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

async function loadLanguages() {
  loading.value = true;
  try {
    const response = await getLanguages();
    languages.value = (response as any).languages ?? [];
  } finally {
    loading.value = false;
  }
}

async function create() {
  await createLanguage(formState.value);
  formState.value = { name: '', code: '', direction: 'LTR', is_default: false };
  await loadLanguages();
}

async function remove(id: number) {
  await deleteLanguage(id);
  await loadLanguages();
}

onMounted(loadLanguages);
</script>

<template>
  <Page description="Manage languages and default locale" title="Languages">
    <Card class="mb-4" title="Add language">
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
        <Form.Item label="Set as default">
          <Select v-model:value="formState.is_default">
            <Select.Option :value="true">Yes</Select.Option>
            <Select.Option :value="false">No</Select.Option>
          </Select>
        </Form.Item>
        <Button type="primary" @click="create">Save language</Button>
      </Form>
    </Card>

    <Card title="Languages">
      <Table
        :columns="columns"
        :data-source="languages"
        :loading="loading"
        row-key="id"
      />
    </Card>
  </Page>
</template>

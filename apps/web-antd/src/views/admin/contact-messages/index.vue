<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { Button, Card, Popconfirm, Select, Table, Tag } from 'ant-design-vue';

import {
  deleteContactMessage,
  getContactMessages,
  updateContactMessage,
} from '#/api';

type ContactMessage = {
  created_at: string;
  email: string;
  id: number;
  ip_address: string | null;
  message: string;
  status: string;
  user_agent: string | null;
};

type ContactResponse = {
  current_page: number;
  messages: ContactMessage[];
  pages: number;
  total: number;
};

const statusFilter = ref<string | undefined>(undefined);
const page = ref(1);
const loading = ref(false);
const data = ref<ContactResponse | null>(null);

const statusOptions = ['new', 'read', 'replied', 'closed'];

async function loadMessages() {
  loading.value = true;
  try {
    data.value = (await getContactMessages({
      status: statusFilter.value,
      page: page.value,
      per_page: 20,
    })) as ContactResponse;
  } finally {
    loading.value = false;
  }
}

async function handleStatusChange(id: number, status: string) {
  await updateContactMessage(id, { status });
  await loadMessages();
}

async function handleDelete(id: number) {
  await deleteContactMessage(id);
  await loadMessages();
}

onMounted(loadMessages);
watch([statusFilter, page], loadMessages);

const columns = [
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Message', dataIndex: 'message', key: 'message' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ record }: { record: ContactMessage }) =>
      h(Select, {
        size: 'small',
        value: record.status,
        options: statusOptions.map((option) => ({
          label: option,
          value: option,
        })),
        onChange: (value: string) => handleStatusChange(record.id, value),
        style: { width: '120px' },
      }),
  },
  {
    title: 'Time',
    dataIndex: 'created_at',
    key: 'created_at',
    customRender: ({ text }: { text: string }) =>
      text ? new Date(text).toLocaleString() : '-',
  },
  {
    title: 'Actions',
    key: 'actions',
    customRender: ({ record }: { record: ContactMessage }) =>
      h(
        Popconfirm,
        {
          title: 'Delete this message?',
          onConfirm: () => handleDelete(record.id),
        },
        {
          default: () =>
            h(
              Button,
              { danger: true, size: 'small', type: 'link' },
              () => 'Delete',
            ),
        },
      ),
  },
];
</script>

<template>
  <Page description="Review and triage contact submissions" title="Contact Messages">
    <Card class="mb-4">
      <div class="flex flex-wrap items-center gap-3">
        <Select
          v-model:value="statusFilter"
          allow-clear
          class="min-w-[220px]"
          placeholder="Filter by status"
        >
          <Select.Option v-for="option in statusOptions" :key="option" :value="option">
            {{ option }}
          </Select.Option>
        </Select>
        <Tag color="blue">Total: {{ data?.total ?? 0 }}</Tag>
      </div>
    </Card>

    <Card>
      <Table
        :columns="columns"
        :data-source="data?.messages ?? []"
        :loading="loading"
        :pagination="{
          current: data?.current_page ?? 1,
          pageSize: 20,
          total: data?.total ?? 0,
          onChange: (next) => (page = next),
        }"
        row-key="id"
      />
    </Card>
  </Page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { Button, Card, Select, Table } from 'ant-design-vue';

import { getActivityLog } from '#/api';

type ActivityLogResponse = {
  actions: string[];
  activities: Array<{
    action: string;
    admin: string;
    created_at: string;
    details: string | null;
    entity_id: number | null;
    entity_type: string | null;
    id: number;
    ip_address: string | null;
  }>;
  current_page: number;
  pages: number;
  total: number;
};

const loading = ref(false);
const log = ref<ActivityLogResponse | null>(null);
const action = ref<string | undefined>(undefined);
const page = ref(1);

const columns = [
  { title: 'Admin', dataIndex: 'admin', key: 'admin' },
  { title: 'Action', dataIndex: 'action', key: 'action' },
  { title: 'Entity', dataIndex: 'entity_type', key: 'entity_type' },
  { title: 'Details', dataIndex: 'details', key: 'details' },
  {
    title: 'Time',
    dataIndex: 'created_at',
    key: 'created_at',
    customRender: ({ text }: { text: string }) =>
      text ? new Date(text).toLocaleString() : '-',
  },
];

async function loadActivity() {
  loading.value = true;
  try {
    log.value = (await getActivityLog({
      action: action.value,
      page: page.value,
      per_page: 20,
    })) as ActivityLogResponse;
  } finally {
    loading.value = false;
  }
}

onMounted(loadActivity);
watch([action, page], loadActivity);
</script>

<template>
  <Page description="Audit trail for admin actions" title="Activity Log">
    <Card class="mb-4">
      <div class="flex flex-wrap items-center gap-3">
        <Select
          v-model:value="action"
          allow-clear
          class="min-w-[220px]"
          placeholder="Filter by action"
        >
          <Select.Option
            v-for="item in log?.actions ?? []"
            :key="item"
            :value="item"
          >
            {{ item }}
          </Select.Option>
        </Select>
        <Button @click="page = 1">Refresh</Button>
      </div>
    </Card>

    <Card>
      <Table
        :columns="columns"
        :data-source="log?.activities ?? []"
        :loading="loading"
        :pagination="{
          current: log?.current_page ?? 1,
          pageSize: 20,
          total: log?.total ?? 0,
          onChange: (next) => (page = next),
        }"
        row-key="id"
      />
    </Card>
  </Page>
</template>

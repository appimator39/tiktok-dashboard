<script setup lang="ts">
import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Card, Col, Row, Statistic, Table, Tag } from 'ant-design-vue';

import { getActivityLog, getRecentDownloads, getStatsSummary } from '#/api';

type StatsSummary = {
  total_downloads: number;
  today_downloads: number;
  total_contacts: number;
  today_contacts: number;
  total_countries: number;
};

type RecentDownload = {
  country: string;
  download_time: string;
  status: string | null;
  video_id: string | null;
};

type ActivityItem = {
  action: string;
  admin: string;
  created_at: string;
  details: string | null;
  id: number;
};

const loading = ref(false);
const stats = ref<StatsSummary | null>(null);
const downloads = ref<RecentDownload[]>([]);
const activity = ref<ActivityItem[]>([]);

const downloadColumns = [
  { title: 'Video ID', dataIndex: 'video_id', key: 'video_id' },
  { title: 'Country', dataIndex: 'country', key: 'country' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }: { text: string }) =>
      h(Tag, { color: 'blue' }, () => text || 'pending'),
  },
  {
    title: 'Time',
    dataIndex: 'download_time',
    key: 'download_time',
    customRender: ({ text }: { text: string }) =>
      text ? new Date(text).toLocaleString() : '-',
  },
];

const activityColumns = [
  { title: 'Admin', dataIndex: 'admin', key: 'admin' },
  { title: 'Action', dataIndex: 'action', key: 'action' },
  { title: 'Details', dataIndex: 'details', key: 'details' },
  {
    title: 'Time',
    dataIndex: 'created_at',
    key: 'created_at',
    customRender: ({ text }: { text: string }) =>
      text ? new Date(text).toLocaleString() : '-',
  },
];

async function loadData() {
  loading.value = true;
  try {
    const [summary, recent, log] = await Promise.all([
      getStatsSummary(),
      getRecentDownloads(),
      getActivityLog({ page: 1, per_page: 6 }),
    ]);
    stats.value = summary as StatsSummary;
    downloads.value = recent as RecentDownload[];
    activity.value = (log as any)?.activities ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <Page description="Live admin insights from your backend" title="Dashboard">
    <Row :gutter="[16, 16]" class="mb-4">
      <Col :md="6" :xs="24">
        <Card>
          <Statistic
            :value="stats?.total_downloads ?? 0"
            title="Total downloads"
          />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card>
          <Statistic
            :value="stats?.today_downloads ?? 0"
            title="Downloads today"
          />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card>
          <Statistic
            :value="stats?.total_contacts ?? 0"
            title="Total contacts"
          />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card>
          <Statistic
            :value="stats?.total_countries ?? 0"
            title="Active countries"
          />
        </Card>
      </Col>
    </Row>

    <Row :gutter="[16, 16]">
      <Col :md="14" :xs="24">
        <Card title="Recent downloads">
          <Table
            :columns="downloadColumns"
            :data-source="downloads"
            :loading="loading"
            :pagination="false"
            row-key="download_time"
            size="small"
          />
        </Card>
      </Col>
      <Col :md="10" :xs="24">
        <Card title="Latest activity">
          <Table
            :columns="activityColumns"
            :data-source="activity"
            :loading="loading"
            :pagination="false"
            row-key="id"
            size="small"
          />
        </Card>
      </Col>
    </Row>
  </Page>
</template>

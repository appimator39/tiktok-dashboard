<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import { Card, Radio, Space, Table } from 'ant-design-vue';

import { getActivityLog, getAnalyticsData } from '#/api';

type AnalyticsData = {
  api_usage: Array<{ api: string; count: number }>;
  daily_downloads: Array<{ count: number; date: string }>;
  status_data: Array<{ count: number; status: string }>;
  top_countries: Array<{ count: number; country: string }>;
};

type ActivityItem = {
  id: number;
  admin: string;
  action: string;
  details?: string | null;
  created_at: string;
  ip_address?: string | null;
};

const period = ref(30);
const data = ref<AnalyticsData | null>(null);
const loading = ref(false);
const activityLoading = ref(false);
const activityItems = ref<ActivityItem[]>([]);

const trendRef = ref<InstanceType<typeof EchartsUI> | null>(null);
const statusRef = ref<InstanceType<typeof EchartsUI> | null>(null);

const { renderEcharts: renderTrend } = useEcharts(trendRef);
const { renderEcharts: renderStatus } = useEcharts(statusRef);

const countryColumns = [
  { title: 'Country', dataIndex: 'country', key: 'country' },
  { title: 'Downloads', dataIndex: 'count', key: 'count' },
];

const apiColumns = [
  {
    title: 'Provider',
    dataIndex: 'api',
    key: 'api',
    customRender: ({ text }: { text: string }) =>
      text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : '-',
  },
  { title: 'Usage', dataIndex: 'count', key: 'count' },
];

const activityColumns = [
  {
    title: 'When',
    dataIndex: 'created_at',
    key: 'created_at',
    customRender: ({ text }: { text: string }) =>
      text ? new Date(text).toLocaleString() : '-',
  },
  { title: 'Admin', dataIndex: 'admin', key: 'admin' },
  { title: 'Action', dataIndex: 'action', key: 'action' },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details',
    customRender: ({ text }: { text?: string }) => text || '-',
  },
];

async function loadAnalytics() {
  loading.value = true;
  try {
    data.value = (await getAnalyticsData(period.value)) as AnalyticsData;
    renderCharts();
  } finally {
    loading.value = false;
  }
}

async function loadActivity() {
  activityLoading.value = true;
  try {
    const response = (await getActivityLog({ page: 1, per_page: 10 })) as {
      activities: ActivityItem[];
    };
    activityItems.value = response.activities ?? [];
  } finally {
    activityLoading.value = false;
  }
}

function renderCharts() {
  const series = data.value?.daily_downloads ?? [];
  renderTrend({
    grid: { left: '4%', right: '4%', top: '6%', bottom: '8%' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: series.map((item) => item.date),
      axisLabel: { color: '#9aa5b1' },
    },
    yAxis: { type: 'value' },
    series: [
      {
        data: series.map((item) => item.count),
        type: 'line',
        smooth: true,
        areaStyle: {},
        itemStyle: { color: '#7c3aed' },
      },
    ],
  });

  const statusSeries = data.value?.status_data ?? [];
  renderStatus({
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        data: statusSeries.map((item) => ({
          name: item.status,
          value: item.count,
        })),
        label: { show: false },
      },
    ],
  });
}

onMounted(() => {
  loadAnalytics();
  loadActivity();
});
watch(period, loadAnalytics);
</script>

<template>
  <Page description="Traffic, downloads, and provider usage" title="Analytics">
    <Card class="mb-4">
      <Space>
        <span>Period</span>
        <Radio.Group v-model:value="period">
          <Radio.Button :value="7">7 days</Radio.Button>
          <Radio.Button :value="30">30 days</Radio.Button>
          <Radio.Button :value="90">90 days</Radio.Button>
        </Radio.Group>
      </Space>
    </Card>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2" title="Download trends" :loading="loading">
        <EchartsUI ref="trendRef" style="height: 280px" />
      </Card>
      <Card title="Status breakdown" :loading="loading">
        <EchartsUI ref="statusRef" style="height: 280px" />
      </Card>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card title="Top countries" :loading="loading">
        <Table
          :columns="countryColumns"
          :data-source="data?.top_countries ?? []"
          :pagination="false"
          row-key="country"
          size="small"
        />
      </Card>
      <Card title="API usage" :loading="loading">
        <Table
          :columns="apiColumns"
          :data-source="data?.api_usage ?? []"
          :pagination="false"
          row-key="api"
          size="small"
        />
      </Card>
    </div>

    <div class="mt-4">
      <Card title="Recent activity" :loading="activityLoading">
        <Table
          :columns="activityColumns"
          :data-source="activityItems"
          :pagination="false"
          row-key="id"
          size="small"
        />
      </Card>
    </div>
  </Page>
</template>

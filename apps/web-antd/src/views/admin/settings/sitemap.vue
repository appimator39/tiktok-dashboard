<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Card, Col, Row, Statistic } from 'ant-design-vue';

import { getSitemapSummary } from '#/api';

const loading = ref(false);
const stats = ref<Record<string, number>>({});

async function loadSummary() {
  loading.value = true;
  try {
    const response = await getSitemapSummary();
    stats.value = (response as any).stats ?? {};
  } finally {
    loading.value = false;
  }
}

onMounted(loadSummary);
</script>

<template>
  <Page description="Sitemap generation stats" title="Sitemap Generator">
    <Row :gutter="[16, 16]">
      <Col :md="6" :xs="24">
        <Card :loading="loading">
          <Statistic title="Total languages" :value="stats.total_languages ?? 0" />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card :loading="loading">
          <Statistic title="MP3 enabled" :value="stats.enabled_mp3 ?? 0" />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card :loading="loading">
          <Statistic title="Stories enabled" :value="stats.enabled_stories ?? 0" />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card :loading="loading">
          <Statistic title="How enabled" :value="stats.enabled_how ?? 0" />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card :loading="loading">
          <Statistic title="MP3 pages" :value="stats.total_mp3_pages ?? 0" />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card :loading="loading">
          <Statistic title="Stories pages" :value="stats.total_stories_pages ?? 0" />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card :loading="loading">
          <Statistic title="How pages" :value="stats.total_how_pages ?? 0" />
        </Card>
      </Col>
      <Col :md="6" :xs="24">
        <Card :loading="loading">
          <Statistic title="Custom pages" :value="stats.total_custom_pages ?? 0" />
        </Card>
      </Col>
    </Row>
  </Page>
</template>

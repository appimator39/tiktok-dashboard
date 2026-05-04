<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { Button, Card, Select, Switch, message } from 'ant-design-vue';

import {
  getLanguagePageToggles,
  getLanguages,
  updateLanguagePageToggles,
} from '#/api';

type Language = { id: number; name: string };

const route = useRoute();
const loading = ref(false);
const languageId = ref<number | null>(null);
const languages = ref<Language[]>([]);
const toggles = ref<Record<string, boolean>>({});

const toggleKeys = [
  { key: 'home_enabled', label: 'Home' },
  { key: 'mp3_enabled', label: 'MP3' },
  { key: 'stories_enabled', label: 'Stories' },
  { key: 'how_enabled', label: 'How' },
  { key: 'faqs_enabled', label: 'FAQs' },
  { key: 'privacy_enabled', label: 'Privacy' },
  { key: 'terms_enabled', label: 'Terms' },
  { key: 'contact_enabled', label: 'Contact' },
  { key: 'create_new_enabled', label: 'Custom pages' },
];

async function loadLanguages() {
  const response = await getLanguages();
  languages.value = (response as any).languages ?? [];
  const queryId = route.query.id ? Number(route.query.id) : null;
  if (!languageId.value && queryId) {
    languageId.value = queryId;
  }
}

async function loadToggles() {
  if (!languageId.value) return;
  loading.value = true;
  try {
    const response = await getLanguagePageToggles(languageId.value);
    toggles.value = (response as any).toggles ?? {};
  } finally {
    loading.value = false;
  }
}

async function saveToggles() {
  if (!languageId.value) return;
  await updateLanguagePageToggles(languageId.value, toggles.value);
  message.success('Page toggles updated');
}

onMounted(async () => {
  await loadLanguages();
  await loadToggles();
});

watch(languageId, loadToggles);
</script>

<template>
  <Page description="Toggle language page availability" title="Language Pages">
    <Card class="mb-4">
      <div class="flex flex-wrap items-center gap-3">
        <Select
          v-model:value="languageId"
          class="min-w-[240px]"
          placeholder="Select language"
        >
          <Select.Option v-for="lang in languages" :key="lang.id" :value="lang.id">
            {{ lang.name }}
          </Select.Option>
        </Select>
        <Button type="primary" :disabled="!languageId" @click="saveToggles">
          Save
        </Button>
      </div>
    </Card>

    <Card :loading="loading">
      <div class="grid gap-4 md:grid-cols-2">
        <div v-for="item in toggleKeys" :key="item.key" class="flex items-center justify-between">
          <span>{{ item.label }}</span>
          <Switch v-model:checked="toggles[item.key]" />
        </div>
      </div>
    </Card>
  </Page>
</template>

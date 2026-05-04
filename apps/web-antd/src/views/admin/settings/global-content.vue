<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, message } from 'ant-design-vue';

import { getGlobalContent, updateGlobalContent } from '#/api';

const loading = ref(false);
const saving = ref(false);
const contents = ref<Record<string, string>>({});
const newKey = ref('');

async function loadContent() {
  loading.value = true;
  try {
    const response = await getGlobalContent();
    contents.value = (response as any).contents ?? {};
  } finally {
    loading.value = false;
  }
}

function addKey() {
  const key = newKey.value.trim();
  if (!key) return;
  if (!contents.value[key]) {
    contents.value[key] = '';
  }
  newKey.value = '';
}

async function saveContent() {
  saving.value = true;
  try {
    await updateGlobalContent({ contents: contents.value });
    message.success('Global content updated');
  } finally {
    saving.value = false;
  }
}

onMounted(loadContent);
</script>

<template>
  <Page description="Global text snippets and shared content" title="Global Content">
    <Card :loading="loading">
      <Form layout="vertical">
        <Form.Item label="Add content key">
          <div class="flex gap-2">
            <Input v-model:value="newKey" placeholder="footer_note" />
            <Button @click="addKey">Add</Button>
          </div>
        </Form.Item>
        <Form.Item
          v-for="(value, key) in contents"
          :key="key"
          :label="key"
        >
          <Input.TextArea v-model:value="contents[key]" :rows="4" />
        </Form.Item>
        <Button type="primary" :loading="saving" @click="saveContent">
          Save content
        </Button>
      </Form>
    </Card>
  </Page>
</template>

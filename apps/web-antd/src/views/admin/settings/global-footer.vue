<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, message } from 'ant-design-vue';

import { getGlobalFooter, updateGlobalFooter } from '#/api';

const loading = ref(false);
const saving = ref(false);
const content = ref('');

async function loadContent() {
  loading.value = true;
  try {
    const response = await getGlobalFooter();
    content.value = (response as any).content ?? '';
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  try {
    await updateGlobalFooter({ content: content.value });
    message.success('Footer updated');
  } finally {
    saving.value = false;
  }
}

onMounted(loadContent);
</script>

<template>
  <Page description="Edit the global footer HTML" title="Global Footer">
    <Card :loading="loading">
      <Form layout="vertical">
        <Form.Item label="Footer content">
          <Input.TextArea v-model:value="content" :rows="10" />
        </Form.Item>
        <Button type="primary" :loading="saving" @click="save">Save</Button>
      </Form>
    </Card>
  </Page>
</template>

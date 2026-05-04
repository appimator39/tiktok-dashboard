<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, message } from 'ant-design-vue';

import { getGlobalHeader, updateGlobalHeader } from '#/api';

const loading = ref(false);
const saving = ref(false);
const content = ref('');

async function loadContent() {
  loading.value = true;
  try {
    const response = await getGlobalHeader();
    content.value = (response as any).content ?? '';
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  try {
    await updateGlobalHeader({ content: content.value });
    message.success('Header updated');
  } finally {
    saving.value = false;
  }
}

onMounted(loadContent);
</script>

<template>
  <Page description="Edit the global header HTML" title="Global Header">
    <Card :loading="loading">
      <Form layout="vertical">
        <Form.Item label="Header content">
          <Input.TextArea v-model:value="content" :rows="10" />
        </Form.Item>
        <Button type="primary" :loading="saving" @click="save">Save</Button>
      </Form>
    </Card>
  </Page>
</template>

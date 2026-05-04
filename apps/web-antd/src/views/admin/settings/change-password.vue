<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, message } from 'ant-design-vue';

import { changePassword } from '#/api';

const saving = ref(false);
const formState = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
});

async function save() {
  saving.value = true;
  try {
    await changePassword(formState.value);
    message.success('Password updated');
    formState.value = {
      current_password: '',
      new_password: '',
      confirm_password: '',
    };
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Page description="Update your admin password" title="Change Password">
    <Card>
      <Form layout="vertical">
        <Form.Item label="Current password">
          <Input.Password v-model:value="formState.current_password" />
        </Form.Item>
        <Form.Item label="New password">
          <Input.Password v-model:value="formState.new_password" />
        </Form.Item>
        <Form.Item label="Confirm password">
          <Input.Password v-model:value="formState.confirm_password" />
        </Form.Item>
        <Button type="primary" :loading="saving" @click="save">Save</Button>
      </Form>
    </Card>
  </Page>
</template>

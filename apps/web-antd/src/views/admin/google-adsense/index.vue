<script setup lang="ts">
import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Table,
  message,
} from 'ant-design-vue';

import {
  createAdsenseItem,
  deleteAdsenseItem,
  getAdsenseItems,
  updateAdsenseItem,
} from '#/api';

type AdsenseItem = {
  ad_script: string;
  created_at: string;
  id: number;
  updated_at: string | null;
};

const loading = ref(false);
const ads = ref<AdsenseItem[]>([]);
const formState = ref({ ad_script: '' });
const editVisible = ref(false);
const editTarget = ref<AdsenseItem | null>(null);
const editForm = ref({ ad_script: '' });

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  {
    title: 'Script',
    dataIndex: 'ad_script',
    key: 'ad_script',
    ellipsis: true,
  },
  {
    title: 'Updated',
    dataIndex: 'updated_at',
    key: 'updated_at',
    customRender: ({ text }: { text: string }) =>
      text ? new Date(text).toLocaleString() : '-',
  },
  {
    title: 'Actions',
    key: 'actions',
    customRender: ({ record }: { record: AdsenseItem }) =>
      h(
        'div',
        { class: 'flex gap-2' },
        [
          h(
            Button,
            { size: 'small', onClick: () => openEdit(record) },
            () => 'Edit',
          ),
          h(
            Button,
            { size: 'small', danger: true, onClick: () => remove(record.id) },
            () => 'Delete',
          ),
        ],
      ),
  },
];

async function loadAds() {
  loading.value = true;
  try {
    const response = await getAdsenseItems();
    ads.value = (response as any).ads ?? [];
  } finally {
    loading.value = false;
  }
}

async function create() {
  if (!formState.value.ad_script.trim()) {
    message.warning('Ad script is required');
    return;
  }
  await createAdsenseItem({ ad_script: formState.value.ad_script });
  formState.value.ad_script = '';
  await loadAds();
}

function openEdit(item: AdsenseItem) {
  editTarget.value = item;
  editForm.value.ad_script = item.ad_script;
  editVisible.value = true;
}

async function saveEdit() {
  if (!editTarget.value) return;
  await updateAdsenseItem(editTarget.value.id, {
    ad_script: editForm.value.ad_script,
  });
  editVisible.value = false;
  await loadAds();
}

async function remove(id: number) {
  await deleteAdsenseItem(id);
  await loadAds();
}

onMounted(loadAds);
</script>

<template>
  <Page description="Manage Google Adsense scripts" title="Google Adsense">
    <Card class="mb-4" title="Add new script">
      <Form layout="vertical">
        <Form.Item label="Ad script">
          <Input.TextArea
            v-model:value="formState.ad_script"
            :rows="5"
            placeholder="Paste Google Adsense script"
          />
        </Form.Item>
        <Button type="primary" @click="create">Save script</Button>
      </Form>
    </Card>

    <Card title="Existing scripts">
      <Table
        :columns="columns"
        :data-source="ads"
        :loading="loading"
        row-key="id"
      />
    </Card>

    <Modal
      v-model:open="editVisible"
      title="Edit Adsense Script"
      @ok="saveEdit"
    >
      <Input.TextArea v-model:value="editForm.ad_script" :rows="6" />
    </Modal>
  </Page>
</template>

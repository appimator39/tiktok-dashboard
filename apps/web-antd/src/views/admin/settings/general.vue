<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { Button, Card, Form, Input, Switch, Upload, message, UploadFile } from 'ant-design-vue';

import { getGeneralSettings, getLogoFavicon, updateGeneralSettings, uploadLogoFavicon } from '#/api';

const loading = ref(false);
const saving = ref(false);
const assetsLoading = ref(false);
const assetsSaving = ref(false);
const formState = ref({
  site_name: '',
  site_url: '',
  site_email: '',
  site_phone: '',
  tag_line: '',
  site_status: true,
  download_app_enabled: true,
});
const assetData = ref<{ settings?: { logo_path?: string | null; favicon_path?: string | null } }>({});
const logoFile = ref<File | null>(null);
const faviconFile = ref<File | null>(null);
const logoFileList = ref<UploadFile[]>([]);
const faviconFileList = ref<UploadFile[]>([]);
const logoPreviewUrl = ref('');
const faviconPreviewUrl = ref('');
const baseUrl = import.meta.env.VITE_GLOB_API_URL;

const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/x-icon', 'image/webp'];
const maxFileSize = 2 * 1024 * 1024;

function resolveAssetUrl(path?: string | null, absoluteUrl?: string | null) {
  if (absoluteUrl) return absoluteUrl;
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${baseUrl}/static/${path}`;
}

const logoUrl = computed(() =>
  resolveAssetUrl(
    assetData.value.settings?.logo_path,
    (assetData.value.settings as any)?.logo_url,
  ),
);
const faviconUrl = computed(() =>
  resolveAssetUrl(
    assetData.value.settings?.favicon_path,
    (assetData.value.settings as any)?.favicon_url,
  ),
);

const displayLogoUrl = computed(() => logoPreviewUrl.value || logoUrl.value);
const displayFaviconUrl = computed(() => faviconPreviewUrl.value || faviconUrl.value);

function validateFile(file: File, type: 'logo' | 'favicon') {
  if (!allowedImageTypes.includes(file.type)) {
    message.error(`${type === 'logo' ? 'Logo' : 'Favicon'} must be an image (PNG, JPG, SVG, ICO, or WebP)`);
    return false;
  }
  if (file.size > maxFileSize) {
    message.error(`${type === 'logo' ? 'Logo' : 'Favicon'} must be smaller than 2MB`);
    return false;
  }
  return true;
}

function beforeUploadLogo(file: File) {
  if (!validateFile(file, 'logo')) {
    return false;
  }
  logoFile.value = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    if (logoPreviewUrl.value) {
      URL.revokeObjectURL(logoPreviewUrl.value);
    }
    logoPreviewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
  
  logoFileList.value = [{
    uid: String(Date.now()),
    name: file.name,
    status: 'done',
    url: logoPreviewUrl.value,
  }];
  
  return false;
}

function beforeUploadFavicon(file: File) {
  if (!validateFile(file, 'favicon')) {
    return false;
  }
  faviconFile.value = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    if (faviconPreviewUrl.value) {
      URL.revokeObjectURL(faviconPreviewUrl.value);
    }
    faviconPreviewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
  
  faviconFileList.value = [{
    uid: String(Date.now()),
    name: file.name,
    status: 'done',
    url: faviconPreviewUrl.value,
  }];
  
  return false;
}

function removeLogo() {
  logoFile.value = null;
  logoFileList.value = [];
  if (logoPreviewUrl.value) {
    URL.revokeObjectURL(logoPreviewUrl.value);
    logoPreviewUrl.value = '';
  }
}

function removeFavicon() {
  faviconFile.value = null;
  faviconFileList.value = [];
  if (faviconPreviewUrl.value) {
    URL.revokeObjectURL(faviconPreviewUrl.value);
    faviconPreviewUrl.value = '';
  }
}

async function loadSettings() {
  loading.value = true;
  try {
    const data = (await getGeneralSettings()) as Record<string, any>;
    const settings = (data?.settings ?? data) as Record<string, any> | null;
    if (settings) {
      Object.assign(formState.value, settings);
    }
  } finally {
    loading.value = false;
  }
}

async function loadAssets() {
  assetsLoading.value = true;
  try {
    assetData.value = (await getLogoFavicon()) as Record<string, any>;
  } finally {
    assetsLoading.value = false;
  }
}

async function save() {
  saving.value = true;
  try {
    await updateGeneralSettings(formState.value);
    message.success('Settings updated');
    await loadSettings();
  } finally {
    saving.value = false;
  }
}

async function saveAssets() {
  if (!logoFile.value && !faviconFile.value) {
    message.warning('Please select at least one file to upload');
    return;
  }
  
  assetsSaving.value = true;
  try {
    const formData = new FormData();
    if (logoFile.value) formData.append('logo', logoFile.value);
    if (faviconFile.value) formData.append('favicon', faviconFile.value);
    const response = await uploadLogoFavicon(formData) as any;
    
    if (response?.success) {
      message.success(response?.message || 'Assets updated successfully');
      removeLogo();
      removeFavicon();
      await loadAssets();
    } else {
      message.error(response?.error || 'Failed to update assets');
    }
  } catch (error: any) {
    const errorMsg = error?.response?.data?.error || error?.message || 'Failed to update assets';
    message.error(errorMsg);
  } finally {
    assetsSaving.value = false;
  }
}

onMounted(loadSettings);
onMounted(loadAssets);
</script>

<template>
  <Page description="Core site configuration" title="General Settings">
    <Card :loading="loading">
      <Form layout="vertical">
        <Form.Item label="Site name">
          <Input v-model:value="formState.site_name" placeholder="Enter site name" />
        </Form.Item>
        <Form.Item label="Site URL">
          <Input v-model:value="formState.site_url" placeholder="https://yourdomain.com" />
        </Form.Item>
        <Form.Item label="Site email">
          <Input v-model:value="formState.site_email" placeholder="contact@yourdomain.com" />
        </Form.Item>
        <Form.Item label="Site phone">
          <Input v-model:value="formState.site_phone" placeholder="+1 234 567 890" />
        </Form.Item>
        <Form.Item label="Tag line">
          <Input v-model:value="formState.tag_line" placeholder="A short tagline for your site" />
        </Form.Item>
        <Form.Item label="Site status">
          <Switch v-model:checked="formState.site_status" />
          <span class="ml-2 text-gray-500">{{ formState.site_status ? 'Online' : 'Offline' }}</span>
        </Form.Item>
        <Form.Item label="Download app enabled">
          <Switch v-model:checked="formState.download_app_enabled" />
          <span class="ml-2 text-gray-500">{{ formState.download_app_enabled ? 'Enabled' : 'Disabled' }}</span>
        </Form.Item>
        <Button type="primary" :loading="saving" @click="save">
          Save changes
        </Button>
      </Form>
    </Card>

    <Card class="mt-4" title="Logo & Favicon" :loading="assetsLoading">
      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-3">
          <p class="font-medium text-sm text-gray-700">Current logo</p>
          <div 
            v-if="displayLogoUrl"
            class="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[120px]"
          >
            <img
              :src="displayLogoUrl"
              alt="Logo preview"
              class="max-h-24 max-w-full object-contain"
            />
          </div>
          <div 
            v-else
            class="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[120px]"
          >
            <span class="text-gray-400">No logo uploaded</span>
          </div>
          <div class="flex gap-2">
            <Upload
              :before-upload="beforeUploadLogo"
              :file-list="logoFileList"
              :show-upload-list="false"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/x-icon,image/webp"
            >
              <Button type="default" :disabled="assetsSaving">
                {{ logoFileList.length > 0 ? 'Change logo' : 'Select logo' }}
              </Button>
            </Upload>
            <Button 
              v-if="logoFileList.length > 0" 
              danger 
              :disabled="assetsSaving"
              @click="removeLogo"
            >
              Remove
            </Button>
          </div>
          <p v-if="logoFileList.length > 0" class="text-xs text-gray-500">
            Selected: {{ logoFileList[0]?.name }}
          </p>
        </div>

        <div class="space-y-3">
          <p class="font-medium text-sm text-gray-700">Current favicon</p>
          <div 
            v-if="displayFaviconUrl"
            class="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[120px]"
          >
            <img
              :src="displayFaviconUrl"
              alt="Favicon preview"
              class="max-h-16 max-w-full object-contain"
            />
          </div>
          <div 
            v-else
            class="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[120px]"
          >
            <span class="text-gray-400">No favicon uploaded</span>
          </div>
          <div class="flex gap-2">
            <Upload
              :before-upload="beforeUploadFavicon"
              :file-list="faviconFileList"
              :show-upload-list="false"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/x-icon,image/webp"
            >
              <Button type="default" :disabled="assetsSaving">
                {{ faviconFileList.length > 0 ? 'Change favicon' : 'Select favicon' }}
              </Button>
            </Upload>
            <Button 
              v-if="faviconFileList.length > 0" 
              danger 
              :disabled="assetsSaving"
              @click="removeFavicon"
            >
              Remove
            </Button>
          </div>
          <p v-if="faviconFileList.length > 0" class="text-xs text-gray-500">
            Selected: {{ faviconFileList[0]?.name }}
          </p>
        </div>
      </div>
      <div class="mt-6 space-y-2">
        <Button type="primary" :loading="assetsSaving" @click="saveAssets">
          Save assets
        </Button>
        <p class="text-xs text-gray-500">
          Supported formats: PNG, JPG, JPEG, SVG, ICO, WebP. Maximum file size: 2MB.
        </p>
      </div>
    </Card>
  </Page>
</template>
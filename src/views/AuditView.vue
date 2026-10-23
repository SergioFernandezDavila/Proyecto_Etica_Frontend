<template>
  <div class="app-page p-6 space-y-6">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-3xl font-bold dark:text-white">
          {{ t('audit.title') }}
        </h1>
        <p class="text-gray-500 text-sm mt-1 dark:text-gray-400">
          {{ t('audit.subtitle') }}
        </p>
      </div>
      <fwb-badge type="indigo">{{ t('common.adminMode') }}</fwb-badge>
    </div>

    <div class="app-card">
      <fwb-tabs v-model="activeTab" variant="underline" class="p-2">
        <fwb-tab name="identity" :title="t('audit.tabs.identity')">
          <IdentityAuditTab />
        </fwb-tab>
        <fwb-tab name="properties" :title="t('audit.tabs.properties')">
          <PropertyAuditTab />
        </fwb-tab>
        <fwb-tab name="profiles" :title="t('audit.tabs.profiles')">
          <ProfileAuditTab />
        </fwb-tab>
        <fwb-tab name="access_control" :title="t('audit.tabs.accessControl')">
          <AccessControlAuditTab />
        </fwb-tab>
      </fwb-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { FwbTabs, FwbTab, FwbBadge } from 'flowbite-vue';
import IdentityAuditTab from '@/components/audit/IdentityAuditTab.vue';
import PropertyAuditTab from '@/components/audit/PropertyAuditTab.vue';
import ProfileAuditTab from '@/components/audit/ProfileAuditTab.vue';
import AccessControlAuditTab from '@/components/audit/AccessControlAuditTab.vue';

const { t } = useI18n();
const route = useRoute();
const activeTab = ref('identity');

onMounted(() => {
  if (route.query.tab && typeof route.query.tab === 'string') {
    activeTab.value = route.query.tab;
  }
});
</script>

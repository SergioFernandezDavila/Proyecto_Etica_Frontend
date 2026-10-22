<template>
  <div class="space-y-6">
    <!-- Filter Card -->
    <div class="app-card p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Role Code Filter -->
        <div class="flex flex-col">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Código de Rol
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"
            >
              <IconLucideShield class="w-4 h-4" />
            </div>
            <input
              v-model="filters.roleCode"
              type="text"
              placeholder="Ej. ADMIN, AGENT..."
              class="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-9 p-2.5 uppercase"
              @keyup.enter="resetAndLoad"
            />
          </div>
        </div>

        <!-- Action Selector -->
        <div class="flex flex-col">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Tipo de Acción
          </label>
          <select
            v-model="filters.action"
            class="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          >
            <option value="">Todas las acciones</option>
            <option value="ROLE_CREATE">ROLE_CREATE (Creación de Rol)</option>
            <option value="ROLE_UPDATE">ROLE_UPDATE (Actualización de Rol)</option>
            <option value="ROLE_DELETE">ROLE_DELETE (Eliminación de Rol)</option>
            <option value="ROLE_MATRIX_UPDATE">ROLE_MATRIX_UPDATE (Actualización de Matriz)</option>
          </select>
        </div>

        <!-- Date Range: From & To -->
        <div class="grid grid-cols-2 gap-2 md:col-span-2">
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Desde
            </label>
            <input
              v-model="filters.from"
              type="date"
              class="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Hasta
            </label>
            <input
              v-model="filters.to"
              type="date"
              class="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 mt-4">
        <fwb-button @click="resetAndLoad" gradient="blue" size="sm">
          <div class="flex items-center gap-2">
            <IconLucideSearch class="w-4 h-4" />
            <span>Filtrar</span>
          </div>
        </fwb-button>
        <fwb-button @click="clearFilters" color="alternative" size="sm">Limpiar filtros</fwb-button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-20">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"
      ></div>
      <p class="mt-2 text-gray-500 text-sm">
        Cargando registros de auditoría de control de acceso...
      </p>
    </div>

    <!-- Table of Audit Logs -->
    <div v-else-if="logs.length > 0" class="overflow-x-auto">
      <fwb-table hoverable class="min-w-full">
        <fwb-table-head>
          <fwb-table-head-cell class="w-44">Fecha y Hora</fwb-table-head-cell>
          <fwb-table-head-cell>Acción</fwb-table-head-cell>
          <fwb-table-head-cell>Rol Afectado</fwb-table-head-cell>
          <fwb-table-head-cell>Responsable</fwb-table-head-cell>
          <fwb-table-head-cell>IP Cliente</fwb-table-head-cell>
          <fwb-table-head-cell>Detalle</fwb-table-head-cell>
          <fwb-table-head-cell>
            <span class="sr-only">Acciones</span>
          </fwb-table-head-cell>
        </fwb-table-head>
        <fwb-table-body>
          <fwb-table-row v-for="log in logs" :key="log.id" class="group">
            <!-- DateTime -->
            <fwb-table-cell
              class="whitespace-nowrap text-[11px] font-mono text-gray-500 dark:text-gray-400"
            >
              {{ formatDateTime(log.timestamp) }}
            </fwb-table-cell>

            <!-- Action Badge -->
            <fwb-table-cell>
              <span
                :class="getActionBadgeClass(log.action)"
                class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-xs"
              >
                {{ getActionLabel(log.action) }}
              </span>
            </fwb-table-cell>

            <!-- Role Affected -->
            <fwb-table-cell>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-xs text-gray-900 dark:text-white">
                  {{ log.roleCode }}
                </span>
                <span
                  v-if="log.roleId && log.roleId !== 'N/A'"
                  class="text-[10px] text-gray-400 font-mono"
                >
                  ({{ log.roleId }})
                </span>
              </div>
            </fwb-table-cell>

            <!-- Responsible User -->
            <fwb-table-cell>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-gray-700 dark:text-gray-200">
                  {{ log.performedByName || log.performedByEmail || log.performedBy }}
                </span>
                <span
                  v-if="log.performedByEmail && log.performedByEmail !== log.performedByName"
                  class="text-[10px] text-gray-400"
                >
                  {{ log.performedByEmail }}
                </span>
              </div>
            </fwb-table-cell>

            <!-- Client IP -->
            <fwb-table-cell
              class="whitespace-nowrap text-[11px] font-mono text-gray-500 dark:text-gray-400"
            >
              {{ log.ipAddress || '--' }}
            </fwb-table-cell>

            <!-- Details Preview -->
            <fwb-table-cell>
              <p
                class="text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate"
                :title="log.details"
              >
                {{ log.details || '--' }}
              </p>
            </fwb-table-cell>

            <!-- View Modal Action -->
            <fwb-table-cell class="text-right">
              <button
                @click="openModal(log)"
                class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer"
                title="Ver detalle del registro"
              >
                <IconLucideEye class="w-4 h-4" />
              </button>
            </fwb-table-cell>
          </fwb-table-row>
        </fwb-table-body>
      </fwb-table>

      <!-- Pagination Component -->
      <Pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total-pages="totalPages"
        :total="totalLogs"
        @change="fetchLogs"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-16 app-card border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl"
    >
      <div
        class="w-12 h-12 mx-auto rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3"
      >
        <IconLucideShieldCheck class="w-6 h-6" />
      </div>
      <h3 class="text-base font-bold text-gray-900 dark:text-white">
        No se encontraron registros de auditoría
      </h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
        Las operaciones de creación, edición, eliminación de roles y cambios en la matriz quedarán
        registradas automáticamente aquí.
      </p>
    </div>

    <!-- Details Modal -->
    <fwb-modal v-if="selectedLog" @close="selectedLog = null" size="xl">
      <template #header>
        <div class="flex items-center gap-3">
          <div :class="getActionBadgeClass(selectedLog.action)" class="p-2 rounded-lg shadow-xs">
            <IconLucideShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold dark:text-white leading-tight">
              {{ getActionLabel(selectedLog.action) }}
            </h3>
            <p class="text-xs text-gray-500 font-mono mt-0.5">
              {{ formatDateTime(selectedLog.timestamp) }}
            </p>
          </div>
        </div>
      </template>

      <template #body>
        <div class="space-y-6">
          <!-- Metadata Cards Grid -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4 app-card p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
          >
            <!-- User -->
            <div class="space-y-1">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Usuario Responsable
              </span>
              <div class="flex items-center gap-2 mt-1">
                <div
                  class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold"
                >
                  {{
                    (selectedLog.performedByName || selectedLog.performedByEmail || 'S')
                      .charAt(0)
                      .toUpperCase()
                  }}
                </div>
                <div>
                  <p class="text-sm font-bold dark:text-white">
                    {{ selectedLog.performedByName || selectedLog.performedBy }}
                  </p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">
                    {{ selectedLog.performedByEmail || '--' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Role Details -->
            <div class="space-y-1">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Rol / Objeto Afectado
              </span>
              <div class="mt-1">
                <p class="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {{ selectedLog.roleCode }}
                </p>
                <p class="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                  ID: {{ selectedLog.roleId }}
                </p>
              </div>
            </div>

            <!-- Client IP -->
            <div class="space-y-1">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Dirección IP de Origen
              </span>
              <p class="text-xs font-mono font-semibold text-gray-800 dark:text-gray-200 mt-1">
                {{ selectedLog.ipAddress || 'UNKNOWN' }}
              </p>
            </div>

            <!-- Action Code -->
            <div class="space-y-1">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Código de Operación
              </span>
              <p class="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                {{ selectedLog.action }}
              </p>
            </div>
          </div>

          <!-- Description / Details -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Detalles del Evento
              </span>
              <div class="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div
              class="app-card p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xs"
            >
              {{ selectedLog.details || 'Sin detalles adicionales.' }}
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end">
          <fwb-button @click="selectedLog = null" color="alternative" size="sm">Cerrar</fwb-button>
        </div>
      </template>
    </fwb-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import {
    accessControlService,
    type AccessControlAuditLog,
    type AccessControlAuditFilters,
  } from '@/services/accessControlService';
  import Pagination from '@/components/ui/Pagination.vue';
  import { formatDateTime } from '@/utils/dateTime';
  import {
    FwbTable,
    FwbTableHead,
    FwbTableHeadCell,
    FwbTableBody,
    FwbTableRow,
    FwbTableCell,
    FwbButton,
    FwbModal,
  } from 'flowbite-vue';
  import IconLucideSearch from '~icons/lucide/search';
  import IconLucideEye from '~icons/lucide/eye';
  import IconLucideShield from '~icons/lucide/shield';
  import IconLucideShieldCheck from '~icons/lucide/shield-check';
  import { handleApiError } from '@/api/errorHandler';

  const logs = ref<AccessControlAuditLog[]>([]);
  const loading = ref(false);
  const selectedLog = ref<AccessControlAuditLog | null>(null);
  const currentPage = ref(0);
  const pageSize = ref(10);
  const totalPages = ref(0);
  const totalLogs = ref(0);

  const filters = ref({
    roleCode: '',
    action: '',
    from: '',
    to: '',
  });

  const getActionLabel = (action: string): string => {
    switch (action) {
      case 'ROLE_CREATE':
        return 'Creación de Rol';
      case 'ROLE_UPDATE':
        return 'Actualización de Rol';
      case 'ROLE_DELETE':
        return 'Eliminación de Rol';
      case 'ROLE_MATRIX_UPDATE':
        return 'Actualización de Matriz';
      default:
        return action;
    }
  };

  const getActionBadgeClass = (action: string): string => {
    switch (action) {
      case 'ROLE_CREATE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'ROLE_UPDATE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'ROLE_DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'ROLE_MATRIX_UPDATE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const fetchLogs = async () => {
    loading.value = true;
    try {
      const queryFilters: AccessControlAuditFilters = {
        page: currentPage.value,
        pageSize: pageSize.value,
      };

      if (filters.value.roleCode.trim()) {
        queryFilters.roleCode = filters.value.roleCode.trim().toUpperCase();
      }
      if (filters.value.action) {
        queryFilters.action = filters.value.action;
      }
      if (filters.value.from) {
        queryFilters.from = new Date(filters.value.from + 'T00:00:00Z').toISOString();
      }
      if (filters.value.to) {
        queryFilters.to = new Date(filters.value.to + 'T23:59:59Z').toISOString();
      }

      const res = await accessControlService.getAuditLogs(queryFilters);
      if (res.data) {
        logs.value = res.data;
      } else {
        logs.value = [];
      }

      if (res.meta) {
        totalLogs.value = res.meta.total ?? 0;
        totalPages.value = Math.ceil(totalLogs.value / pageSize.value);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      loading.value = false;
    }
  };

  const resetAndLoad = () => {
    currentPage.value = 0;
    fetchLogs();
  };

  const clearFilters = () => {
    filters.value = {
      roleCode: '',
      action: '',
      from: '',
      to: '',
    };
    resetAndLoad();
  };

  const openModal = (log: AccessControlAuditLog) => {
    selectedLog.value = log;
  };

  onMounted(fetchLogs);
</script>

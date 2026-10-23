<template>
  <div class="app-page p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="p-2 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            <IconLucideShieldCheck class="w-6 h-6" />
          </span>
          <div>
            <h1 class="text-2xl font-bold dark:text-white">
              Matriz de Roles y Permisos
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Gestión centralizada de control de acceso para el rol Administrador con modelos teóricos MAC, RBAC y DAC.
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- New Role Button (ABM) -->
        <button
          @click="openCreateRoleModal"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800 cursor-pointer"
        >
          <IconLucidePlus class="w-4 h-4" />
          <span>Nuevo Rol</span>
        </button>

        <!-- Audit Center Link -->
        <router-link
          to="/dashboard/admin/audit?tab=access_control"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/50 transition-colors"
          title="Monitoreo de logs de auditoría de control de acceso"
        >
          <IconLucideHistory class="w-4 h-4" />
          <span>Auditoría de Roles</span>
        </router-link>

        <router-link
          to="/dashboard/admin/users"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
          <IconLucideUsers class="w-4 h-4" />
          Usuarios
        </router-link>

        <button
          @click="resetChanges"
          :disabled="!isDirty || saving"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Deshacer cambios no guardados"
        >
          <IconLucideRotateCcw class="w-4 h-4" />
          Restablecer
        </button>

        <button
          @click="saveMatrix"
          :disabled="saving"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-60 cursor-pointer"
        >
          <IconLucideLoader v-if="saving" class="w-4 h-4 animate-spin" />
          <IconLucideSave v-else class="w-4 h-4" />
          <span>{{ saving ? 'Guardando...' : 'Guardar Matriz' }}</span>
          <span
            v-if="isDirty"
            class="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-blue-800 text-blue-100 rounded-full"
          >
            Modificado
          </span>
        </button>
      </div>
    </div>

    <!-- Theoretical Access Control Concepts Card -->
    <div class="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/80 rounded-2xl p-5 border border-blue-100/80 dark:border-gray-700 shadow-xs">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <IconLucideBookOpen class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">
            Fundamentos Teóricos de Control de Acceso
          </h2>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          Asignación requerida por módulo y rol
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- MAC Card -->
        <div class="p-3.5 bg-white/90 dark:bg-gray-800/90 rounded-xl border border-purple-200/80 dark:border-purple-900/40 shadow-xs">
          <div class="flex items-center justify-between mb-1.5">
            <span class="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
              MAC
            </span>
            <span class="text-xs font-medium text-purple-700 dark:text-purple-300">
              Función / Área general
            </span>
          </div>
          <p class="text-xs font-medium text-gray-800 dark:text-gray-200">
            Mandatory Access Control
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Gobernanza central e irrestricta según el área funcional del usuario (ej. Administración general).
          </p>
        </div>

        <!-- RBAC Card -->
        <div class="p-3.5 bg-white/90 dark:bg-gray-800/90 rounded-xl border border-blue-200/80 dark:border-blue-900/40 shadow-xs">
          <div class="flex items-center justify-between mb-1.5">
            <span class="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              RBAC
            </span>
            <span class="text-xs font-medium text-blue-700 dark:text-blue-300">
              Segregación / Restricción de funciones
            </span>
          </div>
          <p class="text-xs font-medium text-gray-800 dark:text-gray-200">
            Role-Based Access Control
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Permisos estrictamente delimitados por el perfil y segregación operativa de funciones (ej. Agentes, Propietarios).
          </p>
        </div>

        <!-- DAC Card -->
        <div class="p-3.5 bg-white/90 dark:bg-gray-800/90 rounded-xl border border-amber-200/80 dark:border-amber-900/40 shadow-xs">
          <div class="flex items-center justify-between mb-1.5">
            <span class="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
              DAC
            </span>
            <span class="text-xs font-medium text-amber-700 dark:text-amber-300">
              Temporal / Puntual
            </span>
          </div>
          <p class="text-xs font-medium text-gray-800 dark:text-gray-200">
            Discretionary Access Control
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Asignación discrecional conferida para contingencias, delegación temporal o accesos puntuales específicos.
          </p>
        </div>
      </div>
    </div>

    <!-- Alert / Toast -->
    <div
      v-if="toast.visible"
      class="p-4 rounded-xl flex items-center justify-between transition-all shadow-sm"
      :class="[
        toast.type === 'success'
          ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
          : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
      ]"
    >
      <div class="flex items-center gap-2">
        <IconLucideCheckCircle v-if="toast.type === 'success'" class="w-5 h-5 text-green-600 dark:text-green-400" />
        <IconLucideAlertCircle v-else class="w-5 h-5 text-red-600 dark:text-red-400" />
        <span class="text-sm font-medium">{{ toast.message }}</span>
      </div>
      <button
        @click="toast.visible = false"
        class="text-xs font-semibold hover:underline opacity-80 cursor-pointer"
      >
        Cerrar
      </button>
    </div>

    <!-- Controls Bar -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Search & Filters -->
      <div class="flex flex-1 items-center gap-3">
        <div class="relative flex-1 max-w-xs">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <IconLucideSearch class="w-4 h-4" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filtrar módulos..."
            class="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <!-- Role Selector Tab Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            v-for="role in rolesList"
            :key="role.roleId"
            @click="selectedRoleCode = role.roleCode"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            :class="[
              selectedRoleCode === role.roleCode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
            ]"
          >
            <span>{{ role.roleName }} ({{ role.roleCode }})</span>
            <span
              v-if="role.roleType === 'SYSTEM'"
              class="text-[10px] opacity-75"
              title="Rol de Sistema protegido"
            >
              🔒
            </span>
          </button>

          <!-- Quick Add Role Pill -->
          <button
            @click="openCreateRoleModal"
            class="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            title="Crear nuevo rol de seguridad"
          >
            <IconLucidePlus class="w-3.5 h-3.5" />
            <span>Nuevo</span>
          </button>
        </div>
      </div>

      <!-- View Switcher -->
      <div class="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-gray-200 dark:border-gray-700">
        <span class="text-xs text-gray-500 dark:text-gray-400">Modo:</span>
        <button
          @click="viewMode = 'role'"
          class="px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          :class="[
            viewMode === 'role'
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300',
          ]"
        >
          Detalle por Rol
        </button>
        <button
          @click="viewMode = 'matrix'"
          class="px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          :class="[
            viewMode === 'matrix'
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300',
          ]"
        >
          Matriz Completa
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-12 text-center text-gray-500">
      <IconLucideLoader class="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
      <p class="text-sm">Cargando matriz de roles y permisos...</p>
    </div>

    <!-- MODE 1: Granular Role View (Selected Role) -->
    <div v-else-if="viewMode === 'role' && currentRole" class="space-y-4">
      <!-- Role Info Banner with ABM Actions -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 flex items-center justify-center font-bold">
            {{ currentRole.roleCode.charAt(0) }}
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-base font-bold text-gray-900 dark:text-white">
                {{ currentRole.roleName }}
              </h3>
              <span class="px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 font-mono">
                {{ currentRole.roleCode }}
              </span>
              <span
                class="px-2 py-0.5 text-xs font-semibold rounded"
                :class="currentRole.roleType === 'SYSTEM' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'"
              >
                {{ currentRole.roleType === 'SYSTEM' ? '🛡️ Rol de Sistema (Protegido)' : 'Personalizado' }}
              </span>
              <span
                class="px-2 py-0.5 text-xs font-semibold rounded"
                :class="currentRole.active ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'"
              >
                {{ currentRole.active ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ currentRole.roleDescription }}
            </p>
          </div>
        </div>

        <!-- ABM & Quick actions for this role -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Edit Role (ABM) -->
          <button
            @click="openEditRoleModal(currentRole)"
            class="px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
            title="Modificar nombre, descripción o estado del rol"
          >
            <IconLucideEdit class="w-3.5 h-3.5" />
            <span>Editar Rol</span>
          </button>

          <!-- Delete Role (ABM) -->
          <button
            v-if="currentRole.roleType === 'CUSTOM'"
            @click="confirmDeleteRole(currentRole)"
            class="px-2.5 py-1 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            title="Eliminar rol personalizado del sistema"
          >
            <IconLucideTrash2 class="w-3.5 h-3.5" />
            <span>Eliminar Rol</span>
          </button>

          <span
            v-else
            class="text-[11px] text-gray-400 dark:text-gray-500 italic px-2 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700"
            title="Los roles del sistema son esenciales y están protegidos contra eliminación"
          >
            🔒 Rol protegido
          </span>

          <div class="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden lg:block"></div>

          <!-- Quick Permissions Buttons -->
          <button
            @click="bulkSetAccessTypeForRole(currentRole.roleId, 'MAC')"
            class="px-2 py-1 text-xs font-medium rounded bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 transition-colors cursor-pointer"
          >
            Todos MAC
          </button>
          <button
            @click="bulkSetAccessTypeForRole(currentRole.roleId, 'RBAC')"
            class="px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 transition-colors cursor-pointer"
          >
            Todos RBAC
          </button>
          <button
            @click="bulkSetAccessTypeForRole(currentRole.roleId, 'DAC')"
            class="px-2 py-1 text-xs font-medium rounded bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 transition-colors cursor-pointer"
          >
            Todos DAC
          </button>
          <button
            @click="grantAllForRole(currentRole.roleId)"
            class="px-2 py-1 text-xs font-medium rounded bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 transition-colors cursor-pointer"
          >
            Activar Todo
          </button>
        </div>
      </div>

      <!-- Modules Table for Current Role (Conceder y Quitar Permisos) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th scope="col" class="py-3 px-4 font-semibold w-1/4">
                  Módulo / Recurso
                </th>
                <th scope="col" class="py-3 px-4 font-semibold w-1/4">
                  Tipo de Acceso (Teórico)
                </th>
                <th scope="col" class="py-3 px-4 font-semibold w-1/3 text-center">
                  Casillas de Acceso (Conceder / Quitar)
                </th>
                <th scope="col" class="py-3 px-4 font-semibold text-right">
                  Acciones Rápidas
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="mod in filteredModules"
                :key="mod.code"
                class="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors"
              >
                <!-- Module Name & Description -->
                <td class="py-3.5 px-4">
                  <div class="flex items-start gap-2.5">
                    <span class="mt-0.5 p-1.5 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      <IconLucideLayers class="w-4 h-4" />
                    </span>
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{{ mod.name }}</span>
                        <span class="text-[11px] px-1.5 py-0.2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded font-mono">
                          {{ mod.code }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {{ mod.description }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Access Type Selector (MAC / RBAC / DAC) -->
                <td class="py-3.5 px-4">
                  <div class="space-y-1.5">
                    <div class="inline-flex rounded-lg shadow-2xs border border-gray-200 dark:border-gray-600 p-0.5 bg-gray-50 dark:bg-gray-700">
                      <button
                        v-for="typeOption in ['MAC', 'RBAC', 'DAC']"
                        :key="typeOption"
                        type="button"
                        @click="setAccessType(currentRole.roleId, mod.code, typeOption as AccessType)"
                        class="px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer"
                        :class="[
                          getAccessType(currentRole.roleId, mod.code) === typeOption
                            ? getAccessTypeBadgeClass(typeOption as AccessType)
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
                        ]"
                        :title="getAccessTypeDefinition(typeOption as AccessType)"
                      >
                        {{ typeOption }}
                      </button>
                    </div>
                    <div class="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full" :class="getAccessTypeDotClass(getAccessType(currentRole.roleId, mod.code))"></span>
                      <span>{{ getAccessTypeDefinition(getAccessType(currentRole.roleId, mod.code)) }}</span>
                    </div>
                  </div>
                </td>

                <!-- Access Checkboxes (create, read, update, delete) -->
                <td class="py-3.5 px-4">
                  <div class="flex items-center justify-center gap-4">
                    <label
                      v-for="act in availableActions"
                      :key="act"
                      class="flex items-center gap-1.5 cursor-pointer select-none text-xs"
                    >
                      <input
                        type="checkbox"
                        :checked="hasAction(currentRole.roleId, mod.code, act)"
                        @change="toggleAction(currentRole.roleId, mod.code, act)"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      />
                      <span
                        class="font-medium"
                        :class="[
                          hasAction(currentRole.roleId, mod.code, act)
                            ? 'text-gray-900 dark:text-white font-semibold'
                            : 'text-gray-500 dark:text-gray-400',
                        ]"
                      >
                        {{ actionLabels[act] || act }}
                      </span>
                    </label>
                  </div>
                </td>

                <!-- Quick Action Buttons for Row -->
                <td class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      @click="grantAllActions(currentRole.roleId, mod.code)"
                      class="px-2 py-1 text-[11px] font-medium text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-950/40 cursor-pointer"
                    >
                      Todos
                    </button>
                    <span class="text-gray-300 dark:text-gray-600">|</span>
                    <button
                      type="button"
                      @click="revokeAllActions(currentRole.roleId, mod.code)"
                      class="px-2 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-950/40 cursor-pointer"
                    >
                      Ninguno
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODE 2: Full Matrix Grid View (All Roles Across All Modules) -->
    <div v-else-if="viewMode === 'matrix'" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th scope="col" class="py-3.5 px-4 font-bold min-w-[200px] sticky left-0 bg-gray-50 dark:bg-gray-750 z-10 shadow-xs">
                Módulo / Rol
              </th>
              <th
                v-for="role in rolesList"
                :key="role.roleId"
                scope="col"
                class="py-3 px-3 font-semibold text-center border-l border-gray-200 dark:border-gray-700 min-w-[220px]"
              >
                <div class="flex items-center justify-center gap-1">
                  <span class="font-bold text-gray-900 dark:text-white">
                    {{ role.roleName }}
                  </span>
                  <span v-if="role.roleType === 'SYSTEM'" class="text-[10px]" title="Rol de Sistema">🔒</span>
                </div>
                <div class="text-[10px] text-gray-500 font-mono">
                  {{ role.roleCode }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="mod in filteredModules"
              :key="mod.code"
              class="hover:bg-gray-50/60 dark:hover:bg-gray-750/50"
            >
              <!-- Module Label -->
              <td class="py-3 px-4 sticky left-0 bg-white dark:bg-gray-800 z-10 shadow-xs">
                <div class="font-bold text-gray-900 dark:text-white">
                  {{ mod.name }}
                </div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400">
                  {{ mod.code }}
                </div>
              </td>

              <!-- Per-Role Cells -->
              <td
                v-for="role in rolesList"
                :key="role.roleId + '-' + mod.code"
                class="py-3 px-3 border-l border-gray-200 dark:border-gray-700 align-top"
              >
                <div class="space-y-2">
                  <!-- Access Type Selector -->
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] text-gray-400 font-medium">Tipo:</span>
                    <select
                      :value="getAccessType(role.roleId, mod.code)"
                      @change="handleSelectAccessType(role.roleId, mod.code, $event)"
                      class="text-[11px] py-0.5 px-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="MAC">MAC (Área general)</option>
                      <option value="RBAC">RBAC (Segregación)</option>
                      <option value="DAC">DAC (Temporal/Puntual)</option>
                    </select>
                  </div>

                  <!-- Actions Checkboxes Pills -->
                  <div class="grid grid-cols-2 gap-1 bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg border border-gray-100 dark:border-gray-600">
                    <label
                      v-for="act in availableActions"
                      :key="act"
                      class="flex items-center gap-1 cursor-pointer select-none text-[11px]"
                    >
                      <input
                        type="checkbox"
                        :checked="hasAction(role.roleId, mod.code, act)"
                        @change="toggleAction(role.roleId, mod.code, act)"
                        class="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-0"
                      />
                      <span
                        :class="[
                          hasAction(role.roleId, mod.code, act)
                            ? 'font-bold text-gray-900 dark:text-white'
                            : 'text-gray-400 dark:text-gray-500',
                        ]"
                      >
                        {{ actionShortLabels[act] || act }}
                      </span>
                    </label>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: Crear Rol (ABM) -->
    <fwb-modal v-if="showCreateRoleModal" @close="showCreateRoleModal = false" size="md">
      <template #header>
        <div class="flex items-center gap-2.5">
          <span class="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <IconLucidePlus class="w-5 h-5" />
          </span>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Crear Nuevo Rol de Seguridad
          </h3>
        </div>
      </template>

      <template #body>
        <form @submit.prevent="handleCreateRole" class="space-y-4">
          <!-- Code -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Código del Rol *
            </label>
            <input
              v-model="createRoleForm.code"
              type="text"
              required
              placeholder="Ej. AUDITOR, SUPERVISOR_ZONA..."
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5 uppercase font-mono"
            />
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Identificador único del rol en mayúsculas sin espacios (ej. AUDITOR_GENERAL).
            </p>
          </div>

          <!-- Name -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Nombre Visible *
            </label>
            <input
              v-model="createRoleForm.name"
              type="text"
              required
              placeholder="Ej. Auditor de Cumplimiento"
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Descripción del Rol *
            </label>
            <textarea
              v-model="createRoleForm.description"
              required
              rows="3"
              placeholder="Descripción de responsabilidades y alcance funcional del rol..."
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5"
            ></textarea>
          </div>

          <!-- Permissions Template -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Plantilla de Permisos Iniciales
            </label>
            <select
              v-model="createRoleForm.template"
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5"
            >
              <option value="EMPTY">Permisos vacíos (configurar en la matriz)</option>
              <option value="AGENT">Clonar base de Agente Inmobiliario</option>
              <option value="CLIENT">Clonar base de Cliente</option>
            </select>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Podrás afinar individualmente cada permiso en la matriz tras la creación.
            </p>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <fwb-button
              type="button"
              @click="showCreateRoleModal = false"
              color="alternative"
              size="sm"
            >
              Cancelar
            </fwb-button>
            <fwb-button
              type="submit"
              :disabled="creatingRole"
              gradient="green"
              size="sm"
            >
              <IconLucideLoader v-if="creatingRole" class="w-4 h-4 animate-spin mr-1.5" />
              <span>{{ creatingRole ? 'Creando...' : 'Crear y Configurar' }}</span>
            </fwb-button>
          </div>
        </form>
      </template>
    </fwb-modal>

    <!-- MODAL: Editar Rol (ABM) -->
    <fwb-modal v-if="showEditRoleModal" @close="showEditRoleModal = false" size="md">
      <template #header>
        <div class="flex items-center gap-2.5">
          <span class="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            <IconLucideEdit class="w-5 h-5" />
          </span>
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Modificar Rol: {{ editRoleForm.code }}
            </h3>
            <span
              v-if="editRoleForm.roleType === 'SYSTEM'"
              class="text-[10px] text-purple-600 dark:text-purple-400 font-semibold"
            >
              Rol de Sistema (Código protegido)
            </span>
          </div>
        </div>
      </template>

      <template #body>
        <form @submit.prevent="handleUpdateRole" class="space-y-4">
          <!-- Code (Readonly) -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Código del Rol (No modificable)
            </label>
            <input
              :value="editRoleForm.code"
              disabled
              class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm rounded-lg p-2.5 font-mono cursor-not-allowed"
            />
          </div>

          <!-- Name -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Nombre Visible *
            </label>
            <input
              v-model="editRoleForm.name"
              type="text"
              required
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Descripción del Rol *
            </label>
            <textarea
              v-model="editRoleForm.description"
              required
              rows="3"
              class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>

          <!-- Active Checkbox -->
          <div class="flex items-center gap-2 pt-1">
            <input
              id="edit-role-active"
              v-model="editRoleForm.active"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
            />
            <label for="edit-role-active" class="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
              Rol Activo en el Sistema
            </label>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <fwb-button
              type="button"
              @click="showEditRoleModal = false"
              color="alternative"
              size="sm"
            >
              Cancelar
            </fwb-button>
            <fwb-button
              type="submit"
              :disabled="updatingRole"
              gradient="blue"
              size="sm"
            >
              <IconLucideLoader v-if="updatingRole" class="w-4 h-4 animate-spin mr-1.5" />
              <span>{{ updatingRole ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </fwb-button>
          </div>
        </form>
      </template>
    </fwb-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import {
  accessControlService,
  type RoleMatrixData,
  type AccessType,
  type RoleMatrixRow,
  type ModuleInfo,
  type RoleMatrixBatchUpdatePayload,
  type PermissionEntry,
} from '@/services/accessControlService';
import { handleApiError } from '@/api/errorHandler';
import { FwbModal, FwbButton } from 'flowbite-vue';

// Icons
import IconLucideShieldCheck from '~icons/lucide/shield-check';
import IconLucideUsers from '~icons/lucide/users';
import IconLucideSave from '~icons/lucide/save';
import IconLucideRotateCcw from '~icons/lucide/rotate-ccw';
import IconLucideSearch from '~icons/lucide/search';
import IconLucideLoader from '~icons/lucide/loader';
import IconLucideCheckCircle from '~icons/lucide/check-circle';
import IconLucideAlertCircle from '~icons/lucide/alert-circle';
import IconLucideBookOpen from '~icons/lucide/book-open';
import IconLucideLayers from '~icons/lucide/layers';
import IconLucidePlus from '~icons/lucide/plus';
import IconLucideEdit from '~icons/lucide/edit';
import IconLucideTrash2 from '~icons/lucide/trash-2';
import IconLucideHistory from '~icons/lucide/history';

const loading = ref(true);
const saving = ref(false);
const searchQuery = ref('');
const viewMode = ref<'role' | 'matrix'>('role');
const isDirty = ref(false);

const matrixData = ref<RoleMatrixData | null>(null);
const originalState = ref<string>('');

const selectedRoleCode = ref('ADMIN');

// ABM Modal States
const showCreateRoleModal = ref(false);
const creatingRole = ref(false);
const createRoleForm = ref({
  code: '',
  name: '',
  description: '',
  template: 'EMPTY',
});

const showEditRoleModal = ref(false);
const updatingRole = ref(false);
const editRoleForm = ref({
  id: '',
  code: '',
  name: '',
  description: '',
  active: true,
  roleType: 'CUSTOM',
});

const toast = ref<{ visible: boolean; message: string; type: 'success' | 'error' }>({
  visible: false,
  message: '',
  type: 'success',
});

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { visible: true, message, type };
  setTimeout(() => {
    toast.value.visible = false;
  }, 5000);
};

const actionLabels: Record<string, string> = {
  create: 'Crear',
  read: 'Leer / Consultar',
  update: 'Editar / Modificar',
  delete: 'Eliminar / Baja',
};

const actionShortLabels: Record<string, string> = {
  create: 'Crear',
  read: 'Leer',
  update: 'Editar',
  delete: 'Borrar',
};

// Fallback modules if backend has not yet seeded
const defaultModules: ModuleInfo[] = [
  { code: 'users', name: 'Agentes y Usuarios', description: 'Gestión de usuarios, empleados, propietarios y clientes', category: 'Administración' },
  { code: 'properties', name: 'Propiedades e Inventario', description: 'Catálogo, fichas técnicas y estados de inmuebles', category: 'Inmobiliaria' },
  { code: 'visits', name: 'Calendario y Visitas', description: 'Agendamiento, disponibilidad y confirmación de visitas', category: 'Operaciones' },
  { code: 'operations', name: 'Operaciones y Ventas', description: 'Transacciones comerciales, alquileres y compras', category: 'Operaciones' },
  { code: 'contracts', name: 'Contratos Legales', description: 'Generación y control de versiones de contratos', category: 'Legal' },
  { code: 'vehicles', name: 'Gestión Vehicular', description: 'Flota vehicular corporativa y registros de uso', category: 'Logística' },
  { code: 'audit', name: 'Auditoría y Trazabilidad', description: 'Registro inmutable de acciones y eventos del sistema', category: 'Gobernanza' },
  { code: 'reports', name: 'Reportes y Métricas', description: 'Estadísticas, rankings y reportes gerenciales', category: 'Inteligencia' },
  { code: 'notifications', name: 'Notificaciones y Alertas', description: 'Centro de notificaciones y configuración de alertas', category: 'Comunicación' },
];

const availableActions = computed(() => {
  return matrixData.value?.availableActions || ['create', 'read', 'update', 'delete'];
});

const rolesList = computed(() => {
  return matrixData.value?.roles || [];
});

const currentRole = computed(() => {
  return rolesList.value.find((r) => r.roleCode === selectedRoleCode.value) || rolesList.value[0];
});

const allModules = computed<ModuleInfo[]>(() => {
  return matrixData.value?.modules?.length ? matrixData.value.modules : defaultModules;
});

const filteredModules = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return allModules.value;
  return allModules.value.filter(
    (m) =>
      m.name.toLowerCase().includes(query) ||
      m.code.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query)
  );
});

// Load matrix from access-control-service
const loadMatrix = async () => {
  loading.value = true;
  try {
    const data = await accessControlService.getMatrix();
    matrixData.value = data;
    if (data.roles?.length && !rolesList.value.some((r) => r.roleCode === selectedRoleCode.value)) {
      selectedRoleCode.value = data.roles[0].roleCode;
    }
    originalState.value = JSON.stringify(data);
    isDirty.value = false;
  } catch (error) {
    console.error('Error fetching role matrix, generating fallback:', error);
    matrixData.value = createDefaultMatrixState();
    originalState.value = JSON.stringify(matrixData.value);
    isDirty.value = false;
  } finally {
    loading.value = false;
  }
};

const createDefaultMatrixState = (): RoleMatrixData => {
  return {
    modules: defaultModules,
    availableActions: ['create', 'read', 'update', 'delete'],
    accessTypes: [
      { code: 'MAC', name: 'MAC (Mandatory Access Control)', theoreticalDefinition: 'Función / Área general', description: 'Control de acceso obligatorio y centralizado' },
      { code: 'RBAC', name: 'RBAC (Role-Based Access Control)', theoreticalDefinition: 'Segregación / Restricción de funciones', description: 'Control de acceso basado en roles' },
      { code: 'DAC', name: 'DAC (Discretionary Access Control)', theoreticalDefinition: 'Temporal / Puntual', description: 'Control de acceso discrecional y temporal' },
    ],
    roles: [
      {
        roleId: 'rol_admin',
        roleCode: 'ADMIN',
        roleName: 'Administrador General',
        roleDescription: 'Acceso de gobierno general del sistema (MAC)',
        roleType: 'SYSTEM',
        active: true,
        moduleAccess: defaultModules.reduce((acc, mod) => {
          acc[mod.code] = {
            resource: mod.code,
            accessType: 'MAC',
            actions: ['create', 'read', 'update', 'delete'],
          };
          return acc;
        }, {} as Record<string, { resource: string; accessType: AccessType; actions: string[] }>),
      },
      {
        roleId: 'rol_agent',
        roleCode: 'AGENT',
        roleName: 'Agente Inmobiliario',
        roleDescription: 'Gestión operativa y visitas de propiedades (RBAC)',
        roleType: 'SYSTEM',
        active: true,
        moduleAccess: {
          properties: { resource: 'properties', accessType: 'RBAC', actions: ['create', 'read', 'update'] },
          visits: { resource: 'visits', accessType: 'RBAC', actions: ['create', 'read', 'update'] },
          users: { resource: 'users', accessType: 'RBAC', actions: ['read', 'create'] },
          operations: { resource: 'operations', accessType: 'RBAC', actions: ['read', 'create'] },
        },
      },
    ],
  };
};

// Access Type Helpers
const getAccessType = (roleId: string, moduleCode: string): AccessType => {
  const role = rolesList.value.find((r) => r.roleId === roleId);
  if (!role || !role.moduleAccess) return 'RBAC';
  const access = role.moduleAccess[moduleCode];
  if (access && access.accessType) return access.accessType;
  return role.roleCode === 'ADMIN' ? 'MAC' : 'RBAC';
};

const setAccessType = (roleId: string, moduleCode: string, accessType: AccessType) => {
  const role = rolesList.value.find((r) => r.roleId === roleId);
  if (!role) return;

  if (!role.moduleAccess) {
    role.moduleAccess = {};
  }
  if (!role.moduleAccess[moduleCode]) {
    role.moduleAccess[moduleCode] = {
      resource: moduleCode,
      accessType,
      actions: ['read'],
    };
  } else {
    role.moduleAccess[moduleCode].accessType = accessType;
  }
  isDirty.value = true;
};

const handleSelectAccessType = (roleId: string, moduleCode: string, event: Event) => {
  const target = event.target as HTMLSelectElement;
  setAccessType(roleId, moduleCode, target.value as AccessType);
};

const getAccessTypeDefinition = (type: AccessType): string => {
  switch (type) {
    case 'MAC':
      return 'Función / Área general';
    case 'RBAC':
      return 'Segregación / Restricción de funciones';
    case 'DAC':
      return 'Temporal / Puntual';
    default:
      return type;
  }
};

const getAccessTypeBadgeClass = (type: AccessType): string => {
  switch (type) {
    case 'MAC':
      return 'bg-purple-600 text-white shadow-xs';
    case 'RBAC':
      return 'bg-blue-600 text-white shadow-xs';
    case 'DAC':
      return 'bg-amber-600 text-white shadow-xs';
    default:
      return 'bg-gray-700 text-white';
  }
};

const getAccessTypeDotClass = (type: AccessType): string => {
  switch (type) {
    case 'MAC':
      return 'bg-purple-500';
    case 'RBAC':
      return 'bg-blue-500';
    case 'DAC':
      return 'bg-amber-500';
    default:
      return 'bg-gray-400';
  }
};

// Action Checkbox Helpers
const hasAction = (roleId: string, moduleCode: string, action: string): boolean => {
  const role = rolesList.value.find((r) => r.roleId === roleId);
  if (!role || !role.moduleAccess) return false;
  const access = role.moduleAccess[moduleCode];
  return Boolean(access && access.actions && access.actions.includes(action));
};

const toggleAction = (roleId: string, moduleCode: string, action: string) => {
  const role = rolesList.value.find((r) => r.roleId === roleId);
  if (!role) return;

  if (!role.moduleAccess) {
    role.moduleAccess = {};
  }
  if (!role.moduleAccess[moduleCode]) {
    const defaultType: AccessType = role.roleCode === 'ADMIN' ? 'MAC' : 'RBAC';
    role.moduleAccess[moduleCode] = {
      resource: moduleCode,
      accessType: defaultType,
      actions: [action],
    };
  } else {
    const currentActions = role.moduleAccess[moduleCode].actions || [];
    if (currentActions.includes(action)) {
      role.moduleAccess[moduleCode].actions = currentActions.filter((a) => a !== action);
    } else {
      role.moduleAccess[moduleCode].actions = [...currentActions, action];
    }
  }
  isDirty.value = true;
};

const grantAllActions = (roleId: string, moduleCode: string) => {
  const role = rolesList.value.find((r) => r.roleId === roleId);
  if (!role) return;

  const defaultType: AccessType = getAccessType(roleId, moduleCode);
  if (!role.moduleAccess) role.moduleAccess = {};
  role.moduleAccess[moduleCode] = {
    resource: moduleCode,
    accessType: defaultType,
    actions: [...availableActions.value],
  };
  isDirty.value = true;
};

const revokeAllActions = (roleId: string, moduleCode: string) => {
  const role = rolesList.value.find((r) => r.roleId === roleId);
  if (!role || !role.moduleAccess || !role.moduleAccess[moduleCode]) return;

  role.moduleAccess[moduleCode].actions = [];
  isDirty.value = true;
};

// Bulk Helpers
const bulkSetAccessTypeForRole = (roleId: string, accessType: AccessType) => {
  const role = rolesList.value.find((r) => r.roleId === roleId);
  if (!role) return;

  if (!role.moduleAccess) role.moduleAccess = {};
  allModules.value.forEach((m) => {
    if (!role.moduleAccess[m.code]) {
      role.moduleAccess[m.code] = {
        resource: m.code,
        accessType,
        actions: ['read'],
      };
    } else {
      role.moduleAccess[m.code].accessType = accessType;
    }
  });
  isDirty.value = true;
};

const grantAllForRole = (roleId: string) => {
  const role = rolesList.value.find((r) => r.roleId === roleId);
  if (!role) return;

  if (!role.moduleAccess) role.moduleAccess = {};
  allModules.value.forEach((m) => {
    const currentType = getAccessType(roleId, m.code);
    role.moduleAccess[m.code] = {
      resource: m.code,
      accessType: currentType,
      actions: [...availableActions.value],
    };
  });
  isDirty.value = true;
};

const resetChanges = () => {
  if (originalState.value) {
    matrixData.value = JSON.parse(originalState.value);
    isDirty.value = false;
    showToast('Cambios revertidos al estado original', 'success');
  }
};

// Save Matrix Handler
const saveMatrix = async () => {
  if (!matrixData.value) return;

  saving.value = true;
  try {
    const payload: RoleMatrixBatchUpdatePayload = {
      updates: rolesList.value.map((role: RoleMatrixRow) => {
        const modulesUpdates = Object.entries(role.moduleAccess || {}).map(([resource, access]) => ({
          resource,
          accessType: access.accessType || 'RBAC',
          actions: access.actions || [],
        }));

        return {
          roleId: role.roleId,
          modules: modulesUpdates,
        };
      }),
    };

    const updated = await accessControlService.updateMatrix(payload);
    if (updated) {
      matrixData.value = updated;
    }
    originalState.value = JSON.stringify(matrixData.value);
    isDirty.value = false;
    showToast('¡Matriz de roles y permisos guardada exitosamente!', 'success');
  } catch (error) {
    console.error('Error saving matrix:', error);
    showToast('Error al guardar la matriz de permisos. Por favor intente nuevamente.', 'error');
  } finally {
    saving.value = false;
  }
};

// --- ABM METHODS ---

const openCreateRoleModal = () => {
  createRoleForm.value = {
    code: '',
    name: '',
    description: '',
    template: 'EMPTY',
  };
  showCreateRoleModal.value = true;
};

const handleCreateRole = async () => {
  const code = createRoleForm.value.code.trim().toUpperCase();
  const name = createRoleForm.value.name.trim();
  const description = createRoleForm.value.description.trim();

  if (!code || !name) {
    showToast('El código y el nombre del rol son obligatorios', 'error');
    return;
  }

  creatingRole.value = true;
  try {
    const initialPermissions: PermissionEntry[] = [];

    if (createRoleForm.value.template === 'AGENT') {
      const agentRole = rolesList.value.find((r) => r.roleCode === 'AGENT');
      if (agentRole && agentRole.moduleAccess) {
        Object.entries(agentRole.moduleAccess).forEach(([resource, acc]) => {
          (acc.actions || []).forEach((act) => {
            initialPermissions.push({
              resource,
              action: act,
              scope: 'ANY',
              accessType: acc.accessType || 'RBAC',
            });
          });
        });
      }
    } else if (createRoleForm.value.template === 'CLIENT') {
      initialPermissions.push(
        { resource: 'properties', action: 'read', scope: 'ANY', accessType: 'RBAC' },
        { resource: 'visits', action: 'create', scope: 'OWN', accessType: 'RBAC' }
      );
    }

    const created = await accessControlService.createRole({
      code,
      name,
      description,
      permissions: initialPermissions,
    });

    showCreateRoleModal.value = false;
    showToast(`Rol "${created.name}" (${created.code}) creado exitosamente`, 'success');

    // Reload matrix to include the newly created role
    await loadMatrix();
    selectedRoleCode.value = created.code;
  } catch (error) {
    handleApiError(error);
  } finally {
    creatingRole.value = false;
  }
};

const openEditRoleModal = (role: RoleMatrixRow) => {
  editRoleForm.value = {
    id: role.roleId,
    code: role.roleCode,
    name: role.roleName,
    description: role.roleDescription,
    active: role.active !== false,
    roleType: role.roleType,
  };
  showEditRoleModal.value = true;
};

const handleUpdateRole = async () => {
  const name = editRoleForm.value.name.trim();
  const description = editRoleForm.value.description.trim();

  if (!name) {
    showToast('El nombre del rol es obligatorio', 'error');
    return;
  }

  updatingRole.value = true;
  try {
    await accessControlService.updateRole(editRoleForm.value.id, {
      name,
      description,
      active: editRoleForm.value.active,
    });

    showEditRoleModal.value = false;
    showToast(`Rol "${name}" actualizado exitosamente`, 'success');

    await loadMatrix();
  } catch (error) {
    handleApiError(error);
  } finally {
    updatingRole.value = false;
  }
};

const confirmDeleteRole = async (role: RoleMatrixRow) => {
  if (role.roleType === 'SYSTEM') {
    Swal.fire({
      icon: 'error',
      title: 'Acción No Permitida',
      text: 'Los roles reservados del sistema (ADMIN, AGENT, OWNER, INTERESTED_CLIENT) están protegidos y no pueden eliminarse.',
      confirmButtonColor: '#2563eb',
    });
    return;
  }

  const result = await Swal.fire({
    title: '¿Eliminar Rol?',
    html: `¿Estás seguro de que deseas eliminar permanentemente el rol <strong>${role.roleName}</strong> (<code>${role.roleCode}</code>)?<br/><br/><span style="font-size: 0.85em; color: #ef4444;">Esta acción removerá el rol y todas sus asignaciones en el sistema.</span>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    focusCancel: true,
  });

  if (result.isConfirmed) {
    try {
      await accessControlService.deleteRole(role.roleId);
      showToast(`Rol "${role.roleName}" eliminado exitosamente`, 'success');
      await loadMatrix();
      selectedRoleCode.value = 'ADMIN';
    } catch (error) {
      handleApiError(error);
    }
  }
};

onMounted(loadMatrix);
</script>

<style scoped>
.shadow-2xs {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>

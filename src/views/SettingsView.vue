<template>
  <div class="p-6 max-w-4xl mx-auto space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 dark:border-gray-700/80 pb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
          <IconLucideSettings class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          Preferencias de Usuario
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gestiona los datos de tu cuenta, opciones de privacidad y seguridad.
        </p>
      </div>

      <!-- Quick status indicator -->
      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          :class="twoFactorEnabled ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'"
        >
          <span class="w-2 h-2 rounded-full" :class="twoFactorEnabled ? 'bg-emerald-500' : 'bg-amber-500'"></span>
          {{ twoFactorEnabled ? '2FA Protegido' : '2FA Desactivado' }}
        </span>
      </div>
    </div>

    <!-- Alert / Toast Messages -->
    <div
      v-if="statusMessage"
      class="p-4 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm transition-all"
      :class="statusMessage.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200' : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-800 dark:text-red-200'"
    >
      <div class="flex items-center gap-2">
        <IconLucideCheck v-if="statusMessage.type === 'success'" class="w-5 h-5 flex-shrink-0" />
        <IconLucideAlertTriangle v-else class="w-5 h-5 flex-shrink-0" />
        <span>{{ statusMessage.text }}</span>
      </div>
      <button @click="statusMessage = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
        <IconLucideX class="w-4 h-4" />
      </button>
    </div>

    <!-- Section 1: User Profile Summary -->
    <div class="app-card rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
        <IconLucideUser class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        Información del Perfil
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-gray-50 dark:bg-gray-750/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Nombre de Usuario</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
            {{ userProfile?.fullName || authStore.user?.fullName || authStore.user?.name || 'Usuario' }}
          </p>
        </div>

        <div class="bg-gray-50 dark:bg-gray-750/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Correo Electrónico</p>
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 truncate">
            {{ userProfile?.email || authStore.user?.email || 'No registrado' }}
          </p>
        </div>

        <div class="bg-gray-50 dark:bg-gray-750/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Rol en el Sistema</p>
          <span class="inline-block mt-1 text-xs px-2 py-0.5 font-bold rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 uppercase">
            {{ userProfile?.userType || authStore.user?.userType || authStore.userRole || 'USUARIO' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Section 2: Privacy and Security (2FA) -->
    <div class="app-card rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800 space-y-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <IconLucideShieldCheck class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Privacidad y Seguridad
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Controla los mecanismos de verificación de identidad para acceder a la plataforma.
          </p>
        </div>
      </div>

      <div class="border-t border-gray-100 dark:border-gray-700/60 pt-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 rounded-2xl bg-gray-50/80 dark:bg-gray-900/40 border border-gray-200/80 dark:border-gray-700/60">
          <!-- Description & Status -->
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
              :class="twoFactorEnabled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'"
            >
              <IconLucideSmartphone class="w-6 h-6" />
            </div>

            <div>
              <div class="flex items-center gap-2.5">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                  Autenticación de 2 Factores (2FA - TOTP)
                </h3>
                <span
                  class="px-2 py-0.5 rounded text-[11px] font-bold"
                  :class="twoFactorEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
                >
                  {{ twoFactorEnabled ? 'ACTIVO' : 'INACTIVO' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                Al iniciar sesión, se solicitará un código de 6 dígitos generado por tu aplicación móvil
                (<span class="font-medium text-gray-700 dark:text-gray-300">Google Authenticator</span> o
                <span class="font-medium text-gray-700 dark:text-gray-300">Microsoft Authenticator</span>).
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex-shrink-0">
            <button
              v-if="!twoFactorEnabled"
              @click="openSetupModal"
              :disabled="loading"
              class="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <IconLucideLock class="w-4 h-4" />
              Activar 2FA
            </button>

            <button
              v-else
              @click="openDisableModal"
              :disabled="loading"
              class="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 active:scale-95 transition-all border border-red-200 dark:border-red-900/50 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <IconLucideUnlock class="w-4 h-4" />
              Desactivar 2FA
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 1: Setup 2FA (QR Code & Confirm) -->
    <fwb-modal v-if="showSetupModal" @close="closeSetupModal">
      <template #header>
        <div class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <IconLucideQrCode class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Configurar Autenticación de Dos Factores
        </div>
      </template>

      <template #body>
        <div class="space-y-6">
          <p class="text-xs text-gray-600 dark:text-gray-300">
            Sigue estos pasos con tu aplicación móvil de autenticación
            (ej. <strong>Google Authenticator</strong> o <strong>Microsoft Authenticator</strong>):
          </p>

          <!-- Step 1: Scan QR Code -->
          <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/60 text-center space-y-3">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Paso 1: Escanea este código QR con la app
            </p>

            <div v-if="setupData?.qrCodeDataUri" class="flex justify-center p-2">
              <img
                :src="setupData.qrCodeDataUri"
                alt="Código QR 2FA"
                class="w-48 h-48 rounded-xl border border-gray-200 dark:border-gray-700 p-2 bg-white shadow-sm"
              />
            </div>
            <div v-else class="h-48 flex items-center justify-center text-sm text-gray-400">
              Generando código QR...
            </div>

            <!-- Manual secret fallback -->
            <div class="pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
              <p class="text-[11px] text-gray-500 dark:text-gray-400">
                ¿No puedes escanear? Ingresa esta clave secreta manualmente:
              </p>
              <div class="mt-1 flex items-center justify-center gap-2">
                <code class="px-2.5 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                  {{ setupData?.secretKey }}
                </code>
                <button
                  type="button"
                  @click="copySecretKey"
                  class="p-1 rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                  :title="copied ? '¡Copiado!' : 'Copiar clave'"
                >
                  <IconLucideCheck v-if="copied" class="w-4 h-4 text-emerald-500" />
                  <IconLucideCopy v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Step 2: Verification Code -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Paso 2: Ingresa el código de 6 dígitos que muestra tu app
            </label>
            <input
              v-model="verificationCode"
              type="text"
              maxlength="6"
              placeholder="123456"
              inputmode="numeric"
              autocomplete="one-time-code"
              class="w-full text-center text-2xl font-mono tracking-widest font-bold py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              @keydown.enter.prevent="handleConfirmSetup"
            />
            <p v-if="setupError" class="text-xs text-red-600 dark:text-red-400 mt-1">
              {{ setupError }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <fwb-button color="alternative" @click="closeSetupModal">
            Cancelar
          </fwb-button>
          <fwb-button
            gradient="blue"
            :disabled="verificationCode.length !== 6 || actionLoading"
            @click="handleConfirmSetup"
          >
            {{ actionLoading ? 'Verificando...' : 'Verificar y Activar' }}
          </fwb-button>
        </div>
      </template>
    </fwb-modal>

    <!-- Modal 2: Disable 2FA -->
    <fwb-modal v-if="showDisableModal" @close="closeDisableModal">
      <template #header>
        <div class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <IconLucideUnlock class="w-5 h-5 text-red-600 dark:text-red-400" />
          Desactivar Autenticación de Dos Factores
        </div>
      </template>

      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Para confirmar la desactivación del 2FA, ingresa el código de 6 dígitos que muestra tu aplicación autenticadora.
          </p>

          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Código de autenticación (6 dígitos)
            </label>
            <input
              v-model="disableCode"
              type="text"
              maxlength="6"
              placeholder="123456"
              inputmode="numeric"
              class="w-full text-center text-2xl font-mono tracking-widest font-bold py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              @keydown.enter.prevent="handleConfirmDisable"
            />
            <p v-if="disableError" class="text-xs text-red-600 dark:text-red-400 mt-1">
              {{ disableError }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <fwb-button color="alternative" @click="closeDisableModal">
            Cancelar
          </fwb-button>
          <fwb-button
            color="red"
            :disabled="disableCode.length !== 6 || actionLoading"
            @click="handleConfirmDisable"
          >
            {{ actionLoading ? 'Desactivando...' : 'Confirmar y Desactivar' }}
          </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/modules/auth';
import { authService } from '@/modules/auth/services';
import { userService } from '@/services/userService';
import type { User } from '@/types/user';
import { FwbModal, FwbButton } from 'flowbite-vue';

// Icons
import IconLucideSettings from '~icons/lucide/settings';
import IconLucideShieldCheck from '~icons/lucide/shield-check';
import IconLucideUser from '~icons/lucide/user';
import IconLucideLock from '~icons/lucide/lock';
import IconLucideUnlock from '~icons/lucide/unlock';
import IconLucideSmartphone from '~icons/lucide/smartphone';
import IconLucideQrCode from '~icons/lucide/qr-code';
import IconLucideCopy from '~icons/lucide/copy';
import IconLucideCheck from '~icons/lucide/check';
import IconLucideAlertTriangle from '~icons/lucide/alert-triangle';
import IconLucideX from '~icons/lucide/x';

const authStore = useAuthStore();
const userProfile = ref<User | null>(null);
const twoFactorEnabled = ref(false);
const loading = ref(false);
const actionLoading = ref(false);
const statusMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null);

// Setup Modal State
const showSetupModal = ref(false);
const setupData = ref<{ secretKey: string; qrCodeDataUri: string; otpAuthUrl: string } | null>(null);
const verificationCode = ref('');
const setupError = ref('');
const copied = ref(false);

// Disable Modal State
const showDisableModal = ref(false);
const disableCode = ref('');
const disableError = ref('');

const loadUserData = async () => {
  const currentUserId = (authStore.user?.id || authStore.user?.userId || authStore.user?.sub) as string;
  if (!currentUserId) return;

  try {
    loading.value = true;
    const res = await userService.getUserById(currentUserId);
    if (res?.data) {
      userProfile.value = res.data;
      twoFactorEnabled.value = Boolean(res.data.twoFactorEnabled);
    }
  } catch (err) {
    console.warn('Could not load detailed user profile', err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadUserData();
});

const openSetupModal = async () => {
  setupError.value = '';
  verificationCode.value = '';
  copied.value = false;
  try {
    actionLoading.value = true;
    const res = await authService.setupTwoFactor();
    setupData.value = res;
    showSetupModal.value = true;
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
    showMessage('error', errorObj.response?.data?.message || 'Error al iniciar la configuración de 2FA');
  } finally {
    actionLoading.value = false;
  }
};

const closeSetupModal = () => {
  showSetupModal.value = false;
  setupData.value = null;
  verificationCode.value = '';
  setupError.value = '';
};

const copySecretKey = async () => {
  if (setupData.value?.secretKey) {
    await navigator.clipboard.writeText(setupData.value.secretKey);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  }
};

const handleConfirmSetup = async () => {
  if (verificationCode.value.length !== 6) {
    setupError.value = 'El código debe tener 6 dígitos';
    return;
  }

  setupError.value = '';
  try {
    actionLoading.value = true;
    await authService.confirmTwoFactor(verificationCode.value);
    twoFactorEnabled.value = true;
    closeSetupModal();
    showMessage('success', '¡Autenticación de 2 Factores activada exitosamente!');
    await loadUserData();
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
    setupError.value = errorObj.response?.data?.message || 'Código inválido. Verifica tu app e intenta de nuevo.';
  } finally {
    actionLoading.value = false;
  }
};

const openDisableModal = () => {
  disableError.value = '';
  disableCode.value = '';
  showDisableModal.value = true;
};

const closeDisableModal = () => {
  showDisableModal.value = false;
  disableCode.value = '';
  disableError.value = '';
};

const handleConfirmDisable = async () => {
  if (disableCode.value.length !== 6) {
    disableError.value = 'El código debe tener 6 dígitos';
    return;
  }

  disableError.value = '';
  try {
    actionLoading.value = true;
    await authService.disableTwoFactor(disableCode.value);
    twoFactorEnabled.value = false;
    closeDisableModal();
    showMessage('success', 'La Autenticación de 2 Factores ha sido desactivada.');
    await loadUserData();
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
    disableError.value = errorObj.response?.data?.message || 'Código inválido. No se pudo desactivar el 2FA.';
  } finally {
    actionLoading.value = false;
  }
};

const showMessage = (type: 'success' | 'error', text: string) => {
  statusMessage.value = { type, text };
  setTimeout(() => {
    if (statusMessage.value?.text === text) {
      statusMessage.value = null;
    }
  }, 6000);
};
</script>

<template>
  <div class="h-screen flex items-center justify-center p-4 relative">
    <div class="absolute top-4 right-4">
      <theme-toggle />
    </div>

    <div
      v-if="errorMessage"
      class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
    >
      {{ errorMessage }}
    </div>

    <login-form v-if="!showChangePassword && !showMfa" @submit="handleLogin" />

    <!-- MFA Modal -->
    <fwb-modal v-if="showMfa" @close="handleCancelMfa">
      <template #header>
        <div class="flex items-center gap-2 text-lg font-bold dark:text-white">
          <IconLucideShieldCheck class="w-6 h-6 text-blue-600" />
          Verificación en Dos Pasos (MFA)
        </div>
      </template>
      <template #body>
        <form @submit.prevent="handleVerifyMfa" class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            Se ha enviado un código de verificación de 6 dígitos a su correo electrónico:
            <strong class="text-blue-600 dark:text-blue-400 font-mono">{{ mfaEmail }}</strong>.
          </p>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Código de Verificación (OTP)
            </label>
            <input
              v-model="mfaCode"
              type="text"
              maxlength="6"
              placeholder="000000"
              class="w-full text-center tracking-widest text-2xl font-mono p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
              autofocus
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            El código vence en 5 minutos. Si no lo visualiza en su bandeja principal, revise su carpeta de spam.
          </p>
          <div class="flex justify-end space-x-3 pt-4">
            <fwb-button color="alternative" @click="handleCancelMfa">
              {{ t('auth.cancel') }}
            </fwb-button>
            <fwb-button type="submit" gradient="blue" :disabled="mfaLoading || mfaCode.length < 6">
              <span v-if="mfaLoading">Verificando...</span>
              <span v-else>Verificar e Ingresar</span>
            </fwb-button>
          </div>
        </form>
      </template>
    </fwb-modal>

    <fwb-modal v-if="showChangePassword" @close="handleCancelChange">
      <template #header>
        <div class="text-lg font-bold">{{ t('auth.changePasswordTitle') }}</div>
      </template>
      <template #body>
        <form @submit.prevent="onPasswordSubmit" class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('auth.changePasswordInfo') }}
          </p>
          <fwb-input
            v-model="currentPassword"
            :label="t('auth.currentPassword')"
            type="password"
            :validation-status="errors.currentPassword ? 'error' : undefined"
            :validation-message="errors.currentPassword"
          />
          <fwb-input
            v-model="newPassword"
            :label="t('auth.newPassword')"
            type="password"
            :validation-status="errors.newPassword ? 'error' : undefined"
            :validation-message="errors.newPassword"
          />
          <fwb-input
            v-model="confirmPassword"
            :label="t('auth.confirmPassword')"
            type="password"
            :validation-status="errors.confirmPassword ? 'error' : undefined"
            :validation-message="errors.confirmPassword"
          />
          <div class="flex justify-end space-x-3 pt-4">
            <fwb-button color="alternative" @click="handleCancelChange">
              {{ t('auth.cancel') }}
            </fwb-button>
            <fwb-button type="submit" gradient="blue">{{
              t('auth.changePassword')
            }}</fwb-button>
          </div>
        </form>
      </template>
    </fwb-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useAuthStore, type UserClaims, authService } from '@/modules/auth';
import LoginForm from '@/components/auth/LoginForm.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import IconLucideShieldCheck from '~icons/lucide/shield-check';
import {
  loginSchema,
  changePasswordSchema,
} from '@/modules/auth/schemas/authSchema';
import { FwbModal, FwbInput, FwbButton } from 'flowbite-vue';
import type { LoginFormValues } from '@/modules/auth/schemas/authSchema';
import { useI18n } from 'vue-i18n';
import { handleApiError } from '@/api/errorHandler';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { login } = authStore;
const { t } = useI18n();

const showChangePassword = ref(false);
const showMfa = ref(false);
const mfaEmail = ref('');
const mfaCode = ref('');
const mfaLoading = ref(false);
const pendingPassword = ref('');
const errorMessage = ref('');

onMounted(() => {
  if (route.query.error === 'connection') {
    errorMessage.value =
      (route.query.msg as string) || t('common.connectionError');
    setTimeout(() => {
      errorMessage.value = '';
    }, 8000);
  }
});

const {
  defineField,
  handleSubmit: onChangePasswordSubmit,
  setValues: setChangePasswordValues,
  errors,
} = useForm({
  validationSchema: toTypedSchema(changePasswordSchema),
});

const [currentPassword] = defineField('currentPassword');
const [newPassword] = defineField('newPassword');
const [confirmPassword] = defineField('confirmPassword');

const handleLogin = async (payload: { email: string; password: string }) => {
  errorMessage.value = '';

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    errorMessage.value = parsed.error.issues[0].message;
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
    return;
  }

  const values: LoginFormValues = parsed.data;

  try {
    const result = await login({ email: values.email, password: values.password });

    if (result && 'mfaRequired' in result && result.mfaRequired) {
      mfaEmail.value = values.email;
      pendingPassword.value = values.password;
      showMfa.value = true;
      return;
    }

    if (localStorage.getItem('must_change_password') === 'true') {
      showChangePassword.value = true;
      setChangePasswordValues({
        currentPassword: values.password,
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      const redirectPath = (route.query.redirect as string) || '/dashboard';
      if (redirectPath.startsWith('/')) {
        router.push(redirectPath);
      } else {
        router.push('/dashboard');
      }
    }
  } catch (error: unknown) {
    console.error('Login error:', error);
    const appError = handleApiError(error);

    if (appError.status === 401) {
      errorMessage.value = t('auth.invalidCredentials');
    } else {
      errorMessage.value = appError.message;
    }

    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  }
};

const handleVerifyMfa = async () => {
  if (!mfaCode.value || mfaCode.value.trim().length !== 6) {
    errorMessage.value = 'Ingrese el código numérico de 6 dígitos.';
    return;
  }
  mfaLoading.value = true;
  errorMessage.value = '';
  try {
    await authStore.verifyMfa({
      email: mfaEmail.value,
      mfaCode: mfaCode.value.trim(),
    });
    showMfa.value = false;

    if (localStorage.getItem('must_change_password') === 'true') {
      showChangePassword.value = true;
      setChangePasswordValues({
        currentPassword: pendingPassword.value,
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      const redirectPath = (route.query.redirect as string) || '/dashboard';
      if (redirectPath.startsWith('/')) {
        router.push(redirectPath);
      } else {
        router.push('/dashboard');
      }
    }
  } catch (error: unknown) {
    console.error('MFA verify error:', error);
    const appError = handleApiError(error);
    errorMessage.value = appError.message || 'Código de verificación incorrecto o expirado.';
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
  } finally {
    mfaLoading.value = false;
  }
};

const handleCancelMfa = () => {
  showMfa.value = false;
  mfaCode.value = '';
  mfaEmail.value = '';
  pendingPassword.value = '';
};

const onPasswordSubmit = onChangePasswordSubmit(async (values) => {
  try {
    const u = authStore.user as UserClaims | null;
    const emailVal = u?.email;

    if (!emailVal) {
      console.error('No email found in token');
      alert(t('auth.emailError'));
      return;
    }

    console.log('Changing password for email:', emailVal);

    await authService.changePassword({
      email: emailVal,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    localStorage.removeItem('must_change_password');

    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      const response = await authService.refreshToken(refreshToken);
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
    }

    showChangePassword.value = false;
    const redirectPath = (route.query.redirect as string) || '/dashboard';
    if (redirectPath.startsWith('/')) {
      router.push(redirectPath);
    } else {
      router.push('/dashboard');
    }
  } catch (error: unknown) {
    console.error('Password change error:', error);
    const err = error as { response?: { data?: { detail?: string } } };
    alert(err.response?.data?.detail || t('auth.changePasswordError'));
  }
});

const handleCancelChange = () => {
  showChangePassword.value = false;
  authService.logout();
  router.push({ name: 'Login' });
};
</script>

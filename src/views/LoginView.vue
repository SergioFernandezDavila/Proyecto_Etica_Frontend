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

    <!-- Step 2: 2FA Verification Card -->
    <div
      v-if="showTwoFactorStep && !showChangePassword"
      class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/80 space-y-6"
    >
      <div class="text-center space-y-2">
        <div
          class="w-14 h-14 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm"
        >
          <IconLucideShieldCheck class="w-7 h-7" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Verificación de Dos Factores
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Ingresa el código de 6 dígitos generado por tu aplicación móvil (Google Authenticator)
        </p>
      </div>

      <form @submit.prevent="handleTwoFactorSubmit" class="space-y-4">
        <div>
          <input
            v-model="twoFactorCode"
            type="text"
            maxlength="6"
            placeholder="000000"
            inputmode="numeric"
            autofocus
            autocomplete="one-time-code"
            class="w-full text-center text-3xl font-mono tracking-widest font-bold py-3 px-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-750 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <fwb-button
          type="submit"
          class="w-full py-3 text-base font-medium"
          gradient="blue"
          :disabled="twoFactorCode.length !== 6 || twoFactorLoading"
        >
          {{ twoFactorLoading ? 'Verificando...' : 'Verificar e Iniciar Sesión' }}
        </fwb-button>

        <div class="text-center pt-2">
          <button
            type="button"
            @click="cancelTwoFactor"
            class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            ← Volver al inicio de sesión
          </button>
        </div>
      </form>
    </div>

    <!-- Step 1: Normal Login Form -->
    <login-form v-else-if="!showChangePassword" @submit="handleLogin" />

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
            <fwb-button type="submit" gradient="blue">{{ t('auth.changePassword') }}</fwb-button>
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
  import { loginSchema, changePasswordSchema } from '@/modules/auth/schemas/authSchema';
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

  const errorMessage = ref('');

  // 2FA state
  const showTwoFactorStep = ref(false);
  const preAuthToken = ref('');
  const twoFactorCode = ref('');
  const twoFactorLoading = ref(false);
  const pendingPassword = ref('');

  onMounted(() => {
    if (route.query.error === 'connection') {
      errorMessage.value = (route.query.msg as string) || t('common.connectionError');
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

  const handleLogin = async (payload: {
    email: string;
    password: string;
    recaptchaToken: string;
  }) => {
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
      const res = await login({
        email: values.email,
        password: values.password,
        recaptchaToken: payload.recaptchaToken,
      });

      if (res?.requiresTwoFactor) {
        preAuthToken.value = res.preAuthToken;
        pendingPassword.value = values.password;
        showTwoFactorStep.value = true;
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

  const handleTwoFactorSubmit = async () => {
    if (twoFactorCode.value.length !== 6) return;
    errorMessage.value = '';
    twoFactorLoading.value = true;
    try {
      await authStore.verifyTwoFactorLogin({
        preAuthToken: preAuthToken.value,
        code: twoFactorCode.value,
      });

      if (localStorage.getItem('must_change_password') === 'true') {
        showChangePassword.value = true;
        setChangePasswordValues({
          currentPassword: pendingPassword.value,
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const redirectPath = (route.query.redirect as string) || '/dashboard';
        router.push(redirectPath.startsWith('/') ? redirectPath : '/dashboard');
      }
    } catch (err: unknown) {
      const appError = handleApiError(err);
      errorMessage.value = appError.message || 'Código 2FA incorrecto';
      setTimeout(() => {
        errorMessage.value = '';
      }, 5000);
    } finally {
      twoFactorLoading.value = false;
    }
  };

  const cancelTwoFactor = () => {
    showTwoFactorStep.value = false;
    preAuthToken.value = '';
    twoFactorCode.value = '';
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

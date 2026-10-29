<template>
  <fwb-card class="max-w-md w-full p-6 shadow-xl border-gray-100 dark:border-gray-700">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-primary mb-2">
        {{ t('auth.welcome') }}
      </h1>
      <p class="text-secondary">{{ t('auth.subtitle') }}</p>
    </div>

    <form @submit.prevent="submit" class="space-y-6">
      <fwb-input
        v-model="email"
        :label="t('auth.emailLabel')"
        :placeholder="t('auth.emailPlaceholder')"
        type="email"
        required
      />
      <fwb-input
        v-model="password"
        :label="t('auth.passwordLabel')"
        type="password"
        :placeholder="t('auth.passwordPlaceholder')"
        required
      />

      <div class="flex items-center justify-between">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            />
          </div>
          <label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            {{ t('auth.rememberMe') }}
          </label>
        </div>
        <a href="#" class="text-sm text-blue-700 hover:underline dark:text-blue-500">
          {{ t('auth.forgotPassword') }}
        </a>
      </div>

      <!-- reCAPTCHA v2 widget -->
      <div class="flex justify-center">
        <div ref="recaptchaContainer" class="g-recaptcha" :data-sitekey="siteKey"></div>
      </div>

      <fwb-button
        type="submit"
        class="w-full py-3 text-base font-medium"
        gradient="blue"
        :disabled="!recaptchaToken"
      >
        {{ t('auth.signIn') }}
      </fwb-button>
    </form>

    <div class="mt-6 text-center text-sm text-secondary">
      {{ t('auth.notRegistered') }}
      <a href="#" class="text-blue-700 hover:underline dark:text-blue-500 text-medium">
        {{ t('auth.createAccount') }}
      </a>
    </div>

    <!-- Safe to delete: Quick Login Helpers -->
    <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
      <p class="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        Quick Login (Dev)
      </p>
      <div class="grid grid-cols-2 gap-2">
        <fwb-button size="xs" color="alternative" @click="quickLogin('admin@admin.com')">
          Admin
        </fwb-button>
        <fwb-button size="xs" color="alternative" @click="quickLogin('agent1@user.com')">
          Agent 1
        </fwb-button>
        <fwb-button size="xs" color="alternative" @click="quickLogin('agent2@user.com')">
          Agent 2
        </fwb-button>
        <fwb-button size="xs" color="alternative" @click="quickLogin('owner1@user.com')">
          Owner 1
        </fwb-button>
        <fwb-button size="xs" color="alternative" @click="quickLogin('owner2@user.com')">
          Owner 2
        </fwb-button>
        <fwb-button size="xs" color="alternative" @click="quickLogin('client1@user.com')">
          Client 1
        </fwb-button>
      </div>
    </div>
  </fwb-card>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FwbInput, FwbButton, FwbCard } from 'flowbite-vue';

  const { t } = useI18n();

  const emit = defineEmits(['submit']);

  const email = ref('');
  const password = ref('');
  const recaptchaToken = ref('');
  const recaptchaContainer = ref<HTMLElement | null>(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

  // Declare grecaptcha on the global window object
  declare global {
    interface Window {
      grecaptcha: {
        render: (container: HTMLElement, params: Record<string, unknown>) => number;
        reset: (widgetId?: number) => void;
        getResponse: (widgetId?: number) => string;
      };
      onRecaptchaLoaded: () => void;
    }
  }

  let widgetId: number | null = null;

  const loadRecaptchaScript = (): Promise<void> => {
    return new Promise((resolve) => {
      if (document.getElementById('recaptcha-script')) {
        resolve();
        return;
      }
      window.onRecaptchaLoaded = resolve;
      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src =
        'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    });
  };

  onMounted(async () => {
    await loadRecaptchaScript();
    if (recaptchaContainer.value && window.grecaptcha) {
      widgetId = window.grecaptcha.render(recaptchaContainer.value, {
        sitekey: siteKey,
        callback: (token: string) => {
          recaptchaToken.value = token;
        },
        'expired-callback': () => {
          recaptchaToken.value = '';
        },
        'error-callback': () => {
          recaptchaToken.value = '';
        },
      });
    }
  });

  onUnmounted(() => {
    // Clean up the global callback to avoid memory leaks
    delete window.onRecaptchaLoaded;
  });

  const resetRecaptcha = () => {
    if (widgetId !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId);
      recaptchaToken.value = '';
    }
  };

  const quickLogin = (userEmail: string) => {
    email.value = userEmail;
    password.value = 'password';
    // If user already solved the captcha, preserve that token; otherwise use dev-bypass
    if (!recaptchaToken.value) {
      recaptchaToken.value = 'dev-bypass';
    }
    submit();
  };

  const submit = () => {
    emit('submit', {
      email: email.value,
      password: password.value,
      recaptchaToken: recaptchaToken.value,
    });
    // Reset captcha after submission attempt
    resetRecaptcha();
  };
</script>

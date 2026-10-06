import i18n from '@/locales/i18n';

/**
 * Standardized error object returned by the API client
 */
export interface AppError {
  message: string;
  isNetworkError: boolean;
  isApiError: boolean;
  status?: number;
  errors?: Array<{ field?: string; message: string; code: string }>;
}

/**
 * Extracts and standardizes error messages from various error sources
 */
export function handleApiError(error: unknown): AppError {
  const { t } = i18n.global;

  if (!(error instanceof Object)) {
    return {
      message: String(error) || t('common.error'),
      isNetworkError: false,
      isApiError: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any;

  // 1. Connection / Network errors
  if (!err.response && err.request) {
    return {
      message: t('common.connectionError') || 'No connection to server',
      isNetworkError: true,
      isApiError: false,
    };
  }

  // 2. Standardized Backend Errors (ApiResponse structure)
  if (err.isApiError) {
    return {
      message: err.message,
      isNetworkError: false,
      isApiError: true,
      status: err.response?.status,
      errors: err.errors,
    };
  }

  // 3. Axios Response Errors
  if (err.response?.data) {
    const data = err.response.data;
    return {
      message: data.message || data.detail || t('common.error'),
      isNetworkError: false,
      isApiError: true,
      status: err.response.status,
      errors: data.errors,
    };
  }

  // 4. Fallback
  return {
    message: err.message || t('common.error'),
    isNetworkError: false,
    isApiError: false,
  };
}

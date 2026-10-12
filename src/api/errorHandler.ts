import Swal from 'sweetalert2';
import i18n from '@/locales/i18n';
import type { ApiError } from './types';

/**
 * Standardized error object returned by the API client
 */
export interface AppError {
  message: string;
  isNetworkError: boolean;
  isApiError: boolean;
  status?: number;
  errors?: ApiError[];
}

/**
 * Mapeo de títulos y mensajes según el código de estado HTTP
 */
function getHttpErrorInfo(status?: number): {
  title: string;
  defaultReason: string;
} {
  switch (status) {
    case 403:
      return {
        title: 'Acceso Denegado (403)',
        defaultReason: 'No cuentas con los permisos requeridos para realizar esta acción.',
      };
    case 404:
      return {
        title: 'Recurso No Encontrado (404)',
        defaultReason: 'El elemento o recurso solicitado no existe o fue eliminado.',
      };
    case 409:
      return {
        title: 'Conflicto (409)',
        defaultReason: 'La solicitud entra en conflicto con el estado actual del servidor.',
      };
    case 500:
      return {
        title: 'Error Interno del Servidor (500)',
        defaultReason: 'Ocurrió un problema inesperado al procesar la solicitud en el servidor.',
      };
    case 502:
      return {
        title: 'Puerta de Enlace Incorrecta (502)',
        defaultReason: 'El servidor recibió una respuesta no válida del microservicio de destino.',
      };
    case 503:
      return {
        title: 'Servicio No Disponible (503)',
        defaultReason: 'El servicio está temporalmente saturado o en mantenimiento.',
      };
    case 504:
      return {
        title: 'Tiempo de Espera Agotado (504)',
        defaultReason: 'El servidor no recibió respuesta a tiempo del servicio interno.',
      };
    default:
      if (status && status >= 500) {
        return {
          title: `Error del Servidor (${status})`,
          defaultReason: 'Ocurrió un fallo de infraestructura en el backend.',
        };
      }
      return {
        title: `Error (${status || 'Desconocido'})`,
        defaultReason: 'Ocurrió un error inesperado al procesar la solicitud.',
      };
  }
}

/**
 * Muestra un SweetAlert únicamente para errores del tipo 403, 404, 409 y familia 5xx
 */
export function showHttpErrorAlert(appError: AppError): void {
  const status = appError.status;

  // Filtrar: solo mostrar para 403, 404, 409 y familia 500+ (500, 502, 503, 504, etc.)
  const shouldAlert =
    status === 403 || status === 404 || status === 409 || (status !== undefined && status >= 500);

  if (!shouldAlert) {
    return;
  }

  const { title, defaultReason } = getHttpErrorInfo(status);
  const mainMessage = appError.message || defaultReason;

  // Construir detalle si el backend retornó errores de campo en errors: [...]
  let detailsHtml = '';
  if (appError.errors && appError.errors.length > 0) {
    const listItems = appError.errors
      .map((err) => {
        const fieldPart = err.field ? `<strong>${escapeHtml(err.field)}:</strong> ` : '';
        const codePart = err.code
          ? ` <span style="font-size: 0.85em; opacity: 0.7;">(${escapeHtml(err.code)})</span>`
          : '';
        return `<li style="text-align: left; margin-bottom: 4px;">${fieldPart}${escapeHtml(err.message)}${codePart}</li>`;
      })
      .join('');

    detailsHtml = `
      <div style="margin-top: 12px; font-size: 0.9em; text-align: left;">
        <p style="margin-bottom: 6px; font-weight: 600;">Detalles detectados:</p>
        <ul style="padding-left: 20px; list-style-type: disc;">${listItems}</ul>
      </div>
    `;
  }

  Swal.fire({
    icon: 'error',
    title,
    html: `
      <div style="font-size: 1rem; line-height: 1.5;">
        <p style="margin-bottom: 8px;">${escapeHtml(mainMessage)}</p>
        ${detailsHtml}
      </div>
    `,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#2563eb',
    focusConfirm: true,
  });
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

/**
 * Normaliza cualquier error y dispara la alerta cuando corresponde
 */
export function handleApiError(error: unknown): AppError {
  const { t } = i18n.global;

  if (!(error instanceof Object)) {
    const appError: AppError = {
      message: String(error) || t('common.error'),
      isNetworkError: false,
      isApiError: false,
    };
    return appError;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as any;

  // 1. Connection / Network errors
  if (!err.response && err.request) {
    const appError: AppError = {
      message: t('common.connectionError') || 'No connection to server',
      isNetworkError: true,
      isApiError: false,
    };
    return appError;
  }

  // 2. Standardized Backend Errors (ApiResponse structure con success: false)
  if (err.isApiError) {
    const appError: AppError = {
      message: err.message,
      isNetworkError: false,
      isApiError: true,
      status: err.status || err.response?.status,
      errors: err.errors,
    };
    showHttpErrorAlert(appError);
    return appError;
  }

  // 3. Axios Response Errors (4xx, 5xx lanzados por Axios)
  if (err.response?.data) {
    const data = err.response.data;
    const appError: AppError = {
      message: data.message || data.detail || t('common.error'),
      isNetworkError: false,
      isApiError: true,
      status: err.response.status,
      errors: Array.isArray(data.errors) ? data.errors : undefined,
    };
    showHttpErrorAlert(appError);
    return appError;
  }

  // 4. Fallback genérico
  const appError: AppError = {
    message: err.message || t('common.error'),
    isNetworkError: false,
    isApiError: false,
    status: err.status || err.response?.status,
  };
  showHttpErrorAlert(appError);
  return appError;
}

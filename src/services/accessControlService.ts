import { apiClient as api } from '@/api';
import type { ApiResponse } from '@/api/types';

export type AccessType = 'MAC' | 'RBAC' | 'DAC';

export interface ModuleInfo {
  code: string;
  name: string;
  description: string;
  category: string;
}

export interface AccessTypeDefinition {
  code: AccessType;
  name: string;
  theoreticalDefinition: string;
  description: string;
}

export interface RoleMatrixModuleAccess {
  resource: string;
  accessType: AccessType;
  actions: string[];
  scope?: string;
}

export interface RoleMatrixRow {
  roleId: string;
  roleCode: string;
  roleName: string;
  roleDescription: string;
  roleType: 'SYSTEM' | 'CUSTOM';
  active: boolean;
  moduleAccess: Record<string, RoleMatrixModuleAccess>;
}

export interface RoleMatrixData {
  modules: ModuleInfo[];
  availableActions: string[];
  accessTypes: AccessTypeDefinition[];
  roles: RoleMatrixRow[];
}

export interface RoleModuleAccessUpdate {
  resource: string;
  accessType: AccessType;
  actions: string[];
}

export interface RoleMatrixRowUpdate {
  roleId: string;
  modules: RoleModuleAccessUpdate[];
}

export interface RoleMatrixBatchUpdatePayload {
  updates: RoleMatrixRowUpdate[];
}

export const accessControlService = {
  /**
   * Obtiene la matriz completa de roles, módulos, acciones y tipos de acceso (MAC/RBAC/DAC)
   */
  async getMatrix(): Promise<RoleMatrixData> {
    const response = await api.get<ApiResponse<RoleMatrixData>>('/roles/matrix');
    return response.data.data;
  },

  /**
   * Guarda de forma atómica la matriz de roles y permisos con sus tipos de acceso
   */
  async updateMatrix(payload: RoleMatrixBatchUpdatePayload): Promise<RoleMatrixData> {
    const response = await api.put<ApiResponse<RoleMatrixData>>('/roles/matrix', payload);
    return response.data.data;
  },

  /**
   * Obtiene la lista de roles
   */
  async getRoles(page = 0, pageSize = 50): Promise<ApiResponse<unknown[]>> {
    const response = await api.get<ApiResponse<unknown[]>>('/roles', {
      params: { page, pageSize },
    });
    return response.data;
  },

  /**
   * Actualiza los permisos de un rol específico
   */
  async updateRole(id: string, payload: Record<string, unknown>): Promise<unknown> {
    const response = await api.patch<ApiResponse<unknown>>(`/roles/${id}`, payload);
    return response.data.data;
  },

  /**
   * Obtiene el catálogo general de permisos
   */
  async getPermissionsCatalog(page = 0, pageSize = 100): Promise<unknown[]> {
    const response = await api.get<ApiResponse<unknown[]>>('/permissions', {
      params: { page, pageSize },
    });
    return response.data.data;
  },
};

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

export interface PermissionEntry {
  resource: string;
  action: string;
  scope?: string;
  accessType?: AccessType;
}

export interface RoleItem {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'SYSTEM' | 'CUSTOM';
  active: boolean;
  permissions?: PermissionEntry[];
  version?: number;
}

export interface CreateRolePayload {
  code: string;
  name: string;
  description: string;
  permissions?: PermissionEntry[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  active?: boolean;
  permissions?: PermissionEntry[];
}

export interface AccessControlAuditLog {
  id: string;
  action: string;
  roleId: string;
  roleCode: string;
  performedBy: string;
  performedByEmail?: string;
  performedByName?: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

export interface AccessControlAuditFilters {
  roleId?: string;
  roleCode?: string;
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
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
   * Obtiene la lista paginada de roles
   */
  async getRoles(page = 0, pageSize = 50): Promise<ApiResponse<RoleItem[]>> {
    const response = await api.get<ApiResponse<RoleItem[]>>('/roles', {
      params: { page, pageSize },
    });
    return response.data;
  },

  /**
   * Obtiene un rol por su ID
   */
  async getRoleById(id: string): Promise<RoleItem> {
    const response = await api.get<ApiResponse<RoleItem>>(`/roles/${id}`);
    return response.data.data;
  },

  /**
   * Crea un nuevo rol en el sistema
   */
  async createRole(payload: CreateRolePayload): Promise<RoleItem> {
    const response = await api.post<ApiResponse<RoleItem>>('/roles', payload);
    return response.data.data;
  },

  /**
   * Actualiza los datos y/o permisos de un rol específico
   */
  async updateRole(id: string, payload: UpdateRolePayload): Promise<RoleItem> {
    const response = await api.patch<ApiResponse<RoleItem>>(`/roles/${id}`, payload);
    return response.data.data;
  },

  /**
   * Elimina un rol personalizado del sistema
   */
  async deleteRole(id: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/roles/${id}`);
  },

  /**
   * Obtiene los logs de auditoría de control de acceso
   */
  async getAuditLogs(
    filters: AccessControlAuditFilters = {}
  ): Promise<ApiResponse<AccessControlAuditLog[]>> {
    const response = await api.get<ApiResponse<AccessControlAuditLog[]>>('/roles/audit', {
      params: filters,
    });
    return response.data;
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

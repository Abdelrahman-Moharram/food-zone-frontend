export interface RoleItem {
  id: string;
  name: string;
  created_at?: string;
  created_by?: string;
}

export interface PermissionItem {
  id: string;
  key: string;
  label: string;
  has_perm: boolean;
}

export type PermissionsByModule = Record<string, PermissionItem[]>;

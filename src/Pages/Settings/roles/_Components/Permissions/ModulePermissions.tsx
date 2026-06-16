import { Shield } from 'lucide-react';
import { useAddPermissionToRoleMutation } from '../../../../../redux/api/rolesApi';
import Spinner from '../../../../../Components/ui/Common/Spinner';
import type { PermissionItem } from '../RoleTypes';

interface Props {
  moduleName: string;
  permissions: PermissionItem[];
  roleId: string;
}

const ModulePermissions = ({ moduleName, permissions, roleId }: Props) => {
  const [togglePermission, { isLoading }] = useAddPermissionToRoleMutation();

  const handleToggle = (permissionId: string) => {
    if (roleId) togglePermission({ id: roleId, permission_id: permissionId });
  };

  return (
    <section className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Shield className="h-4 w-4" />
          </span>
          <h3 className="font-bold text-color">{moduleName}</h3>
        </div>
        {isLoading ? <Spinner sm /> : null}
      </div>

      <div className="space-y-2">
        {permissions.map((permission) => (
          <label
            key={permission.id}
            htmlFor={permission.key}
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-neutral-50 px-3 py-2 text-sm transition hover:bg-card"
          >
            <span className="font-medium text-neutral-700">{permission.label}</span>
            <input
              id={permission.key}
              type="checkbox"
              checked={permission.has_perm}
              onChange={() => handleToggle(permission.id)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-neutral-300 accent-primary"
            />
          </label>
        ))}
      </div>
    </section>
  );
};

export default ModulePermissions;

import { KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FullHModal from '../../../../../Components/ui/Modals/FullHModal';
import Spinner from '../../../../../Components/ui/Common/Spinner';
import { useRolePermissionsDetailsQuery } from '../../../../../redux/api/rolesApi';
import type { PermissionsByModule, RoleItem } from '../RoleTypes';
import ModulePermissions from './ModulePermissions';

interface Props {
  open: boolean;
  role: RoleItem | null;
  onClose: () => void;
}

const RolePermissionsModal = ({ open, role, onClose }: Props) => {
  const { t } = useTranslation();
  const { data, isLoading } = useRolePermissionsDetailsQuery({ id: role?.id || '' }, { skip: !open || !role?.id });
  const permissions = (data?.permissions || {}) as PermissionsByModule;
  const moduleNames = Object.keys(permissions);

  return (
    <FullHModal open={open} handleToggler={onClose}>
      <div className="w-[min(980px,92vw)] bg-container">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-container px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-color">{data?.role?.name || role?.name}</h2>
              <p className="text-sm text-neutral-500">{t('Manage Role Permissions')}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-card">
            {t('Cancle')}
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <Spinner md />
            </div>
          ) : moduleNames.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {moduleNames.map((moduleName) => (
                <ModulePermissions
                  key={moduleName}
                  moduleName={moduleName}
                  permissions={permissions[moduleName]}
                  roleId={role?.id || ''}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-card p-8 text-center font-semibold text-neutral-500">{t('No Data Available')}</div>
          )}
        </div>
      </div>
    </FullHModal>
  );
};

export default RolePermissionsModal;

import { useState } from 'react';
import { Plus, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import Button from '../../../Components/ui/Common/Button';
import EmptyData from '../../../Components/ui/Common/EmptyData';
import { ImageSkeleton } from '../../../Components/ui/Common';
import Paginition from '../../../Components/ui/Lists/Paginition';
import { useGetRolesListQuery } from '../../../redux/api/rolesApi';
import { IsAllowedPermissionOrNull } from '../../Guards/IsAllowedPermission';
import DeleteRoleModal from './_Components/DeleteRoleModal';
import RoleCard from './_Components/RoleCard';
import RoleFormModal from './_Components/RoleFormModal';
import type { RoleItem } from './_Components/RoleTypes';
import RolePermissionsModal from './_Components/Permissions/RolePermissionsModal';

const skeletons = Array.from({ length: 8 }, (_, index) => index);

const RolesSettings = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;
  const { data, isLoading } = useGetRolesListQuery({ page, size });

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);

  const roles = (data?.data || []) as RoleItem[];
  const totalPages = data?.total_pages || 1;

  const openCreate = () => {
    setSelectedRole(null);
    setFormOpen(true);
  };

  const openEdit = (role: RoleItem) => {
    setSelectedRole(role);
    setFormOpen(true);
  };

  const openDelete = (role: RoleItem) => {
    setSelectedRole(role);
    setDeleteOpen(true);
  };

  const openPermissions = (role: RoleItem) => {
    setSelectedRole(role);
    setPermissionsOpen(true);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-container p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-color">{t('Roles')}</h1>
            <p className="text-sm text-neutral-500">{t('Create roles and control their permissions')}</p>
          </div>
        </div>

        <IsAllowedPermissionOrNull permission="permissions.roles.add">
          <Button
            title={t('Add Role')}
            variant="primary"
            onClick={openCreate}
            icon={<Plus className="h-4 w-4" />}
            className="md:max-w-[170px]"
          />
        </IsAllowedPermissionOrNull>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {skeletons.map((item) => (
            <ImageSkeleton key={item} height="210px" width="100%" rounded="8px" />
          ))}
        </div>
      ) : roles.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={openEdit}
              onDelete={openDelete}
              onPermissions={openPermissions}
            />
          ))}
        </div>
      ) : (
        <EmptyData height="180px" message={t('No Roles Available')} />
      )}

      <div className="flex justify-center">
        <Paginition totalPages={totalPages} />
      </div>

      <RoleFormModal open={formOpen} role={selectedRole} onClose={() => setFormOpen(false)} />
      <DeleteRoleModal open={deleteOpen} role={selectedRole} onClose={() => setDeleteOpen(false)} />
      <RolePermissionsModal open={permissionsOpen} role={selectedRole} onClose={() => setPermissionsOpen(false)} />
    </div>
  );
};

export default RolesSettings;

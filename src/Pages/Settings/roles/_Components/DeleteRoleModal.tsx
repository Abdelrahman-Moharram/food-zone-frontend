import { ChangeEvent, useEffect, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '../../../../Components/ui/Common/Button';
import SelectInput from '../../../../Components/ui/Forms/SelectInput';
import Modal from '../../../../Components/ui/Modals/Modal';
import { useDeleteRoleMutation, useGetRolesAsSelectListQuery } from '../../../../redux/api/rolesApi';
import type { RoleItem } from './RoleTypes';

interface Props {
  open: boolean;
  role: RoleItem | null;
  onClose: () => void;
}

const DeleteRoleModal = ({ open, role, onClose }: Props) => {
  const { t } = useTranslation();
  const [alterRole, setAlterRole] = useState('');
  const { data } = useGetRolesAsSelectListQuery({ exclude: role?.id || '' }, { skip: !open || !role?.id });
  const [deleteRole, { isLoading }] = useDeleteRoleMutation();
  const roles = data?.roles || [];

  useEffect(() => {
    if (open) setAlterRole('');
  }, [open, role?.id]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setAlterRole(event.target.value);
  };

  const handleDelete = async () => {
    if (!role?.id || !alterRole) {
      toast.error(t('You should choose an alter role to move current role users to'));
      return;
    }

    try {
      await deleteRole({ roleId: role.id, alter_role: alterRole }).unwrap();
      toast.success(t('role has been deleted succssefully!'));
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.error || t('Something went wrong please try again later'));
    }
  };

  return (
    <Modal open={open} handleToggler={onClose} title={t('Delete Role')}>
      <div className="space-y-6">
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-red-700">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h3 className="font-bold">
                {t('Are you sure u want to delete')} "{role?.name}"
              </h3>
              <p className="mt-1 text-sm">{t('You should choose an alter role to move current role users to')}</p>
            </div>
          </div>
        </div>

        <SelectInput labelId="alter_role" label={t('Alter Role')} value={alterRole} onChange={handleChange} required>
          {roles.map((item: RoleItem) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </SelectInput>

        <div className="flex justify-end gap-3">
          <Button
            title={t('Cancle')}
            variant="secondary-outline"
            onClick={onClose}
            className="max-w-[140px]"
            fontBold={false}
          />
          <Button
            title={t('Delete')}
            variant="red"
            onClick={handleDelete}
            disabled={!alterRole || isLoading}
            isLoading={isLoading}
            icon={<Trash2 className="h-4 w-4" />}
            className="max-w-[140px]"
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteRoleModal;

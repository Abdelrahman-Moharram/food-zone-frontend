import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '../../../../Components/ui/Common/Button';
import { FloatingInput } from '../../../../Components/ui/Forms';
import Modal from '../../../../Components/ui/Modals/Modal';
import { useAddRoleMutation, useEditRoleMutation } from '../../../../redux/api/rolesApi';
import type { RoleItem } from './RoleTypes';

interface Props {
  open: boolean;
  role: RoleItem | null;
  onClose: () => void;
}

const RoleFormModal = ({ open, role, onClose }: Props) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [addRole, { isLoading: isAdding }] = useAddRoleMutation();
  const [editRole, { isLoading: isEditing }] = useEditRoleMutation();
  const isEditingRole = Boolean(role?.id);

  useEffect(() => {
    setName(role?.name || '');
  }, [role, open]);

  const isInvalid = useMemo(() => name.trim().length < 3, [name]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSave = async () => {
    if (isInvalid) {
      toast.error(t('Please enter the role name correctly'));
      return;
    }

    const form = new FormData();
    form.append('name', name.trim());

    try {
      if (role?.id) {
        await editRole({ id: role.id, form }).unwrap();
        toast.success(t('Role has changed successfully'));
      } else {
        await addRole({ form }).unwrap();
        toast.success(t('Role added successfully'));
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.error || t('Something went wrong please try again later'));
    }
  };

  return (
    <Modal open={open} handleToggler={onClose} title={isEditingRole ? t('Edit Role') : t('Add Role')}>
      <div className="space-y-6">
        <FloatingInput
          labelId="name"
          type="text"
          label={t('Role Name')}
          value={name}
          onChange={handleChange}
          required
        />

        <div className="flex justify-end gap-3">
          <Button
            title={t('Cancle')}
            variant="secondary-outline"
            onClick={onClose}
            className="max-w-[140px]"
            fontBold={false}
          />
          <Button
            title={t('Save')}
            variant="primary"
            onClick={handleSave}
            disabled={isInvalid || isAdding || isEditing}
            isLoading={isAdding || isEditing}
            icon={<Save className="h-4 w-4" />}
            className="max-w-[140px]"
          />
        </div>
      </div>
    </Modal>
  );
};

export default RoleFormModal;

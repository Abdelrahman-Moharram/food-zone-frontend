import type { ReactNode } from 'react';
import { CalendarDays, KeyRound, Pencil, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IsAllowedPermissionOrNull } from '../../../Guards/IsAllowedPermission';
import type { RoleItem } from './RoleTypes';

interface Props {
  role: RoleItem;
  onEdit: (role: RoleItem) => void;
  onDelete: (role: RoleItem) => void;
  onPermissions: (role: RoleItem) => void;
}

const IconButton = ({
  children,
  label,
  onClick,
  tone = 'neutral',
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  tone?: 'neutral' | 'danger' | 'primary';
}) => {
  const tones = {
    neutral: 'text-neutral-600 hover:bg-neutral-100',
    danger: 'text-red-600 hover:bg-red-50',
    primary: 'text-primary hover:bg-primary/10',
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-lg transition ${tones[tone]}`}
    >
      {children}
    </button>
  );
};

const RoleCard = ({ role, onEdit, onDelete, onPermissions }: Props) => {
  const { t } = useTranslation();
  const initial = role.name?.trim()?.[0]?.toUpperCase() || 'R';

  return (
    <article className="group flex min-h-[210px] flex-col rounded-lg border border-border bg-container p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-lg font-bold text-white shadow-sm">
            {initial}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-color">{role.name}</h2>
            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('Role')}
            </p>
          </div>
        </div>

        <IsAllowedPermissionOrNull permission="permissions.roles.edit.permissions">
          <IconButton label={t('Manage Permissions')} onClick={() => onPermissions(role)} tone="primary">
            <KeyRound className="h-4 w-4" />
          </IconButton>
        </IsAllowedPermissionOrNull>
      </div>

      <div className="mt-5 space-y-3 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-neutral-400" />
          <span className="truncate">{role.created_at || t('Not Available')}</span>
        </div>
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-neutral-400" />
          <span className="truncate">{role.created_by || t('System')}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <IsAllowedPermissionOrNull permission="permissions.roles.edit.permissions">
          <button
            type="button"
            onClick={() => onPermissions(role)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
          >
            <KeyRound className="h-4 w-4" />
            {t('Permissions')}
          </button>
        </IsAllowedPermissionOrNull>

        <div className="flex items-center gap-1">
          <IsAllowedPermissionOrNull permission="permissions.roles.edit">
            <IconButton label={t('Edit')} onClick={() => onEdit(role)}>
              <Pencil className="h-4 w-4" />
            </IconButton>
          </IsAllowedPermissionOrNull>
          <IsAllowedPermissionOrNull permission="permissions.roles.delete">
            <IconButton label={t('Delete')} onClick={() => onDelete(role)} tone="danger">
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </IsAllowedPermissionOrNull>
        </div>
      </div>
    </article>
  );
};

export default RoleCard;

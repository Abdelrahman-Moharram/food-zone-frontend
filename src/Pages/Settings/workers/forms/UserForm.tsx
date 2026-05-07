import React, { ChangeEvent } from 'react';
import Input from '../../../../Components/ui/Forms/Input';
import SelectInput from '../../../../Components/ui/Forms/SelectInput';
import { useGetRolesAsSelectListQuery } from '../../../../redux/api/rolesApi';

interface UserFormProps {
  data: any;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors?: any;
  isUpdate?: boolean;
}

const UserForm = ({ data, onChange, errors, isUpdate = false }: UserFormProps) => {
  const { data: rolesResponse } = useGetRolesAsSelectListQuery({ exclude: '' });
  const roles = rolesResponse || [];

  return (
    <div className="space-y-4">
      <Input
        labelId="username"
        label="Username"
        type="text"
        value={data.username || ''}
        onChange={onChange}
        errors={errors?.username}
        required
      />
      
      <Input
        labelId="full_name"
        label="Full Name"
        type="text"
        value={data.full_name || ''}
        onChange={onChange}
        errors={errors?.full_name}
        required
      />

      <Input
        labelId="email"
        label="Email"
        type="text"
        value={data.email || ''}
        onChange={onChange}
        errors={errors?.email}
      />

      <SelectInput
        labelId="role"
        label="Role"
        value={data.role || ''}
        onChange={onChange}
        errors={errors?.role}
        required
      >
        {roles.map((role: any) => (
          <option key={role.id || role.name} value={role.name || role.id}>
            {role.name}
          </option>
        ))}
      </SelectInput>

      {!isUpdate && (
        <Input
          labelId="password"
          label="Password"
          type="password"
          value={data.password || ''}
          onChange={onChange}
          errors={errors?.password}
          required
        />
      )}
    </div>
  );
};

export default UserForm;

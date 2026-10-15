import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { IoPersonOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { Input, Button } from '../../../../Components/Forms/ui';

interface BaseFormProps {
  identifier: string;
  setIdentifier: (val: string) => void;
  onNext: () => void;
}

const BaseForm = ({ identifier, setIdentifier, onNext }: BaseFormProps) => {
  const { t } = useTranslation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (identifier.trim().length >= 3) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      <Input
        labelId="identifier"
        label={t('Username or Email')}
        placeholder={t('Enter username or email')}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        icon={<IoPersonOutline className="w-4 h-4 text-copy-secondary" />}
        required
      />

      <Button
        title={t('Next') || 'التالي'}
        submit
        variant="primary"
        className="w-full py-3 font-semibold shadow-md shadow-primary/20"
        disabled={identifier.trim().length < 3}
        icon={<IoArrowForwardOutline className="w-4 h-4 rtl:rotate-180" />}
        iconRight
      />
    </form>
  );
};

export default BaseForm;
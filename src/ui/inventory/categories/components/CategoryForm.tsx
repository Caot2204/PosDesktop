import '../stylesheets/CategoryForm.css';
import { useEffect, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import OkCancelButtons from '../../../common/components/OkCancelButtons';
import { showSuccessNotify } from '../../../utils/NotifyUtils';
import { handleErrorMessage } from '../../../utils/ErrorUtils';
import PosInput from '../../../common/components/PosInput';
import { useTranslation } from 'react-i18next';

interface CategoryFormProps {
  id?: number;
  name: string;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

function CategoryForm(props: CategoryFormProps) {
  const { t } = useTranslation('global');
  const [categoryId, setCategoryId] = useState<number | undefined>(props.id);
  const [name, setName] = useState(props.name);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setCategoryId(props.id);
    setName(props.name);
  }, [props.id, props.name]);

  const clearForm = () => {
    setName(props.name);
    setCategoryId(props.id);
    setErrorMessage(null);
  };

  const handleCancel = () => {
    clearForm();
    props.onCancel();
  };

  const handleSubmit = async () => {
    if (categoryId) {
      if (window.categoryAPI && typeof window.categoryAPI.updateCategory === 'function') {
        try {
          await window.categoryAPI?.updateCategory(categoryId, name);
          showSuccessNotify(t('screens.categoryForm.categoryUpdated'));
          clearForm();
          props.onSaveSuccess();
        } catch (error) {
          handleErrorMessage(error, setErrorMessage);
        }
      } else {
        console.log("updateCategory is not available");
        handleCancel();
      }
    } else {
      if (window.categoryAPI && typeof window.categoryAPI.saveCategory === 'function') {
        try {
          await window.categoryAPI?.saveCategory(name);
          showSuccessNotify(t('screens.categoryForm.categorySaved'));
          clearForm();
          props.onSaveSuccess();
        } catch (error) {
          handleErrorMessage(error, setErrorMessage);
        }
      } else {
        console.log("saveCategory is not available");
        handleCancel();
      }
    }
  };

  return (
    <div className="category-form">
      <h2>{t('screens.categoryForm.title')}</h2>
      {
        errorMessage ?
          <div className="error-message-container">
            <MdErrorOutline />
            <span>{errorMessage}</span>
          </div>
          :
          <></>
      }
      <PosInput
        label={t('screens.categoryForm.nameLabel')}
        value={name}
        maxLength={50}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
      <OkCancelButtons
        onSave={handleSubmit}
        onCancel={handleCancel} />
    </div>
  );
}

export default CategoryForm;
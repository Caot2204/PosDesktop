import { useState, useEffect } from 'react';
import '../stylesheets/UserForm.css';
import { MdErrorOutline } from "react-icons/md";
import OkCancelButtons from '../../common/components/OkCancelButtons';
import { showSuccessNotify } from '../../utils/NotifyUtils';
import { handleErrorMessage } from '../../utils/ErrorUtils';
import { useTranslation } from 'react-i18next';

interface UserDataProps {
  id?: string,
  name: string;
  password: string;
  isAdmin: boolean;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export function UserForm(props: UserDataProps) {
  const { t } = useTranslation('global');
  const [userId, setUserId] = useState(props.id);
  const [name, setName] = useState(props.name);
  const [password, setPassword] = useState(props.password);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isAdmin, setIsAdmin] = useState(props.isAdmin);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setUserId(props.id);
    setName(props.name);
    setPassword(props.password);
    setIsAdmin(props.isAdmin);
  }, [props.id, props.name, props.password, props.isAdmin]);

  const clearForm = () => {
    setUserId(props.id);
    setName(props.name);
    setPassword(props.password);
    setIsAdmin(props.isAdmin);
    setErrorMessage(null);
  };

  const handleCancel = () => {
    clearForm();
    props.onCancel();
  }

  const handleSubmit = async () => {
    if (userId) {
      if (window.userAPI && typeof window.userAPI.updateUser === 'function') {
        try {
          await window.userAPI.updateUser(userId, name, isAdmin)
          showSuccessNotify(t('screens.userForm.userUpdated'));
          clearForm();
          props.onSaveSuccess();
        } catch (error: any) {
          handleErrorMessage(error, setErrorMessage);
        }
      } else {
        console.error('updateUser is not available');
        handleCancel();
      }
    } else {
      if (window.userAPI && typeof window.userAPI.saveUser === 'function') {
        if (password !== passwordConfirm) {
          setErrorMessage(t('screens.userForm.passwordUnmatch'));
          return;
        }
        try {
          await window.userAPI.saveUser(name, password, isAdmin);
          showSuccessNotify(t('screens.userForm.userSaved'));
          clearForm();
          props.onSaveSuccess();
        } catch (error: any) {
          handleErrorMessage(error, setErrorMessage);
        }
      } else {
        console.error('saveUser is not available');
        handleCancel();
      }
    }
  };

  return (
    <>
      <div className="user-form">
        <h2>{t('screens.userForm.title')}</h2>
        {
          errorMessage ?
            <div className="error-message-container">
              <MdErrorOutline />
              <span>{errorMessage}</span>
            </div>
            :
            <></>
        }
        <label>{t('screens.userForm.nameLabel')}</label>
        <input 
          type="text" 
          value={name} 
          maxLength={100}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
        {
          props.id ?
            <></>
            :
            <>
              <label>{t('screens.userForm.passwordLabel')}</label>
              <input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
              <label>{t('screens.userForm.confirmPasswordLabel')}</label>
              <input type="password" value={passwordConfirm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)} />
            </>
        }
        <div className="checkbox-container">
          <input id="isAdminCheckBox" type="checkbox" checked={isAdmin} onChange={(e: any) => setIsAdmin(e.target.checked)} />
          <label htmlFor="isAdminCheckBox">{t('screens.userForm.isAdminLabel')}</label>
        </div>
      </div>
      <OkCancelButtons
        onSave={handleSubmit}
        onCancel={handleCancel} />
    </>
  );
}
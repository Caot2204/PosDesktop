import { useState, useEffect } from 'react';
import '../stylesheets/UserForm.css';
import { MdErrorOutline } from "react-icons/md";
import SaveCancelButtons from '../../common/components/SaveCancelButtons';
import { showSuccessNotify } from '../../utils/NotifyUtils';
import { handleErrorMessage } from '../../utils/ErrorUtils';

interface UserDataProps {
  id?: string,
  name: string;
  password: string;
  isAdmin: boolean;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export function UserForm(props: UserDataProps) {
  const [userId, setUserId] = useState(props.id);
  const [name, setName] = useState(props.name);
  const [password, setPassword] = useState(props.password);
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
          await window.userAPI?.updateUser(userId!!, name, isAdmin)
          showSuccessNotify("Usuario actualizado!");
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
        try {
          await window.userAPI.saveUser(name, password, isAdmin);
          showSuccessNotify("Usuario guardado!");
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
        <h2>Datos del usuario:</h2>
        {
          errorMessage ? 
            <div className="error-message-container">
              <MdErrorOutline />
              <span>{ errorMessage }</span>
            </div>
            :
            <></>
        }
        <label>Nombre:</label>
        <input type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
        {
          props.id ?
            <></>
            :
            <>
              <label>Contraseña:</label>
              <input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
            </>
        }
        <div className="checkbox-container">
          <input id="isAdminCheckBox" type="checkbox" checked={isAdmin} onChange={(e: any) => setIsAdmin(e.target.checked)} />
          <label htmlFor="isAdminCheckBox">¿Es administrador?</label>
        </div>
      </div>
      <SaveCancelButtons
        onSave={handleSubmit}
        onCancel={handleCancel} />
    </>
  );
}
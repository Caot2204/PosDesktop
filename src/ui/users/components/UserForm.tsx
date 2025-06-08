import { useState, useEffect } from 'react';
import '../stylesheets/UserForm.css';
import SaveCancelButtons from '../../common/components/SaveCancelButtons';
import { showErrorNotify, showSuccessNotify } from '../../utils/NotifyUtils';

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

  useEffect(() => {
    setUserId(props.id);
    setName(props.name);
    setPassword(props.password);
    setIsAdmin(props.isAdmin);
  }, [props.id, props.name, props.password, props.isAdmin]);

  const handleErrorMessage = (error: any) => {
    let errorMessage = error.message;
    if (typeof errorMessage === "string") {
      const parts = errorMessage.split("Error: ");
      errorMessage = parts[1] ? parts[1] : "Error en la información ingresada";
    }
    showErrorNotify(errorMessage);
  }

  const handleSubmit = async () => {
    if (userId) {
      if (window.userAPI && typeof window.userAPI.updateUser === 'function') {
        try {
          await window.userAPI?.updateUser(userId!!, name, password, isAdmin)
          showSuccessNotify("Usuario actualizado!");
          props.onSaveSuccess();
        } catch (error: any) {
          handleErrorMessage(error);
        }
      } else {
        console.error('window.userAPI.updateUser is not available');
        props.onCancel();
      }
    } else {
      if (window.userAPI && typeof window.userAPI.saveUser === 'function') {
        try {
          await window.userAPI.saveUser(name, password, isAdmin);
          showSuccessNotify("Usuario guardado!");
          props.onSaveSuccess();
        } catch (error: any) {
          handleErrorMessage(error);
        }
      } else {
        console.error('window.userAPI.saveUser is not available');
        props.onCancel();
      }
    }
  };

  return (
    <>
      <div className="user-form">
        <h2>Datos del usuario:</h2>
        <label>Nombre:</label>
        <input type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
        {
          props.id ?
            <></>
            :
            <>
              <label>Contraseña:</label>
              <input type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
            </>
        }
        <div className="checkbox-container">
          <input id="isAdminCheckBox" type="checkbox" checked={isAdmin} onChange={(e: any) => setIsAdmin(e.target.checked)} />
          <label htmlFor="isAdminCheckBox">¿Es administrador?</label>
        </div>
      </div>
      <SaveCancelButtons
        onSave={handleSubmit}
        onCancel={props.onCancel} />
    </>
  );
}
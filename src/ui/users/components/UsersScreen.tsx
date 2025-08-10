import { useEffect, useState, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import { IoAddOutline } from "react-icons/io5";
import '../stylesheets/UsersScreen.css';
import UserSection from './UserSection';
import PosButton from '../../common/components/PosButton';
import { UserForm } from './UserForm';
import User from '../../../data/model/User';
import { showErrorNotify, showSuccessNotify } from '../../utils/NotifyUtils';
import { handleErrorMessage } from '../../utils/ErrorUtils';

function UsersScreen() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [admins, setAdmins] = useState<User[]>([]);
  const [cashiers, setCashiers] = useState<User[]>([]);
  const [userForForm, setUserForForm] = useState<User>();

  const fetchUsers = async () => {
    try {
      const usersRecupered = await window.userAPI?.getAllUsers();
      if (usersRecupered != undefined) {
        const admins = usersRecupered.filter((user) => user.isAdmin);
        const cashiers = usersRecupered.filter((user) => !user.isAdmin);
        setAdmins(admins);
        setCashiers(cashiers);
      }
    } catch (error) {
      showErrorNotify("Error al recuperar los usuarios");
    }
  };

  const handleOpenDialog = () => {
    setUserForForm(new User(undefined, "", "", false));
  };

  const handleEditUser = (user: User) => {
    setUserForForm(user)
  };

  const handleDeleteUser = async (userId: string, isAdmin: boolean) => {
    try {
      await window.userAPI?.deleteUser(userId, isAdmin);
      showSuccessNotify("Usuario eliminado");
    } catch (error) {
      handleErrorMessage(error, showErrorNotify);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userForForm) {
      dialogRef.current?.showModal();
    }
  }, [userForForm]);


  return (
    <div className="users-screen-container">
      <PosButton 
          className="add-user-button"
          icon={<IoAddOutline />}
          label="Nuevo usuario" 
          onClick={handleOpenDialog} />
      <div className="user-sections-container">
        <UserSection 
          role="Administradores" 
          users={admins}
          onUpdateUser={handleEditUser}
          onDeleteUser={handleDeleteUser} />
        <UserSection 
          role="Cajeros" 
          users={cashiers}
          onUpdateUser={handleEditUser}
          onDeleteUser={handleDeleteUser} />
      </div>
      <dialog className="user-form-dialog" ref={dialogRef}>
        <UserForm
          id={userForForm ? userForForm.id : ""}
          name={userForForm ? userForForm.name : ""}
          password={userForForm?.password ? userForForm.password : ""}
          isAdmin={userForForm ? userForForm.isAdmin : false}
          onSaveSuccess={() => {
            fetchUsers();
            dialogRef.current?.close();
          }}
          onCancel={() => {
            dialogRef.current?.close()
          }}
        />
      </dialog>
      <ToastContainer />
    </div>
  );
}

export default UsersScreen;
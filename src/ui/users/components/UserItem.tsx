import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';
import '../stylesheets/UserItem.css';
import PosConfirmDialog from '../../common/components/PosConfirmDialog';
import { useState } from 'react';

interface UserItemProps {
  name: string;
  onUpdate: () => void;
  onDelete: () => void;
}

function UserItem(prop: UserItemProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false);
    prop.onDelete();
  };

  return (
    <>
      <div className="user-container">
        <p className="user-name">{prop.name}</p>
        <div className="user-icons-container">
          <AiOutlineEdit className="user-icon edit" onClick={prop.onUpdate} />
          <RiDeleteBin6Line className="user-icon delete" onClick={() => setShowConfirmDialog(true)} />
        </div>
      </div>
      <PosConfirmDialog
        message="¿Desea eliminar este usuario?"
        isShowed={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onOk={handleConfirmDelete} />
    </>
  );
}

export default UserItem;
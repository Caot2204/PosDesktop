import '../stylesheets/CategoryItem.css';
import { useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';
import PosConfirmDialog from '../../../common/components/PosConfirmDialog';
import { useTranslation } from 'react-i18next';

interface CategoryItemProps {
  name: string;
  isAbleToDelete: boolean;
  onUpdate: () => void;
  onDelete: () => void;
}

function CategoryItem(prop: CategoryItemProps) {
  const { t } = useTranslation('global');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false);
    prop.onDelete();
  };

  return (
    <>
      <div className="category-container">
        <p className="category-name">{prop.name}</p>
        {
          prop.isAbleToDelete
            ?
            <div className="category-icons-container">
              <AiOutlineEdit className="category-icon edit" onClick={prop.onUpdate} />
              <RiDeleteBin6Line className="category-icon delete" onClick={() => setShowConfirmDialog(true)} />
            </div>
            :
            <></>
        }
      </div>
      <PosConfirmDialog
        message={t('items.categoryItem.deleteMessage')}
        isShowed={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onOk={handleConfirmDelete} />
    </>
  );
}

export default CategoryItem;
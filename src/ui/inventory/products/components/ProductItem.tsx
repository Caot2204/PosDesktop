import '../stylesheets/ProductItem.css';
import { useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';
import { formatNumberToCurrentPrice } from '../../../utils/FormatUtils';
import PosConfirmDialog from '../../../common/components/PosConfirmDialog';

interface ProductDataProps {
  code: string;
  name: string;
  unitPrice: number;
  stock: string;
  category: string
  onUpdate: () => void;
  onDelete: () => void;
}

function ProductItem(props: ProductDataProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    console.log("si pasa");
    props.onDelete();
  };

  return (
    <>
      <div className="product-data-container">
        <div className="product-header">
          <span className="product-name">{props.name}</span>
          <div className="button-actions">
            <AiOutlineEdit className="edit-button" onClick={props.onUpdate} />
            <RiDeleteBin6Line className="delete-button" onClick={() => setShowConfirmDialog(true)} />
          </div>
        </div>
        <ul>
          <li>
            <span>Código:</span>&emsp;{props.code}
          </li>
          <li>
            <span>Precio:</span>&emsp;{formatNumberToCurrentPrice(props.unitPrice)}
          </li>
          <li>
            <span>Stock:</span>&emsp;{props.stock}
          </li>
          <li>
            <span>Categoría:</span>&emsp;{props.category}
          </li>
        </ul>
      </div>
      <PosConfirmDialog
        message="¿Desea eliminar este producto?"
        isShowed={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onOk={handleConfirmDelete} />
    </>
  );
}

export default ProductItem;
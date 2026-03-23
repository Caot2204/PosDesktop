import '../stylesheets/ProductItem.css';
import { useState } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';
import { formatNumberToCurrentPrice } from '../../../utils/FormatUtils';
import PosConfirmDialog from '../../../common/components/PosConfirmDialog';
import { useTranslation } from 'react-i18next';

interface ProductDataProps {
  code: string;
  name: string;
  unitPrice: number;
  stock: string;
  category: string;
  minimunStock: number;
  onUpdate: () => void;
  onDelete: () => void;
}

function ProductItem(props: ProductDataProps) {
  const { t } = useTranslation('global');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    props.onDelete();
  };

  return (
    <>
      <div className="product-data-container">
        <div className="product-header">
          <span className="product-name">{props.name}</span>
          <div className="button-actions">
            <AiOutlineEdit className="product-edit-button" onClick={props.onUpdate} />
            <RiDeleteBin6Line className="product-delete-button" onClick={() => setShowConfirmDialog(true)} />
          </div>
        </div>
        <ul>
          <li>
            <span className="label-span">{t('items.productItem.codeLabel')}</span>&emsp;{props.code}
          </li>
          <li>
            <span className="label-span">{t('items.productItem.priceLabel')}</span>&emsp;{formatNumberToCurrentPrice(props.unitPrice)}
          </li>
          <li>
            <span className="label-span">{t('items.productItem.stockLabel')}</span>&emsp;<span className={ Number(props.stock) <= props.minimunStock ? "low-stock" : "" }>{props.stock}</span>
          </li>
          <li>
            <span className="label-span">{t('items.productItem.categoryLabel')}</span>&emsp;{props.category}
          </li>
        </ul>
      </div>
      <PosConfirmDialog
        message={t('items.productItem.deleteMessage')}
        isShowed={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onOk={handleConfirmDelete} />
    </>
  );
}

export default ProductItem;
import '../stylesheets/ProductItem.css';
import { memo } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';
import { formatNumberToCurrentPrice } from '../../../utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import type Product from '../../../../data/model/Product';

interface ProductDataProps {
  product: Product;
  minimunStock: number;
  onEdit: (product: Product) => void;
  onRequestDelete: (code: string) => void;
}

function ProductItem({ product, minimunStock, onEdit, onRequestDelete }: ProductDataProps) {
  const { t } = useTranslation('global');
  const allCategoryLabel = t("screens.inventory.allCategoryLabel");
  const stock = product.isInfinityStock ? t('screens.inventory.infinityLabel') : String(product.stock);

  return (
    <div className="product-data-container">
      <div className="product-header">
        <span className="product-name">{product.name}</span>
        <div className="button-actions">
          <AiOutlineEdit className="product-edit-button" onClick={() => onEdit(product)} />
          <RiDeleteBin6Line className="product-delete-button" onClick={() => onRequestDelete(product.code)} />
        </div>
      </div>
      <ul>
        <li>
          <span className="label-span">{t('items.productItem.codeLabel')}</span>&emsp;{product.code}
        </li>
        <li>
          <span className="label-span">{t('items.productItem.priceLabel')}</span>&emsp;{formatNumberToCurrentPrice(product.unitPrice)}
        </li>
        <li>
          <span className="label-span">{t('items.productItem.stockLabel')}</span>&emsp;<span className={ Number(stock) <= minimunStock ? "low-stock" : "" }>{stock}</span>
        </li>
        <li>
          <span className="label-span">{t('items.productItem.categoryLabel')}</span>&emsp;{product.category == "Todos" ? allCategoryLabel : product.category}
        </li>
      </ul>
    </div>
  );
}

export default memo(ProductItem);

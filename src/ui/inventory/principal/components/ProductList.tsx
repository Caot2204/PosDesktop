import '../stylesheets/ProductList.css';
import { useCallback, useMemo, useState } from "react";
import type Product from "../../../../data/model/Product";
import ProductItem from "../../products/components/ProductItem";
import PosConfirmDialog from "../../../common/components/PosConfirmDialog";
import { useTranslation } from 'react-i18next';

interface ProductListProps {
  products: Product[];
  categoryFilter: string;
  searchFilter: string;
  minimumStock: number;
  onEditProduct: (product: Product) => void;
  onDeleteProductSuccess: () => void;
}

function ProductList(props: ProductListProps) {
  const { t } = useTranslation('global');
  const allCategoryLabel = t('screens.inventory.allCategoryLabel');

  const [codeToDelete, setCodeToDelete] = useState<string | null>(null);

  const handleRequestDelete = useCallback((code: string) => setCodeToDelete(code), []);

  const handleConfirmDelete = async () => {
    const code = codeToDelete;
    setCodeToDelete(null);
    if (code === null) return;
    await window.productAPI?.deleteProduct(code);
    props.onDeleteProductSuccess();
  };

  const productsToShow = useMemo(() => {
    let products = props.products;
    if (props.categoryFilter !== allCategoryLabel) {
      products = products.filter(product => product.category === props.categoryFilter);
    }
    if (props.searchFilter.trim() !== "") {
      const search = props.searchFilter.toLowerCase();
      products = products.filter(product => product.name.toLowerCase().includes(search) || product.code.toLowerCase().includes(search));
    }
    return products;
  }, [props.products, props.categoryFilter, props.searchFilter, allCategoryLabel]);

  return (
    <div className="products-list-container">
      {
        productsToShow.map((product: Product) => (
          <ProductItem
            key={product.code}
            product={product}
            minimunStock={props.minimumStock}
            onEdit={props.onEditProduct}
            onRequestDelete={handleRequestDelete} />
        ))
      }
      <PosConfirmDialog
        message={t('items.productItem.deleteMessage')}
        isShowed={codeToDelete !== null}
        onCancel={() => setCodeToDelete(null)}
        onOk={handleConfirmDelete} />
    </div>
  );
}

export default ProductList;
import '../stylesheets/IncreaseStockScreen.css';
import { useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import PosButton from '../../../common/components/PosButton';
import SearchProductScreen from '../../products/components/SearchProductScreen';
import type Product from '../../../../data/model/Product';
import { showErrorNotify, showSuccessNotify } from '../../../utils/NotifyUtils';
import { handleErrorMessage } from '../../../utils/ErrorUtils';
import { useTranslation } from 'react-i18next';

interface IncreaseStockScreen {
  products: Product[];
  onIncreaseSuccesfully: () => void;
}

function IncreaseStockScreen(props: IncreaseStockScreen) {
  const { t } = useTranslation('global');
  const [productCode, setProductCode] = useState("");
  const [unitsToIncrease, setUnitsToIncrease] = useState(0);
  const [openDialog, setOpenDialog] = useState<'searchProduct' | null>(null);

  const clearForm = () => {
    setProductCode("");
    setUnitsToIncrease(0);
  };

  const handleProductSearchedClicked = (product: Product) => {
    setProductCode(product.code);
    setOpenDialog(null);
  };

  const handleIncreaseStock = async () => {
    try {
      await window.productAPI?.increaseStock(productCode, unitsToIncrease);
      showSuccessNotify(t('screens.increaseStock.stockUpdated'));
      clearForm();
      props.onIncreaseSuccesfully();
    } catch (error) {
      handleErrorMessage(error, showErrorNotify);
    }
  };

  return (
    <div className="increase-stock-container">
      <h2>{t('screens.increaseStock.title')}</h2>
      <label>{t('screens.increaseStock.codeLabel')}</label>
      <div className="code-product-container">
        <input value={productCode} className="product-code-input" type="text" autoFocus onChange={(e) => setProductCode(e.target.value)} />
        <FaSearch className="search-icon" onClick={() => setOpenDialog("searchProduct")} />
      </div>
      <label>{t('screens.increaseStock.unitsToAddLabel')}</label>
      <input value={unitsToIncrease} type="number" onChange={(e) => setUnitsToIncrease(Number(e.target.value))} />
      <div className="button-div">
        <PosButton
          label={t('screens.increaseStock.addLabel')}
          onClick={handleIncreaseStock} />
      </div>
      <dialog className="pos-dialog search-product-dialog" open={openDialog === "searchProduct"}>
        <div className="header-dialog">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setOpenDialog(null);
          }} />
        </div>
        <SearchProductScreen
          isShowed={openDialog === "searchProduct"}
          products={props.products}
          onProductClicked={handleProductSearchedClicked} />
      </dialog>
    </div>
  );
}

export default IncreaseStockScreen;
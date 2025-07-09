import '../stylesheets/NewSaleScreen.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CiBarcode } from "react-icons/ci";
import { FaSearch } from 'react-icons/fa';
import { MdDateRange, MdOutlineCancel } from "react-icons/md";
import { ToastContainer } from 'react-toastify';
import PosButton from '../../common/components/PosButton';
import SalesProductList from './SalesProductList';
import SaleProductModel from '../model/SalesProductModel';
import TotalForPayLabel from './TotalForPayLabel';
import SearchProductScreen from '../../inventory/products/components/SearchProductScreen';
import type Product from '../../../data/model/Product';
import { showErrorNotify, showSuccessNotify } from '../../utils/NotifyUtils';
import PosConfirmDialog from '../../common/components/PosConfirmDialog';
import PayScreen from './PayScreen';

function NewSaleScreen() {
  const searchDialogRef = useRef<HTMLDialogElement>(null);
  const payDialogRef = useRef<HTMLDialogElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const [openDialog, setOpenDialog] = useState<null | 'confirmDialog' | 'searchProduct' | 'paydialog'>(null);

  const [productCodeInput, setProductCodeInput] = useState("");
  const [productsOfSale, setProductsOfSale] = useState<SaleProductModel[]>([]);
  const [totalSale, setTotalSale] = useState(0.0);

  const getCurrentDate = useCallback(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  }, []);

  const handleClearScreen = () => {
    searchDialogRef.current?.close();
    if (codeInputRef.current) {
      codeInputRef.current.value = "";
    }
    setProductsOfSale([]);
    setOpenDialog(null);
  };

  const handleAddProduct = (product: Product) => {
    const index = productsOfSale.findIndex(saleProduct => saleProduct.code === product.code);
    if (index !== -1) {
      const updateProducts = productsOfSale.map((product, i) => (
        i === index ? { ...product, unitsToSale: product.unitsToSale + 1 } : product
      ));
      handleClearScreen();
      setProductsOfSale(updateProducts);
    } else {
      const productToSale = new SaleProductModel(
        product.code,
        product.name,
        product.unitPrice,
        1,
        product.isInfinityStock ? 'infinity' : product.stock
      );
      handleClearScreen();
      setProductsOfSale([...productsOfSale, productToSale]);
    }
  };

  const handleModifyProductsUnits = (code: string, units: number) => {
    const index = productsOfSale.findIndex(saleProduct => saleProduct.code === code);
    if (index !== -1) {
      const updateProducts = productsOfSale.map((product, i) => (
        i === index ? { ...product, unitsToSale: units } : product
      ));
      handleClearScreen();
      setProductsOfSale(updateProducts);
    }
  };

  const handlePaySale = () => {
    setOpenDialog(null);
    handleClearScreen();
    showSuccessNotify("Venta realizada");
  };

  useEffect(() => {
    let tempTotalSale: number = 0.0;
    productsOfSale.forEach(product => {
      tempTotalSale += (product.unitPrice * product.unitsToSale);
    });
    setTotalSale(tempTotalSale);
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [productsOfSale]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (openDialog) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpenDialog(null);
      }

      if (e.key === "F10") {
        e.preventDefault();
        setOpenDialog("searchProduct");
      }

      if (e.key === "F1") {
        e.preventDefault();
        setOpenDialog("paydialog");
      }

      if (e.key === "F4") {
        e.preventDefault();
        setOpenDialog("confirmDialog");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [openDialog]);

  return (
    <div className="new-sale-container">
      <div className={openDialog ? "code-input filter-blur" : "code-input"}>
        <CiBarcode className="codebar-icon" />
        <input
          ref={codeInputRef}
          className="code-input-sale"
          type="text"
          autoFocus
          placeholder="Ingrese el código del producto..."
          onChange={(e) => setProductCodeInput(e.target.value)}
          onKeyDown={async e => {
            if (e.key === 'Enter') {
              const product = await window.productAPI?.getProductByCode(productCodeInput);
              if (product) {
                handleAddProduct(product);
              } else {
                showErrorNotify("Producto no encontrado");
                if (codeInputRef.current) {
                  codeInputRef.current.value = "";
                }
              };
            }
          }} />
        <PosButton
          className="search-button"
          icon={<FaSearch />}
          label="Buscar (F10)"
          onClick={() => setOpenDialog("searchProduct")} />
      </div>
      <div className={openDialog ? "filter-blur" : ""}>
        <SalesProductList
          products={productsOfSale}
          onModifyProductUnits={handleModifyProductsUnits} />
      </div>
      <div className={openDialog ? "pay-container filter-blur" : "pay-container"} >
        <TotalForPayLabel
          total={totalSale} />
        <div className="pay-buttons-container">
          <PosButton
            className="pay-button cancel-button"
            label="Cancelar (F4)"
            onClick={() => setOpenDialog("confirmDialog")} />
          <PosButton
            disabled={totalSale === 0}
            className="pay-button"
            label="Pagar (F1)"
            onClick={() => setOpenDialog("paydialog")} />
        </div>
      </div>
      <div className={openDialog ? "date-container filter-blur" : "date-container"} >
        <MdDateRange className="date-icon" />
        <span className="date-label">{getCurrentDate()}</span>
      </div>
      <dialog className="pos-dialog search-product-dialog" ref={searchDialogRef} open={openDialog === "searchProduct"}>
        <div className="header-dialog">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setOpenDialog(null);
          }} />
        </div>
        <SearchProductScreen
          onProductClicked={handleAddProduct} />
      </dialog>
      <dialog className="pos-dialog payscreen" ref={payDialogRef} open={openDialog === "paydialog"}>
        <PayScreen
          totalSale={totalSale}
          onCancel={() => setOpenDialog(null)}
          onPaySale={handlePaySale} />
      </dialog>
      <PosConfirmDialog
        message="¿Quitar los producto de la venta actual?"
        isShowed={openDialog === "confirmDialog"}
        onCancel={() => {
          setOpenDialog(null);
          codeInputRef.current?.focus();
        }}
        onOk={handleClearScreen} />
      <ToastContainer />
    </div>
  );
}

export default NewSaleScreen;
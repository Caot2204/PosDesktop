import '../stylesheets/NewSaleScreen.css';
import { useEffect, useRef, useState } from 'react';
import { CiBarcode } from "react-icons/ci";
import { FaSearch } from 'react-icons/fa';
import { MdOutlineCancel } from "react-icons/md";
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
import SalesScreen from './SalesScreen';
import CashClosingScreen from './CashClosingScreen';
import type UserSession from '../../../data/model/UserSession';
import CotizationProduct from '../../../data/model/CotizationProduct';
import { useTranslation } from 'react-i18next';

interface NewSaleScreenProps {
  currentUser: UserSession;
  products: SaleProductModel[] | CotizationProduct[];
  clearProductsCotizationData: () => void;
}

function NewSaleScreen(props: NewSaleScreenProps) {
  const { t } = useTranslation('global');
  const searchDialogRef = useRef<HTMLDialogElement>(null);
  const payDialogRef = useRef<HTMLDialogElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const [openDialog, setOpenDialog] = useState<null | 'confirmDialog' | 'searchProduct' | 'paydialog' | 'salesDialog' | 'cashClosingDialog'>(null);
  const [bussinessName, setBussinessName] = useState("");
  const [bussinessLogoUrl, setBussinessLogoUrl] = useState('../icons/icon.png');

  const [productCodeInput, setProductCodeInput] = useState("");
  const [productsOfSale, setProductsOfSale] = useState<SaleProductModel[]>([]);
  const [totalSale, setTotalSale] = useState(0.0);

  const handleClearScreen = () => {
    searchDialogRef.current?.close();
    if (codeInputRef.current) {
      codeInputRef.current.value = "";
    }
    setProductsOfSale([]);
    window.saleAPI?.clearCurrentSaleBackup()
      .then(() => { })
      .catch((e) => console.log(e));
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

  const handleDeleteProductOfSale = (code: string) => {
    const index = productsOfSale.findIndex(saleProduct => saleProduct.code === code);
    if (index !== -1) {
      const updateProducts: SaleProductModel[] = productsOfSale.filter(product => code !== product.code);
      setProductsOfSale(updateProducts);
    }
  };

  const handlePaySale = (paymentType: string, amountPayed: number, paymentFolio: string | null) => {
    const currentDate = new Date();
    window.saleAPI?.saveSale(
      currentDate,
      props.currentUser.userName,
      productsOfSale,
      paymentType,
      paymentType === "Tarjeta" ? totalSale : amountPayed,
      paymentFolio,
      totalSale
    )
      .then(() => {
        showSuccessNotify(t('screens.newSale.saleSuccess'));
        setOpenDialog(null);
        handleClearScreen();
      })
      .catch((error) => {
        console.log(error);
        showErrorNotify(t('screens.newSale.errorSale'));
      });
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
    if (productsOfSale.length > 0) {
      window.saleAPI?.createCurrentSaleBackup(productsOfSale)
        .then(() => { })
        .catch((error) => console.log(error));
    }
  }, [productsOfSale]);

  useEffect(() => {
    if (openDialog === null) {
      codeInputRef.current?.focus();
    }
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

  function isSaleProductArray(arr: any[]): arr is SaleProductModel[] {
    return arr.length > 0 && arr[0] instanceof SaleProductModel;
  };

  useEffect(() => {
    window.posConfigAPI?.getPosConfig()
      .then(posConfig => {
        setBussinessName(posConfig?.bussinessName);
        setBussinessLogoUrl(posConfig?.bussinessLogoUrl);
      });
    if (props.products) {
      if (isSaleProductArray(props.products)) {
        setProductsOfSale(props.products);
      } else {
        const products = props.products;
        if (products && products.length > 0) {
          const loadProducts = async () => {
            try {
              const productsSaleModel = await Promise.all(
                products!.map(async (p: CotizationProduct) => {
                  const productDb = await window.productAPI?.getProductByCode(p.productCode);
                  if (productDb) {
                    return new SaleProductModel(
                      productDb.code,
                      productDb.name,
                      productDb.unitPrice,
                      p.unitsSold,
                      productDb.isInfinityStock ? 'infinity' : productDb.stock
                    );
                  }
                  return null;
                })
              );
              setProductsOfSale(productsSaleModel.filter((p): p is SaleProductModel => p !== null));
            } catch (error) {
              showErrorNotify(t('screens.newSale.errorLoadProductsCotization'));
            }
          };
          loadProducts();
        } else {
          setProductsOfSale([]);
        }
      }
      props.clearProductsCotizationData();
    } else {
      window.saleAPI?.getCurrentSaleBackup()
        .then(productsSold => {
          setProductsOfSale(productsSold);
        })
        .catch((error) => {
          console.log("Error al recuperar el backup de la venta actual: ", error);
        });
    }
  }, []);

  return (
    <div className="new-sale-container">
      <div className={openDialog ? "code-input filter-blur" : "code-input"}>
        <CiBarcode className="codebar-icon" />
        <input
          ref={codeInputRef}
          className="code-input-sale"
          type="text"
          maxLength={100}
          autoFocus
          placeholder={t('screens.newSale.enterCodePlaceHolder')}
          onChange={(e) => setProductCodeInput(e.target.value)}
          onKeyDown={async e => {
            if (e.key === 'Enter') {
              try {
                const product = await window.productAPI?.getProductByCode(productCodeInput);
                if (product) {
                  handleAddProduct(product);
                }
              } catch (e) {
                showErrorNotify(t('screens.newSale.productNotFound'));
                if (codeInputRef.current) {
                  codeInputRef.current.value = "";
                }
              }
            };
          }} />
        <PosButton
          className="search-button"
          icon={<FaSearch />}
          label={t('buttons.searchProduct')}
          onClick={() => setOpenDialog("searchProduct")} />
      </div>
      <div className={openDialog ? "filter-blur" : ""}>
        <SalesProductList
          products={productsOfSale}
          onModifyProductUnits={handleModifyProductsUnits}
          onDeleteProductOfSale={handleDeleteProductOfSale} />
      </div>
      <div className={openDialog ? "pay-container filter-blur" : "pay-container"} >
        <TotalForPayLabel
          total={totalSale} />
        <div className="pay-buttons-container">
          <PosButton
            className="pay-button cancel-button"
            label={t('screens.newSale.cancelSaleLabel')}
            onClick={() => setOpenDialog("confirmDialog")} />
          <PosButton
            disabled={totalSale === 0}
            className="pay-button"
            label={t('screens.newSale.paySaleLabel')}
            onClick={() => setOpenDialog("paydialog")} />
        </div>
      </div>
      <div className={openDialog ? "extras-container filter-blur" : "extras-container"} >
        <div className="bussiness-info-container">
          <img
            className="newsale-bussiness-logo"
            src={bussinessLogoUrl}
            alt="bussiness-logo" />
          <h3>{bussinessName}</h3>
        </div>
        <div className="sale-buttons-extra">
          <PosButton
            className="extra-button"
            label={t('screens.newSale.salesOfDayLabel')}
            onClick={() => setOpenDialog("salesDialog")} />
          <PosButton
            className="extra-button"
            label={t('screens.newSale.cashClosingLabel')}
            onClick={() => setOpenDialog("cashClosingDialog")} />
        </div>
      </div>
      <dialog className="pos-dialog search-product-dialog" ref={searchDialogRef} open={openDialog === "searchProduct"}>
        <div className="header-dialog">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setOpenDialog(null);
          }} />
        </div>
        <SearchProductScreen
          isShowed={openDialog === "searchProduct"}
          onProductClicked={handleAddProduct} />
      </dialog>
      <dialog className="pos-dialog payscreen" ref={payDialogRef} open={openDialog === "paydialog"}>
        <PayScreen
          isShowed={openDialog === "paydialog"}
          totalSale={totalSale}
          onCancel={() => setOpenDialog(null)}
          onPaySale={handlePaySale} />
      </dialog>
      <dialog className="pos-dialog sales-dialog" open={openDialog === "salesDialog"}>
        <div className="header-dialog">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setOpenDialog(null);
          }} />
        </div>
        <SalesScreen
          isShowed={openDialog === "salesDialog"} />
      </dialog>
      <dialog className="pos-dialog cashclosing-dialog" open={openDialog === "cashClosingDialog"}>
        <div className="header-dialog">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setOpenDialog(null);
          }} />
        </div>
        <CashClosingScreen
          isShowed={openDialog === "cashClosingDialog"}
          currentUser={props.currentUser.userName}
          onClose={() => setOpenDialog(null)} />
      </dialog>
      <PosConfirmDialog
        message={t('screens.newSale.quitProductsMessage')}
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
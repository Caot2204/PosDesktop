import '../stylesheets/CotizationScreen.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CiBarcode } from 'react-icons/ci';
import { showErrorNotify, showSuccessNotify } from '../../../ui/utils/NotifyUtils';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { IoMdArrowRoundBack } from "react-icons/io";
import SaleProductModel from '../../../ui/sales/model/SalesProductModel';
import Product from "../../../data/model/Product";
import SearchProductScreen from '../../../ui/inventory/products/components/SearchProductScreen';
import SalesProductList from '../../../ui/sales/components/SalesProductList';
import PosButton from '../../../ui/common/components/PosButton';
import { formatNumberToCurrentPrice, toInputDateValue } from '../../../ui/utils/FormatUtils';
import CotizationProduct from '../../../data/model/CotizationProduct';

interface CotizationScreenProps {
  id?: number;
  dateOfCotization?: Date;
  client?: string;
  userToRegister?: string;
  products?: CotizationProduct[];
  isForEdit: boolean;
  onSuccess: (cotizationId: number) => void;
  onCancel: () => void;
}

function CotizationScreen(props: CotizationScreenProps) {
  const codeInputRef = useRef<HTMLInputElement>(null);
  const searchDialogRef = useRef<HTMLDialogElement>(null);
  const [openDialog, setOpenDialog] = useState<null | 'searchProduct'>(null);
  const [productCodeInput, setProductCodeInput] = useState("");

  const [client, setClient] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totalOfCotization, setTotalOfCotization] = useState(0);
  const [products, setProducts] = useState<SaleProductModel[]>([]);

  const handleClearScreen = () => {
    setClient("");
    setOpenDialog(null);
    setProducts([]);
    setProductCodeInput("");
    setCurrentDate(new Date());
    setTotalOfCotization(0);
  };

  const handleClearProductInput = () => {
    setOpenDialog(null);
    setProductCodeInput("");
    searchDialogRef.current?.close();
    if (codeInputRef.current) {
      codeInputRef.current.value = "";
    }
  };

  const handleAddProduct = (product: Product) => {
    const index = products.findIndex(saleProduct => saleProduct.code === product.code);
    if (index !== -1) {
      const updateProducts = products.map((product, i) => (
        i === index ? { ...product, unitsToSale: product.unitsToSale + 1 } : product
      ));
      handleClearProductInput();
      setProducts(updateProducts);
    } else {
      const productToSale = new SaleProductModel(
        product.code,
        product.name,
        product.unitPrice,
        1,
        product.isInfinityStock ? 'infinity' : product.stock
      );
      handleClearProductInput();
      setProducts([...products, productToSale]);
    }
  };

  const handleModifyProductsUnits = (code: string, units: number) => {
    const index = products.findIndex(saleProduct => saleProduct.code === code);
    if (index !== -1) {
      const updateProducts = products.map((product, i) => (
        i === index ? { ...product, unitsToSale: units } : product
      ));
      handleClearProductInput();
      setProducts(updateProducts);
    }
  };

  const handleDeleteProductOfSale = (code: string) => {
    const index = products.findIndex(saleProduct => saleProduct.code === code);
    if (index !== -1) {
      const updateProducts: SaleProductModel[] = products.filter(product => code !== product.code);
      setProducts(updateProducts);
    }
  };

  const handleSaveCotization = async () => {
    try {
      if (!props.isForEdit) {
        const cotizationId = await window.cotizationAPI?.saveCotization(
          currentDate,
          client,
          props.userToRegister,
          products.map((p: SaleProductModel) => new CotizationProduct(
            p.code,
            p.unitsToSale
          )));
        handleClearScreen();
        props.onSuccess(cotizationId);
      } else {
        await window.cotizationAPI?.updateCotization(
          props.id,
          currentDate,
          client,
          props.userToRegister,
          products.map((p: SaleProductModel) => new CotizationProduct(
            p.code,
            p.unitsToSale
          ))
        );
        handleClearScreen();
        props.onSuccess(props.id);
      }
    } catch (error) {
      showErrorNotify("Error al guardar la cotización, inténtelo de nuevo");
    }
  };

  useEffect(() => {
    setClient(props.client ? props.client : "");
    setCurrentDate(props.dateOfCotization ? props.dateOfCotization : new Date());
  }, [props.client, props.dateOfCotization]);

  useEffect(() => {
    if (props.products && props.products.length > 0) {
      const loadProducts = async () => {
        try {
          const productsSaleModel = await Promise.all(
            props.products!.map(async (p: CotizationProduct) => {
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
          setProducts(productsSaleModel.filter((p): p is SaleProductModel => p !== null));
        } catch (error) {
          showErrorNotify("Error al cargar los productos de la cotización");
        }
      };
      loadProducts();
    } else {
      setProducts([]);
    }
  }, [props.products]);

  useEffect(() => {
    let tempTotal: number = 0.0;
    products.forEach(product => {
      tempTotal += (product.unitPrice * product.unitsToSale);
    });
    setTotalOfCotization(tempTotal);
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [products]);

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
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [openDialog]);

  return (
    <>
      <div className={openDialog ? 'cotizationscreen-container filter-blur' : 'cotizationscreen-container'}>
        <div className='back-container' onClick={props.onCancel}>
          <IoMdArrowRoundBack />
          <label>Regresar</label>
        </div>
        <div className='cotization-data-container'>
          <div className='cotization-data-header'>
            <div className='cotization-inputs'>
              <label>Cliente:</label>
              <input
                type='text'
                maxLength={100}
                value={client}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setClient(e.target.value)} />
              <label>Fecha de la cotización:</label>
              <input
                type="date"
                value={toInputDateValue(currentDate)}
                disabled={true} />
            </div>
            <div className='total-cotization-container'>
              <label
                className='total-cotization-label'
              >
                Total: {formatNumberToCurrentPrice(totalOfCotization)}
              </label>
              <PosButton
                label='Guardar cotizatión'
                onClick={handleSaveCotization} />
            </div>
          </div>
          <div className={openDialog ? "code-input filter-blur" : "code-input"}>
            <CiBarcode className="codebar-icon" />
            <input
              ref={codeInputRef}
              className="code-input-sale"
              type="text"
              maxLength={100}
              autoFocus
              placeholder="Ingrese el código del producto..."
              onChange={(e) => setProductCodeInput(e.target.value)}
              onKeyDown={async e => {
                if (e.key === 'Enter') {
                  try {
                    const product = await window.productAPI?.getProductByCode(productCodeInput);
                    if (product) {
                      handleAddProduct(product);
                    }
                  } catch (e) {
                    showErrorNotify("Producto no encontrado");
                    if (codeInputRef.current) {
                      codeInputRef.current.value = "";
                    }
                  }
                };
              }} />
            <PosButton
              className="search-button"
              icon={<FaSearch />}
              label="Buscar (F10)"
              onClick={() => setOpenDialog("searchProduct")} />
          </div>
          <SalesProductList
            products={products}
            onModifyProductUnits={handleModifyProductsUnits}
            onDeleteProductOfSale={handleDeleteProductOfSale} />
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
    </>
  );
}

export default CotizationScreen;
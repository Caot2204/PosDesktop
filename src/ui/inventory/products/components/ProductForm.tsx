import '../stylesheets/ProductForm.css';
import { useEffect, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';
import OkCancelButtons from '../../../common/components/OkCancelButtons';
import { handleErrorMessage } from '../../../utils/ErrorUtils';
import type Category from '../../../../data/model/Category';
import CategorySelect from '../../categories/components/CategorySelect';
import { showSuccessNotify } from '../../../utils/NotifyUtils';

interface ProductDataProps {
  code?: string;
  name?: string;
  unitPrice?: number;
  stock?: number;
  isInfinityStock?: boolean;
  category?: string;
  forEdit?: boolean;
  categories: Category[];
  onSaveSuccess: () => void;
  onCancel: () => void;
}

function ProductForm(props: ProductDataProps) {
  const [productCode, setProductCode] = useState(props.code ? props.code : "");
  const [productName, setProductName] = useState(props.name ? props.name : "");
  const [unitPrice, setUnitPrice] = useState(props.unitPrice ? String(props.unitPrice) : "0");
  const [stock, setStock] = useState(props.stock ? String(props.stock) : "1");
  const [isInfinityStock, setInfinityStock] = useState(props.isInfinityStock ? props.isInfinityStock : false);
  const [category, setCategory] = useState(props.category ? props.category : "Todos");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clearForm = () => {
    setProductCode("");
    setProductName("");
    setUnitPrice("0");
    setStock("1");
    setInfinityStock(false);
    setCategory("Todos");
    setErrorMessage(null);
  };

  const handleCancel = () => {
    clearForm();
    props.onCancel();
  };

  const handleSubmit = async () => {
    if (props.forEdit) {
      try {
        await window.productAPI?.updateProduct(
          productCode,
          productName,
          Number(unitPrice),
          Number(stock),
          isInfinityStock,
          category,
          productCode !== props.code ? props.code : undefined
        );
        showSuccessNotify("Producto actualizado!");
        clearForm();
        props.onSaveSuccess();
      } catch (error) {
        handleErrorMessage(error, setErrorMessage);
      }

    } else {
      window.productAPI?.saveProduct(productCode, productName, Number(unitPrice), Number(stock), isInfinityStock, category)
        .then(() => {
          showSuccessNotify("Producto guardado!");
          clearForm();
          props.onSaveSuccess();
        })
        .catch((error) => {
          handleErrorMessage(error, setErrorMessage);
        });
    }
  };

  useEffect(() => {
    setProductCode(props.code ? props.code : "");
    setProductName(props.name ? props.name : "");
    setUnitPrice(props.unitPrice ? String(props.unitPrice) : "0");
    setStock(props.stock ? String(props.stock) : "1");
    setInfinityStock(props.isInfinityStock ? props.isInfinityStock : false);
    setCategory(props.category ? props.category : "Todos");
    setErrorMessage(null);
  }, [props.code, props.name, props.unitPrice, props.stock, props.isInfinityStock, props.isInfinityStock, props.category]);

  return (
    <div className="product-form">
      <h2>Datos del producto:</h2>
      {
        errorMessage
          ?
          <div className="error-message-container">
            <MdErrorOutline />
            <span>{errorMessage}</span>
          </div>
          :
          <></>
      }
      <label>Código del producto:</label>
      <input 
        disabled={props.forEdit} 
        type="text" 
        value={productCode}
        maxLength={50} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductCode(e.target.value)} />
      <label>Nombre:</label>
      <input 
        type="text" 
        value={productName}
        maxLength={100} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)} />
      <label>Precio unitario:</label>
      <input 
        type="number" 
        value={unitPrice} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnitPrice(e.target.value)} />
      <label>Stock:</label>
      <input 
        type="number" 
        value={stock} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStock(e.target.value)} />
      <label>¿Stock infinito?</label>
      <input 
        type="checkbox" 
        checked={isInfinityStock} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInfinityStock(e.target.checked)} />
      <CategorySelect
        selected={category}
        options={props.categories}
        onCategorySelected={setCategory} />
      <OkCancelButtons
        onSave={handleSubmit}
        onCancel={handleCancel} />
    </div>
  );
}

export default ProductForm;
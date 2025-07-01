import '../stylesheets/InventoryScreen.css';
import { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import PosButton from '../../../common/components/PosButton';
import CategoryScreen from '../../categories/components/CategoryScreen';
import ProductForm from '../../products/components/ProductForm';
import Product from '../../../../data/model/Product';
import { showErrorNotify, showSuccessNotify } from '../../../utils/NotifyUtils';
import CategorySelect from '../../categories/components/CategorySelect';
import type Category from '../../../../data/model/Category';
import { ToastContainer } from 'react-toastify';
import ProductList from './ProductList';

function InventoryScreen() {
  const categoriesDialogRef = useRef<HTMLDialogElement>(null);
  const productFormDialogRef = useRef<HTMLDialogElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [searchFilter, setSearchFilter] = useState("");
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined)

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await window.productAPI?.getAllProducts();
      if (fetchedProducts !== undefined) {
        setFetchedProducts(fetchedProducts);
      }
    } catch (error) {
      showErrorNotify("Error al recuperar los productos");
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await window.categoryAPI?.getAllCategories();
      if (fetchedCategories !== undefined) {
        setCategories(fetchedCategories);
      }
    } catch (error) {
      showErrorNotify("Error al recuperar las categorias");
    }
  };

  const handleCloseProductDialog = () => {
    setIsOpenDialog(false);
    setProductToEdit(undefined);
    productFormDialogRef.current?.close();
  };
  
  const handleClearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setSearchFilter("");
  };

  const handleEditProduct = (product: Product) => {
    setIsOpenDialog(true);
    setProductToEdit(product);
    fetchProducts();
    productFormDialogRef.current?.show();
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    setCategoryFilter("Todos");
    setLoadingData(false);
  }, [loadingData]);

  return (
    <div className="inventory-container">
      <div className={isOpenDialog ? "actions-container filter-blur" : "actions-container"}>
        <span className="label-section">Categoría: </span>
        <CategorySelect
          selected={categoryFilter}
          options={categories}
          onCategorySelected={setCategoryFilter} />
        <hr />
        <span className="label-section">Acciones: </span>
        <PosButton
          label="Nuevo producto"
          onClick={() => {
            setIsOpenDialog(true);
            productFormDialogRef.current?.show()
            categoriesDialogRef.current?.close();
          }} />
        <PosButton
          label="Admin. categorías"
          onClick={() => {
            setIsOpenDialog(true);
            categoriesDialogRef.current?.show()
            productFormDialogRef.current?.close();
          }} />
        <PosButton
          label="Incrementar stock"
          onClick={() => { }} />
      </div>
      <div className={isOpenDialog ? "products-container filter-blur" : "products-container"}>
        <div className="search-product-container">
          <FaSearch />
          <input className="search-input" ref={searchInputRef} type="text" placeholder="Ingrese el nombre o código del producto..." onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)} />
          <MdOutlineCancel onClick={handleClearSearch}/>
        </div>
        <ProductList
          products={fetchedProducts}
          categoryFilter={categoryFilter}
          searchFilter={searchFilter}
          onEditProduct={handleEditProduct}
          onDeleteProductSuccess={() => {
            showSuccessNotify("Producto eliminado!");
            fetchProducts();
          }} />
      </div>
      <dialog className="pos-dialog" ref={categoriesDialogRef}>
        <div className="categories-header">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setIsOpenDialog(false);
            categoriesDialogRef.current?.close();
            setLoadingData(true);
          }} />
        </div>
        <CategoryScreen />
      </dialog>
      <dialog className="pos-dialog" ref={productFormDialogRef}>
        <ProductForm
          code={productToEdit ? productToEdit.code : ""}
          name={productToEdit ? productToEdit.name : ""}
          unitPrice={productToEdit ? productToEdit.unitPrice : 0}
          stock={productToEdit ? productToEdit.stock : 0}
          isInfinityStock={productToEdit ? productToEdit.isInfinityStock : false}
          category={productToEdit ? productToEdit.category : "Todos"}
          forEdit={productToEdit ? true : false}
          categories={categories}
          onSaveSuccess={() => {
            fetchProducts();
            handleCloseProductDialog();
          }}
          onCancel={() => {
            handleCloseProductDialog();
          }} />
      </dialog>
      <ToastContainer />
    </div>
  );
}

export default InventoryScreen;
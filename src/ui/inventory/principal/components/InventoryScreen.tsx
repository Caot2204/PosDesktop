import '../stylesheets/InventoryScreen.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import PosButton from '../../../common/components/PosButton';
import CategoryScreen from '../../categories/components/CategoryScreen';
import ProductForm from '../../products/components/ProductForm';
import Product from '../../../../data/model/Product';
import { showErrorNotify, showSuccessNotify } from '../../../utils/NotifyUtils';
import CategorySelect from '../../categories/components/CategorySelect';
import type Category from '../../../../data/model/Category';
import ProductList from './ProductList';
import IncreaseStockScreen from './IncreaseStockScreen';

function InventoryScreen() {
  const categoriesDialogRef = useRef<HTMLDialogElement>(null);
  const productFormDialogRef = useRef<HTMLDialogElement>(null);
  const increaseStockDialogRef = useRef<HTMLDialogElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [openDialog, setOpenDialog] = useState<null | 'categories' | 'productForm' | 'increaseStock'>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [minimumStock, setMinimumStock] = useState(5);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [searchFilter, setSearchFilter] = useState("");
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(undefined)

  const fetchProducts = async () => {
    try {
      window.productAPI?.getAllProducts().then((fetchedProducts: Product[]) => {
        setFetchedProducts(fetchedProducts);
      });
    } catch (error) {
      showErrorNotify("Error al recuperar los productos");
    }
  };

  const fetchCategories = async () => {
    try {
      window.categoryAPI?.getAllCategories().then((fetchedCategories: Category[]) => {
        setCategories(fetchedCategories);
      });
    } catch (error) {
      showErrorNotify("Error al recuperar las categorias");
    }
  };

  const handleCloseProductDialog = useCallback(() => {
    setOpenDialog(null);
    setProductToEdit(undefined);
  }, []);

  const handleClearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setSearchFilter("");
  };

  const handleEditProduct = (product: Product) => {
    setOpenDialog("productForm");
    setProductToEdit(product);
  };

  useEffect(() => {
    window.posConfigAPI?.getPosConfig()
      .then(posConfig => {
        setMinimumStock(posConfig.minimunStock);
      });
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    setCategoryFilter(categoryFilter);
    setLoadingData(false);
  }, [loadingData]);

  return (
    <div className="inventory-container">
      <div className={openDialog ? "actions-container filter-blur" : "actions-container"}>
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
            setOpenDialog("productForm");
          }} />
        <PosButton
          label="Admin. categorías"
          onClick={() => {
            setOpenDialog("categories");
          }} />
        <PosButton
          label="Incrementar stock"
          onClick={() => {
            setOpenDialog("increaseStock");
          }} />
      </div>
      <div className={openDialog ? "products-container filter-blur" : "products-container"}>
        <div className="search-product-container">
          <FaSearch />
          <input className="search-input" ref={searchInputRef} type="text" placeholder="Ingrese el nombre o código del producto..." onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)} />
          <MdOutlineCancel onClick={handleClearSearch} />
        </div>
        <ProductList
          products={fetchedProducts}
          categoryFilter={categoryFilter}
          searchFilter={searchFilter}
          minimumStock={minimumStock}
          onEditProduct={handleEditProduct}
          onDeleteProductSuccess={() => {
            showSuccessNotify("Producto eliminado!");
            fetchProducts();
          }} />
      </div>
      <dialog className="pos-dialog" ref={categoriesDialogRef} open={openDialog === "categories"}>
        <div className="header-dialog">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setOpenDialog(null);
          }} />
        </div>
        <CategoryScreen
          onChangeCategories={() => setLoadingData(true)} />
      </dialog>
      <dialog className="pos-dialog" ref={productFormDialogRef} open={openDialog === "productForm"}>
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
            setLoadingData(true);
            handleCloseProductDialog();
          }}
          onCancel={() => {
            handleCloseProductDialog();
          }} />
      </dialog>
      <dialog className="pos-dialog" ref={increaseStockDialogRef} open={openDialog === "increaseStock"}>
        <div className="header-dialog">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setOpenDialog(null);
          }} />
        </div>
        <IncreaseStockScreen
          products={fetchedProducts}
          onIncreaseSuccesfully={() => setLoadingData(true)} />
      </dialog>
      <ToastContainer />
    </div>
  );
}

export default InventoryScreen;
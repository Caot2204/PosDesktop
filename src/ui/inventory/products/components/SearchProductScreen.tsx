import '../stylesheets/SearchProductScreen.css';
import { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import type Product from '../../../../data/model/Product';
import { formatNumberToCurrentPrice } from '../../../utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import { T } from 'react-router/dist/development/index-react-server-client-CMphySRb';

interface SearchProductProps {
  isShowed: boolean;
  products?: Product[];
  onProductClicked: (product: Product) => void;
}

interface ProductSearchedRowProps {
  code: string;
  name: string;
  category: string;
  unitPrice: number;
  isSelected: boolean;
  onProductClicked: () => void;
}

function ProductSearchedRow(props: ProductSearchedRowProps) {
  const { t } = useTranslation('global');
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (props.isSelected) {
      rowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [props.isSelected]);

  return (
    <tr
      ref={rowRef}
      className={props.isSelected ? "selected-row" : ""}
      onClick={props.onProductClicked}>
      <th scope="row">{props.code}</th>
      <td>{props.name}</td>
      <td>{props.category}</td>
      <td><strong>{formatNumberToCurrentPrice(props.unitPrice)}</strong></td>
    </tr>
  );
}

function SearchProductScreen(props: SearchProductProps) {
  const { t } = useTranslation('global');
  const allCategoryLabel = t('screens.inventory.allCategoryLabel')
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [productsToShow, setProductsToShow] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setSearchFilter("");
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (productsToShow.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % productsToShow.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + productsToShow.length) % productsToShow.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < productsToShow.length) {
        props.onProductClicked(productsToShow[selectedIndex]);
      }
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      let products: Product[] = props.products ?? await window.productAPI?.getAllProducts() ?? [];
      if (searchFilter.trim() !== "") {
        products = products.filter(product =>
          product.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
          product.name.toLowerCase().includes(searchFilter.toLowerCase()));
      }
      setProductsToShow(products);
    };
    getProducts();
    setSelectedIndex(0);
  }, [props.products, searchFilter]);

  useEffect(() => {
    if (props.isShowed) {
      searchInputRef.current?.focus();
    } else {
      handleClearSearch();
    }
  }, [props.isShowed]);

  return (
    <div className="search-screen-container">
      <div className="search-product-container">
        <FaSearch />
        <input
          autoFocus
          className="search-input"
          ref={searchInputRef}
          type="text"
          maxLength={100}
          placeholder={t('screens.searchProduct.enterProductPlaceHolder')}
          onKeyDown={handleKeyDown}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)} />
        <MdOutlineCancel onClick={handleClearSearch} />
      </div>
      <hr />
      <div className="product-list">
        <table>
          <thead>
            <tr>
              <th scope="col">{t('screens.searchProduct.codeLabel')}</th>
              <th scope="col">{t('screens.searchProduct.nameLabel')}</th>
              <th scope="col">{t('screens.searchProduct.categoryLabel')}</th>
              <th scope="col">{t('screens.searchProduct.priceLabel')}</th>
            </tr>
          </thead>
          <tbody>
            {
              searchFilter.trim() !== "" ?
                productsToShow.map((product, index) => (
                  <ProductSearchedRow
                    key={product.code}
                    code={product.code}
                    name={product.name}
                    category={product.category == "Todos" ? allCategoryLabel : product.category}
                    unitPrice={product.unitPrice}
                    isSelected={index === selectedIndex}
                    onProductClicked={() => props.onProductClicked(product)} />
                ))
                :
                <></>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SearchProductScreen;
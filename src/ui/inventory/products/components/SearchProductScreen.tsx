import '../stylesheets/SearchProductScreen.css';
import { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import type Product from '../../../../data/model/Product';
import { formatNumberToCurrentPrice } from '../../../utils/FormatUtils';

interface SearchProductProps {
  products: Product[];
  onProductClicked: (productCode: string) => void;
}

interface ProductSearchedRowProps {
  code: string;
  name: string;
  category: string;
  unitPrice: number;
  onProductClicked: (productCode: string) => void;
}

function ProductSearchedRow(props: ProductSearchedRowProps) {
  return (
    <tr onClick={() => props.onProductClicked(props.code)}>
      <th scope="row">{props.code}</th>
      <td>{props.name}</td>
      <td>{props.category}</td>
      <td>{formatNumberToCurrentPrice(props.unitPrice)}</td>
    </tr>
  );
}

function SearchProductScreen(props: SearchProductProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [productsToShow, setProductsToShow] = useState<Product[]>([]);

  const handleClearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setSearchFilter("");
  };

  useEffect(() => {
    let products = props.products;
    if (searchFilter.trim() !== "") {
      products = products.filter(product => product.code.toLowerCase().includes(searchFilter.toLowerCase()) || product.name.toLowerCase().includes(searchFilter.toLowerCase()));
    }
    setProductsToShow(products);
  }, [props.products, searchFilter]);

  return (
    <div className="search-screen-container">
      <div className="search-product-container">
        <FaSearch />
        <input className="search-input" ref={searchInputRef} type="text" placeholder="Ingrese el nombre o código del producto..." onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)} />
        <MdOutlineCancel onClick={handleClearSearch} />
      </div>
      <hr />
      <table className="product-list">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Nombre</th>
            <th scope="col">Categoría</th>
            <th scope="col">Precio</th>
          </tr>
        </thead>
        <tbody>
          {
            searchFilter.trim() !== "" ?
              productsToShow.map(product => (
                <ProductSearchedRow
                  code={product.code}
                  name={product.name}
                  category={product.category}
                  unitPrice={product.unitPrice}
                  onProductClicked={props.onProductClicked} />
              ))
              :
              <></>
          }
        </tbody>
      </table>
    </div>
  );
}

export default SearchProductScreen;
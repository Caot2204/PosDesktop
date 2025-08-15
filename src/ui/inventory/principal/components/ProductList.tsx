import '../stylesheets/ProductList.css';
import { useEffect, useState } from "react";
import type Product from "../../../../data/model/Product";
import ProductItem from "../../products/components/ProductItem";

interface ProductListProps {
  products: Product[];
  categoryFilter: string;
  searchFilter: string;
  minimumStock: number;
  onEditProduct: (product: Product) => void;
  onDeleteProductSuccess: () => void;
}

function ProductList(props: ProductListProps) {

  const [productsToShow, setProductsToShow] = useState<Product[]>([]);

  const handleDeleteProduct = async (code: string) => {
    await window.productAPI?.deleteProduct(code);
    props.onDeleteProductSuccess();
  };

  useEffect(() => {
    let products = props.products;
    if (props.categoryFilter !== "Todos") {
      products = products.filter(product => product.category === props.categoryFilter);
    }
    if (props.searchFilter.trim() !== "") {
      products = products.filter(product => product.name.toLowerCase().includes(props.searchFilter.toLowerCase()) || product.code.toLowerCase().includes(props.searchFilter.toLowerCase()));
    }
    setProductsToShow(products);
  }, [props.products, props.categoryFilter, props.searchFilter]);

  return (
    <div className="products-list-container">
      {
        productsToShow.map((product: Product) => (
          <ProductItem
            key={product.code}
            code={product.code}
            name={product.name}
            unitPrice={product.unitPrice}
            stock={product.isInfinityStock ? "Infinito" : String(product.stock)}
            category={product.category}
            minimunStock={props.minimumStock}
            onUpdate={() => props.onEditProduct(product)}
            onDelete={() => handleDeleteProduct(product.code)} />
        ))
      }
    </div>
  );
}

export default ProductList;
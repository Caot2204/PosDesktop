import './App.css';
import { Outlet } from 'react-router';
import PosMenu from './common/components/PosMenu';
import UserAvatar from './common/components/UserAvatar';

import User from '../data/model/User';
import type Category from '../data/model/Category';
import type Product from '../data/model/Product';

declare global {
  interface Window {
    userAPI?: {
      saveUser: (name: string, password: string, isAdmin: boolean) => Promise<void>;
      updateUser: (id: string, name: string, isAdmin: boolean) => Promise<void>;
      deleteUser: (id: string, isAdmin: boolean) => Promise<void>;
      getAllUsers: () => Promise<User[]>;
      getUserById: (id: string) => Promise<User>;
    };
    categoryAPI?: {
      saveCategory: (name: string) => Promise<void>;
      updateCategory: (categoryId: number, name: string) => Promise<void>;
      deleteCategory: (categoryId: number) => Promise<void>;
      getAllCategories: () => Promise<Category[]>;
    };
    productAPI?: {
      deleteProduct: (code: string) => Promise<void>;
      getAllProducts: () => Promise<Product[]>;
      getProductByCode: (code: string) => Promise<Product>;
      increaseStock: (code: string, unitsToIncrease: number) => Promise<void>;
      saveProduct: (code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string) => Promise<void>;
      updateProduct: (code: string, name: string, unitPrice: number, stock: number, isInfinityStock: boolean, category: string, previuosCode?: string) => Promise<void>;
    };
  }
}

function App() {
  return (
    <>
      <div className="pos-header">
        <PosMenu
          className="pos-menu" />
        <UserAvatar />
      </div>
      <Outlet />
    </>
  )
}

export default App

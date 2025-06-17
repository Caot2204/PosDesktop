import './App.css';
import UsersScreen from './users/components/UsersScreen';
import PosMenu from './common/components/PosMenu';
import UserAvatar from './common/components/UserAvatar';

import User from '../data/model/User';
import type Category from '../data/model/Category';
import CategoryScreen from './inventory/categories/components/CategoryScreen';

declare global {
  interface Window {
    userAPI?: {
      saveUser: (name: string, password: string, isAdmin: boolean) => Promise<void>;
      updateUser: (id: string, name: string, isAdmin: boolean) => Promise<void>;
      deleteUser: (id: string) => Promise<void>;
      getAllUsers: () => Promise<User[]>;
      getUserById: (id: string) => Promise<User>;
    };
    categoryAPI?: {
      saveCategory: (name: string) => Promise<void>;
      updateCategory: (categoryId: number, name: string) => Promise<void>;
      deleteCategory: (categoryId: number) => Promise<void>;
      getAllCategories: () => Promise<Category[]>;
    };
  }
}

function App() {
  return (
    <>
      <div className="pos-header">
        <PosMenu
          className="pos-menu"
          onSalesClicked={() => console.log('Ventas clicked')}
          onEgressClicked={() => console.log('Egresos clicked')}
          onInventoryClicked={() => console.log('Inventario clicked')}
          onUsersClicked={() => console.log('Usuarios clicked')}
          onSettingsClicked={() => console.log('Configuración clicked')} />
        <UserAvatar />
      </div>
      <CategoryScreen />
    </>
  )
}

export default App

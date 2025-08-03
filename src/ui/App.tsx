import './App.css';
import { Outlet, useNavigate } from 'react-router';
import PosMenu from './common/components/PosMenu';
import UserAvatar from './common/components/UserAvatar';
import { BrowserRouter, Route, Routes } from 'react-router'
import UsersScreen from './users/components/UsersScreen';
import InventoryScreen from './inventory/principal/components/InventoryScreen.tsx';
import NewSaleScreen from './sales/components/NewSaleScreen.tsx';
import EgressScreen from './egress/components/EgressScreen.tsx';
import AdministrationScreen from './administration/components/AdministrationScreen.tsx';

import User from '../data/model/User';
import type Category from '../data/model/Category';
import type Product from '../data/model/Product';
import type Sale from '../data/model/Sale';
import type SaleProductModel from './sales/model/SalesProductModel';
import { useEffect, useState } from 'react';
import LoginScreen from './login/components/LoginScreen';
import type UserSession from '../data/model/UserSession.ts';
import FirstUseScreen from './firstuse/components/FirstUseScreen.tsx';
import type CashClosing from '../data/model/CashClosing.ts';

declare global {
  interface Window {
    userAPI?: {
      login: (userName: string, password: string) => Promise<UserSession>;
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
    saleAPI?: {
      getSaleById: (saleId: number) => Promise<Sale | undefined>;
      getSalesByDate: (dateOfSale: Date) => Promise<Sale[]>;
      saveSale: (dateOfSale: Date, userToGenerateSale: string, productsSold: SaleProductModel[], paymentType: string, amountPayed: number, totalSale: number) => Promise<void>;
    };
    cashClosingAPI?: {
      getCashClosingOfDate: (date: Date) => Promise<CashClosing[]>;
      getCashClosingOfUser: (userName: string) => Promise<CashClosing[]>;
      saveCashClosing: (physicalMoney: number, totalOfDay: number, userName: string) => Promise<void>;
    }
  }
}

function App() {
  const [isFirstUse, setIsFirstUSe] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  useEffect(() => {
    window.userAPI?.getAllUsers().then((users) => {
      if (users.length === 0) {
        setIsFirstUSe(true);
      }
    });
  }, []);

  return (
    isFirstUse ?
      <FirstUseScreen
        onSuccessfullyCreateAccount={() => setIsFirstUSe(false)} />
      :
      userSession ?
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PosScreen
                  userSession={userSession}
                  onLogout={() => {
                    setUserSession(null);
                  }}/>
              }>
              <Route index element={<NewSaleScreen currentUser={userSession} />} />
              <Route path="sales" element={<NewSaleScreen currentUser={userSession} />} />
              <Route path="egress" element={<EgressScreen />} />
              <Route path="inventory" element={<InventoryScreen />} />
              <Route path="users" element={<UsersScreen />} />
              <Route path="administration" element={<AdministrationScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
        :
        <LoginScreen
          onLogin={(userSession: UserSession) => setUserSession(userSession)} />
  )
}

interface PosScreenProps {
  userSession: UserSession;
  onLogout: () => void;
}

function PosScreen(props: PosScreenProps) {
  let navigate = useNavigate();
  return (
    <>
      <div className="pos-header">
        <PosMenu
          className="pos-menu"
          userSession={props.userSession} />
        <UserAvatar
          name={props.userSession.userName}
          isAdmin={props.userSession.isAdmin}
          onLogout={() => {
            props.onLogout();
            navigate("/sales");
          }} />
      </div>
      <Outlet />
    </>
  );
}

export default App

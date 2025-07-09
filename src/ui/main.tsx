import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import UsersScreen from './users/components/UsersScreen';
import InventoryScreen from './inventory/principal/components/InventoryScreen.tsx';
import NewSaleScreen from './sales/components/NewSaleScreen.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<NewSaleScreen />}/>
          <Route path="sales" element={<NewSaleScreen />}/>
          <Route path="inventory" element={<InventoryScreen />} />
          <Route path="users" element={<UsersScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

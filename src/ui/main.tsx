import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import CategoryScreen from './inventory/categories/components/CategoryScreen';
import UsersScreen from './users/components/UsersScreen';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="categories" element={<CategoryScreen />} />
          <Route path="users" element={<UsersScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

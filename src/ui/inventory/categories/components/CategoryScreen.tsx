import '../stylesheets/CategoryScreen.css';
import { useEffect, useRef, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import PosButton from '../../../common/components/PosButton';
import CategoryItem from './CategoryItem';
import Category from '../../../../data/model/Category';
import CategoryForm from './CategoryForm';
import { showErrorNotify, showSuccessNotify } from '../../../utils/NotifyUtils';

function CategoryScreen() {

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryForForm, setCategoryForForm] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const categoriesRecuperated = await window.categoryAPI?.getAllCategories();
      if (categoriesRecuperated !== undefined) {
        setCategories(categoriesRecuperated);
      }
    } catch (error) {
      showErrorNotify("Error al recuperar las categorías");
    }
  };

  const handleEdit = (category: Category) => {
    setCategoryForForm(category);
    handleOpenDialog();
  };

  const handleDelete = async (id: number) => {
    if (window.categoryAPI && typeof window.categoryAPI.deleteCategory === 'function') {
      await window.categoryAPI.deleteCategory(id);
      showSuccessNotify("Categoría eliminada!");
      fetchCategories();
    }
  };

  const handleOpenDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleCloseDialog = () => {
    setCategoryForForm(null);
    dialogRef.current?.close();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="categories-container">
      <h3>Categorías</h3>
      <div className="categories-section">
        <PosButton
          className="add-user-button"
          icon={<IoAddOutline />}
          label="Nueva categoría"
          onClick={handleOpenDialog} />
        <div className="categories-list">
          {
            categories.map((category: Category) => (
              <CategoryItem
                key={category.id}
                name={category.name}
                isAbleToDelete={category.id !== 1}
                onDelete={() => handleDelete(category.id!!)}
                onUpdate={() => handleEdit(category)} />
            ))
          }
        </div>
      </div>
      <dialog className="category-form-dialog" ref={dialogRef}>
        <CategoryForm
          id={categoryForForm?.id ? categoryForForm.id : undefined}
          name={categoryForForm ? categoryForForm.name : ""}
          onSaveSuccess={() => {
            fetchCategories();
            handleCloseDialog();
          }}
          onCancel={handleCloseDialog} />
      </dialog>
      <ToastContainer />
    </div>
  );
}

export default CategoryScreen;
import '../stylesheets/CategoryScreen.css';
import { useEffect, useRef, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import PosButton from '../../../common/components/PosButton';
import CategoryItem from './CategoryItem';
import Category from '../../../../data/model/Category';
import CategoryForm from './CategoryForm';
import { showErrorNotify, showSuccessNotify } from '../../../utils/NotifyUtils';

interface CategoryScreenProps {
  onChangeCategories: () => void;
}

function CategoryScreen(props: CategoryScreenProps) {

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryForForm, setCategoryForForm] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await window.categoryAPI?.getAllCategories();
      if (fetchedCategories !== undefined) {
        setCategories(fetchedCategories);
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
      props.onChangeCategories();
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
          className="add-category-button"
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
                onDelete={() => category.id && handleDelete(category.id)}
                onUpdate={() => handleEdit(category)} />
            ))
          }
        </div>
      </div>
      <dialog className="category-form-dialog" ref={dialogRef} aria-modal="true">
        <CategoryForm
          id={categoryForForm?.id ? categoryForForm.id : undefined}
          name={categoryForForm ? categoryForForm.name : ""}
          onSaveSuccess={() => {
            fetchCategories();
            handleCloseDialog();
            props.onChangeCategories();
          }}
          onCancel={handleCloseDialog} />
      </dialog>
    </div>
  );
}

export default CategoryScreen;
import '../stylesheets/CategorySelect.css';
import type Category from '../../../../data/model/Category';

interface CategorySelectProps {
  options: Category[];
  selected?: string;
  onCategorySelected: (category: string) => void;
}

function CategorySelect(props: CategorySelectProps) {
  return (
    <select
      value={props.selected}
      onChange={e => props.onCategorySelected(e.target.value)}>
      {
        props.options.map(category => (
          <option key={category.id} value={category.name}>
              {category.name}
          </option>
        ))
      }
    </select>
  );
}

export default CategorySelect;
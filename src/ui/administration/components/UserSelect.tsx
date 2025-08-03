import '../stylesheets/UserSelect.css';
import type User from "../../../data/model/User";

interface UserSelectProps {
  options: User[];
  selected: string | null | undefined;
  onUserSelected: (category: string) => void;
}

function UserSelect(props: UserSelectProps) {
  return (
    <select
      value={ props.selected ? props.selected : "Seleccione un usuario" }
      onChange={e => props.onUserSelected(e.target.value)}>
        <option value={undefined}>
              Seleccione un usuario...
        </option>
      {
        props.options.map(user => (
          <option key={user.id} value={user.name}>
              {user.name}
          </option>
        ))
      }
    </select>
  );
}

export default UserSelect;
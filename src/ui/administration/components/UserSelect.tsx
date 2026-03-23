import '../stylesheets/UserSelect.css';
import type User from "../../../data/model/User";
import { useTranslation } from 'react-i18next';

interface UserSelectProps {
  options: User[];
  selected: string | null | undefined;
  onUserSelected: (category: string) => void;
}

function UserSelect(props: UserSelectProps) {
  const { t } = useTranslation('global');

  return (
    <select
      value={props.selected ? props.selected : t('screens.cashClosingList.selectUserLabel')}
      onChange={e => props.onUserSelected(e.target.value)}>
      <option value={undefined}>
        {t('screens.cashClosingList.selectUserLabel')}
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
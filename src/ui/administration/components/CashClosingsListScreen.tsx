import '../stylesheets/CashClosingsListScreen.css';
import { useEffect, useState } from 'react';
import { formatDateForSearch } from '../../utils/FormatUtils';
import type CashClosing from '../../../data/model/CashClosing';
import CashClosingItem from './CashClosingItem';
import type User from '../../../data/model/User';
import UserSelect from './UserSelect';

interface CashClosingsListScreenProps {
  isShowed: boolean;
}

function CashClosingsListScreen(props: CashClosingsListScreenProps) {
  const [dateToSearch, setDateToSearch] = useState(formatDateForSearch(new Date()));
  const [userToSearch, setUserToSearch] = useState<string | null | undefined>(null);
  const [cashClosings, setCashClosings] = useState<CashClosing[]>([]);
  const [posUsers, setPosUsers] = useState<User[]>([]);

  const fetchCashClosingsOfDate = () => {
    window.cashClosingAPI?.getCashClosingOfDate(new Date(dateToSearch))
      .then(cashClosings => {
        setCashClosings(cashClosings);
      });
  };

  const fetchCashClosingsOfUser = () => {
    if (userToSearch) {
      window.cashClosingAPI?.getCashClosingOfUser(userToSearch)
        .then(cashClosings => {
          setCashClosings(cashClosings);
        });
    }
    if (userToSearch === null || userToSearch === undefined) {
      fetchCashClosingsOfDate();
    }
  };

  useEffect(() => {
    window.userAPI?.getAllUsers()
      .then(users => {
        setPosUsers(users);
      });
    setDateToSearch(formatDateForSearch(new Date()));
    setUserToSearch(null);
  }, [props.isShowed]);

  useEffect(() => {
    fetchCashClosingsOfDate();
  }, [dateToSearch]);

  useEffect(() => {
    fetchCashClosingsOfUser();
  }, [userToSearch]);

  return (
    <div className="cashclosingslistscreen-container">
      <h3>Cortes de caja</h3>
      <div className="cashclosingslistscreen-inputs">
        <input
          className="cashclosing-date-input"
          type="date"
          placeholder="Fecha del corte de caja..."
          value={dateToSearch}
          onChange={(e) => {
            setDateToSearch(e.target.value);
          }} />
        <UserSelect
          options={posUsers}
          selected={userToSearch}
          onUserSelected={(user) => {
            setUserToSearch(user);
          }} />
      </div>
      <div className="cashclosingslistscreen-list">
        {
          cashClosings.map(cashClosing => (
            <CashClosingItem key={cashClosing.id} {...cashClosing} />
          ))
        }
      </div>
    </div>
  );
}

export default CashClosingsListScreen;
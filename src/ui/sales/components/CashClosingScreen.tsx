import '../stylesheets/CashClosingScreen.css';
import {  useEffect, useRef, useState } from 'react';
import { formatNumberToCurrentPrice } from '../../utils/FormatUtils';

interface CashClosingScreenProps {
  isShowed: boolean;
  currentUser: string;
}

function CashClosingScreen(props: CashClosingScreenProps) {
  const physicalMoneyInputRef = useRef<HTMLInputElement>(null);

  const [totalOfDay, setTotalOfDay] = useState(0.0);
  const [physicalMoney, setPhysicalMoney] = useState(0.0);

  useEffect(() => {
    window.saleAPI?.getSalesByDate(new Date()).then(sales => {
      const salesOfCurrentUser = sales.filter(sale => sale.userToGeneretaSale === props.currentUser);
      let tempTotal = 0.0;
      salesOfCurrentUser.forEach(sale => {
        tempTotal += sale.totalSale;
      });
      setTotalOfDay(tempTotal);
      if (physicalMoneyInputRef.current) {
        physicalMoneyInputRef.current.value = "";
        physicalMoneyInputRef.current.focus();
      }    
    });
  }, [props.isShowed]);

  return (
    <div className="cash-closing-container">
      <h2>Corte de caja</h2>
      <p><strong>Venta del día:</strong>&emsp;&ensp;{formatNumberToCurrentPrice(totalOfDay)}</p>
      <div className="physicalmoney-input">
        <p><strong>Dinero en caja: </strong></p>
        <input type="number" onChange={(e) => setPhysicalMoney(Number(e.target.value))} />
      </div>      
    </div>
  );
}

export default CashClosingScreen;
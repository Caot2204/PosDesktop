import '../stylesheets/AdministrationScreen.css';
import { useEffect, useState } from 'react';
import PosButton from '../../common/components/PosButton';
import CashClosingsListScreen from './CashClosingsListScreen';
import { MdOutlineCancel } from 'react-icons/md';
import { showSuccessNotify } from '../../utils/NotifyUtils';
import { ToastContainer } from 'react-toastify';

const defaultLogo = '../../assets/react.svg';

function AdministrationScreen() {
  const [openDialog, setOpenDialog] = useState<'cashClosingDialog' | null>(null);

  const [bussinessName, setBussinessName] = useState('');
  const [bussinessLogoUrl, setBussinessLogoUrl] = useState<string | undefined>('../../assets/react.svg');
  const [minimunStock, setMinimunStock] = useState(5);
  const [posLanguage, setPosLanguage] = useState('es');

  const fetchPosConfig = () => {
    window.posConfigAPI?.getPosConfig()
      .then(posConfig => {
        setBussinessLogoUrl(posConfig.bussinessLogoUrl);
        setBussinessName(posConfig.bussinessName);
        setMinimunStock(posConfig.minimunStock);
        setPosLanguage(posConfig.posLanguage);
      });
  };

  const handleSaveConfig = () => {
    window.posConfigAPI?.savePosConfig(bussinessName, bussinessLogoUrl || defaultLogo, minimunStock, posLanguage)
      .then(() => {
        showSuccessNotify("Configuración guardada con éxito");
        fetchPosConfig();
      }).catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchPosConfig();
  }, []);

  return (
    <div className="administrationscreen-container">
      <div className="sales-container">
        <h3>Ventas</h3>
        <PosButton
          label="Ver cortes de caja"
          onClick={() => setOpenDialog("cashClosingDialog")} />
      </div>
      <hr />
      <div className="pos-configurations-container">
        <h3>Configuraciones del punto de venta:</h3>
        <div className="input-container">
          <label className="pos-label">Unidades mínimas para el stock:</label>
          <input
            className="pos-input"
            type="number"
            value={minimunStock}
            onChange={(e) => setMinimunStock(Number(e.target.value))} />
        </div>
      </div>
      <hr />
      <div className="administration-bussiness-info-container">
        <h3>Datos del negocio:</h3>
        <div className="input-container">
          <img
            className="bussiness-logo-administration"
            src={bussinessLogoUrl || defaultLogo}
            alt="Logo del negocio" />
          <PosButton
            className="bussiness-logo-button"
            label="Cambiar logo"
            onClick={() => {
              window.posConfigAPI?.selectNewBussinessLogo()
                .then(newLogoUrl => {
                  if (newLogoUrl) {
                    window.posConfigAPI?.getBussinessLogoDataUrl(newLogoUrl)
                      .then(dataUrl => {
                        setBussinessLogoUrl(dataUrl);
                      });
                  }
                });
            }} />
        </div>
        <div className="input-container">
          <label className="pos-label">Nombre del negocio:</label>
          <input
            className="pos-input"
            type="text"
            value={bussinessName}
            onChange={(e) => setBussinessName(e.target.value)} />
        </div>
      </div>
      <PosButton
        label="Guardar configuración"
        onClick={handleSaveConfig} />
      <dialog className="pos-dialog" open={openDialog === "cashClosingDialog"}>
        <div className="header-dialog">
          <MdOutlineCancel className="close-dialog-button" onClick={() => {
            setOpenDialog(null);
          }} />
        </div>
        <CashClosingsListScreen
          isShowed={openDialog === "cashClosingDialog"} />
      </dialog>
      <ToastContainer />
    </div>
  );
}

export default AdministrationScreen;
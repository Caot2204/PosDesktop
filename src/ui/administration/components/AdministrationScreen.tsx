import '../stylesheets/AdministrationScreen.css';
import { useEffect, useState } from 'react';
import PosButton from '../../common/components/PosButton';
import CashClosingsListScreen from './CashClosingsListScreen';
import { MdOutlineCancel } from 'react-icons/md';
import { showErrorNotify, showSuccessNotify } from '../../utils/NotifyUtils';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import PosConfirmDialog from '../../../ui/common/components/PosConfirmDialog';

const defaultLogo = '../../assets/react.svg';

function AdministrationScreen() {
  const { t, i18n } = useTranslation('global');
  const [openDialog, setOpenDialog] = useState<'cashClosingDialog' | 'restartAppDialog' | null>(null);

  const [bussinessName, setBussinessName] = useState('');
  const [bussinessLogoUrl, setBussinessLogoUrl] = useState<string | undefined>('../icons/icon.png');
  const [minimunStock, setMinimunStock] = useState(5);
  const [posLanguage, setPosLanguage] = useState('');

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
        showSuccessNotify(t('screens.administration.configSaveSuccess'));
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
      <div className={openDialog ? "sales-container filter-blur" : "sales-container"}>
        <h3>{t('screens.administration.titleSales')}</h3>
        <PosButton
          label={t('screens.administration.showCashClosings')}
          onClick={() => setOpenDialog("cashClosingDialog")} />
      </div>
      <hr />
      <div className={openDialog ? "pos-configurations-container filter-blur" : "pos-configurations-container"}>
        <h3>{t('screens.administration.titlePosConfigs')}</h3>
        <div className="input-container">
          <label className="pos-label">{t('screens.administration.subtitleMinimunStock')}</label>
          <input
            className="pos-input"
            type="number"
            value={minimunStock}
            onChange={(e) => setMinimunStock(Number(e.target.value))} />
        </div>
      </div>
      <hr />
      <div className={openDialog ? "administration-bussiness-info-container filter-blur" : "administration-bussiness-info-container"}>
        <h3>{t('screens.administration.titleBussinessData')}</h3>
        <div className="input-container">
          <img
            className="bussiness-logo-administration"
            src={bussinessLogoUrl || defaultLogo}
            alt={t('screens.administration.altBussinessLogo')} />
          <PosButton
            className="bussiness-logo-button"
            label={t('screens.administration.changeBussinessLogo')}
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
          <label className="pos-label">{t('screens.administration.bussinessNameLabel')}</label>
          <input
            className="pos-input"
            type="text"
            value={bussinessName}
            maxLength={150}
            onChange={(e) => setBussinessName(e.target.value)} />
        </div>
      </div>
      <div className={openDialog ? "filter-blur" : ""}>
        <h3>{t('screens.administration.posLanguageLabel')}</h3>
        <select className='language-select' onChange={(e) => {
          i18n.changeLanguage(e.target.value);
          setPosLanguage(e.target.value);
          setOpenDialog("restartAppDialog");
        }}>
          <option value="">{t('screens.administration.selectLanguageLabel')}</option>
          <option value="es" selected={posLanguage === "es"}>Español</option>
          <option value="en" selected={posLanguage === "en"}>English</option>
        </select>
      </div>
      <div className={openDialog ? "filter-blur" : ""}>
        <h3>{t('screens.administration.backupTitle')}</h3>
        <PosButton
          label={t('screens.administration.createBackupLabel')}
          onClick={async () => {
            const result = await window.posConfigAPI?.createDbBackup();
            if (result?.canceled) {
              showErrorNotify(t('screens.administration.backupCanceledMessage'));
              return;
            }

            if (result?.success) {
              showSuccessNotify(t('screens.administration.backupSuccessMessage', { path: result.path}))
            } else {
              showErrorNotify(t('screens.administration.backupErrorMessage'));
            }
          }} />
        <PosButton
          label={t('screens.administration.loadBackupLabel')}
          onClick={async () => {
            const result = await window.posConfigAPI?.loadDbBackup();
            if (result?.canceled) {
              showErrorNotify(t('screens.administration.loadBackupCanceledMessage'));
              return;
            }
          }} />
      </div>
      <PosButton
        className={openDialog ? "filter-blur" : ""}
        label={t('screens.administration.saveConfigLabel')}
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
      <PosConfirmDialog
        message={t('screens.administration.restartAppMessage')}
        isShowed={openDialog === "restartAppDialog"}
        onCancel={() => setOpenDialog(null)}
        notShowCancelButton={true}
        onOk={() => {
          handleSaveConfig();
          setOpenDialog(null);
        }} />
      <ToastContainer />
    </div>
  );
}

export default AdministrationScreen;
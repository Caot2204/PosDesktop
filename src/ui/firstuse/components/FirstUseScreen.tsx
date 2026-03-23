import '../stylesheets/FirstUseScreen.css';
import { useState } from 'react';
import PosButton from '../../common/components/PosButton';
import { ToastContainer } from 'react-toastify';
import { showErrorNotify } from '../../utils/NotifyUtils';
import { useTranslation } from 'react-i18next';

interface FirstUseScreenProps {
  onSuccessfullyCreateAccount: () => void;
}

function FirstUseScreen(props: FirstUseScreenProps) {
  const { t } = useTranslation('global');
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleCreateFirstUser = async () => {
    if (password === passwordConfirm) {
      await window.userAPI?.saveUser(userName, password, true);
      props.onSuccessfullyCreateAccount();
    } else {
      showErrorNotify(t('screens.firstUse.errorPasswords'));
    }
  };

  return (
    <div className="first-use-screen-container">
      <div className="form-container">
        <h2>{t('screens.firstUse.title')}</h2>
        <label><strong>{t('screens.firstUse.userNameLabel')}</strong></label>
        <input
          type="text"
          onChange={(e) => setUserName(e.target.value)} />
        <label><strong>{t('screens.firstUse.passwordLabel')}</strong></label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)} />
        <label><strong>{t('screens.firstUse.confirmPasswordLabel')}</strong></label>
        <input
          type="password"
          onChange={(e) => setPasswordConfirm(e.target.value)} />
        <PosButton
          disabled={!userName || !password}
          label="Crear cuenta"
          onClick={handleCreateFirstUser} />
      </div>
      <div className="data-software">
        <p>{t('aboutSoftware.name')}</p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FirstUseScreen;
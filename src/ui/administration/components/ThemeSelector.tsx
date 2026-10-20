import { useTheme, ThemeType } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation('global');

  return (
    <div style={{ width: '18%' }}>
      <h3>{t('screens.administration.themeTitle')}</h3>
      <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeType)}>
        <option value="verde">{t('screens.administration.classicTheme')}</option>
        <option value="azul">{t('screens.administration.corporateTheme')}</option>
        <option value="rosado">{t('screens.administration.pinkTheme')}</option>
        <option value="morado">{t('screens.administration.purpleTheme')}</option>
        <option value="rojo">{t('screens.administration.redTheme')}</option>
        <option value="amarillo">{t('screens.administration.yellowTheme')}</option>
      </select>
    </div>
  );
}
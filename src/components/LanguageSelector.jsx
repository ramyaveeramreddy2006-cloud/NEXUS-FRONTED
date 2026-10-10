import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ compact = false }) {
  const { language, changeLanguage, languages, t } = useLanguage();
  return <label className={compact ? 'language-picker compact' : 'language-picker'} title={t('language')}>
    <Languages size={16} aria-hidden="true" />
    <span className="sr-only">{t('language')}</span>
    <select aria-label={t('language')} value={language} onChange={(event) => changeLanguage(event.target.value)}>
      {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
    </select>
  </label>;
}

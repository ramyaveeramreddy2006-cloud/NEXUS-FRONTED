import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const domains = ['EDUCATION', 'AGRICULTURE', 'HEALTHCARE', 'BUSINESS', 'TECHNOLOGY', 'GOVERNMENT', 'COMMUNITY'];
const roles = ['STUDENT', 'FACULTY', 'FARMER', 'PROFESSIONAL', 'ORGANIZATION'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT', domain: 'EDUCATION', domains: ['EDUCATION'], phone: '', city: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const toggleDomain = (domain) => setForm((current) => ({ ...current, domains: current.domains.includes(domain) ? current.domains.filter((item) => item !== domain) : [...current.domains, domain] }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    setLoading(true);
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), city: form.city.trim(), phone: form.phone.trim() });
      navigate('/dashboard');
    } catch (requestError) {
      const status = requestError.response?.status;
      const message = requestError.response?.data?.message || requestError.response?.data?.error;
      if (status === 409 || /already registered/i.test(message || '')) {
        setError(t('registrationConflict'));
      } else if (status >= 500) {
        setError(t('registrationServer'));
      } else if (!requestError.response) {
        setError(t('serverUnavailable'));
      } else {
        setError(message || t('registrationServer'));
      }
    } finally {
      setLoading(false);
    }
  };

  return <div className="auth-page">
    <div className="auth-tools"><LanguageSelector /></div>
    <Link className="auth-brand" to="/"><div className="logo">N</div><b>{t('brandName')}</b></Link>
    <div className="auth-card wide">
      <div className="auth-top"><div className="auth-icon"><UserPlus /></div><span className="eyebrow">{t('join')}</span><h1>{t('createAccount')}</h1><p>{t('chooseRole')}</p></div>
      {error && <div className="error-box" role="alert">{error}</div>}
      <form className="form-grid" onSubmit={submit}>
        <div className="span-2"><label htmlFor="register-name">{t('fullName')}</label><input id="register-name" name="name" value={form.name} onChange={change} required maxLength={120} autoComplete="name" placeholder={t('yourName')} /></div>
        <div className="span-2"><label htmlFor="register-email">{t('email')}</label><input id="register-email" type="email" name="email" value={form.email} onChange={change} required maxLength={254} autoComplete="email" placeholder="you@example.com" /></div>
        <div><label htmlFor="register-password">{t('password')}</label><div className="input-wrap"><input id="register-password" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={change} required minLength={6} maxLength={100} autoComplete="new-password" placeholder={t('minPassword')} /><button type="button" className="input-action" aria-label={showPassword ? t('hidePassword') : t('showPassword')} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><small className="field-hint">{t('passwordAdvice')}</small></div>
        <div><label htmlFor="register-phone">{t('phone')} <span className="optional">{t('optional')}</span></label><input id="register-phone" type="tel" name="phone" value={form.phone} onChange={change} autoComplete="tel" maxLength={30} placeholder={t('phone')} /></div>
        <div><label htmlFor="register-role">{t('role')}</label><select id="register-role" name="role" value={form.role} onChange={change}>{roles.map((role) => <option key={role} value={role}>{t(`role${role.charAt(0) + role.slice(1).toLowerCase()}`)}</option>)}</select></div>
        <div><label htmlFor="register-domain">{t('primaryField')}</label><select id="register-domain" name="domain" value={form.domain} onChange={change}>{domains.map((domain) => <option key={domain} value={domain}>{t(domain === 'COMMUNITY' ? 'communityField' : domain.toLowerCase())}</option>)}</select></div>
        <div className="span-2"><label>{t('fieldsToFollow')}</label><div className="domain-checklist">{domains.map((domain) => <button key={domain} type="button" className={form.domains.includes(domain) ? 'domain-choice selected' : 'domain-choice'} aria-pressed={form.domains.includes(domain)} onClick={() => toggleDomain(domain)}>{form.domains.includes(domain) && <Check size={14} />}{t(domain === 'COMMUNITY' ? 'communityField' : domain.toLowerCase())}</button>)}</div><small className="field-hint">{t('followMultiple')}</small></div>
        <div className="span-2"><label htmlFor="register-city">{t('city')} <span className="optional">{t('optional')}</span></label><input id="register-city" name="city" value={form.city} onChange={change} autoComplete="address-level2" maxLength={120} placeholder="Hyderabad" /></div>
        <div className="span-2"><button disabled={loading} className="btn btn-primary full">{loading ? t('createAccountLoading') : t('createAccount')} <ArrowRight size={17} /></button></div>
      </form>
      <p className="auth-foot">{t('alreadyRegistered')} <Link to="/login">{t('signIn')}</Link></p>
    </div>
  </div>;
}

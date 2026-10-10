import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [show, setShow] = useState(false); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const { login } = useAuth(); const { t } = useLanguage(); const navigate = useNavigate();
  const submit = async (event) => { event.preventDefault(); setError(''); setLoading(true); try { await login(email.trim(), password); navigate('/dashboard'); } catch (requestError) { setError(requestError.response?.data?.message || requestError.response?.data?.error || t('invalidCredentials')); } finally { setLoading(false); } };

  return <div className="auth-page"><div className="auth-tools"><LanguageSelector /></div><Link className="auth-brand" to="/"><div className="logo">N</div><b>{t('brandName')}</b></Link><div className="auth-card"><div className="auth-top"><div className="auth-icon"><Lock /></div><span className="eyebrow">{t('secureAccess')}</span><h1>{t('welcomeBack')}</h1><p>{t('signInWorkspace')}</p></div>{error && <div className="error-box" role="alert">{error}</div>}<form onSubmit={submit}><label htmlFor="login-email">{t('email')}</label><div className="input-wrap"><Mail size={18} /><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" placeholder="you@example.com" /></div><label htmlFor="login-password">{t('password')}</label><div className="input-wrap"><Lock size={18} /><input id="login-password" type={show ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} autoComplete="current-password" placeholder="••••••••" /><button type="button" className="input-action" aria-label={show ? t('hidePassword') : t('showPassword')} onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><button disabled={loading} className="btn btn-primary full">{loading ? t('signingIn') : t('signIn')} <ArrowRight size={17} /></button></form><p className="auth-foot">{t('newToNexus')} <Link to="/register">{t('createAccount')}</Link></p><div className="secure"><ShieldCheck size={16} /> {t('passwordSecurity')}</div></div></div>;
}

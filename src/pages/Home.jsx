import { ArrowDownRight, ArrowRight, Building2, CheckCircle, Compass, Globe2, Handshake, Languages, Mic2, Network, Search, ShieldCheck, Sparkles, Sprout, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

const focusFields = [
  ['🎓', 'education', 'homeEducationText'],
  ['🌱', 'agriculture', 'homeAgricultureText'],
  ['💼', 'business', 'homeBusinessText'],
];

export default function Home() {
  const { t } = useLanguage();
  return <div className="landing">
    <header className="landing-nav"><Link className="brand landing-brand" to="/"><div className="logo">N</div><div><b>{t('brandName')}</b><small>{t('brandSubtitle')}</small></div></Link><nav className="landing-links"><LanguageSelector compact /><a href="#how-it-works">{t('howItWorks')}</a><a href="#fields">{t('fields')}</a><a href="#organizations">{t('organizations')}</a><Link className="btn btn-outline" to="/login">{t('signIn')}</Link><Link className="btn btn-primary" to="/register">{t('joinNexus')} <ArrowRight size={17} /></Link></nav></header>

    <section className="hero company-hero"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15} /> {t('homeEyebrow')}</div><h1>{t('homeHeadlineA')}<br /><span>{t('homeHeadlineB')}</span></h1><p>{t('homeIntro')}</p><div className="hero-actions"><Link className="btn btn-primary btn-lg" to="/register">{t('createProfile')} <ArrowRight size={18} /></Link><Link className="btn btn-ghost btn-lg" to="/login">{t('exploreNexus')}</Link></div><div className="trust"><CheckCircle size={17} /> {t('personalizedByField')} <CheckCircle size={17} /> {t('oneProfile')} <CheckCircle size={17} /> {t('builtCollaboration')}</div></div><div className="hero-panel"><div className="nexus-network"><div className="network-core">N</div><div className="network-node node-education"><span>🎓</span> {t('education')}</div><div className="network-node node-agriculture"><span>🌱</span> {t('agriculture')}</div><div className="network-node node-business"><span>💼</span> {t('business')}</div><div className="network-node node-technology"><span>💻</span> {t('technology')}</div><div className="network-line line-one" /><div className="network-line line-two" /><div className="network-line line-three" /></div></div></section>

    <section id="how-it-works" className="section how-section"><div className="section-head"><span className="eyebrow">{t('howEyebrow')}</span><h2>{t('howTitle')}</h2><p>{t('howIntro')}</p></div><div className="journey-grid"><article><span className="journey-icon"><Users /></span><b>{t('step1Title')}</b><p>{t('step1Text')}</p></article><ArrowRight className="journey-arrow" /><article><span className="journey-icon"><Search /></span><b>{t('step2Title')}</b><p>{t('step2Text')}</p></article><ArrowRight className="journey-arrow" /><article><span className="journey-icon"><Handshake /></span><b>{t('step3Title')}</b><p>{t('step3Text')}</p></article></div></section>

    <section id="fields" className="section field-section"><div className="section-head"><span className="eyebrow">{t('fieldsEyebrow')}</span><h2>{t('fieldsTitle')}</h2><p>{t('fieldsIntro')}</p></div><div className="field-grid focus-fields">{focusFields.map(([icon, nameKey, descriptionKey]) => <article className="public-field" key={nameKey}><span>{icon}</span><h3>{t(nameKey)}</h3><p>{t(descriptionKey)}</p></article>)}</div><div className="other-fields"><span>{t('moreFields')}</span>{['healthcare', 'governmentServices', 'localCommunity'].map((key) => <span className="tag" key={key}>{t(key)}</span>)}</div></section>

    <section className="section alt cross-section"><div className="feature-grid"><div><span className="eyebrow"><Network size={14} /> {t('differenceEyebrow')}</span><h2>{t('differenceTitle')}</h2><p>{t('differenceText')}</p><Link to="/register" className="btn btn-primary">{t('buildProfile')} <ArrowRight size={16} /></Link></div><div className="connection-flow"><div className="flow-card"><Sprout /><span><b>{t('realNeed')}</b><small>{t('waterFarm')}</small></span></div><ArrowDownRight className="flow-arrow" /><div className="flow-branches"><div className="flow-card"><Users /><span><b>{t('domainExpert')}</b><small>{t('agricultureContext')}</small></span></div><div className="flow-card"><Compass /><span><b>{t('solutionBuilder')}</b><small>{t('technologyProduct')}</small></span></div></div><ArrowDownRight className="flow-arrow" /><div className="flow-card flow-outcome"><Handshake /><span><b>{t('sharedSolution')}</b><small>{t('partnersCoordinate')}</small></span></div></div></div></section>

    <section id="organizations" className="section organization-section"><div className="section-head"><span className="eyebrow">{t('ecosystemEyebrow')}</span><h2>{t('ecosystemTitle')}</h2><p>{t('ecosystemText')}</p></div><div className="stakeholder-grid"><article><Users /><b>{t('people')}</b><p>{t('peopleDescription')}</p></article><article><Building2 /><b>{t('organizations')}</b><p>{t('organizationsDescription')}</p></article><article><ShieldCheck /><b>{t('expertsAdmins')}</b><p>{t('expertsDescription')}</p></article></div></section>

    <section className="company-features"><div className="company-feature"><Globe2 /><span><b>{t('multilingual')}</b><small>{t('multilingualDescription')}</small></span></div><div className="company-feature"><Sparkles /><span><b>{t('aiDiscovery')}</b><small>{t('aiDiscoveryDescription')}</small></span></div><div className="company-feature"><Mic2 /><span><b>{t('voiceEnabled')}</b><small>{t('voiceDescription')}</small></span></div><div className="company-feature"><Languages /><span><b>{t('reusablePlatform')}</b><small>{t('reusableDescription')}</small></span></div></section>
    <footer>{t('footerText')}</footer>
  </div>;
}

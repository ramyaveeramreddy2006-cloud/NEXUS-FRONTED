import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, BookOpen, Briefcase, CalendarDays, Check, Compass, Plus, Save, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { useLanguage } from '../context/LanguageContext';

const fields = [
  { id: 'EDUCATION', label: 'Education', icon: '🎓', focus: 'focusEducation' },
  { id: 'AGRICULTURE', label: 'Agriculture', icon: '🌱', focus: 'focusAgriculture' },
  { id: 'BUSINESS', label: 'Business', icon: '💼', focus: 'focusBusiness' },
  { id: 'TECHNOLOGY', label: 'Technology', icon: '💻', focus: 'focusTechnology' },
  { id: 'HEALTHCARE', label: 'Healthcare', icon: '🏥', focus: 'focusHealthcare' },
  { id: 'GOVERNMENT', label: 'Government', icon: '🏛️', focus: 'focusGovernment' },
  { id: 'COMMUNITY', label: 'Community', icon: '🤝', focus: 'focusCommunity' },
];

const collaborations = [
  { fields: ['AGRICULTURE', 'TECHNOLOGY'], title: 'collabFarmTitle', text: 'collabFarmText' },
  { fields: ['EDUCATION', 'TECHNOLOGY'], title: 'collabLearningTitle', text: 'collabLearningText' },
  { fields: ['BUSINESS', 'EDUCATION'], title: 'collabSkillsTitle', text: 'collabSkillsText' },
  { fields: ['AGRICULTURE', 'BUSINESS'], title: 'collabMarketTitle', text: 'collabMarketText' },
];

export default function Dashboard() {
  const { user, updateDomains, activeDomain, setActiveDomain } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({}); const [posts, setPosts] = useState([]); const [resources, setResources] = useState([]); const [opportunities, setOpportunities] = useState([]); const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(user?.domains?.length ? user.domains : [user?.domain || 'EDUCATION']); const [saving, setSaving] = useState(false); const [error, setError] = useState('');

  useEffect(() => { setSelected(user?.domains?.length ? user.domains : [user?.domain || 'EDUCATION']); }, [user?.domains, user?.domain]);
  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/posts'), api.get('/resources'), api.get('/opportunities'), api.get('/events')])
      .then(([summary, postData, resourceData, opportunityData, eventData]) => { setStats(summary.data); setPosts(postData.data); setResources(resourceData.data); setOpportunities(opportunityData.data); setEvents(eventData.data); })
      .catch(() => setError('Some dashboard recommendations could not be loaded. Check your connection and refresh.'));
  }, []);

  const toggleField = (id) => {
    if (selected.includes(id)) {
      if (selected.length > 1 && id !== user?.domain) {
        const next = selected.filter((item) => item !== id);
        setSelected(next);
        if (activeDomain === id) setActiveDomain(next[0]);
      } else setActiveDomain(id);
      return;
    }
    setSelected((current) => [...current, id]);
    setActiveDomain(id);
  };
  const saveFields = async () => { setSaving(true); setError(''); try { const updated = await updateDomains(selected); setSelected(updated.domains); if (!updated.domains.includes(activeDomain)) setActiveDomain(updated.domains[0] || 'ALL'); } catch (requestError) { setError(requestError.response?.data?.message || 'Could not save your selected fields. Try again.'); } finally { setSaving(false); } };

  const scopedFields = activeDomain !== 'ALL' && selected.includes(activeDomain) ? [activeDomain] : selected;
  const recommended = useMemo(() => ({
    resources: resources.filter((item) => scopedFields.includes(item.domain)).slice(0, 3),
    opportunities: opportunities.filter((item) => scopedFields.includes(item.domain)).slice(0, 3),
    events: events.filter((item) => scopedFields.includes(item.domain)).slice(0, 2),
    posts: posts.filter((item) => scopedFields.includes(item.domain)).slice(0, 3),
  }), [resources, opportunities, events, posts, scopedFields.join('|')]);
  const crossFieldIdeas = collaborations.filter((item) => item.fields.every((field) => selected.includes(field)));

  return <div className="page"><div className="page-head"><div><span className="eyebrow">{t('personalizedWorkspace')}</span><h1>{t('hello')}, {user?.name?.split(' ')[0]}</h1><p>{t('oneProfile')} — {t('focusFields')}</p></div><Link className="btn btn-primary" to={user?.role === 'ORGANIZATION' ? '/opportunities' : '/community'}><Plus size={17} />{user?.role === 'ORGANIZATION' ? t('postOpportunity') : t('shareNeed')}</Link></div>
    {error && <div className="error-box page-error" role="alert">{error}</div>}
    <div className="stats-grid"><StatCard icon={<Users />} title={t('network')} value={stats.users ?? '—'} sub={t('peopleToConnect')} /><StatCard icon={<BookOpen />} title={t('resources')} value={stats.resources ?? '—'} sub={t('sharedKnowledge')} /><StatCard icon={<Briefcase />} title={t('opportunities')} value={stats.opportunities ?? '—'} sub={t('jobsCollaborations')} /><StatCard icon={<CalendarDays />} title={t('events')} value={stats.events ?? '—'} sub={t('communityActivities')} /></div>

    <section className="panel interests-panel"><div className="panel-head"><div><span className="eyebrow">{t('oneProfile')}</span><h2>{t('chooseFields')}</h2></div><button className="btn btn-primary" onClick={saveFields} disabled={saving}><Save size={16} />{saving ? t('saving') : t('saveFields')}</button></div><p className="section-copy">{t('focusFields')}</p><div className="domain-checklist dashboard-domain-list">{fields.map((field) => <button key={field.id} type="button" className={`${selected.includes(field.id) ? 'domain-choice selected' : 'domain-choice'} ${activeDomain === field.id ? 'active-domain' : ''}`} aria-pressed={activeDomain === field.id} onClick={() => toggleField(field.id)}><span>{field.icon}</span>{t(field.id === 'COMMUNITY' ? 'communityField' : field.id.toLowerCase())}{activeDomain === field.id && <Check size={14} />}</button>)}</div><div className="focus-grid">{fields.filter((field) => selected.includes(field.id)).map((field) => <Link key={field.id} className={`focus-card ${activeDomain === field.id ? 'active-domain' : ''}`} to={`/discover?domain=${field.id}`} onClick={() => setActiveDomain(field.id)}><span>{field.icon}</span><div><b>{t(field.id === 'COMMUNITY' ? 'communityField' : field.id.toLowerCase())}</b><small>{t(field.focus)}</small></div><ArrowUpRight size={16} /></Link>)}</div></section>

    {crossFieldIdeas.length > 0 && <section className="collaboration-section"><div className="section-title"><span className="eyebrow"><Compass size={14} /> {t('crossFieldConnections')}</span><h2>{t('interestsMeet')}</h2><p>{t('collaborationIntro')}</p></div><div className="collaboration-grid">{crossFieldIdeas.map((idea) => <article className="collaboration-card" key={idea.title}><div className="collab-fields">{idea.fields.map((id) => <span className="tag" key={id}>{t(id === 'COMMUNITY' ? 'communityField' : id.toLowerCase())}</span>)}</div><h3>{t(idea.title)}</h3><p>{t(idea.text)}</p><Link to="/community">{t('startDiscussion')} <ArrowUpRight size={15} /></Link></article>)}</div></section>}

    <section className="recommendation-section"><div className="section-title"><span className="eyebrow">{t('matchedFields')}</span><h2>{t('relevantNow')}</h2></div><div className="recommendation-grid">
      <div className="panel recommendation-panel"><div className="panel-head"><h2>{t('opportunities')}</h2><Link to="/opportunities">{t('allOpportunities')} <ArrowUpRight size={15} /></Link></div>{recommended.opportunities.length ? recommended.opportunities.map((item) => <Link className="recommendation-item" key={item.id} to="/opportunities"><span className="recommendation-icon"><Briefcase size={16} /></span><div><b>{item.title}</b><small>{item.organization} · {t(item.domain.toLowerCase())}</small></div></Link>) : <div className="empty">{t('matchedOpportunities')}</div>}</div>
      <div className="panel recommendation-panel"><div className="panel-head"><h2>{t('resources')}</h2><Link to="/resources">{t('exploreResources')} <ArrowUpRight size={15} /></Link></div>{recommended.resources.length ? recommended.resources.map((item) => <Link className="recommendation-item" key={item.id} to="/resources"><span className="recommendation-icon"><BookOpen size={16} /></span><div><b>{item.title}</b><small>{t(item.domain.toLowerCase())} · {item.tags}</small></div></Link>) : <div className="empty">{t('matchedResources')}</div>}</div>
      <div className="panel recommendation-panel"><div className="panel-head"><h2>{t('community')}</h2><Link to="/community">{t('joinDiscussion')} <ArrowUpRight size={15} /></Link></div>{recommended.posts.length ? recommended.posts.map((item) => <Link className="recommendation-item" key={item.id} to="/community"><span className="recommendation-icon"><Users size={16} /></span><div><b>{item.title}</b><small>{t(item.domain === 'COMMUNITY' ? 'communityField' : item.domain.toLowerCase())} · {item.authorName}</small></div></Link>) : <div className="empty">{t('matchedPosts')}</div>}</div>
    </div></section>
    {user?.role === 'ORGANIZATION' && <section className="organization-callout"><Briefcase size={20} /><div><b>{t('organizationWorkspace')}</b><p>{t('organizationText')}</p></div><Link className="btn btn-outline" to="/opportunities">{t('manageListings')} <ArrowUpRight size={15} /></Link></section>}
  </div>;
}

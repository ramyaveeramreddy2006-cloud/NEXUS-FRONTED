import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Download, ExternalLink, FileText, Plus, Search, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const domains = ['ALL', 'EDUCATION', 'AGRICULTURE', 'HEALTHCARE', 'BUSINESS', 'TECHNOLOGY', 'GOVERNMENT', 'COMMUNITY'];
const savedKey = 'nexus_saved_resources';
const projectDocuments = [
  { title: 'docProjectBrief', file: 'NEXUS-COMPANY-PROJECT.md', type: 'fileTypeMarkdown' },
  { title: 'docDeploymentGuide', file: 'DEPLOYMENT.md', type: 'fileTypeMarkdown' },
  { title: 'docGithubGuide', file: 'GITHUB.md', type: 'fileTypeMarkdown' },
  { title: 'docPresentationNotes', file: 'PRESENTATION.md', type: 'fileTypeMarkdown' },
  { title: 'docAbstract', file: 'ABSTRACT.txt', type: 'fileTypeText' },
  { title: 'docAbstractWord', file: '24EG107D60_NEXUS_Project_Abstract.docx', type: 'fileTypeWord', download: true },
  { title: 'docPresentation', file: '24EG107D60_NEXUS_Presentation.pptx', type: 'fileTypePowerPoint', download: true },
];

export default function Resources() {
  const { user, activeDomain, setActiveDomain } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', url: '', tags: '', domain: user?.domain || 'EDUCATION' });
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState(activeDomain);
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem(savedKey)) || []; } catch { return []; } });
  const [error, setError] = useState('');
  const load = () => api.get('/resources').then((response) => setItems(response.data)).catch(() => setError('Could not load resources. Check your connection and try again.'));
  useEffect(() => { load(); }, []);
  useEffect(() => { setDomain(activeDomain); setForm((current) => ({ ...current, domain: activeDomain === 'ALL' ? (user?.domain || 'EDUCATION') : activeDomain })); }, [activeDomain, user?.domain]);

  const filtered = useMemo(() => items.filter((item) => (domain === 'ALL' || item.domain === domain)
    && `${item.title} ${item.description} ${item.tags}`.toLowerCase().includes(query.trim().toLowerCase())), [items, domain, query]);
  const toggleSaved = (id) => setSaved((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    localStorage.setItem(savedKey, JSON.stringify(next));
    return next;
  });
  const add = async (event) => {
    event.preventDefault(); setError('');
    try {
      await api.post('/resources', form);
      setForm((current) => ({ ...current, title: '', description: '', url: '', tags: '' }));
      setShow(false); await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Could not publish this resource. Check the details and try again.'); }
  };
  const remove = async (id) => { try { await api.delete(`/resources/${id}`); await load(); } catch { setError('You can remove only resources you shared.'); } };

  return <div className="page"><div className="page-head"><div><span className="eyebrow">{t('knowledgeHub')}</span><h1>{t('resources')}</h1><p>{t('resourcesIntro')}</p></div><button className="btn btn-primary" onClick={() => setShow(!show)}><Plus size={17} /> {t('addResource')}</button></div>
    <section className="project-documents panel"><div className="panel-head"><div><span className="eyebrow">{t('projectLibrary')}</span><h2>{t('projectDocuments')}</h2></div><span className="result-count">{projectDocuments.length} {t('documents')}</span></div><p className="section-copy">{t('projectDocumentsHelp')}</p><div className="resource-grid">{projectDocuments.map((document) => <article className="resource-card project-document" key={document.file}><div className="resource-top"><span className="stat-icon"><FileText size={18} /></span><span className="tag">{t(document.type)}</span></div><h3>{t(document.title)}</h3><p>{document.download ? t('officeFileHelp') : t('textFileHelp')}</p><a className="btn btn-outline document-open" href={`/project-docs/${encodeURIComponent(document.file)}`} target={document.download ? undefined : '_blank'} rel={document.download ? undefined : 'noreferrer'} download={document.download ? document.file : undefined}>{document.download ? <Download size={15} /> : <ExternalLink size={15} />}{document.download ? t('downloadDocument') : t('openDocument')}</a></article>)}</div></section>
    {error && <div className="error-box page-error" role="alert">{error}</div>}
    {show && <form className="panel form-grid resource-form" onSubmit={add}><div><label htmlFor="resource-title">{t('title')}</label><input id="resource-title" required maxLength={160} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div><div><label htmlFor="resource-url">{t('url')}</label><input id="resource-url" type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://…" /></div><div className="span-2"><label htmlFor="resource-description">{t('description')}</label><textarea id="resource-description" required maxLength={3000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div><div><label htmlFor="resource-tags">{t('searchTags')}</label><input id="resource-tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. learning, Java" /></div><div><label htmlFor="resource-domain">{t('field')}</label><select id="resource-domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}>{domains.slice(1).map((item) => <option key={item} value={item}>{t(item === 'COMMUNITY' ? 'communityField' : item.toLowerCase())}</option>)}</select></div><button className="btn btn-primary">{t('publishResource')}</button></form>}
    <div className="toolbar"><div className="input-wrap"><Search size={18} /><input aria-label={t('searchResources')} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchResources')} /></div><select aria-label={t('field')} value={domain} onChange={(e) => { setDomain(e.target.value); setActiveDomain(e.target.value); }}>{domains.map((item) => <option key={item} value={item}>{item === 'ALL' ? t('allFields') : t(item === 'COMMUNITY' ? 'communityField' : item.toLowerCase())}</option>)}</select><span className="result-count">{filtered.length} {t('resourcesCount')}</span></div>
    {filtered.length ? <div className="resource-grid">{filtered.map((resource) => <article className="resource-card" key={resource.id}><div className="resource-top"><span className="tag">{t(resource.domain === 'COMMUNITY' ? 'communityField' : resource.domain.toLowerCase())}</span><div className="resource-actions"><button className={saved.includes(resource.id) ? 'icon-btn saved' : 'icon-btn'} aria-label={saved.includes(resource.id) ? t('removeSavedResource') : t('saveResource')} title={saved.includes(resource.id) ? t('saved') : t('saveForLater')} onClick={() => toggleSaved(resource.id)}><Bookmark size={16} fill={saved.includes(resource.id) ? 'currentColor' : 'none'} /></button>{(resource.uploadedBy?.toLowerCase() === user?.email?.toLowerCase() || user?.role === 'ADMIN') && <button className="icon-btn danger" aria-label={t('deleteYourResource')} title={t('deleteYourResource')} onClick={() => remove(resource.id)}><Trash2 size={16} /></button>}</div></div><h3>{t(resource.title)}</h3><p>{t(resource.description)}</p><div className="resource-meta"><span>{t(resource.tags)}</span>{resource.url && <a href={resource.url} target="_blank" rel="noreferrer"><ExternalLink size={15} /> {t('open')}</a>}</div></article>)}</div> : <div className="empty panel">{items.length ? t('noMatches') : t('noResources')}</div>}
  </div>;
}

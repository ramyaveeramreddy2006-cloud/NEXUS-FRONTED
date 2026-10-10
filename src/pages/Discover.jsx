import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const domains = ['ALL', 'EDUCATION', 'AGRICULTURE', 'HEALTHCARE', 'BUSINESS', 'TECHNOLOGY', 'GOVERNMENT', 'COMMUNITY'];

export default function Discover() {
  const { activeDomain, setActiveDomain } = useAuth();
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const initialDomain = domains.includes(params.get('domain')) ? params.get('domain') : activeDomain;
  const [query, setQuery] = useState(params.get('q') || ''); const [domain, setDomain] = useState(initialDomain); const [posts, setPosts] = useState([]); const [error, setError] = useState('');
  useEffect(() => { setDomain(domains.includes(params.get('domain')) ? params.get('domain') : activeDomain); setQuery(params.get('q') || ''); }, [params, activeDomain]);
  useEffect(() => { api.get('/posts').then((response) => setPosts(response.data)).catch(() => setError('Could not load community posts. Check your connection and try again.')); }, []);
  const filtered = useMemo(() => posts.filter((post) => (domain === 'ALL' || post.domain === domain) && `${post.title} ${post.content} ${post.authorName} ${post.type}`.toLowerCase().includes(query.trim().toLowerCase())), [posts, domain, query]);

  return <div className="page"><div className="page-head"><div><span className="eyebrow">{t('exploreNetwork')}</span><h1>{t('discover')}</h1><p>{t('discoverIntro')}</p></div></div>{error && <div className="error-box page-error" role="alert">{error}</div>}<div className="toolbar"><div className="input-wrap"><Search size={18} /><input aria-label={t('searchPosts')} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchPosts')} /></div><select aria-label={t('field')} value={domain} onChange={(event) => { setDomain(event.target.value); setActiveDomain(event.target.value); }}>{domains.map((item) => <option key={item} value={item}>{item === 'ALL' ? t('allFields') : t(item === 'COMMUNITY' ? 'communityField' : item.toLowerCase())}</option>)}</select><span className="result-count">{filtered.length} {t('posts')}</span></div>{filtered.length ? <div className="cards-list">{filtered.map((post) => <article className="content-card" key={post.id}><div className="tag">{t(post.domain === 'COMMUNITY' ? 'communityField' : post.domain.toLowerCase())}</div><h3>{t(post.title)}</h3><p>{t(post.content)}</p><footer><span>{t(post.authorName)}</span><span>{t(post.type)}</span></footer></article>)}</div> : <div className="empty panel">{posts.length ? t('noMatches') : t('noPosts')}</div>}</div>;
}

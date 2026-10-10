import { useEffect, useState } from 'react';
import { BarChart3, Database, Shield, Users } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const moduleKeys = ['moduleAuthentication', 'moduleRoles', 'moduleCrud', 'moduleRelations', 'moduleAi', 'moduleRetrieval', 'moduleTesting', 'moduleDocker', 'moduleDeployment', 'moduleApiDocs'];

export default function Admin() {
  const [stats, setStats] = useState({});
  const { t } = useLanguage();
  useEffect(() => { api.get('/dashboard').then((response) => setStats(response.data)); }, []);
  return <div className="page"><div className="page-head"><div><span className="eyebrow">{t('adminCenter')}</span><h1>{t('adminTitle')}</h1><p>{t('adminDescription')}</p></div></div>
    <div className="stats-grid"><div className="stat-card"><div className="stat-icon"><Users /></div><div><span>{t('totalMembers')}</span><strong>{stats.users || 0}</strong><small>{t('allMembers')}</small></div></div><div className="stat-card"><div className="stat-icon"><Database /></div><div><span>{t('content')}</span><strong>{(stats.posts || 0) + (stats.resources || 0)}</strong><small>{t('postsResources')}</small></div></div><div className="stat-card"><div className="stat-icon"><BarChart3 /></div><div><span>{t('opportunities')}</span><strong>{stats.opportunities || 0}</strong><small>{t('activeRecords')}</small></div></div><div className="stat-card"><div className="stat-icon"><Shield /></div><div><span>{t('security')}</span><strong>JWT</strong><small>{t('protectedApis')}</small></div></div></div>
    <div className="panel"><div className="panel-head"><h2>{t('architecture')}</h2></div><div className="module-grid">{moduleKeys.map((key) => <div key={key} className="module">✓ {t(key)}</div>)}</div></div>
  </div>;
}

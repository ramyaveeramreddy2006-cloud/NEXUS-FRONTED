import { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Mic, Plus, Search, Send, Square, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import VoiceMessagePlayer from '../components/VoiceMessagePlayer';

const domains = ['EDUCATION', 'AGRICULTURE', 'HEALTHCARE', 'BUSINESS', 'TECHNOLOGY', 'GOVERNMENT', 'COMMUNITY'];

export default function Community() {
  const { user, activeDomain, setActiveDomain } = useAuth(); const { t } = useLanguage();
  const [posts, setPosts] = useState([]); const [show, setShow] = useState(false); const [query, setQuery] = useState(''); const [domain, setDomain] = useState(activeDomain); const [error, setError] = useState(''); const [posting, setPosting] = useState(false); const [recording, setRecording] = useState(false); const [voiceData, setVoiceData] = useState(''); const [voiceMimeType, setVoiceMimeType] = useState('');
  const recorderRef = useRef(null); const streamRef = useRef(null); const chunksRef = useRef([]); const timerRef = useRef(null);
  const [form, setForm] = useState({ title: '', content: '', domain: user?.domain || 'COMMUNITY', type: 'DISCUSSION' });
  const load = () => api.get('/posts').then((response) => setPosts(response.data)).catch(() => setError('Could not load community posts. Check your connection and try again.'));
  useEffect(() => { load(); return () => { clearTimeout(timerRef.current); recorderRef.current?.stop?.(); streamRef.current?.getTracks().forEach((track) => track.stop()); }; }, []);
  useEffect(() => { setDomain(activeDomain); setForm((current) => ({ ...current, domain: activeDomain === 'ALL' ? (user?.domain || 'COMMUNITY') : activeDomain })); }, [activeDomain, user?.domain]);
  const filtered = useMemo(() => posts.filter((post) => (domain === 'ALL' || post.domain === domain) && `${post.title} ${post.content} ${post.authorName} ${post.type}`.toLowerCase().includes(query.trim().toLowerCase())), [posts, domain, query]);
  const removeRecording = () => { setVoiceData(''); setVoiceMimeType(''); };

  const startRecording = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setError('Voice recording is not supported in this browser. Try a current version of Edge or Chrome.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); streamRef.current = stream;
      const recorder = new MediaRecorder(stream); recorderRef.current = recorder; chunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        clearTimeout(timerRef.current); stream.getTracks().forEach((track) => track.stop()); streamRef.current = null; setRecording(false);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (blob.size > 5 * 1024 * 1024) { setError(t('voiceTooLarge')); return; }
        if (!blob.size) return;
        const reader = new FileReader();
        reader.onload = () => { setVoiceData(String(reader.result)); setVoiceMimeType(blob.type || 'audio/webm'); };
        reader.onerror = () => setError('Could not read the recording. Please record it again.');
        reader.readAsDataURL(blob);
      };
      recorder.onerror = () => { setError(t('micPermission')); setRecording(false); stream.getTracks().forEach((track) => track.stop()); };
      recorder.start(); setRecording(true);
      timerRef.current = setTimeout(() => { if (recorder.state === 'recording') recorder.stop(); }, 60_000);
    } catch { setError(t('micPermission')); }
  };

  const stopRecording = () => { clearTimeout(timerRef.current); if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); };
  const add = async (event) => {
    event.preventDefault(); setError(''); setPosting(true);
    try {
      await api.post('/posts', { ...form, audioData: voiceData || null, audioMimeType: voiceMimeType || null });
      setForm((current) => ({ ...current, title: '', content: '' })); removeRecording(); setShow(false); await load();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Could not publish the post. Try again.'); }
    finally { setPosting(false); }
  };
  const remove = async (id) => { try { await api.delete(`/posts/${id}`); await load(); } catch { setError('You can remove only your own posts.'); } };

  return <div className="page"><div className="page-head"><div><span className="eyebrow">{t('community').toUpperCase()}</span><h1>{t('community')}</h1><p>{t('communityIntro')}</p></div><button className="btn btn-primary" onClick={() => setShow(!show)}><Plus size={17} /> {t('newPost')}</button></div>
    {error && <div className="error-box page-error" role="alert">{error}</div>}
    {show && <form className="panel form-grid" onSubmit={add}><div className="span-2"><label htmlFor="post-title">{t('title')}</label><input id="post-title" required maxLength={180} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div><div><label htmlFor="post-type">{t('type')}</label><select id="post-type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="DISCUSSION">{t('discussion')}</option><option value="ANNOUNCEMENT">{t('announcement')}</option><option value="QUESTION">{t('question')}</option><option value="RESOURCE">{t('resources')}</option></select></div><div><label htmlFor="post-domain">{t('field')}</label><select id="post-domain" value={form.domain} onChange={(event) => setForm({ ...form, domain: event.target.value })}>{domains.map((item) => <option key={item}>{item}</option>)}</select></div><div className="span-2"><label htmlFor="post-content">{t('content')}</label><textarea id="post-content" maxLength={5000} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} required={!voiceData} placeholder={voiceData ? t('voiceMessage') : ''} /></div>
      <div className="span-2 voice-recording-tools"><div className="voice-recording-copy"><b>{t('voiceMessage')}</b><small>Up to 60 seconds · 5 MB maximum · audio is shared with this post</small></div>{recording ? <button type="button" className="btn btn-recording" onClick={stopRecording}><Square size={15} /> {t('stopRecording')}</button> : <button type="button" className="btn btn-outline" onClick={startRecording}><Mic size={16} /> {t('record')}</button>}</div>
      {recording && <div className="span-2 recording-indicator"><span className="recording-dot" /> {t('recording')}</div>}{voiceData && <div className="span-2 voice-preview"><audio controls src={voiceData} aria-label={t('voiceMessage')} /><button type="button" className="icon-btn danger" onClick={removeRecording} aria-label={t('removeRecording')} title={t('removeRecording')}><X size={17} /></button><span>{t('voiceMessage')}</span></div>}
      <button disabled={posting || recording} className="btn btn-primary"><Send size={16} /> {posting ? 'Publishing…' : t('publish')}</button></form>}
    <div className="toolbar"><div className="input-wrap"><Search size={18} /><input aria-label={t('searchPosts')} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchPosts')} /></div><select aria-label={t('field')} value={domain} onChange={(event) => { setDomain(event.target.value); setActiveDomain(event.target.value); }}><option value="ALL">{t('allFields')}</option>{domains.map((item) => <option key={item} value={item}>{t(item === 'COMMUNITY' ? 'communityField' : item.toLowerCase())}</option>)}</select><span className="result-count">{filtered.length} {t('posts')}</span></div>
    {filtered.length ? <div className="community-list">{filtered.map((post) => <article className="post" key={post.id}><div className="avatar big">{post.authorName?.[0] || 'N'}</div><div className="post-body"><div className="post-head"><div><b>{t(post.authorName)}</b><span>{t(post.domain === 'COMMUNITY' ? 'communityField' : post.domain.toLowerCase())} · {t(post.type)}</span></div>{(post.authorEmail?.toLowerCase() === user?.email?.toLowerCase() || user?.role === 'ADMIN') && <button className="icon-btn danger" aria-label={t('deleteYourPost')} title={t('deleteYourPost')} onClick={() => remove(post.id)}><Trash2 size={15} /></button>}</div><h3>{t(post.title)}</h3>{post.content && <p>{t(post.content)}</p>}{post.hasVoice && <VoiceMessagePlayer postId={post.id} label={t('playVoice')} />}<div className="post-actions"><span><MessageCircle size={15} /> {t('community')}</span></div></div></article>)}</div> : <div className="empty panel">{posts.length ? t('noMatches') : t('noPosts')}</div>}
  </div>;
}

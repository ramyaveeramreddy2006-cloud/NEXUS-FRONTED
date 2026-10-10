import { useState } from 'react';
import { LoaderCircle, Play } from 'lucide-react';
import api from '../services/api';

export default function VoiceMessagePlayer({ postId, label }) {
  const [audio, setAudio] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const load = async () => {
    if (audio || loading) return;
    setLoading(true); setError('');
    try { const response = await api.get(`/posts/${postId}/voice`); setAudio(response.data.audioData); }
    catch { setError('Voice message could not be loaded.'); }
    finally { setLoading(false); }
  };
  return <div className="voice-player">{audio ? <audio controls preload="none" src={audio} aria-label={label} /> : <button type="button" className="voice-play" onClick={load} disabled={loading}>{loading ? <LoaderCircle size={16} className="spin" /> : <Play size={16} />} {loading ? 'Loading…' : label}</button>}{error && <small role="alert">{error}</small>}</div>;
}

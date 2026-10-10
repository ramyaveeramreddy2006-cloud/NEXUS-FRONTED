import { useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, Mic, Send, Sparkles, Square, User, Volume2, VolumeX } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function AIAssistant() {
  const { language, languages, t } = useLanguage();
  const [messages, setMessages] = useState(() => [{ role: 'ai', text: t('aiWelcome') }]);
  const [question, setQuestion] = useState(''); const [loading, setLoading] = useState(false); const [listening, setListening] = useState(false); const [speaking, setSpeaking] = useState(false); const [error, setError] = useState('');
  const recognitionRef = useRef(null); const messagesRef = useRef(null);
  const speechLocale = languages.find((item) => item.code === language)?.speech || 'en-IN';

  useEffect(() => { messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => () => { recognitionRef.current?.abort?.(); window.speechSynthesis?.cancel(); }, []);

  const send = async (event) => {
    event?.preventDefault();
    const text = question.trim();
    if (!text || loading) return;
    setQuestion(''); setError(''); setMessages((current) => [...current, { role: 'user', text }]); setLoading(true);
    try {
      const response = await api.post('/ai/chat', { message: text, language });
      setMessages((current) => [...current, { role: 'ai', text: response.data.answer, source: response.data.source }]);
    } catch {
      setMessages((current) => [...current, { role: 'ai', text: 'The assistant is temporarily unavailable. Please try again.' }]);
    } finally { setLoading(false); }
  };

  const toggleListening = () => {
    if (listening) { recognitionRef.current?.stop(); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError(t('micUnsupported')); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = speechLocale; recognition.continuous = false; recognition.interimResults = false; recognition.maxAlternatives = 1;
    recognition.onresult = (event) => setQuestion((current) => `${current}${current ? ' ' : ''}${event.results[0][0].transcript}`);
    recognition.onerror = () => { setError(t('micPermission')); setListening(false); };
    recognition.onend = () => { setListening(false); recognitionRef.current = null; };
    recognitionRef.current = recognition; setError(''); setListening(true);
    try { recognition.start(); } catch { setListening(false); setError(t('micPermission')); }
  };

  const readAloud = (text) => {
    if (!window.speechSynthesis) { setError('Speech playback is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = speechLocale;
    utterance.onstart = () => setSpeaking(true); utterance.onend = () => setSpeaking(false); utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };

  return <div className="page ai-page"><div className="page-head"><div><span className="eyebrow"><Sparkles size={14} /> {t('multilingualVoice')}</span><h1>{t('aiTitle')}</h1><p>{t('aiDescription')}</p></div></div>
    <section className="chat-shell" aria-label={t('aiTitle')}><div className="chat-head"><div className="ai-avatar"><Bot /></div><div><b>{t('brandName')} AI</b><span>English · हिन्दी · తెలుగు · தமிழ்</span></div><span className="online">● {t('online')}</span></div>
      <div className="messages" ref={messagesRef} aria-live="polite">{messages.map((message, index) => <div className={'message ' + message.role} key={`${index}-${message.role}`}><div className="msg-icon">{message.role === 'ai' ? <Bot size={16} /> : <User size={16} />}</div><div className="message-content"><p>{message.text}</p>{message.source && <small>{message.source}</small>}{message.role === 'ai' && <button className="speak-button" type="button" onClick={() => speaking ? stopSpeaking() : readAloud(message.text)} aria-label={speaking ? t('stopSpeaking') : t('speakReply')}>{speaking ? <VolumeX size={15} /> : <Volume2 size={15} />} {speaking ? t('stopSpeaking') : t('speakReply')}</button>}</div></div>)}{loading && <div className="typing"><LoaderCircle size={15} className="spin" /> {t('thinking')}</div>}</div>
      {error && <div className="voice-error" role="status">{error}</div>}
      {listening && <div className="listening-status"><span className="listening-dot" />{t('listening')}</div>}
      <form className="chat-input" onSubmit={send}><button className={listening ? 'voice-button active' : 'voice-button'} type="button" onClick={toggleListening} aria-label={listening ? t('listening') : t('speakQuestion')} title={listening ? t('listening') : t('speakQuestion')}>{listening ? <Square size={17} /> : <Mic size={18} />}</button><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t('aiPlaceholder')} aria-label={t('aiPlaceholder')} /><button disabled={loading || !question.trim()} className="btn btn-primary" aria-label={t('send') || 'Send'}><Send size={17} /></button></form>
    </section>
  </div>;
}

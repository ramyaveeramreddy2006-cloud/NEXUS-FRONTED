import {ArrowUpRight} from 'lucide-react';
export default function FieldCard({icon,title,text,onClick}){return <button className="field-card" onClick={onClick}><div className="field-icon">{icon}</div><div><b>{title}</b><p>{text}</p></div><ArrowUpRight size={18}/></button>}

import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useApi } from '../../hooks/useApi';
import { getShortlist, removeFromShortlist } from '../../services/shortlistService';
import { ToastContext } from '../../context/ToastContext';

const COUNTRY_FLAGS = {
  Germany: '🇩🇪', Canada: '🇨🇦', 'United Kingdom': '🇬🇧',
  'United States': '🇺🇸', Australia: '🇦🇺', Turkey: '🇹🇷', Netherlands: '🇳🇱',
};

const STATUS_OPTIONS = ['Not Applied','Applied','Interview','Accepted','Rejected'];
const STATUS_COLORS = {
  'Not Applied': { bg: '#F3F4F6', color: '#6B7280' },
  'Applied': { bg: '#EFF6FF', color: '#1D4ED8' },
  'Interview': { bg: '#FFFBEB', color: '#D97706' },
  'Accepted': { bg: '#F0FDF4', color: '#15803D' },
  'Rejected': { bg: '#FEF2F2', color: '#DC2626' },
};

function Shimmer() {
  return (
    <div style={{ height: 90, borderRadius: 12, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 12 }} />
  );
}

function EmptyState({ type }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--saa-text-muted)' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
      <h5 style={{ color: 'var(--saa-navy)' }}>No {type} saved yet</h5>
      <p style={{ fontSize: 14 }}>Browse and save {type.toLowerCase()} to track your applications</p>
      <Link to={`/${type.toLowerCase().replace(' ','')}`} style={{ display: 'inline-block', marginTop: 12, background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', fontWeight: 700, padding: '0.6rem 1.5rem', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
        Browse {type} →
      </Link>
    </div>
  );
}

function UniversityRow({ item, onRemove }) {
  const [status, setStatus] = useState('Not Applied');
  const sc = STATUS_COLORS[status];
  const flag = COUNTRY_FLAGS[item.country] || '🌍';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '1rem 1.25rem', background: '#fff', borderRadius: 12, marginBottom: 10, border: '1.5px solid var(--saa-border)', flexWrap: 'wrap' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--saa-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{flag}</div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--saa-navy)' }}>{item.name}</div>
        <div style={{ fontSize: 12, color: 'var(--saa-text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <i className="bi bi-geo-alt-fill" style={{ color: 'var(--saa-danger)', fontSize: 10 }} />{item.city}, {item.country}
        </div>
      </div>
      <div style={{ minWidth: 140, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 12, color: 'var(--saa-text-muted)' }}>Tuition: <strong style={{ color: 'var(--saa-navy)' }}>${item.tuition_fee_usd?.toLocaleString()}/yr</strong></div>
        <div style={{ fontSize: 12, color: 'var(--saa-text-muted)' }}>Deadline: <strong style={{ color: 'var(--saa-navy)' }}>{item.application_deadline}</strong></div>
      </div>
      <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.4rem 0.75rem', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color, cursor: 'pointer' }}>
        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to={`/how-to-apply/university/${item.id}`} style={{ fontSize: 12, fontWeight: 600, color: 'var(--saa-teal)', textDecoration: 'none', border: '1.5px solid var(--saa-teal)', borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap' }}>How to Apply</Link>
        <button onClick={() => onRemove(item)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}>
          <i className="bi bi-trash" />
        </button>
      </div>
    </div>
  );
}

function ScholarshipRow({ item, onRemove }) {
  const [status, setStatus] = useState('Not Applied');
  const sc = STATUS_COLORS[status];
  const flag = COUNTRY_FLAGS[item.funding_country] || '🌍';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '1rem 1.25rem', background: '#fff', borderRadius: 12, marginBottom: 10, border: '1.5px solid var(--saa-border)', flexWrap: 'wrap' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--saa-gradient-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{flag}</div>
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--saa-navy)' }}>{item.name}</div>
        <div style={{ fontSize: 12, color: 'var(--saa-text-muted)', marginTop: 2 }}>{item.provider}</div>
      </div>
      <div style={{ minWidth: 140, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 12, color: 'var(--saa-text-muted)' }}>Coverage: <strong style={{ color: 'var(--saa-navy)' }}>{item.coverage}</strong></div>
        <div style={{ fontSize: 12, color: 'var(--saa-text-muted)' }}>Deadline: <strong style={{ color: 'var(--saa-navy)' }}>{item.deadline}</strong></div>
      </div>
      <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.4rem 0.75rem', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color, cursor: 'pointer' }}>
        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div style={{ display: 'flex', gap: 8 }}>
        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: 'var(--saa-teal)', textDecoration: 'none', border: '1.5px solid var(--saa-teal)', borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap' }}>Official Link</a>
        <button onClick={() => onRemove(item)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}>
          <i className="bi bi-trash" />
        </button>
      </div>
    </div>
  );
}

export default function ShortlistPage() {
  const toast = useContext(ToastContext);
  const { data, loading, setData } = useApi(getShortlist);
  const universities = data?.data?.universities || [];
  const scholarships = data?.data?.scholarships || [];
  const [tab, setTab] = useState('universities');

  async function handleRemoveUni(item) {
    await removeFromShortlist('university', item.id);
    setData(prev => ({ ...prev, data: { ...prev.data, universities: prev.data.universities.filter(u => u.id !== item.id) } }));
    toast?.info(`Removed ${item.name} from shortlist`);
  }

  async function handleRemoveSch(item) {
    await removeFromShortlist('scholarship', item.id);
    setData(prev => ({ ...prev, data: { ...prev.data, scholarships: prev.data.scholarships.filter(s => s.id !== item.id) } }));
    toast?.info(`Removed ${item.name} from shortlist`);
  }

  return (
    <DashboardLayout pageTitle="Shortlist">
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {[
          { key: 'universities', label: `Universities (${universities.length})` },
          { key: 'scholarships', label: `Scholarships (${scholarships.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '0.6rem 1.25rem', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, transition: 'var(--saa-transition)',
            background: tab === t.key ? '#fff' : 'transparent',
            color: tab === t.key ? 'var(--saa-navy)' : 'var(--saa-text-muted)',
            boxShadow: tab === t.key ? 'var(--saa-shadow-sm)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {loading ? (
        <div>{[1,2,3].map(i => <Shimmer key={i} />)}</div>
      ) : tab === 'universities' ? (
        universities.length === 0 ? <EmptyState type="Universities" /> :
        universities.map(u => <UniversityRow key={u.id} item={u} onRemove={handleRemoveUni} />)
      ) : (
        scholarships.length === 0 ? <EmptyState type="Scholarships" /> :
        scholarships.map(s => <ScholarshipRow key={s.id} item={s} onRemove={handleRemoveSch} />)
      )}
    </DashboardLayout>
  );
}

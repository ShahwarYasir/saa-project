import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useApi } from '../../hooks/useApi';
import { getScholarships } from '../../services/recommendationService';
import { addToShortlist, removeFromShortlist } from '../../services/shortlistService';

const COVERAGE_GRAD = {
  'Fully Funded': 'linear-gradient(135deg,#F5A623 0%,#FFD166 100%)',
  'Partial Funding': 'linear-gradient(135deg,#0EA5E9 0%,#0284C7 100%)',
  'Stipend Only': 'linear-gradient(135deg,#8B5CF6 0%,#6D28D9 100%)',
};

const COUNTRY_FLAGS = {
  Germany: '🇩🇪', Canada: '🇨🇦', 'United Kingdom': '🇬🇧',
  'United States': '🇺🇸', Australia: '🇦🇺', Turkey: '🇹🇷', Netherlands: '🇳🇱',
};

function daysLeft(deadline) {
  const d = new Date(deadline) - new Date();
  return Math.ceil(d / (1000 * 60 * 60 * 24));
}

function Shimmer() {
  return (
    <div className="saa-card" style={{ overflow: 'hidden' }}>
      <div style={{ height: 100, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ padding: '1rem' }}>
        {[1,2,3].map(i => <div key={i} style={{ height: 14, borderRadius: 8, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 10 }} />)}
      </div>
    </div>
  );
}

function ScholarshipCard({ sch, saved, onToggleSave }) {
  const grad = COVERAGE_GRAD[sch.coverage] || COVERAGE_GRAD['Partial Funding'];
  const flag = COUNTRY_FLAGS[sch.funding_country] || '🌍';
  const days = daysLeft(sch.deadline);
  const initials = (sch.provider || '').split(' ').map(w => w?.[0] || '').slice(0,2).join('').toUpperCase();

  return (
    <div className="saa-card" style={{ overflow: 'hidden', transition: 'var(--saa-transition)', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--saa-shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--saa-shadow-md)'; }}>
      {/* Gradient header */}
      <div style={{ background: grad, padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', borderRadius: 99, padding: '4px 14px', fontSize: 12, fontWeight: 700, color: '#fff' }}>
          {sch.coverage}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff' }}>
          {initials}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h6 style={{ fontWeight: 700, fontSize: 15, color: 'var(--saa-navy)', marginBottom: 4 }}>{sch.name}</h6>
        <div style={{ fontSize: 12, color: 'var(--saa-text-muted)', marginBottom: 8 }}>{sch.provider}</div>
        <div style={{ fontSize: 13, color: 'var(--saa-text)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          {flag} {sch.funding_country}
        </div>

        {/* Eligibility tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {(sch.degree_levels || []).map(dl => (
            <span key={dl} style={{ fontSize: 10, background: '#EFF6FF', color: '#1D4ED8', borderRadius: 99, padding: '2px 8px', fontWeight: 600 }}>{dl}</span>
          ))}
          {sch.eligible_nationalities?.[0] !== 'All' && (
            <span style={{ fontSize: 10, background: '#F0FDF4', color: '#15803D', borderRadius: 99, padding: '2px 8px' }}>{(sch.eligible_nationalities || []).slice(0,2).join(', ')}</span>
          )}
        </div>

        {/* Deadline row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, marginTop: 'auto' }}>
          <i className="bi bi-calendar3" style={{ color: 'var(--saa-text-muted)', fontSize: 12 }} />
          <span style={{ fontSize: 12, color: 'var(--saa-text-muted)' }}>Deadline: {sch.deadline}</span>
          {days < 30 && days > 0 && (
            <span style={{ fontSize: 10, background: '#FEF2F2', color: '#DC2626', borderRadius: 99, padding: '2px 8px', fontWeight: 700 }}>{days}d left</span>
          )}
          {days <= 0 && <span style={{ fontSize: 10, background: '#F3F4F6', color: '#6B7280', borderRadius: 99, padding: '2px 8px' }}>Closed</span>}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => onToggleSave(sch)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: saved ? '#EF4444' : '#CBD5E1', transition: 'color 0.2s' }}>
            <i className={`bi ${saved ? 'bi-heart-fill' : 'bi-heart'}`} />
          </button>
          <a href={sch.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: 'var(--saa-teal)', textDecoration: 'none', border: '1.5px solid var(--saa-teal)', borderRadius: 8, padding: '4px 12px' }}>
            Official Link ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ScholarshipsPage() {
  const { data, loading } = useApi(getScholarships);
  const scholarships = data?.data || [];

  const [search, setSearch] = useState('');
  const [selCountry, setSelCountry] = useState('');
  const [selCoverage, setSelCoverage] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [saved, setSaved] = useState({ 2: true, 4: true });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let res = [...scholarships];
    if (search) res = res.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase()));
    if (selCountry) res = res.filter(s => s.funding_country === selCountry);
    if (selCoverage) res = res.filter(s => s.coverage === selCoverage);
    if (sortBy === 'deadline') res.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    return res;
  }, [scholarships, search, selCountry, selCoverage, sortBy]);

  function clearFilters() { setSearch(''); setSelCountry(''); setSelCoverage(''); setSortBy('default'); }

  async function handleToggleSave(sch) {
    const isSaved = saved[sch.id];
    setSaved(p => ({ ...p, [sch.id]: !isSaved }));
    if (isSaved) await removeFromShortlist('scholarship', sch.id);
    else await addToShortlist('scholarship', sch.id);
  }

  const countries = [...new Set(scholarships.map(s => s.funding_country))];

  return (
    <DashboardLayout pageTitle="Scholarships">
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--saa-navy)' }}>Scholarships</h2>
          {!loading && <span style={{ background: 'var(--saa-gold)', color: 'var(--saa-navy)', borderRadius: 99, padding: '2px 12px', fontSize: 13, fontWeight: 700 }}>{filtered.length}</span>}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="d-md-none" onClick={() => setFiltersOpen(o => !o)} style={{ background: 'var(--saa-navy)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontSize: 13, cursor: 'pointer' }}>
            <i className="bi bi-funnel-fill" /> Filters
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 13, background: '#fff' }}>
            <option value="default">Default</option>
            <option value="deadline">Earliest Deadline</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Filter Sidebar */}
        <div className={`saa-card ${filtersOpen ? '' : 'd-none d-md-block'}`} style={{ width: 260, minWidth: 260, padding: '1.5rem', position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--saa-navy)' }}>Filters</h6>
            <button onClick={clearFilters} style={{ fontSize: 12, color: 'var(--saa-gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear</button>
          </div>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--saa-text-muted)', fontSize: 13 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--saa-text)' }}>Country</div>
            <select value={selCountry} onChange={e => setSelCountry(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 13 }}>
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{COUNTRY_FLAGS[c] || ''} {c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: 'var(--saa-text)' }}>Coverage Type</div>
            {['Fully Funded','Partial Funding','Stipend Only'].map(cv => (
              <label key={cv} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                <input type="radio" name="coverage" value={cv} checked={selCoverage === cv} onChange={() => setSelCoverage(cv)} style={{ accentColor: 'var(--saa-gold)' }} />
                {cv}
              </label>
            ))}
            {selCoverage && <button onClick={() => setSelCoverage('')} style={{ fontSize: 11, color: 'var(--saa-text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>× Clear</button>}
          </div>
        </div>

        {/* Cards */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
              {[1,2,3,4].map(i => <Shimmer key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--saa-text-muted)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎓</div>
              <h5>No scholarships match your filters</h5>
              <button onClick={clearFilters} style={{ marginTop: 12, background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', border: 'none', borderRadius: 8, padding: '0.6rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
              {filtered.map(sch => (
                <ScholarshipCard key={sch.id} sch={sch} saved={!!saved[sch.id]} onToggleSave={handleToggleSave} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

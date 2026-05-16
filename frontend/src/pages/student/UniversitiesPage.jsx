import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useApi } from '../../hooks/useApi';
import { getUniversities } from '../../services/recommendationService';
import { addToShortlist, removeFromShortlist } from '../../services/shortlistService';

const COUNTRY_IMAGES = {
  Germany: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80',
  Canada: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&q=80',
  'United Kingdom': 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=600&q=80',
  'United States': 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80',
  Australia: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80',
  Turkey: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80',
};

const COUNTRY_FLAGS = {
  Germany: '🇩🇪', Canada: '🇨🇦', 'United Kingdom': '🇬🇧',
  'United States': '🇺🇸', Australia: '🇦🇺', Turkey: '🇹🇷',
};

const COUNTRIES = ['Germany','Canada','United Kingdom','United States','Australia','Turkey'];
const DEGREES = ["Bachelor", "Master", "PhD"];

function Shimmer() {
  return (
    <div className="saa-card" style={{ overflow: 'hidden' }}>
      <div style={{ height: 200, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite' }} />
      <div style={{ padding: '1rem' }}>
        {[1,2,3].map(i => <div key={i} style={{ height: 16, borderRadius: 8, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 10 }} />)}
      </div>
    </div>
  );
}

function MatchBar({ score }) {
  const color = score >= 80 ? 'var(--saa-success)' : score >= 60 ? 'var(--saa-gold)' : 'var(--saa-danger)';
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--saa-text-muted)', marginBottom: 4 }}>
        <span>Match Score</span><span style={{ fontWeight: 700, color }}>{score}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: '#F1F5F9' }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: 99, background: color, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

function UniversityCard({ uni, saved, onToggleSave }) {
  const img = COUNTRY_IMAGES[uni.country] || COUNTRY_IMAGES.Germany;
  const flag = COUNTRY_FLAGS[uni.country] || '🌍';
  return (
    <div className="saa-card" style={{ overflow: 'hidden', transition: 'var(--saa-transition)', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--saa-shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--saa-shadow-md)'; }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={img} alt={uni.country} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,22,40,0.7) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: '#fff' }}>
          {flag} {uni.country}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--saa-gradient-gold)', borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: 'var(--saa-navy)' }}>
          #{uni.ranking}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h6 style={{ fontWeight: 700, fontSize: 16, color: 'var(--saa-navy)', marginBottom: 4 }}>{uni.name}</h6>
        <div style={{ fontSize: 12, color: 'var(--saa-text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className="bi bi-geo-alt-fill" style={{ color: 'var(--saa-danger)', fontSize: 11 }} />{uni.city}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {(uni.programs || []).slice(0, 2).map(p => (
            <span key={p} style={{ fontSize: 10, background: 'var(--saa-navy)', color: '#fff', borderRadius: 99, padding: '2px 8px' }}>{p}</span>
          ))}
          {(uni.programs || []).length > 2 && <span style={{ fontSize: 10, color: 'var(--saa-text-muted)' }}>+{(uni.programs || []).length - 2} more</span>}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12, background: '#F8FAFC', borderRadius: 8, padding: '0.75rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--saa-text-muted)' }}>Tuition/yr</div>
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--saa-navy)' }}>${uni.tuition_fee_usd.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'center', borderLeft: '1px solid var(--saa-border)', borderRight: '1px solid var(--saa-border)' }}>
            <div style={{ fontSize: 11, color: 'var(--saa-text-muted)' }}>Min GPA</div>
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--saa-navy)' }}>{uni.gpa_requirement}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--saa-text-muted)' }}>Deadline</div>
            <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--saa-navy)' }}>{uni.application_deadline}</div>
          </div>
        </div>

        <MatchBar score={uni.match_score} />

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <button onClick={() => onToggleSave(uni)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: saved ? '#EF4444' : '#CBD5E1', transition: 'color 0.2s' }} title={saved ? 'Remove from shortlist' : 'Save to shortlist'}>
            <i className={`bi ${saved ? 'bi-heart-fill' : 'bi-heart'}`} />
          </button>
          <Link to={`/how-to-apply/university/${uni.id}`} style={{ fontSize: 13, fontWeight: 600, color: 'var(--saa-teal)', textDecoration: 'none' }}>How to Apply →</Link>
        </div>
      </div>
    </div>
  );
}

export default function UniversitiesPage() {
  const { data, loading } = useApi(getUniversities);
  const universities = useMemo(() => data?.data || [], [data]);

  const [search, setSearch] = useState('');
  const [selCountries, setSelCountries] = useState([]);
  const [selDegrees, setSelDegrees] = useState([]);
  const [maxBudget, setMaxBudget] = useState(60000);
  const [minGpa, setMinGpa] = useState(0);
  const [sortBy, setSortBy] = useState('match_score');
  const [saved, setSaved] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const next = {};
    universities.forEach(uni => {
      if (uni.is_shortlisted) next[uni.id] = true;
    });
    setSaved(next);
  }, [universities]);

  const filtered = useMemo(() => {
    let res = [...universities];
    if (search) res = res.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.city.toLowerCase().includes(search.toLowerCase()));
    if (selCountries.length) res = res.filter(u => selCountries.includes(u.country));
    if (selDegrees.length) res = res.filter(u => (u.degree_levels || []).some(d => selDegrees.includes(d)));
    res = res.filter(u => (u.tuition_fee_usd || 0) <= maxBudget);
    res = res.filter(u => u.gpa_requirement >= minGpa);
    res.sort((a, b) => {
      if (sortBy === 'match_score') return b.match_score - a.match_score;
      if (sortBy === 'ranking') return a.ranking - b.ranking;
      if (sortBy === 'tuition') return a.tuition_fee_usd - b.tuition_fee_usd;
      if (sortBy === 'deadline') return new Date(a.application_deadline) - new Date(b.application_deadline);
      return 0;
    });
    return res;
  }, [universities, search, selCountries, selDegrees, maxBudget, minGpa, sortBy]);

  function clearFilters() { setSearch(''); setSelCountries([]); setSelDegrees([]); setMaxBudget(60000); setMinGpa(0); setSortBy('match_score'); }

  async function handleToggleSave(uni) {
    const isSaved = saved[uni.id];
    setSaved(p => ({ ...p, [uni.id]: !isSaved }));
    try {
      if (isSaved) await removeFromShortlist('university', uni.id);
      else await addToShortlist('university', uni.id);
    } catch {
      setSaved(p => ({ ...p, [uni.id]: isSaved }));
    }
  }

  return (
    <DashboardLayout pageTitle="Universities">
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--saa-navy)' }}>Universities</h2>
          {!loading && <span style={{ background: 'var(--saa-navy)', color: '#fff', borderRadius: 99, padding: '2px 12px', fontSize: 13, fontWeight: 600 }}>{filtered.length}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button className="d-md-none" onClick={() => setFiltersOpen(o => !o)} style={{ background: 'var(--saa-navy)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontSize: 13, cursor: 'pointer' }}>
            <i className="bi bi-funnel-fill" /> Filters
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.5rem 0.75rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 13, background: '#fff' }}>
            <option value="match_score">Best Match</option>
            <option value="ranking">Ranking</option>
            <option value="deadline">Deadline</option>
            <option value="tuition">Tuition</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Filter Sidebar */}
        <div className={`saa-card ${filtersOpen ? '' : 'd-none d-md-block'}`} style={{ width: 280, minWidth: 280, padding: '1.5rem', position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--saa-navy)' }}>Filters</h6>
            <button onClick={clearFilters} style={{ fontSize: 12, color: 'var(--saa-gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear All</button>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--saa-text-muted)', fontSize: 14 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search universities..." style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 13 }} />
          </div>
          {/* Country */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--saa-text)' }}>Country</div>
            {COUNTRIES.map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={selCountries.includes(c)} onChange={e => setSelCountries(p => e.target.checked ? [...p, c] : p.filter(x => x !== c))} style={{ accentColor: 'var(--saa-gold)' }} />
                {COUNTRY_FLAGS[c] || '🌍'} {c}
              </label>
            ))}
          </div>
          {/* Degree Level */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--saa-text)' }}>Degree Level</div>
            {DEGREES.map(d => (
              <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer', fontSize: 13 }}>
                <input type="checkbox" checked={selDegrees.includes(d)} onChange={e => setSelDegrees(p => e.target.checked ? [...p, d] : p.filter(x => x !== d))} style={{ accentColor: 'var(--saa-gold)' }} />
                {d}
              </label>
            ))}
          </div>
          {/* Budget slider */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: 'var(--saa-text)' }}>Max Budget: ${maxBudget.toLocaleString()}</div>
            <input type="range" min={1000} max={60000} step={1000} value={maxBudget} onChange={e => setMaxBudget(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--saa-gold)' }} />
          </div>
          {/* Min GPA */}
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: 'var(--saa-text)' }}>Min GPA: {minGpa}</div>
            <input type="range" min={0} max={4} step={0.1} value={minGpa} onChange={e => setMinGpa(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--saa-gold)' }} />
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {[1,2,3,4].map(i => <Shimmer key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--saa-text-muted)' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎓</div>
              <h5>No universities match your filters</h5>
              <button onClick={clearFilters} style={{ marginTop: 12, background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', border: 'none', borderRadius: 8, padding: '0.6rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {filtered.map(uni => (
                <UniversityCard key={uni.id} uni={uni} saved={!!saved[uni.id]} onToggleSave={handleToggleSave} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

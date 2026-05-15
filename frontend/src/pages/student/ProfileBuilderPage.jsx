import { useState, useContext, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';
import { getProfile, updateProfile } from '../../services/profileService';
import { ToastContext } from '../../context/ToastContext';

const COUNTRIES = ['Pakistan','India','Bangladesh','Nigeria','United Kingdom','Germany','Canada','United States','Australia','Turkey','France','Netherlands','China','Japan','Other'];
const QUALIFICATIONS = ["Matric","Intermediate","Bachelor's","Master's","PhD"];
const FIELDS = ['Computer Science','Engineering','Business','Medicine','Arts','Law','Other'];
const DEGREE_LEVELS = [
  { value: "Bachelor's", icon: '🎓' },
  { value: "Master's",   icon: '📚' },
  { value: 'PhD',        icon: '🔬' },
  { value: 'Diploma',    icon: '📜' },
];
const PREF_COUNTRIES = [
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇬🇧', name: 'UK' },
  { flag: '🇺🇸', name: 'USA' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇹🇷', name: 'Turkey' },
];
const RANKING_OPTIONS = ['Top 50','Top 100','Top 200','Any'];

const schema1 = yup.object({ full_name: yup.string().required('Required'), nationality: yup.string().required('Required'), current_country: yup.string().required('Required'), phone: yup.string().required('Required') });
const schema2 = yup.object({ current_qualification: yup.string().required('Required'), gpa_mode: yup.string(), gpa_value: yup.string().required('Required'), field_of_interest: yup.string().required('Required'), ielts_score: yup.number().min(0).max(9).required('Required') });
const schema3 = yup.object({ degree_level: yup.string().required('Select degree level'), annual_budget_usd: yup.number().required() });

function Shimmer({ h = 40, r = 8 }) {
  return <div style={{ height: h, borderRadius: r, background: 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s infinite', marginBottom: 12 }} />;
}

function FieldGroup({ label, error, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: 'var(--saa-text)', marginBottom: 6 }}>{label}</label>
      {children}
      {error && <div style={{ color: 'var(--saa-danger)', fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function SInput({ reg, type = 'text', placeholder, ...rest }) {
  return <input {...reg} type={type} placeholder={placeholder} {...rest} style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff', color: 'var(--saa-text)', ...rest.style }} />;
}

function SSelect({ reg, options, placeholder, ...rest }) {
  return (
    <select {...reg} {...rest} style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid var(--saa-border)', borderRadius: 8, fontSize: 14, background: '#fff', color: 'var(--saa-text)', ...rest.style }}>
      <option value="">{placeholder || 'Select...'}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function StepIndicator({ currentStep }) {
  const steps = ['Personal Info', 'Academic Background', 'Study Preferences'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
      {steps.map((s, i) => {
        const num = i + 1;
        const done = currentStep > num;
        const active = currentStep === num;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 15,
                background: done ? 'var(--saa-success)' : active ? 'var(--saa-gold)' : '#fff',
                border: done || active ? 'none' : '2px solid var(--saa-border)',
                color: done || active ? '#fff' : 'var(--saa-text-muted)',
              }}>
                {done ? '✓' : num}
              </div>
              <div style={{ fontSize: 11, fontWeight: done || active ? 700 : 400, color: active ? 'var(--saa-gold)' : done ? 'var(--saa-success)' : 'var(--saa-text-muted)', whiteSpace: 'nowrap' }}>{s}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 80, height: 2, background: done ? 'var(--saa-success)' : 'var(--saa-border)', margin: '0 8px', marginBottom: 24 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProfileBuilderPage() {
  const { user } = useAuth();
  const toast = useContext(ToastContext);
  const { data: profileData, loading } = useApi(getProfile);
  const profile = profileData?.data || {};
  const { percentage } = useProfileCompletion(profile);

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [prefCountries, setPrefCountries] = useState(profile.preferred_countries || []);
  const [budget, setBudget] = useState(profile.annual_budget_usd || 15000);
  const [needsScholarship, setNeedsScholarship] = useState(profile.needs_scholarship || false);

  const { register: reg1, handleSubmit: hs1, formState: { errors: e1 } } = useForm({ resolver: yupResolver(schema1), defaultValues: { full_name: profile.full_name || '', nationality: profile.nationality || '', current_country: profile.current_country || '', phone: profile.phone || '' } });
  const { register: reg2, handleSubmit: hs2, formState: { errors: e2 }, watch: w2 } = useForm({ resolver: yupResolver(schema2), defaultValues: { current_qualification: profile.current_qualification || '', gpa_mode: 'GPA', gpa_value: profile.gpa ? String(profile.gpa) : '', field_of_interest: profile.field_of_interest || '', ielts_score: profile.ielts_score || '', toefl_score: profile.toefl_score || '', other_languages: profile.other_languages || '' } });
  const { register: reg3, handleSubmit: hs3, formState: { errors: e3 }, watch: w3, setValue: sv3 } = useForm({ resolver: yupResolver(schema3), defaultValues: { degree_level: profile.degree_level || '', annual_budget_usd: profile.annual_budget_usd || 15000, target_intake_season: 'Fall', target_intake_year: '2027', ranking_preference: profile.ranking_preference || 'Any' } });

  const gpaMode = w2('gpa_mode');
  const degLevel = w3('degree_level');

  const step1Data = useRef({});
  const step2Data = useRef({});

  function onStep1(data) { step1Data.current = data; setStep(2); }
  function onStep2(data) { step2Data.current = data; setStep(3); }

  async function onStep3(data) {
    setSaving(true);
    try {
      const payload = {
        ...step1Data.current, ...step2Data.current,
        degree_level: data.degree_level,
        preferred_countries: prefCountries,
        annual_budget_usd: budget,
        needs_scholarship: needsScholarship,
        target_intake: `${data.target_intake_season} ${data.target_intake_year}`,
        ranking_preference: data.ranking_preference,
      };
      await updateProfile(payload);
      toast?.success('Profile saved successfully! ✅');
    } catch { toast?.error('Failed to save profile'); }
    finally { setSaving(false); }
  }

  if (loading) return (
    <DashboardLayout pageTitle="Profile Builder">
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>
      {[1,2,3,4].map(i => <Shimmer key={i} h={60} />)}
    </DashboardLayout>
  );

  return (
    <DashboardLayout pageTitle="Profile Builder">
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>

      {/* Profile completion mini ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          <svg width={64} height={64} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={32} cy={32} r={26} fill="none" stroke="#e2e8f0" strokeWidth={6} />
            <circle cx={32} cy={32} r={26} fill="none" stroke="var(--saa-gold)" strokeWidth={6}
              strokeLinecap="round" strokeDasharray={163} strokeDashoffset={163 - (percentage/100)*163}
              style={{ transition: 'stroke-dashoffset 1s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--saa-navy)' }}>{percentage}%</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--saa-navy)' }}>Profile Completion</div>
          <div style={{ fontSize: 13, color: 'var(--saa-text-muted)' }}>Fill all fields to improve match accuracy</div>
        </div>
      </div>

      <StepIndicator currentStep={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <div className="saa-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 32 }}>👤</span>
            <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--saa-navy)' }}>Personal Information</h4>
          </div>
          <form onSubmit={hs1(onStep1)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <FieldGroup label="Full Name *" error={e1.full_name?.message}>
                <SInput reg={reg1('full_name')} placeholder="Your full name" />
              </FieldGroup>
              <FieldGroup label="Phone Number *" error={e1.phone?.message}>
                <SInput reg={reg1('phone')} placeholder="+92 300 1234567" />
              </FieldGroup>
              <FieldGroup label="Nationality *" error={e1.nationality?.message}>
                <SSelect reg={reg1('nationality')} options={COUNTRIES} placeholder="Select nationality" />
              </FieldGroup>
              <FieldGroup label="Current Country *" error={e1.current_country?.message}>
                <SSelect reg={reg1('current_country')} options={COUNTRIES} placeholder="Select country" />
              </FieldGroup>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="submit" style={{ background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', fontWeight: 700, padding: '0.75rem 2rem', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14 }}>Next →</button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="saa-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 32 }}>🎓</span>
            <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--saa-navy)' }}>Academic Background</h4>
          </div>
          <form onSubmit={hs2(onStep2)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <FieldGroup label="Current Qualification *" error={e2.current_qualification?.message}>
                <SSelect reg={reg2('current_qualification')} options={QUALIFICATIONS} placeholder="Select..." />
              </FieldGroup>
              <FieldGroup label="Field of Interest *" error={e2.field_of_interest?.message}>
                <SSelect reg={reg2('field_of_interest')} options={FIELDS} placeholder="Select field" />
              </FieldGroup>
            </div>
            <FieldGroup label={gpaMode === 'GPA' ? 'GPA (out of 4.0) *' : 'Percentage *'} error={e2.gpa_value?.message}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                {['GPA','Percentage'].map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                    <input type="radio" {...reg2('gpa_mode')} value={m} defaultChecked={m === 'GPA'} />{m}
                  </label>
                ))}
              </div>
              <SInput reg={reg2('gpa_value')} placeholder={gpaMode === 'GPA' ? 'e.g. 3.45' : 'e.g. 85'} />
            </FieldGroup>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <FieldGroup label="IELTS Score *" error={e2.ielts_score?.message}>
                <SInput reg={reg2('ielts_score')} type="number" placeholder="e.g. 7.0" style={{ MozAppearance: 'textfield' }} />
              </FieldGroup>
              <FieldGroup label="TOEFL Score (optional)">
                <SInput reg={reg2('toefl_score')} type="number" placeholder="e.g. 100" />
              </FieldGroup>
            </div>
            <FieldGroup label="Other Languages (optional)">
              <SInput reg={reg2('other_languages')} placeholder="e.g. Urdu, German" />
            </FieldGroup>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: '#F1F5F9', color: 'var(--saa-text)', fontWeight: 600, padding: '0.75rem 1.5rem', border: 'none', borderRadius: 10, cursor: 'pointer' }}>← Back</button>
              <button type="submit" style={{ background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', fontWeight: 700, padding: '0.75rem 2rem', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Next →</button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="saa-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 32 }}>🌍</span>
            <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--saa-navy)' }}>Study Preferences</h4>
          </div>
          <form onSubmit={hs3(onStep3)}>
            {/* Degree Level Cards */}
            <FieldGroup label="Degree Level *" error={e3.degree_level?.message}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {DEGREE_LEVELS.map(dl => (
                  <button key={dl.value} type="button" onClick={() => sv3('degree_level', dl.value)}
                    style={{
                      flex: '1 1 120px', padding: '1rem', border: `2px solid ${degLevel === dl.value ? 'var(--saa-gold)' : 'var(--saa-border)'}`,
                      borderRadius: 12, background: degLevel === dl.value ? 'rgba(245,166,35,0.08)' : '#fff',
                      cursor: 'pointer', transition: 'var(--saa-transition)', textAlign: 'center',
                    }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{dl.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: degLevel === dl.value ? 'var(--saa-gold)' : 'var(--saa-text)' }}>{dl.value}</div>
                  </button>
                ))}
              </div>
            </FieldGroup>

            {/* Preferred Countries */}
            <FieldGroup label="Preferred Countries">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {PREF_COUNTRIES.map(c => {
                  const checked = prefCountries.includes(c.name);
                  return (
                    <label key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 1rem', border: `1.5px solid ${checked ? 'var(--saa-gold)' : 'var(--saa-border)'}`, borderRadius: 8, cursor: 'pointer', background: checked ? 'rgba(245,166,35,0.07)' : '#fff', transition: 'var(--saa-transition)' }}>
                      <input type="checkbox" checked={checked} onChange={e => setPrefCountries(p => e.target.checked ? [...p, c.name] : p.filter(x => x !== c.name))} style={{ display: 'none' }} />
                      <span>{c.flag}</span><span style={{ fontSize: 13, fontWeight: 600, color: checked ? 'var(--saa-gold)' : 'var(--saa-text)' }}>{c.name}</span>
                    </label>
                  );
                })}
              </div>
            </FieldGroup>

            {/* Budget Slider */}
            <FieldGroup label={`Annual Budget: $${budget.toLocaleString()}`}>
              <input type="range" min={5000} max={50000} step={1000} value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--saa-gold)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--saa-text-muted)', marginTop: 4 }}>
                <span>$5,000</span><span>$50,000</span>
              </div>
            </FieldGroup>

            {/* Needs Scholarship toggle */}
            <FieldGroup label="Needs Scholarship">
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ position: 'relative', width: 44, height: 24 }} onClick={() => setNeedsScholarship(x => !x)}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: needsScholarship ? 'var(--saa-gold)' : '#CBD5E1', transition: 'background 0.2s' }} />
                  <div style={{ position: 'absolute', top: 3, left: needsScholarship ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--saa-text)' }}>{needsScholarship ? 'Yes, I need scholarship' : 'No scholarship needed'}</span>
              </label>
            </FieldGroup>

            {/* Target Intake */}
            <FieldGroup label="Target Intake">
              <div style={{ display: 'flex', gap: 12 }}>
                <SSelect reg={reg3('target_intake_season')} options={['Spring','Fall']} style={{ flex: 1 }} />
                <SSelect reg={reg3('target_intake_year')} options={['2025','2026','2027','2028']} style={{ flex: 1 }} />
              </div>
            </FieldGroup>

            {/* Ranking Preference */}
            <FieldGroup label="Ranking Preference">
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {RANKING_OPTIONS.map(r => {
                  const cur = w3('ranking_preference');
                  return (
                    <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', border: `1.5px solid ${cur === r ? 'var(--saa-gold)' : 'var(--saa-border)'}`, borderRadius: 8, cursor: 'pointer', background: cur === r ? 'rgba(245,166,35,0.07)' : '#fff' }}>
                      <input type="radio" {...reg3('ranking_preference')} value={r} style={{ display: 'none' }} />
                      <span style={{ fontSize: 13, fontWeight: cur === r ? 700 : 400, color: cur === r ? 'var(--saa-gold)' : 'var(--saa-text)' }}>{r}</span>
                    </label>
                  );
                })}
              </div>
            </FieldGroup>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <button type="button" onClick={() => setStep(2)} style={{ background: '#F1F5F9', color: 'var(--saa-text)', fontWeight: 600, padding: '0.75rem 1.5rem', border: 'none', borderRadius: 10, cursor: 'pointer' }}>← Back</button>
              <button type="submit" disabled={saving} style={{ background: 'var(--saa-gradient-gold)', color: 'var(--saa-navy)', fontWeight: 700, padding: '0.75rem 2rem', border: 'none', borderRadius: 10, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : '💾 Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}

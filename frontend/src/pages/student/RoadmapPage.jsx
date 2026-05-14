import { useState, useEffect } from 'react';
import { getRoadmap, updateMilestoneStatus } from '../../services/roadmapService';
import { INTAKE_SEASONS } from '../../utils/constants';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RoadmapProgress from '../../components/roadmap/RoadmapProgress';
import MilestoneItem from '../../components/roadmap/MilestoneItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function RoadmapPage() {
  const [milestones, setMilestones] = useState([]);
  const [targetIntake, setTargetIntake] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRoadmap().then(res => {
      setMilestones(res.data.milestones);
      setTargetIntake(res.data.target_intake || '');
    }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateMilestoneStatus(id, status);
      setMilestones(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch (err) { /* handle silently */ }
  };

  return (
    <DashboardLayout>
      <div className="page-container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="page-header">
          <h1>Application Roadmap</h1>
          <p>Track your application journey step by step</p>
        </div>

        <div className="saa-card mb-4">
          <div className="saa-card-body d-flex align-items-center gap-3">
            <label style={{ fontWeight: 'var(--saa-font-weight-semibold)', whiteSpace: 'nowrap' }}>Target Intake:</label>
            <select className="form-select form-select-sm" style={{ maxWidth: 200 }} value={targetIntake} onChange={e => setTargetIntake(e.target.value)}>
              {INTAKE_SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorAlert message={error} />}

        {!loading && !error && (
          <>
            <RoadmapProgress milestones={milestones} />
            <div className="mt-4">
              {milestones.map(m => (
                <MilestoneItem key={m.id} milestone={m} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

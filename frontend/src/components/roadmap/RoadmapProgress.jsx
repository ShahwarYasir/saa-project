import ProgressBar from '../common/ProgressBar';

export default function RoadmapProgress({ milestones = [] }) {
  const total = milestones.length;
  const done = milestones.filter(m => m.status === 'Done').length;
  const inProgress = milestones.filter(m => m.status === 'In Progress').length;
  const percentage = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="saa-card mb-4">
      <div className="saa-card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 style={{ margin: 0 }}>Roadmap Progress</h5>
            <span style={{ fontSize: 'var(--saa-font-size-sm)', color: 'var(--saa-gray-500)' }}>{done} of {total} milestones completed</span>
          </div>
          <div className="d-flex gap-3" style={{ fontSize: 'var(--saa-font-size-xs)' }}>
            <span><i className="bi bi-circle-fill text-success me-1"></i>Done: {done}</span>
            <span><i className="bi bi-circle-fill text-warning me-1"></i>In Progress: {inProgress}</span>
            <span><i className="bi bi-circle-fill me-1" style={{ color: 'var(--saa-gray-300)' }}></i>Not Started: {total - done - inProgress}</span>
          </div>
        </div>
        <ProgressBar value={percentage} />
      </div>
    </div>
  );
}

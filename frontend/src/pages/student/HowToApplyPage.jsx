import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mockUniversities } from '../../mocks/mockUniversities';
import { mockScholarships } from '../../mocks/mockScholarships';
import { COUNTRY_FLAGS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function HowToApplyPage() {
  const { type, id } = useParams();
  const entity = type === 'university'
    ? mockUniversities.find(u => u.id === Number(id)) || mockUniversities[0]
    : mockScholarships.find(s => s.id === Number(id)) || mockScholarships[0];

  const isUni = type === 'university';

  return (
    <DashboardLayout>
      <div className="page-container" style={{ maxWidth: 800 }}>
        <div className="page-header">
          <h1>How to Apply</h1>
          <p>{isUni ? entity.name : entity.name}</p>
        </div>

        <div className="saa-card mb-4">
          <div className="saa-card-header"><i className="bi bi-info-circle me-2"></i>Overview</div>
          <div className="saa-card-body">
            <p>{isUni ? entity.description : entity.details}</p>
            <div className="row g-3" style={{ fontSize: 'var(--saa-font-size-sm)' }}>
              {isUni ? (
                <>
                  <div className="col-6"><strong>Location:</strong> {COUNTRY_FLAGS[entity.country]} {entity.city}, {entity.country}</div>
                  <div className="col-6"><strong>Ranking:</strong> #{entity.ranking}</div>
                  <div className="col-6"><strong>Tuition:</strong> {formatCurrency(entity.tuition_fee_usd)}/year</div>
                  <div className="col-6"><strong>Deadline:</strong> {formatDate(entity.application_deadline)}</div>
                </>
              ) : (
                <>
                  <div className="col-6"><strong>Provider:</strong> {entity.provider}</div>
                  <div className="col-6"><strong>Coverage:</strong> {entity.coverage}</div>
                  <div className="col-6"><strong>Country:</strong> {COUNTRY_FLAGS[entity.funding_country]} {entity.funding_country}</div>
                  <div className="col-6"><strong>Deadline:</strong> {formatDate(entity.deadline)}</div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="saa-card mb-4">
          <div className="saa-card-header"><i className="bi bi-check2-square me-2"></i>Required Documents</div>
          <div className="saa-card-body">
            <div className="form-check mb-2"><input className="form-check-input" type="checkbox" /><label className="form-check-label">Valid passport (minimum 18 months validity)</label></div>
            <div className="form-check mb-2"><input className="form-check-input" type="checkbox" /><label className="form-check-label">Official transcripts with certified translation</label></div>
            <div className="form-check mb-2"><input className="form-check-input" type="checkbox" /><label className="form-check-label">IELTS/TOEFL score report</label></div>
            <div className="form-check mb-2"><input className="form-check-input" type="checkbox" /><label className="form-check-label">Statement of Purpose / Motivation Letter</label></div>
            <div className="form-check mb-2"><input className="form-check-input" type="checkbox" /><label className="form-check-label">2 recommendation letters</label></div>
            <div className="form-check mb-2"><input className="form-check-input" type="checkbox" /><label className="form-check-label">Updated CV / Resume</label></div>
            <div className="form-check mb-2"><input className="form-check-input" type="checkbox" /><label className="form-check-label">Passport-sized photographs</label></div>
          </div>
        </div>

        <div className="saa-card mb-4">
          <div className="saa-card-header"><i className="bi bi-list-ol me-2"></i>Step-by-Step Application Process</div>
          <div className="saa-card-body">
            {['Research the program requirements and eligibility criteria', 'Prepare all required documents listed above', 'Create an account on the official application portal', 'Fill in the online application form completely', 'Upload all supporting documents', 'Pay the application fee (if applicable)', 'Submit the application before the deadline', 'Track your application status regularly'].map((step, i) => (
              <div key={i} className="d-flex gap-3 mb-3 align-items-start">
                <span style={{ background: 'var(--saa-navy)', color: 'white', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--saa-font-size-sm)', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 'var(--saa-font-size-sm)' }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="saa-card mb-4">
          <div className="saa-card-header"><i className="bi bi-lightbulb me-2"></i>Tips & Common Mistakes</div>
          <div className="saa-card-body" style={{ fontSize: 'var(--saa-font-size-sm)' }}>
            <ul>
              <li className="mb-2">Start preparing at least 3-4 months before the deadline</li>
              <li className="mb-2">Double-check all documents for accuracy and completeness</li>
              <li className="mb-2">Tailor your SOP for each university — avoid generic statements</li>
              <li className="mb-2">Request recommendation letters well in advance (6-8 weeks)</li>
              <li className="mb-2">Keep certified copies of all submitted documents</li>
              <li className="mb-2">Don't wait until the last day — submit at least a week early</li>
            </ul>
          </div>
        </div>

        <a href={isUni ? entity.website : entity.link} target="_blank" rel="noopener noreferrer" className="btn btn-saa-gold btn-lg w-100">
          <i className="bi bi-box-arrow-up-right me-2"></i>Visit Official Application Portal
        </a>
      </div>
    </DashboardLayout>
  );
}

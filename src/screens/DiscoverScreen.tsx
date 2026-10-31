import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lock,
  Info,
  FileText,
  Trash2,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';
import {
  computeUnderstandingSummary,
  detectSensitivePersonalData,
  AttachmentItem,
} from '../utils/grievanceLogic';

const SCHEME_OPTIONS = [
  'Post-Matric Scholarship Scheme (National Scholarship Portal)',
  'Central Sector Scheme of Scholarships for College & University Students',
  'State Higher Education Directorate Scholarship',
  "I'm not sure",
];

const TIMELINE_OPTIONS = [
  'About 4 months ago (June 2036)',
  '1 to 3 months ago',
  'More than 6 months ago',
  "I'm not sure of the exact month",
];

const STATUS_OPTIONS = [
  'Application verified by institute; disbursement pending',
  'PFMS / Bank account validation or seeding hold',
  'Pending at district or state nodal level',
  'Marked defective or closed without clear reason',
];

export const DiscoverScreen: React.FC = () => {
  const {
    issueNarrative,
    setIssueNarrative,
    discoveryAnswers,
    updateDiscoveryAnswers,
    grievanceDraft,
    updateGrievanceDraft,
    syncDraftFromDiscovery,
    navigate,
    showToast,
  } = useCitizenJourney();

  const [simulatedFileName, setSimulatedFileName] = useState('');

  const { understoodFacts, missingInformation } = computeUnderstandingSummary(
    issueNarrative,
    discoveryAnswers
  );

  const piiWarnings = detectSensitivePersonalData(
    `${issueNarrative} ${discoveryAnswers.schemeName} ${discoveryAnswers.currentPortalStatus} ${discoveryAnswers.referenceNumberValue}`
  );

  const handleSimulatedUpload = () => {
    const cleanName =
      simulatedFileName.trim() ||
      `Portal_Status_Snapshot_DEMO-NSP-049218_${grievanceDraft.attachments.length + 1}.pdf`;
    const newItem: AttachmentItem = {
      id: `sim-up-${Date.now()}`,
      name: cleanName,
      source: 'simulated-upload',
      sizeLabel: '156 KB',
      statusNote: 'Simulated upload — Stored locally in browser only',
    };
    updateGrievanceDraft({
      attachments: [...grievanceDraft.attachments, newItem],
    });
    setSimulatedFileName('');
    showToast(`Simulated evidence uploaded: ${cleanName}`);
  };

  const handleRemoveEvidence = (id: string) => {
    updateGrievanceDraft({
      attachments: grievanceDraft.attachments.filter((a) => a.id !== id),
    });
  };

  const handleContinue = () => {
    syncDraftFromDiscovery();
    navigate('/recommendation');
  };

  return (
    <div className="space-y-8">
      {/* Screen Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Screen 02 · Guided Intake
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2137]">
            Understand my issue
          </h1>
          <p className="text-sm text-[#475569]">
            Answer only what you know. You can edit any response or select &ldquo;I&apos;m not
            sure&rdquo;.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-xs text-[#0D2137] shrink-0">
          <Lock className="w-4 h-4 text-[#059669] shrink-0" aria-hidden="true" />
          <span>Never enter passwords, OTPs, or Aadhaar numbers.</span>
        </div>
      </div>

      {piiWarnings.length > 0 && (
        <div
          role="alert"
          className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] p-4 rounded-2xl text-xs space-y-1"
        >
          <p className="font-bold">Privacy safeguard alert:</p>
          {piiWarnings.map((w, i) => (
            <p key={i}>{w}</p>
          ))}
        </div>
      )}

      {/* Main 12-Column Split: Guided Questions (Left 7 cols) + Compact Understanding Summary (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Structured Intake Questions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Editable Prefilled Sample Issue */}
          <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
            <label
              htmlFor="discover-issue-input"
              className="block text-sm font-bold text-[#0D2137]"
            >
              Your stated issue (editable)
            </label>
            <textarea
              id="discover-issue-input"
              rows={2}
              value={issueNarrative}
              onChange={(e) => setIssueNarrative(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl p-3.5 text-sm text-[#0F172A] focus:bg-[#FFFFFF]"
            />
          </section>

          {/* Follow-up 1: Which scheme/service? */}
          <section
            aria-labelledby="q-scheme-heading"
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4"
          >
            <div className="space-y-1">
              <h2 id="q-scheme-heading" className="text-base font-bold text-[#0D2137]">
                1. Which scheme or service is this regarding?
              </h2>
              <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                <span>
                  Why we ask: Helps determine whether a Central Ministry or State Directorate nodal
                  desk is responsible.
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SCHEME_OPTIONS.map((opt) => {
                const isSelected = discoveryAnswers.schemeName === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateDiscoveryAnswers({ schemeName: opt })}
                    aria-pressed={isSelected}
                    className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#FAF9F6] border-[#1D4ED8] font-semibold text-[#0D2137]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <CheckCircle2
                        className="w-4 h-4 text-[#1D4ED8] shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div>
              <label
                htmlFor="scheme-edit-input"
                className="block text-xs font-semibold text-[#475569] mb-1"
              >
                Or edit / type scheme name:
              </label>
              <input
                id="scheme-edit-input"
                type="text"
                value={discoveryAnswers.schemeName}
                onChange={(e) => updateDiscoveryAnswers({ schemeName: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs text-[#0F172A]"
              />
            </div>
          </section>

          {/* Follow-up 2: Approximately when did the issue begin? */}
          <section
            aria-labelledby="q-when-heading"
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4"
          >
            <div className="space-y-1">
              <h2 id="q-when-heading" className="text-base font-bold text-[#0D2137]">
                2. Approximately when did the issue begin?
              </h2>
              <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                <span>
                  Why we ask: Distinguishes normal batch processing cycles from overdue disbursement
                  holds.
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TIMELINE_OPTIONS.map((opt) => {
                const isSelected = discoveryAnswers.issueBeganWhen === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateDiscoveryAnswers({ issueBeganWhen: opt })}
                    aria-pressed={isSelected}
                    className={`text-left p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF9F6] border-[#1D4ED8] font-semibold text-[#0D2137]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div>
              <label
                htmlFor="when-edit-input"
                className="block text-xs font-semibold text-[#475569] mb-1"
              >
                Edit timeline detail:
              </label>
              <input
                id="when-edit-input"
                type="text"
                value={discoveryAnswers.issueBeganWhen}
                onChange={(e) => updateDiscoveryAnswers({ issueBeganWhen: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs text-[#0F172A]"
              />
            </div>
          </section>

          {/* Follow-up 3: What status do you currently see? */}
          <section
            aria-labelledby="q-status-heading"
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4"
          >
            <div className="space-y-1">
              <h2 id="q-status-heading" className="text-base font-bold text-[#0D2137]">
                3. What status do you currently see?
              </h2>
              <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                <span>
                  Why we ask: Helps identify whether your application is stuck at college
                  verification or bank disbursement.
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = discoveryAnswers.currentPortalStatus === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateDiscoveryAnswers({ currentPortalStatus: opt })}
                    aria-pressed={isSelected}
                    className={`text-left px-4 py-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF9F6] border-[#1D4ED8] font-semibold text-[#0D2137]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Follow-up 4: Have you already contacted the service provider? */}
          <section
            aria-labelledby="q-contact-heading"
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4"
          >
            <div className="space-y-1">
              <h2 id="q-contact-heading" className="text-base font-bold text-[#0D2137]">
                4. Have you already contacted the service provider?
              </h2>
              <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                <span>
                  Why we ask: Confirms whether first-level institutional verification has already
                  been checked.
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  val: 'yes-institution' as const,
                  label: 'Yes, contacted college nodal officer',
                },
                {
                  val: 'yes-portal' as const,
                  label: 'Yes, contacted portal helpdesk',
                },
                {
                  val: 'no' as const,
                  label: 'No, not contacted yet',
                },
                {
                  val: 'unsure' as const,
                  label: "I'm not sure",
                },
              ].map((item) => {
                const isSelected = discoveryAnswers.contactedService === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => updateDiscoveryAnswers({ contactedService: item.val })}
                    aria-pressed={isSelected}
                    className={`text-left p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF9F6] border-[#1D4ED8] font-semibold text-[#0D2137]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#0F172A] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Optional Evidence Upload UI with Simulated Upload */}
          <section
            aria-labelledby="evidence-upload-heading"
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 id="evidence-upload-heading" className="text-base font-bold text-[#0D2137]">
                  Optional evidence upload (Simulated)
                </h2>
                <p className="text-xs text-[#64748B]">
                  Add a verification slip or portal status screenshot. Demo metadata only—no real
                  file leaves your browser.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#64748B]">Optional</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <label htmlFor="sim-evidence-input" className="sr-only">
                Simulated evidence file name
              </label>
              <input
                id="sim-evidence-input"
                type="text"
                value={simulatedFileName}
                onChange={(e) => setSimulatedFileName(e.target.value)}
                placeholder="e.g., NSP_Verification_Receipt_2036.pdf"
                className="flex-1 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A]"
              />
              <button
                type="button"
                onClick={handleSimulatedUpload}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#0D2137] bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer shrink-0"
              >
                <Upload className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
                <span>Simulate Upload</span>
              </button>
            </div>

            {grievanceDraft.attachments.length > 0 && (
              <ul className="space-y-2 pt-1">
                {grievanceDraft.attachments.map((att) => (
                  <li
                    key={att.id}
                    className="flex items-center justify-between gap-2 p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                      <span className="font-semibold text-[#0D2137] truncate">{att.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidence(att.id)}
                      aria-label={`Remove ${att.name}`}
                      className="text-[#B91C1C] hover:bg-[#FEF2F2] p-1 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right 5 Columns: Compact Understanding Summary ("What we understand so far.") */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-[#FFFFFF] border-2 border-[#0D2137] rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="border-b border-[#E2E8F0] pb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                Live Intake Summary
              </p>
              <h2 className="text-lg font-bold text-[#0D2137] mt-0.5">
                What we understand so far.
              </h2>
            </div>

            <dl className="space-y-3 text-xs">
              {understoodFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl space-y-0.5"
                >
                  <dt className="text-[#64748B] font-medium">{fact.label}</dt>
                  <dd className="font-semibold text-[#0D2137]">{fact.value}</dd>
                </div>
              ))}
              <div className="p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl space-y-1">
                <label
                  htmlFor="demo-ref-input"
                  className="block text-[#64748B] font-medium"
                >
                  Demo Reference ID (Editable)
                </label>
                <input
                  id="demo-ref-input"
                  type="text"
                  value={discoveryAnswers.referenceNumberValue}
                  onChange={(e) =>
                    updateDiscoveryAnswers({ referenceNumberValue: e.target.value })
                  }
                  className="w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 font-mono-tabular font-bold text-[#0D2137]"
                />
              </div>
            </dl>

            {/* Missing Information Check */}
            <div className="border-t border-[#E2E8F0] pt-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
                Missing or uncertain information
              </h3>
              {missingInformation.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] p-3 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>All core routing facts captured. Ready for pathway recommendation.</span>
                </div>
              ) : (
                <ul className="space-y-1.5 text-xs text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-xl">
                  {missingInformation.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Back & Continue Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

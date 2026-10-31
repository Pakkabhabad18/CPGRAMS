import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  ClipboardList,
  Sliders,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';
import {
  buildJourneyTimeline,
  JOURNEY_STAGES_ORDER,
} from '../utils/grievanceLogic';

export const TrackScreen: React.FC = () => {
  const { activeCase, updateActiveCaseStage, navigate } = useCitizenJourney();

  const timeline = buildJourneyTimeline(activeCase.currentStageId);

  return (
    <div className="space-y-8">
      {/* Top Signature Case Header */}
      <section
        aria-labelledby="journey-main-heading"
        className="bg-[#FFFFFF] border-2 border-[#0D2137] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
              <span className="font-mono-tabular font-bold text-[#0D2137]">
                {activeCase.referenceId}
              </span>
              <span aria-hidden="true">·</span>
              <span>Simulated Prototype Case</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                Last demo update: {activeCase.lastUpdatedLabel}
              </span>
            </div>
            <h1
              id="journey-main-heading"
              className="text-2xl sm:text-3xl font-bold text-[#0D2137]"
            >
              {activeCase.title}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#1D4ED8]">
              Current responsible step (illustrative):{' '}
              <strong className="text-[#0D2137]">
                {activeCase.currentResponsibleStepIllustrative}
              </strong>
            </p>
          </div>

          {/* Current Status Badge */}
          <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Current Status (Simulated)
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
              <Clock className="w-4 h-4 text-[#D97706]" aria-hidden="true" />
              <span>{activeCase.currentStatusLabel}</span>
            </span>
          </div>
        </div>

        {/* Suggested Next Action Banner */}
        <div className="bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
              Suggested Next Action
            </span>
            <p className="text-sm font-semibold text-[#0F172A]">
              {activeCase.suggestedNextAction}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/assistance')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#0D2137] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
              <span>Human assistance</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/response')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] transition-colors cursor-pointer"
            >
              <span>Understand Sample Response</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Main 12-Column Split: Interactive Resolution Timeline (Left 7) + Known/Unknown & Authoritative Event Schema (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Signature Interactive Timeline */}
        <section
          aria-labelledby="interactive-timeline-heading"
          className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#059669]">
                Screen 07 · Signature Resolution Timeline
              </p>
              <h2
                id="interactive-timeline-heading"
                className="text-xl font-bold text-[#0D2137] mt-0.5"
              >
                My resolution journey
              </h2>
            </div>

            {/* Interactive Demo Stage Switcher */}
            <div className="flex items-center gap-2 text-xs">
              <Sliders className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
              <label htmlFor="stage-select" className="font-semibold text-[#475569]">
                Inspect Stage:
              </label>
              <select
                id="stage-select"
                value={activeCase.currentStageId}
                onChange={(e) =>
                  updateActiveCaseStage(e.target.value as typeof activeCase.currentStageId)
                }
                className="bg-[#FAF9F6] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 font-semibold text-[#0D2137]"
              >
                {JOURNEY_STAGES_ORDER.map((id, i) => (
                  <option key={id} value={id}>
                    0{i + 1}. {timeline[i]?.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ol className="space-y-5">
            {timeline.map((step, index) => {
              const isCompleted = step.state === 'completed';
              const isCurrent = step.state === 'current';
              return (
                <li key={step.id} className="flex items-start gap-4">
                  {/* Timeline Node + Connector Rail */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => updateActiveCaseStage(step.id)}
                      aria-label={`Select timeline stage ${step.title}`}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono-tabular font-bold border-2 transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-[#0D9488] border-[#0D9488] text-white'
                          : isCurrent
                          ? 'bg-[#FFFBEB] border-[#D97706] text-[#92400E]'
                          : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#64748B]'
                      }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </button>
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-16 mt-1 ${
                          isCompleted ? 'bg-[#0D9488]' : 'bg-[#CBD5E1]'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Timeline Card */}
                  <div
                    onClick={() => updateActiveCaseStage(step.id)}
                    className={`flex-1 p-4 rounded-xl border transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#FAF9F6] border-[#1D4ED8] ring-1 ring-[#1D4ED8]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#0D2137]">{step.title}</h3>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                            Active Demo Stage
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono-tabular text-[#64748B]">
                        {step.timestampLabel}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#1D4ED8] mt-1">{step.summary}</p>
                    <p className="text-xs text-[#475569] mt-1 leading-relaxed">{step.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Right 5 Columns: Known vs Not Known, Pending Actions, Follow-up Prep & Future Authoritative Event Schema */}
        <aside className="lg:col-span-5 space-y-6">
          {/* What is known vs. What is not yet known */}
          <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0D2137]">
              Transparent case state (Demo)
            </h2>

            <div className="p-4 bg-[#ECFDF5]/60 border border-[#A7F3D0] rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#059669]">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>What is known</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#0F172A] list-disc pl-4 leading-relaxed">
                {activeCase.whatIsKnown.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#92400E]">
                <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
                <span>What is not yet known</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#92400E] list-disc pl-4 leading-relaxed">
                {activeCase.whatIsNotYetKnown.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Pending Citizen Actions & Follow-up Preparation */}
          <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#0D2137]">
              <ClipboardList className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
              <h2 className="text-base font-bold">
                Pending citizen actions &amp; follow-up preparation
              </h2>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#0D2137]">Pending actions:</p>
              <ul className="space-y-1.5 text-xs text-[#475569] list-disc pl-4">
                {activeCase.pendingCitizenActions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[#E2E8F0] pt-3 space-y-2">
              <p className="text-xs font-semibold text-[#0D2137]">Follow-up preparation:</p>
              <ul className="space-y-1.5 text-xs text-[#475569] list-disc pl-4">
                {activeCase.followUpPreparation.map((prep, i) => (
                  <li key={i}>{prep}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => navigate('/response')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-white bg-[#0D2137] rounded-xl hover:bg-[#1E3A8A] transition-colors cursor-pointer"
            >
              <span>Inspect Sample Response Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </section>

          {/* Future Authoritative Event Schema Preview */}
          <section className="bg-[#FAF9F6] border border-[#CBD5E1] rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D2137]">
                <ShieldCheck className="w-4 h-4 text-[#059669]" aria-hidden="true" />
                <span>Authoritative Event Structure (2036 Concept)</span>
              </div>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              This prototype never invents real government responses. Below is what a verified
              authoritative event record would look like in a future deployment:
            </p>
            <dl className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2 text-xs">
              <div>
                <dt className="text-[11px] text-[#64748B]">Source</dt>
                <dd className="font-semibold text-[#0D2137]">
                  {activeCase.authoritativeEventExample.source}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#64748B]">Timestamp</dt>
                <dd className="font-mono-tabular font-semibold text-[#0D2137]">
                  {activeCase.authoritativeEventExample.timestamp}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#64748B]">Responsible Authority</dt>
                <dd className="font-semibold text-[#0D2137]">
                  {activeCase.authoritativeEventExample.responsibleAuthority}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#64748B]">Verification Status</dt>
                <dd className="font-semibold text-[#059669]">
                  {activeCase.authoritativeEventExample.verificationStatus}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
};

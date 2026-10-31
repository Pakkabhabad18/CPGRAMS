import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';

export const AlternativesScreen: React.FC = () => {
  const {
    recommendation,
    updateDiscoveryAnswers,
    syncDraftFromDiscovery,
    saveDraftNow,
    navigate,
  } = useCitizenJourney();

  const handleSelectAlternativeScenario = (schemeName: string, statusText: string, msg: string) => {
    updateDiscoveryAnswers({
      schemeName,
      currentPortalStatus: statusText,
    });
    syncDraftFromDiscovery();
    saveDraftNow(msg);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Screen 09 · Alternative Resolution Routes
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2137]">
            Explore alternatives
          </h1>
          <p className="text-sm text-[#475569]">
            When a direct service correction, a different authority, or additional information is
            more appropriate than standard grievance filing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/recommendation')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Recommendation</span>
        </button>
      </div>

      {/* Four Structured Alternative Routes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendation.alternatives.map((alt) => (
          <section
            key={alt.id}
            aria-labelledby={`alt-title-${alt.id}`}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between gap-5 shadow-2xs"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
                  {alt.scenarioCategory}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${
                    alt.redirectsToExternalService
                      ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                      : 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                  }`}
                >
                  {alt.redirectsToExternalService ? (
                    <>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      <span>External Service Route</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      <span>Within Companion Flow</span>
                    </>
                  )}
                </span>
              </div>

              <h2 id={`alt-title-${alt.id}`} className="text-lg font-bold text-[#0D2137]">
                {alt.title}
              </h2>

              <dl className="space-y-3 text-xs pt-1">
                <div className="p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl space-y-1">
                  <dt className="font-bold text-[#0D2137]">Why it may help</dt>
                  <dd className="text-[#475569] leading-relaxed">{alt.whyItMayHelp}</dd>
                </div>

                <div className="p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl space-y-1">
                  <dt className="font-bold text-[#0D2137]">Eligibility or scope uncertainty</dt>
                  <dd className="text-[#475569] leading-relaxed">
                    {alt.eligibilityOrScopeUncertainty}
                  </dd>
                </div>

                <div className="p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl space-y-1">
                  <dt className="font-bold text-[#0D2137]">What you should prepare</dt>
                  <dd className="text-[#475569] leading-relaxed">{alt.whatToPrepare}</dd>
                </div>
              </dl>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2 text-[11px] text-[#64748B]">
              <span>{alt.externalServiceNote}</span>
            </div>
          </section>
        ))}
      </div>

      {/* Interactive Pathway Adjustment Bar */}
      <section className="bg-[#FAF9F6] border border-[#CBD5E1] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#0D2137]">
          <GitBranch className="w-5 h-5 text-[#1D4ED8]" aria-hidden="true" />
          <h2 className="text-base font-bold">
            Test how changing your case details updates the recommendation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              handleSelectAlternativeScenario(
                'State Higher Education Directorate Scholarship',
                'Pending at State Directorate level',
                'Switched pathway to State Higher Education Directorate.'
              )
            }
            className="text-left p-4 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] text-xs space-y-1 cursor-pointer"
          >
            <span className="font-bold text-[#0D2137] block">
              Switch to State Directorate Authority
            </span>
            <span className="text-[#475569] block">
              Updates the illustrative authority to the State Higher Education Directorate.
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              handleSelectAlternativeScenario(
                'Post-Matric Scholarship Scheme (National Scholarship Portal)',
                'PFMS / Bank account validation or seeding hold',
                'Updated case context to PFMS / Bank Seeding Hold.'
              )
            }
            className="text-left p-4 bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] text-xs space-y-1 cursor-pointer"
          >
            <span className="font-bold text-[#0D2137] block">
              Switch to Direct Bank / DBT Seeding Scenario
            </span>
            <span className="text-[#475569] block">
              Highlights direct bank branch NPCI mapper verification in your draft.
            </span>
          </button>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/assistance')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#0D2137] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
            <span>Need help choosing? Open Human Assistance</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/prepare')}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] cursor-pointer"
          >
            <span>Continue to Prepare Grievance</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
};

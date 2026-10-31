import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  GitBranch,
  UserCheck,
  ShieldCheck,
  Building2,
  MessageSquareText,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';

export const RecommendationScreen: React.FC = () => {
  const { recommendation, navigate } = useCitizenJourney();

  const conceptualFlowSteps = [
    {
      icon: UserCheck,
      title: 'Citizen',
      caption: 'States issue & authorizes draft',
    },
    {
      icon: ShieldCheck,
      title: 'Verified grievance channel',
      caption: 'Structures facts & reference ID',
    },
    {
      icon: Building2,
      title: 'Responsible authority',
      caption: 'Illustrative nodal desk trace',
    },
    {
      icon: MessageSquareText,
      title: 'Response',
      caption: 'Plain-language status & outcome',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Intelligent Recommendation Hero Card */}
      <section
        aria-labelledby="rec-main-heading"
        className="bg-[#FFFFFF] border-2 border-[#0D2137] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
              Screen 03 · {recommendation.headline}
            </p>
            <h1 id="rec-main-heading" className="text-2xl sm:text-3xl font-bold text-[#0D2137]">
              {recommendation.recommendedPathwayTitle}
            </h1>
            <p className="text-sm font-medium text-[#475569]">
              Issue: <strong className="text-[#0F172A]">{recommendation.issueHeadline}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/discover')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit intake answers</span>
          </button>
        </div>

        {/* Potential Responsible Authority (Explicitly Marked Illustrative) */}
        <div className="bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Potential Responsible Authority (Illustrative — Subject to Official Verification)
            </span>
            <p className="text-sm sm:text-base font-bold text-[#0D2137]">
              {recommendation.potentialAuthorityIllustrative}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] px-3 py-1 rounded-lg self-start sm:self-center shrink-0">
            Illustrative Routing
          </span>
        </div>

        {/* Recommendation Basis & Needs Verification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#ECFDF5]/60 border border-[#A7F3D0] rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Recommendation basis</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#0F172A] list-disc pl-4">
              {recommendation.recommendationBasis.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#92400E]">
              <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
              <span>Needs verification</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#92400E] list-disc pl-4">
              {recommendation.needsVerification.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Conceptual Pathway Flow Diagram */}
        <div className="bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0D2137]">
              Conceptual Pathway Flow
            </span>
            <span className="text-[11px] font-mono-tabular text-[#64748B]">
              Conceptual Flow — Not a Live Government Integration
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {conceptualFlowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl p-3.5 flex flex-col justify-between gap-2 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF9F6] border border-[#E2E8F0] flex items-center justify-center text-[#1D4ED8]">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-mono-tabular text-[#64748B]">
                      0{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0D2137]">{step.title}</p>
                    <p className="text-[11px] text-[#475569] mt-0.5">{step.caption}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary & Secondary CTAs */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/alternatives')}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] transition-colors cursor-pointer"
          >
            <GitBranch className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
            <span>Explore alternatives</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/prepare')}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] transition-colors cursor-pointer shadow-xs"
          >
            <span>Prepare my grievance</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Concise 3-Column Breakdown: Why Suggested, Supporting Info, What Happens Next */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 space-y-2.5">
          <h2 className="text-sm font-bold text-[#0D2137]">Why this pathway is suggested</h2>
          <ul className="space-y-2 text-xs text-[#475569] list-disc pl-4 leading-relaxed">
            {recommendation.whySuggested.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 space-y-2.5">
          <h2 className="text-sm font-bold text-[#0D2137]">What is still uncertain</h2>
          <ul className="space-y-2 text-xs text-[#475569] list-disc pl-4 leading-relaxed">
            {recommendation.uncertainties.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 space-y-2.5">
          <h2 className="text-sm font-bold text-[#0D2137]">What happens next</h2>
          <ol className="space-y-2 text-xs text-[#475569] list-decimal pl-4 leading-relaxed">
            {recommendation.whatHappensNext.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Compact Alternative Pathways Strip */}
      <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#0D2137]">Alternative pathways available</h2>
            <p className="text-xs text-[#475569]">
              If a direct bank seeding check or state directorate route fits better:
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/alternatives')}
            className="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
          >
            Compare all 4 alternatives →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendation.alternatives.slice(0, 2).map((alt) => (
            <div
              key={alt.id}
              className="p-4 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl space-y-1.5"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1D4ED8]">
                {alt.scenarioCategory}
              </span>
              <h3 className="text-sm font-bold text-[#0D2137]">{alt.title}</h3>
              <p className="text-xs text-[#475569] leading-relaxed">{alt.whyItMayHelp}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

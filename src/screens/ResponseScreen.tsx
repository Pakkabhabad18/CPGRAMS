import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Scale,
  Compass,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';

export const ResponseScreen: React.FC = () => {
  const { activeCase, navigate, accessibilityPrefs } = useCitizenJourney();
  const { sampleResponse } = activeCase;

  const [activeTab, setActiveTab] = useState<'explanation' | 'next-steps'>('explanation');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Interactive Action Toolbar */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Screen 08 · Response Comprehension
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2137] mt-1">
              Understand the response
            </h1>
            <p className="text-xs text-[#475569] mt-0.5">
              Case Reference: <strong className="font-mono-tabular">{activeCase.referenceId}</strong>{' '}
              — {activeCase.title}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/track')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Resolution Journey</span>
          </button>
        </div>

        {/* Three Required Action Controls: "Explain this response", "What can I do next?", "Get human assistance" */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('explanation')}
            aria-pressed={activeTab === 'explanation'}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              activeTab === 'explanation'
                ? 'bg-[#0D2137] text-white border-[#0D2137]'
                : 'bg-[#FAF9F6] text-[#0D2137] border-[#CBD5E1] hover:bg-[#F4F5F7]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Explain this response</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('next-steps')}
            aria-pressed={activeTab === 'next-steps'}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              activeTab === 'next-steps'
                ? 'bg-[#0D2137] text-white border-[#0D2137]'
                : 'bg-[#FAF9F6] text-[#0D2137] border-[#CBD5E1] hover:bg-[#F4F5F7]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>What can I do next?</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/assistance')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1D4ED8] bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Get human assistance</span>
          </button>
        </div>
      </div>

      {/* CRITICAL PRINCIPLE: Administrative Closure vs. Substantive Outcome Banner */}
      <section
        aria-labelledby="outcome-check-heading"
        className="bg-[#FFFBEB] border-2 border-[#D97706] rounded-2xl p-6 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#92400E]">
            <Scale className="w-4 h-4 text-[#D97706]" aria-hidden="true" />
            <span id="outcome-check-heading">
              Whether the requested outcome was actually achieved
            </span>
          </div>
          <span className="text-xs font-bold text-[#92400E] bg-[#FFFFFF] border border-[#FDE68A] px-3 py-1 rounded-lg">
            {sampleResponse.substantiveOutcomeStatus}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[#0D2137]">
          {sampleResponse.wasRequestedOutcomeAchieved.headline}
        </h2>
        <p className="text-xs sm:text-sm text-[#92400E] leading-relaxed">
          {sampleResponse.wasRequestedOutcomeAchieved.explanation}
        </p>
      </section>

      {/* ALWAYS VISIBLE: Simulated Sample Response with DEMO Label */}
      <section
        aria-labelledby="demo-official-response-heading"
        className="bg-[#FFFFFF] border-2 border-[#0D2137] rounded-2xl overflow-hidden shadow-xs"
      >
        <div className="bg-[#0D2137] text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#93C5FD]" aria-hidden="true" />
            <span id="demo-official-response-heading">
              Illustrative Departmental Response (DEMO)
            </span>
          </div>
          <span className="text-xs font-mono-tabular bg-[#D97706] text-white px-2.5 py-0.5 rounded font-bold">
            DEMO SAMPLE
          </span>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B] border-b border-[#E2E8F0] pb-3">
            <span>
              <strong>Issuing Unit:</strong> {sampleResponse.issuingAuthorityIllustrative}
            </span>
            <span className="font-mono-tabular">
              {sampleResponse.referenceTag} · {sampleResponse.dateLabel}
            </span>
          </div>

          <blockquote className="p-4 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl font-mono text-xs sm:text-sm text-[#0F172A] leading-relaxed">
            &ldquo;{sampleResponse.officialText}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* VISUALLY SEPARATED PLAIN-LANGUAGE EXPLANATION & RESOLVED/UNRESOLVED BREAKDOWN */}
      <section
        aria-labelledby="plain-language-heading"
        className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span id="plain-language-heading">
              Plain-Language Comprehension (Visually Separated from DEMO Response)
            </span>
          </div>
          <span className="text-xs text-[#64748B]">
            {accessibilityPrefs.continueWithoutAI
              ? 'Direct Citizen Breakdown'
              : 'AI-Assisted Plain-Language Breakdown'}
          </span>
        </div>

        {/* What the response says */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-[#0D2137]">What the response says in plain words</h2>
          <p className="text-sm sm:text-base text-[#0F172A] leading-relaxed bg-[#FAF9F6] p-4 rounded-xl border border-[#E2E8F0]">
            {sampleResponse.plainLanguageExplanation}
          </p>
        </div>

        {/* What has been resolved vs. What remains unresolved */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-[#ECFDF5]/60 border border-[#A7F3D0] rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#059669]">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <h3>What has been resolved</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[#0F172A] list-disc pl-4 leading-relaxed">
              {sampleResponse.whatIsResolved.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#92400E]">
              <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
              <h3>What remains unresolved</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[#0F172A] list-disc pl-4 leading-relaxed">
              {sampleResponse.whatRemainsUnresolved.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Available Follow-Up Options (Subject to Official Rules) */}
      <section
        aria-labelledby="followup-options-heading"
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-5"
      >
        <div>
          <h2 id="followup-options-heading" className="text-lg font-bold text-[#0D2137]">
            Available follow-up options (Subject to official rules)
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Because the scholarship money has not yet arrived, here are your legitimate next steps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sampleResponse.followUpOptions.map((opt) => (
            <div
              key={opt.id}
              className="p-5 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#64748B] block">
                  {opt.ruleCondition}
                </span>
                <h3 className="text-sm font-bold text-[#0D2137]">{opt.title}</h3>
                <p className="text-xs text-[#475569] leading-relaxed">{opt.description}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate(opt.targetRoute)}
                className="self-start inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] hover:text-[#0D2137] cursor-pointer"
              >
                <span>Open this option</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

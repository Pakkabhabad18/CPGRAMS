import React, { useState } from 'react';
import {
  ArrowRight,
  Mic,
  MicOff,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Compass,
  FolderCheck,
  Sparkles,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';
import {
  IssueCategory,
  DEFAULT_SCHOLARSHIP_ISSUE,
  buildJourneyTimeline,
} from '../utils/grievanceLogic';

const EXAMPLE_CHIPS: Array<{
  id: IssueCategory;
  label: string;
  sampleText: string;
}> = [
  {
    id: 'delayed-payment',
    label: 'Payment delayed',
    sampleText: DEFAULT_SCHOLARSHIP_ISSUE,
  },
  {
    id: 'document-issue',
    label: 'Document issue',
    sampleText:
      'My scholarship verification slip was uploaded at my college, but the portal still shows verification pending.',
  },
  {
    id: 'service-denied',
    label: 'Service denied',
    sampleText:
      'My scholarship renewal was marked ineligible even though my institution approved all required documents.',
  },
];

export const HomeScreen: React.FC = () => {
  const {
    issueNarrative,
    setIssueNarrative,
    selectedCategory,
    setSelectedCategory,
    activeCase,
    grievanceDraft,
    navigate,
    showToast,
  } = useCitizenJourney();

  const [voiceActive, setVoiceActive] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [showDocsModal, setShowDocsModal] = useState(false);

  const timeline = buildJourneyTimeline(activeCase.currentStageId);

  const handleVoiceToggle = () => {
    if (!voiceActive) {
      setVoiceActive(true);
      showToast('Simulated voice input listening... Speak in any preferred language.');
      window.setTimeout(() => {
        setIssueNarrative(DEFAULT_SCHOLARSHIP_ISSUE);
        setSelectedCategory('delayed-payment');
        setVoiceActive(false);
        setInputError(null);
        showToast('Simulated voice transcript captured: Scholarship payment delay.');
      }, 1100);
    } else {
      setVoiceActive(false);
    }
  };

  const handleStartJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueNarrative || issueNarrative.trim().length < 5) {
      setInputError('Please describe what happened, or choose an example below.');
      return;
    }
    setInputError(null);
    navigate('/discover');
  };

  return (
    <div className="space-y-10">
      {/* Main Hero Intake Surface */}
      <section
        aria-labelledby="home-main-headline"
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6"
      >
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Your government services, your next steps.
          </p>
          <h1
            id="home-main-headline"
            className="text-3xl sm:text-[42px] font-bold text-[#0D2137] tracking-tight leading-tight"
          >
            Let&apos;s get things moving.
          </h1>
          <p className="text-lg sm:text-xl font-medium text-[#475569] pt-1">
            How can I help you today?
          </p>
        </div>

        <form onSubmit={handleStartJourney} className="space-y-5" noValidate>
          <div className="relative">
            <label htmlFor="citizen-issue-textarea" className="sr-only">
              How can I help you today? Describe your issue in your own words
            </label>
            <textarea
              id="citizen-issue-textarea"
              rows={3}
              value={issueNarrative}
              onChange={(e) => {
                setIssueNarrative(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="Describe what happened in your own words..."
              className="w-full bg-[#FAF9F6] border-[1.5px] border-[#CBD5E1] rounded-2xl p-4 pb-14 sm:p-5 sm:pr-36 text-base sm:text-lg text-[#0F172A] placeholder:text-[#64748B] focus:bg-[#FFFFFF] focus:border-[#1D4ED8] transition-colors"
            />

            {/* Working Mock Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              aria-pressed={voiceActive}
              className={`absolute right-3.5 bottom-3.5 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                voiceActive
                  ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'
                  : 'bg-[#FFFFFF] text-[#0D2137] border-[#CBD5E1] hover:bg-[#F4F5F7]'
              }`}
            >
              {voiceActive ? (
                <>
                  <MicOff className="w-4 h-4 text-[#B91C1C]" aria-hidden="true" />
                  <span>Listening (Demo)...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
                  <span>Voice input</span>
                </>
              )}
            </button>
          </div>

          {inputError && (
            <p role="alert" className="text-xs font-semibold text-[#B91C1C]">
              {inputError}
            </p>
          )}

          {/* Example Interactive Controls + Primary Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B] mr-1">Try an example:</span>
              {EXAMPLE_CHIPS.map((chip) => {
                const isSelected = selectedCategory === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(chip.id);
                      setIssueNarrative(chip.sampleText);
                      setInputError(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#0D2137] text-white border-[#0D2137]'
                        : 'bg-[#FAF9F6] text-[#0D2137] border-[#CBD5E1] hover:bg-[#F4F5F7]'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2.5 bg-[#1D4ED8] hover:bg-[#1E3A8A] text-white font-semibold text-sm px-7 py-3.5 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <span>Find my next step</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>

      {/* VISUALLY PROMINENT ACTIVE RESOLUTION JOURNEY CARD */}
      <section aria-labelledby="active-journey-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#059669]">
              Active Resolution Journey · Demo Case
            </p>
            <h2 id="active-journey-heading" className="text-xl font-bold text-[#0D2137]">
              Continue where you left off
            </h2>
          </div>
          <span className="text-xs font-mono-tabular text-[#64748B]">
            Simulated Prototype Record
          </span>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#0D2137] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                <span className="font-mono-tabular font-bold text-[#0D2137]">
                  {activeCase.referenceId}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeCase.schemeOrService}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{activeCase.lastUpdatedLabel}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0D2137]">
                {activeCase.title}
              </h3>
              <p className="text-xs text-[#1D4ED8] font-medium">
                {activeCase.illustrativeDestination}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                <Clock className="w-3.5 h-3.5 text-[#D97706]" aria-hidden="true" />
                <span>{activeCase.currentStatusLabel}</span>
              </span>
            </div>
          </div>

          {/* Visual 5-Stage Journey Map Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {timeline.slice(0, 5).map((step, index) => {
              const isCompleted = step.state === 'completed';
              const isCurrent = step.state === 'current';
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border text-xs ${
                    isCurrent
                      ? 'bg-[#FFFBEB] border-[#D97706] text-[#92400E]'
                      : isCompleted
                      ? 'bg-[#ECFDF5]/60 border-[#A7F3D0] text-[#059669]'
                      : 'bg-[#FAF9F6] border-[#E2E8F0] text-[#64748B]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 font-mono-tabular text-[11px] font-semibold">
                    <span>0{index + 1}</span>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                  </div>
                  <p className="font-semibold text-[#0D2137] mt-1 truncate">{step.title}</p>
                </div>
              );
            })}
          </div>

          {/* Current Stage & Suggested Next Action */}
          <div className="bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
                Suggested Next Action
              </span>
              <p className="text-sm font-medium text-[#0F172A]">
                {activeCase.suggestedNextAction}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/response')}
                className="px-4 py-2.5 text-xs font-semibold text-[#0D2137] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
              >
                Understand Response
              </button>
              <button
                type="button"
                onClick={() => navigate('/track')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0D2137] rounded-xl hover:bg-[#1E3A8A] cursor-pointer"
              >
                <span>Open Resolution Journey</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Row: My journeys, My documents, Human help */}
      <section aria-labelledby="quick-access-heading" className="space-y-4">
        <h2 id="quick-access-heading" className="text-lg font-bold text-[#0D2137]">
          Quick access
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. My journeys */}
          <button
            type="button"
            onClick={() => navigate('/track')}
            className="text-left bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1D4ED8] rounded-2xl p-6 transition-colors flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#CBD5E1] flex items-center justify-center text-[#1D4ED8]">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#0D2137]">My journeys</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Follow the interactive timeline for {activeCase.referenceId}, inspect what is known,
                and prepare follow-up steps.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
              <span>View active journey</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </button>

          {/* 2. My documents */}
          <button
            type="button"
            onClick={() => setShowDocsModal(!showDocsModal)}
            aria-expanded={showDocsModal}
            className="text-left bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1D4ED8] rounded-2xl p-6 transition-colors flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#CBD5E1] flex items-center justify-center text-[#059669]">
                <FolderCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#0D2137]">My documents</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {grievanceDraft.attachments.length} supporting document(s) attached to your current
                draft ({grievanceDraft.attachments[0]?.name || 'Verification Slip'}).
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
              <span>{showDocsModal ? 'Hide document drawer' : 'Inspect & manage documents'}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </button>

          {/* 3. Human help */}
          <button
            type="button"
            onClick={() => navigate('/assistance')}
            className="text-left bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1D4ED8] rounded-2xl p-6 transition-colors flex flex-col justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#CBD5E1] flex items-center justify-center text-[#0D2137]">
                <HelpCircle className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#0D2137]">Human help</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                Request a simulated callback, prepare a concise case summary for an assisted service
                centre, or continue without AI.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8]">
              <span>Open human assistance</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          </button>
        </div>

        {/* Inline Document Preview Drawer when "My documents" is clicked */}
        {showDocsModal && (
          <div className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#0D2137]">
                  Session Supporting Documents (Demo Metadata Only)
                </h3>
                <p className="text-xs text-[#64748B]">
                  Stored locally in your browser. Never uploaded to an external server.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/prepare')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0D2137] rounded-xl hover:bg-[#1E3A8A] cursor-pointer"
              >
                Manage in Prepare Screen
              </button>
            </div>
            <ul className="space-y-2">
              {grievanceDraft.attachments.map((att) => (
                <li
                  key={att.id}
                  className="flex items-center justify-between gap-3 p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
                    <span className="font-semibold text-[#0D2137]">{att.name}</span>
                  </div>
                  <span className="text-[#64748B] font-mono-tabular">
                    {att.sizeLabel} · {att.statusNote}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Compact 2036 Architecture Teaser */}
      <section className="bg-[#FAF9F6] border border-[#CBD5E1] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#1D4ED8] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-[#0D2137]">
              Signature Future Experience: Agent-Ready Government in 2036
            </h2>
            <p className="text-xs text-[#475569]">
              See how a citizen can use any trusted assistant or channel with permissioned layers,
              cryptographic receipts, and human fallback.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/how-it-works')}
          className="px-4 py-2.5 text-xs font-semibold text-[#0D2137] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] shrink-0 cursor-pointer"
        >
          Explore How 2036 Works →
        </button>
      </section>
    </div>
  );
};

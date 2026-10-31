import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Lock,
  Building2,
  Target,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';

export const ReviewScreen: React.FC = () => {
  const {
    grievanceDraft,
    updateGrievanceDraft,
    recommendation,
    submitDemoGrievance,
    navigate,
  } = useCitizenJourney();

  const [editingField, setEditingField] = useState<'title' | 'outcome' | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);

  const handleConfirmSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDraft.authorizationConfirmed) {
      setConsentError(
        'Please check the explicit citizen authorization box below to confirm creating your demo case.'
      );
      return;
    }
    setConsentError(null);
    submitDemoGrievance();
    navigate('/confirmation');
  };

  return (
    <div className="space-y-8">
      {/* Prominent Demo Disclaimer Banner */}
      <div
        role="region"
        aria-label="Demo Disclaimer"
        className="bg-[#FFFBEB] border-2 border-[#D97706] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-[#92400E]">
              Demo only. This will not submit a real grievance.
            </p>
            <p className="text-xs text-[#92400E]">
              Confirming below creates a simulated prototype case ({grievanceDraft.referenceNumber})
              in your local browser only.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/prepare')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0D2137] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] shrink-0 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Full Draft Editor</span>
        </button>
      </div>

      {/* Screen Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Screen 05 · Visual Review &amp; Citizen Authorization
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2137] mt-1">
            Review &amp; authorize
          </h1>
        </div>
        <span className="text-xs font-mono-tabular text-[#64748B]">
          Reference ID: {grievanceDraft.referenceNumber}
        </span>
      </div>

      {/* Visual Bento Grid: Issue Summary Card + Destination Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Issue Summary Card (Compact Editable) */}
        <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
                Issue Summary Card
              </span>
              <button
                type="button"
                onClick={() =>
                  setEditingField(editingField === 'title' ? null : 'title')
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D4ED8] hover:text-[#0D2137] cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{editingField === 'title' ? 'Done' : 'Quick edit'}</span>
              </button>
            </div>

            {editingField === 'title' ? (
              <div>
                <label htmlFor="quick-edit-title" className="sr-only">
                  Edit Grievance Title
                </label>
                <input
                  id="quick-edit-title"
                  type="text"
                  value={grievanceDraft.title}
                  onChange={(e) => updateGrievanceDraft({ title: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#1D4ED8] rounded-xl px-3.5 py-2 text-sm font-bold text-[#0D2137]"
                />
              </div>
            ) : (
              <h2 className="text-lg font-bold text-[#0D2137]">{grievanceDraft.title}</h2>
            )}

            <p className="text-xs text-[#475569] leading-relaxed">
              {grievanceDraft.whatHappened}
            </p>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
            <span>Scheme: {grievanceDraft.schemeOrService}</span>
            <span className="font-mono-tabular font-semibold text-[#0D2137]">
              {grievanceDraft.referenceNumber}
            </span>
          </div>
        </section>

        {/* 2. Destination Card */}
        <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D2137]">
                <Building2 className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
                <span>Destination Card (Illustrative)</span>
              </div>
              <span className="text-[11px] font-semibold text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-0.5 rounded-lg">
                Subject to verification
              </span>
            </div>

            <h2 className="text-base font-bold text-[#0D2137]">
              {recommendation.potentialAuthorityIllustrative}
            </h2>

            <p className="text-xs text-[#475569] leading-relaxed">
              Selected because institutional verification is already complete and the case requires
              a post-verification disbursement &amp; DBT mapper trace.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-[#64748B]">Routing pathway</span>
            <button
              type="button"
              onClick={() => navigate('/alternatives')}
              className="font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
            >
              Change pathway →
            </button>
          </div>
        </section>
      </div>

      {/* Side-by-Side Distinction: Citizen Statement vs. AI-Generated Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-[#FFFFFF] border-2 border-[#0D2137] rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
              <UserCheck className="w-4 h-4" aria-hidden="true" />
              <span>Your Direct Citizen Statement</span>
            </div>
            <span className="text-[11px] text-[#64748B]">Unmodified original words</span>
          </div>
          <blockquote className="p-4 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl text-sm text-[#0F172A] italic">
            &ldquo;{grievanceDraft.citizenOriginalStatement}&rdquo;
          </blockquote>
        </section>

        <section className="bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1D4ED8]">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>AI-Generated Summary</span>
            </div>
            <span className="text-[11px] font-semibold text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] px-2 py-0.5 rounded">
              Companion Draft
            </span>
          </div>
          <p className="p-4 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0F172A] leading-relaxed">
            {grievanceDraft.aiAssistedSummary}
          </p>
        </section>
      </div>

      {/* Visual Row 3: Requested Outcome + Evidence Summary + Data-Sharing Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 3. Requested Outcome (Compact Editable) */}
        <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D2137]">
              <Target className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
              <span>Requested Outcome</span>
            </div>
            <button
              type="button"
              onClick={() =>
                setEditingField(editingField === 'outcome' ? null : 'outcome')
              }
              className="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
            >
              {editingField === 'outcome' ? 'Done' : 'Edit'}
            </button>
          </div>

          {editingField === 'outcome' ? (
            <textarea
              rows={3}
              aria-label="Edit requested outcome"
              value={grievanceDraft.requestedOutcome}
              onChange={(e) => updateGrievanceDraft({ requestedOutcome: e.target.value })}
              className="w-full bg-[#FAF9F6] border border-[#1D4ED8] rounded-xl p-2.5 text-xs text-[#0F172A]"
            />
          ) : (
            <p className="text-xs text-[#475569] leading-relaxed whitespace-pre-wrap">
              {grievanceDraft.requestedOutcome}
            </p>
          )}
        </section>

        {/* 4. Evidence Summary */}
        <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D2137]">
            <FileText className="w-4 h-4 text-[#059669]" aria-hidden="true" />
            <span>Evidence Summary ({grievanceDraft.attachments.length})</span>
          </div>
          <p className="text-xs text-[#475569] whitespace-pre-wrap leading-relaxed">
            {grievanceDraft.evidenceAvailable}
          </p>
          <ul className="space-y-1.5 pt-1">
            {grievanceDraft.attachments.map((att) => (
              <li
                key={att.id}
                className="text-[11px] font-mono-tabular bg-[#FAF9F6] border border-[#E2E8F0] px-2.5 py-1.5 rounded-lg text-[#0D2137] truncate"
              >
                {att.name} ({att.sizeLabel})
              </li>
            ))}
          </ul>
        </section>

        {/* 5. Data-Sharing Explanation */}
        <section className="bg-[#FAF9F6] border border-[#CBD5E1] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0D2137]">
            <Lock className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
            <span>Data-Sharing Explanation</span>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            In a future deployment, only the structured case packet above is shared with the
            designated nodal cell. No Aadhaar numbers, passwords, or bank credentials are collected.
            In this prototype, all data stays inside your browser&apos;s local storage.
          </p>
        </section>
      </div>

      {/* Explicit Citizen Authorization & Final Action */}
      <form
        onSubmit={handleConfirmSubmission}
        noValidate
        className="bg-[#FFFFFF] border-2 border-[#0D2137] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs"
      >
        <div className="flex items-center gap-2 text-[#0D2137]">
          <ShieldCheck className="w-5 h-5 text-[#059669]" aria-hidden="true" />
          <h2 className="text-base font-bold">
            Explicit Citizen Authorization Required
          </h2>
        </div>

        <label className="flex items-start gap-3.5 p-4 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={grievanceDraft.authorizationConfirmed}
            onChange={(e) => {
              updateGrievanceDraft({ authorizationConfirmed: e.target.checked });
              if (consentError) setConsentError(null);
            }}
            className="mt-0.5 w-5 h-5 accent-[#1D4ED8] shrink-0"
          />
          <span className="text-sm text-[#0F172A] leading-relaxed">
            <strong>I review and authorize this demo grievance ({grievanceDraft.referenceNumber}).</strong>{' '}
            I understand that an AI assistant never submits on my behalf without my explicit
            approval, and that this academic prototype does not submit to any real government
            department.
          </span>
        </label>

        {consentError && (
          <p
            role="alert"
            className="text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] p-3 rounded-xl"
          >
            {consentError}
          </p>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/prepare')}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Prepare</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] transition-colors cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>Authorize &amp; Create Demo Case</span>
          </button>
        </div>
      </form>
    </div>
  );
};

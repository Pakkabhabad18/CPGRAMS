import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Sparkles,
  Paperclip,
  Trash2,
  Plus,
  AlertCircle,
  ShieldAlert,
  FileCheck,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';
import {
  improveGrievanceDraftParts,
  validateGrievanceDraft,
  AttachmentItem,
} from '../utils/grievanceLogic';

export const PrepareScreen: React.FC = () => {
  const {
    grievanceDraft,
    updateGrievanceDraft,
    discoveryAnswers,
    accessibilityPrefs,
    saveDraftNow,
    navigate,
    showToast,
  } = useCitizenJourney();

  const [attemptedNext, setAttemptedNext] = useState(false);
  const [newDocName, setNewDocName] = useState('');

  const validation = validateGrievanceDraft(grievanceDraft);
  const totalChars =
    grievanceDraft.whatHappened.length +
    grievanceDraft.evidenceAvailable.length +
    grievanceDraft.requestedOutcome.length;

  const handleRefineThreePartDraft = () => {
    const refined = improveGrievanceDraftParts(grievanceDraft, discoveryAnswers);
    updateGrievanceDraft({
      whatHappened: refined.whatHappened,
      evidenceAvailable: refined.evidenceAvailable,
      requestedOutcome: refined.requestedOutcome,
      aiAssistedSummary: refined.aiAssistedSummary,
    });
    showToast(refined.changesNote);
  };

  const handleAddAttachment = () => {
    const cleanName =
      newDocName.trim() ||
      `Supporting_Evidence_DEMO-NSP-049218_${grievanceDraft.attachments.length + 1}.pdf`;
    const item: AttachmentItem = {
      id: `doc-${Date.now()}`,
      name: cleanName,
      source: 'simulated-upload',
      sizeLabel: '142 KB',
      statusNote: 'Simulated upload — Not verified by AI',
    };
    updateGrievanceDraft({
      attachments: [...grievanceDraft.attachments, item],
    });
    setNewDocName('');
  };

  const handleRemoveAttachment = (id: string) => {
    updateGrievanceDraft({
      attachments: grievanceDraft.attachments.filter((a) => a.id !== id),
    });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedNext(true);
    if (!validation.valid) return;
    navigate('/review');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
            Screen 04 · Guided 3-Part Drafting
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2137]">
            Prepare my grievance
          </h1>
          <p className="text-sm text-[#475569]">
            Review or edit the structured 3-part draft below. Your original statement is preserved
            separately.
          </p>
        </div>

        {!accessibilityPrefs.continueWithoutAI && (
          <button
            type="button"
            onClick={handleRefineThreePartDraft}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1D4ED8] bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Refine 3-part structure</span>
          </button>
        )}
      </div>

      {validation.piiWarnings.length > 0 && (
        <div
          role="alert"
          className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] p-4 rounded-2xl text-xs space-y-1"
        >
          <div className="font-bold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Sensitive personal data warning</span>
          </div>
          {validation.piiWarnings.map((w, idx) => (
            <p key={idx}>{w}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleContinue} noValidate className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Editable Title + Three-Part Structure */}
          <div className="lg:col-span-7 space-y-6">
            {/* Editable Grievance Title */}
            <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="grievance-title-input"
                  className="text-sm font-bold text-[#0D2137]"
                >
                  Editable grievance title
                </label>
                <span className="text-xs font-mono-tabular text-[#64748B]">
                  Case: {grievanceDraft.referenceNumber}
                </span>
              </div>
              <input
                id="grievance-title-input"
                type="text"
                value={grievanceDraft.title}
                onChange={(e) => updateGrievanceDraft({ title: e.target.value })}
                aria-invalid={Boolean(attemptedNext && validation.errors.title)}
                className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm font-semibold text-[#0F172A] focus:bg-[#FFFFFF]"
              />
              {attemptedNext && validation.errors.title && (
                <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                  {validation.errors.title}
                </p>
              )}
            </section>

            {/* PART 1: What happened */}
            <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="part1-what-happened"
                  className="text-base font-bold text-[#0D2137]"
                >
                  1. What happened
                </label>
                <span className="text-xs font-semibold text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-0.5 rounded-lg">
                  AI-assisted draft — please review
                </span>
              </div>
              <textarea
                id="part1-what-happened"
                rows={4}
                value={grievanceDraft.whatHappened}
                onChange={(e) => updateGrievanceDraft({ whatHappened: e.target.value })}
                aria-invalid={Boolean(attemptedNext && validation.errors.whatHappened)}
                className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl p-3.5 text-sm text-[#0F172A] leading-relaxed focus:bg-[#FFFFFF]"
              />
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>State when verification finished and what status you see now.</span>
                <span className="font-mono-tabular">
                  {grievanceDraft.whatHappened.length} chars
                </span>
              </div>
              {attemptedNext && validation.errors.whatHappened && (
                <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                  {validation.errors.whatHappened}
                </p>
              )}
            </section>

            {/* PART 2: What evidence is available */}
            <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="part2-evidence"
                  className="text-base font-bold text-[#0D2137]"
                >
                  2. What evidence is available
                </label>
                <span className="text-xs text-[#64748B]">
                  Reference IDs &amp; verification records
                </span>
              </div>
              <textarea
                id="part2-evidence"
                rows={3}
                value={grievanceDraft.evidenceAvailable}
                onChange={(e) => updateGrievanceDraft({ evidenceAvailable: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl p-3.5 text-sm text-[#0F172A] leading-relaxed focus:bg-[#FFFFFF]"
              />
              <p className="text-xs text-[#64748B]">
                Note: The AI assistant cannot verify the authenticity of documents or retrieve live
                government records—it lists the evidence you state you have.
              </p>
            </section>

            {/* PART 3: What outcome are you requesting? */}
            <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="part3-outcome"
                  className="text-base font-bold text-[#0D2137]"
                >
                  3. What outcome are you requesting?
                </label>
                <span className="text-xs font-mono-tabular text-[#64748B]">
                  Total draft: {totalChars} chars
                </span>
              </div>
              <textarea
                id="part3-outcome"
                rows={3}
                value={grievanceDraft.requestedOutcome}
                onChange={(e) => updateGrievanceDraft({ requestedOutcome: e.target.value })}
                aria-invalid={Boolean(attemptedNext && validation.errors.requestedOutcome)}
                className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl p-3.5 text-sm text-[#0F172A] leading-relaxed focus:bg-[#FFFFFF]"
              />
              {attemptedNext && validation.errors.requestedOutcome && (
                <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                  {validation.errors.requestedOutcome}
                </p>
              )}
            </section>
          </div>

          {/* Right 5 Columns: Preserved Citizen Statement, Concise AI Summary, Evidence & Missing Info */}
          <aside className="lg:col-span-5 space-y-6">
            {/* Preserved Citizen Statement (Kept Separate) */}
            <section className="bg-[#FFFFFF] border-2 border-[#0D2137] rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                  Preserved Separately
                </span>
                <span className="text-[11px] text-[#64748B]">Your exact words</span>
              </div>
              <h2 className="text-base font-bold text-[#0D2137]">
                Citizen statement (unmodified)
              </h2>
              <blockquote className="p-3.5 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#0F172A] italic">
                &ldquo;{grievanceDraft.citizenOriginalStatement}&rdquo;
              </blockquote>
              <p className="text-xs text-[#475569]">
                Your original words are attached alongside the structured draft so the reviewing
                officer always sees your direct statement.
              </p>
            </section>

            {/* Concise AI-Assisted Summary Card */}
            <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-[#0D2137]">Concise AI-assisted summary</h2>
                <span className="text-[11px] font-semibold text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] px-2 py-0.5 rounded">
                  AI-assisted draft — please review
                </span>
              </div>
              <label htmlFor="ai-summary-edit" className="sr-only">
                Concise AI-assisted summary
              </label>
              <textarea
                id="ai-summary-edit"
                rows={3}
                value={grievanceDraft.aiAssistedSummary}
                onChange={(e) => updateGrievanceDraft({ aiAssistedSummary: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0F172A] leading-relaxed"
              />
            </section>

            {/* Supporting Document List & Evidence Requirements */}
            <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#0D2137]">
                <FileCheck className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
                <h2 className="text-sm font-bold">
                  Supporting document list &amp; evidence requirements
                </h2>
              </div>

              <div className="p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl text-xs text-[#475569] space-y-1">
                <p className="font-semibold text-[#0D2137]">Known evidence requirements:</p>
                <p>• Application ID ({grievanceDraft.referenceNumber})</p>
                <p>• Institute verification acknowledgment slip</p>
              </div>

              <ul className="space-y-2">
                {grievanceDraft.attachments.map((att) => (
                  <li
                    key={att.id}
                    className="flex items-center justify-between gap-2 p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Paperclip className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0D2137] truncate">{att.name}</p>
                        <p className="text-[11px] text-[#64748B]">{att.statusNote}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      aria-label={`Remove ${att.name}`}
                      className="text-[#B91C1C] hover:bg-[#FEF2F2] p-1 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <label htmlFor="prepare-add-doc" className="sr-only">
                  Document filename
                </label>
                <input
                  id="prepare-add-doc"
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="Add document name..."
                  className="flex-1 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Add</span>
                </button>
              </div>

              {/* Suggested Missing Information */}
              {validation.suggestedMissingInfo.length > 0 && (
                <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-xs text-[#92400E] space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Suggested missing information:</span>
                  </p>
                  {validation.suggestedMissingInfo.map((info, i) => (
                    <p key={i}>• {info}</p>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/recommendation')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => saveDraftNow()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
              <span>Save draft</span>
            </button>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] transition-colors cursor-pointer shadow-xs"
          >
            <span>Continue to Review &amp; Authorize</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
};

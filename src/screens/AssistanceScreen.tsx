import React, { useState } from 'react';
import {
  ArrowLeft,
  PhoneCall,
  Users,
  Globe,
  Accessibility,
  ClipboardCheck,
  CheckCircle2,
  Copy,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';

const SUPPORTED_LANGUAGES = [
  'English (Multilingual Companion Ready)',
  'हिन्दी (Hindi — Simulated Demo Option)',
  'मराठी (Marathi — Simulated Demo Option)',
  'தமிழ் (Tamil — Simulated Demo Option)',
  'বাংলা (Bengali — Simulated Demo Option)',
  'తెలుగు (Telugu — Simulated Demo Option)',
  'ಕನ್ನಡ (Kannada — Simulated Demo Option)',
];

export const AssistanceScreen: React.FC = () => {
  const {
    activeCase,
    grievanceDraft,
    accessibilityPrefs,
    updateAccessibilityPrefs,
    goBack,
    navigate,
    showToast,
  } = useCitizenJourney();

  const [callbackSlot, setCallbackSlot] = useState('Today · Afternoon Window (Simulated)');
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [copiedPacket, setCopiedPacket] = useState(false);

  const conciseCaseSummary = [
    `CPGRAMS 2036 — Concise Case Summary for Assisted Support (DEMO)`,
    `Demo Reference: ${activeCase.referenceId}`,
    `Issue Title: ${activeCase.title}`,
    `Citizen Statement: "${grievanceDraft.citizenOriginalStatement}"`,
    `Current Stage: ${activeCase.currentStatusLabel}`,
    `Preferred Language: ${accessibilityPrefs.preferredLanguage}`,
  ].join('\n');

  const handleSimulatedCallback = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackRequested(true);
    showToast('Simulated callback request recorded (Demo Only — No real phone call placed).');
  };

  const handleCopySummary = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(conciseCaseSummary).catch(() => {});
    }
    setCopiedPacket(true);
    showToast('Copied concise case summary for assisted support.');
    window.setTimeout(() => setCopiedPacket(false), 3000);
  };

  const handleContinueWithoutAI = () => {
    updateAccessibilityPrefs({ continueWithoutAI: true });
    showToast('Switched to Direct Citizen Mode (Continue without AI).');
    navigate('/prepare');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1D4ED8]">
              Screen 10 · Accessible Citizen Support (Demo)
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0D2137] mt-1">
              Human assistance
            </h1>
          </div>

          <button
            type="button"
            onClick={() => goBack('/track')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0D2137] rounded-xl hover:bg-[#1E3A8A] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Return to journey</span>
          </button>
        </div>

        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 text-xs text-[#92400E] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Simulated Support Notice:</strong> All support actions on this screen are
            clearly labeled prototype demonstrations. No real helpline numbers or live government
            contact centres are shown.
          </span>
        </div>
      </div>

      {/* Top Row: 1. Request a Callback (Simulated) + 2. Find Assisted Service Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Request a Callback (Simulated) */}
        <section
          aria-labelledby="callback-heading"
          className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#0D2137]">
              <PhoneCall className="w-5 h-5 text-[#1D4ED8]" aria-hidden="true" />
              <h2 id="callback-heading" className="text-base font-bold">
                Request a callback (Simulated)
              </h2>
            </div>
            <span className="text-[11px] font-mono-tabular bg-[#FAF9F6] border border-[#CBD5E1] px-2 py-0.5 rounded">
              DEMO ACTION
            </span>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed">
            In 2036, a trained civic facilitator can review your pre-prepared case code (
            <strong className="font-mono-tabular">{activeCase.referenceId}</strong>) and call you
            back in your preferred language so you never wait on hold.
          </p>

          {callbackRequested ? (
            <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl text-xs text-[#059669] space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Simulated callback queued for {callbackSlot}</span>
              </div>
              <p>
                Demo Reference <strong>{activeCase.referenceId}</strong> attached for{' '}
                {accessibilityPrefs.preferredLanguage}. (Simulated prototype confirmation only.)
              </p>
              <button
                type="button"
                onClick={() => setCallbackRequested(false)}
                className="underline font-semibold cursor-pointer"
              >
                Change simulated callback window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSimulatedCallback} className="space-y-3">
              <div>
                <label
                  htmlFor="callback-window-select"
                  className="block text-xs font-semibold text-[#0D2137] mb-1"
                >
                  Preferred callback window (Simulated):
                </label>
                <select
                  id="callback-window-select"
                  value={callbackSlot}
                  onChange={(e) => setCallbackSlot(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A]"
                >
                  <option value="Today · Afternoon Window (Simulated)">
                    Today · Afternoon Window (Simulated)
                  </option>
                  <option value="Tomorrow · Morning Window (Simulated)">
                    Tomorrow · Morning Window (Simulated)
                  </option>
                  <option value="Assisted Sign-Language Video Relay (Simulated)">
                    Assisted Sign-Language Video Relay (Simulated)
                  </option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] transition-colors cursor-pointer"
              >
                Request Simulated Callback
              </button>
            </form>
          )}
        </section>

        {/* Option 2: Find Assisted Service Options */}
        <section
          aria-labelledby="assisted-options-heading"
          className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#0D2137]">
                <Users className="w-5 h-5 text-[#059669]" aria-hidden="true" />
                <h2 id="assisted-options-heading" className="text-base font-bold">
                  Find assisted service options
                </h2>
              </div>
              <span className="text-[11px] font-mono-tabular bg-[#FAF9F6] border border-[#CBD5E1] px-2 py-0.5 rounded">
                CONCEPTUAL
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-[#475569]">
              <li className="p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl">
                <strong className="block text-[#0D2137]">
                  Institutional Scholarship Nodal Desk (In-Person)
                </strong>
                Bring your Demo Reference ({activeCase.referenceId}) to your college scholarship
                counter to inspect batch forwarding logs.
              </li>
              <li className="p-3 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl">
                <strong className="block text-[#0D2137]">
                  Community Citizen Facilitation Kiosk (2036 Concept)
                </strong>
                Use your concise case summary below at any public facilitation desk with mandatory
                read-back consent.
              </li>
            </ul>
          </div>

          <p className="text-[11px] text-[#64748B] border-t border-[#E2E8F0] pt-3">
            No fabricated office addresses or real phone numbers are displayed in this prototype.
          </p>
        </section>
      </div>

      {/* Middle Row: 3. Language Options + 4. Accessibility Preferences + 5. Continue Without AI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Language Options */}
        <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0D2137]">
            <Globe className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
            <h2>View language options</h2>
          </div>
          <label htmlFor="assist-lang-select" className="sr-only">
            Select language preference
          </label>
          <select
            id="assist-lang-select"
            value={accessibilityPrefs.preferredLanguage}
            onChange={(e) =>
              updateAccessibilityPrefs({ preferredLanguage: e.target.value })
            }
            className="w-full bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl px-3 py-2.5 text-xs text-[#0F172A]"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-[#64748B]">
            Saved to your assisted support summary packet.
          </p>
        </section>

        {/* Accessibility Preferences */}
        <section className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0D2137]">
            <Accessibility className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
            <h2>Accessibility preferences</h2>
          </div>
          <label className="flex items-start gap-2.5 p-2.5 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={accessibilityPrefs.largeText}
              onChange={(e) =>
                updateAccessibilityPrefs({ largeText: e.target.checked })
              }
              className="mt-0.5 w-4 h-4 accent-[#1D4ED8]"
            />
            <span>
              <strong className="block text-[#0D2137]">Larger reading text</strong>
              Increases base font size across all screens.
            </span>
          </label>
        </section>

        {/* Continue Without AI */}
        <section className="bg-[#FAF9F6] border border-[#CBD5E1] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0D2137]">
              <UserCheck className="w-4 h-4 text-[#059669]" aria-hidden="true" />
              <h2>Continue without AI</h2>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Prefer a 100% manual, self-operated form with zero AI drafting suggestions?
            </p>
          </div>
          <button
            type="button"
            onClick={handleContinueWithoutAI}
            className="w-full py-2.5 px-3 text-xs font-semibold text-[#0D2137] bg-[#FFFFFF] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
          >
            {accessibilityPrefs.continueWithoutAI
              ? 'Direct Citizen Mode Active → Go to Form'
              : 'Switch to Continue Without AI'}
          </button>
        </section>
      </div>

      {/* Bottom Row: Prepare a Concise Case Summary */}
      <section
        aria-labelledby="concise-summary-heading"
        className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#0D2137]">
            <ClipboardCheck className="w-5 h-5 text-[#059669]" aria-hidden="true" />
            <div>
              <h2 id="concise-summary-heading" className="text-base font-bold">
                Prepare a concise case summary (Demo Handout)
              </h2>
              <p className="text-xs text-[#475569]">
                Share this summary with a human facilitator so you don&apos;t have to repeat your
                story from the beginning:
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
          >
            {copiedPacket ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" aria-hidden="true" />
                <span>Summary Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
                <span>Copy Case Summary</span>
              </>
            )}
          </button>
        </div>

        <pre className="whitespace-pre-wrap font-mono-tabular text-xs bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl p-4 text-[#0F172A] leading-relaxed">
          {conciseCaseSummary}
        </pre>
      </section>
    </div>
  );
};

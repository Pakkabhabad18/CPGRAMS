import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Home,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';
import { DEMO_REFERENCE_ID } from '../utils/grievanceLogic';

export const ConfirmationScreen: React.FC = () => {
  const { activeCase, navigate } = useCitizenJourney();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Prototype Notice */}
      <div
        role="region"
        aria-label="Simulated Prototype Notice"
        className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-[#92400E]"
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
          <span className="font-bold">
            Simulated prototype record — not a government registration number.
          </span>
        </div>
        <span>No government department was contacted.</span>
      </div>

      {/* Visually Clear Receipt Design */}
      <section
        aria-labelledby="receipt-headline"
        className="bg-[#FFFFFF] border-2 border-[#0D2137] rounded-2xl overflow-hidden shadow-xs"
      >
        {/* Receipt Top Header */}
        <div className="bg-[#0D2137] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#059669] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#93C5FD]">
                Screen 06 · Citizen Authorization Receipt (Demo)
              </p>
              <h1 id="receipt-headline" className="text-2xl sm:text-3xl font-bold mt-0.5">
                Your demo case is ready.
              </h1>
            </div>
          </div>

          <div className="sm:text-right bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2.5">
            <span className="block text-[10px] uppercase tracking-wider text-[#CBD5E1]">
              Demo Reference Number
            </span>
            <span className="font-mono-tabular text-lg font-bold text-white">
              {activeCase.referenceId || DEMO_REFERENCE_ID}
            </span>
          </div>
        </div>

        {/* Receipt Body Ledger */}
        <div className="p-6 sm:p-8 space-y-6 divide-y divide-[#E2E8F0]">
          {/* Row 1: Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl space-y-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
                <span>Date / Time of Demo Action</span>
              </span>
              <p className="font-mono-tabular font-bold text-[#0D2137] text-sm">
                {activeCase.createdAtLabel}
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-[#E2E8F0] rounded-xl space-y-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" aria-hidden="true" />
                <span>Record Classification</span>
              </span>
              <p className="font-semibold text-[#059669] text-sm">
                Simulated Prototype Record (Local Only)
              </p>
            </div>
          </div>

          {/* Row 2: Issue Summary & Illustrative Destination */}
          <div className="pt-6 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Issue Summary
              </span>
              <h2 className="text-lg font-bold text-[#0D2137]">{activeCase.title}</h2>
              <p className="text-xs text-[#475569] leading-relaxed">
                {activeCase.aiAssistedSummary}
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-[#CBD5E1] rounded-xl space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                Illustrative Destination
              </span>
              <p className="text-sm font-bold text-[#1D4ED8]">
                {activeCase.illustrativeDestination}
              </p>
              <p className="text-[11px] text-[#64748B]">
                Explicitly marked illustrative — this action did not contact any government
                department.
              </p>
            </div>
          </div>

          {/* Row 3: Next Step */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0D2137]">
              <FileText className="w-4 h-4 text-[#1D4ED8]" aria-hidden="true" />
              <span>Next step in your journey</span>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              Open <strong>My Resolution Journey</strong> to follow the interactive timeline for{' '}
              <span className="font-mono-tabular font-semibold">{activeCase.referenceId}</span>,
              inspect what an authoritative event looks like, and review the sample departmental
              response.
            </p>
          </div>

          {/* Prominent & Secondary Actions */}
          <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] cursor-pointer"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>Return home</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/track')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] transition-colors cursor-pointer shadow-xs"
            >
              <span>View my resolution journey</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

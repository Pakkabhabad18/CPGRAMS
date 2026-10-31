import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  KeyRound,
  FileSearch,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  UserCheck,
  Database,
  Radio,
  AlertTriangle,
  Sliders,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';

interface StepSpec {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  citizenControl: string;
  systemRole: string;
}

const ARCHITECTURE_STEPS: StepSpec[] = [
  {
    number: '01',
    title: 'Consent-based identity verification',
    subtitle: 'Explicit, session-scoped citizen verification',
    description:
      'In a 2036 architecture, the citizen verifies their identity through an explicit, time-bounded consent prompt before any assistant can query or prepare a case.',
    citizenControl: 'Approves single-session identity verification; can revoke at any moment.',
    systemRole: 'Issues a short-lived, non-transferable verification token scoped only to the current issue.',
  },
  {
    number: '02',
    title: 'Permissioned document retrieval',
    subtitle: 'Selective evidence preview without bulk data access',
    description:
      'With citizen permission, the assistant previews only the specific supporting records relevant to the issue (such as a verified scholarship sanction certificate or institute confirmation).',
    citizenControl: 'Selects which individual documents may be attached; raw credentials are never shared.',
    systemRole: 'Provides read-only cryptographic verification metadata rather than unrestricted folder access.',
  },
  {
    number: '03',
    title: 'Agent prepares the draft',
    subtitle: 'Structured case assembly with provenance',
    description:
      'The trusted assistant organizes the citizen’s problem into a structured grievance draft—separating the citizen’s exact words from the AI-generated administrative summary.',
    citizenControl: 'Can edit every field, reject AI phrasing, or switch to manual drafting at any time.',
    systemRole: 'Validates required fields against the responsible authority’s schema before submission.',
  },
  {
    number: '04',
    title: 'Citizen reviews and authorizes',
    subtitle: 'Mandatory human-in-the-loop authorization gate',
    description:
      'No personal assistant or AI agent can file a grievance autonomously. The citizen reviews a modular summary of the destination, evidence, and requested outcome before signing off.',
    citizenControl: 'Explicitly checks the authorization consent box to permit transmission.',
    systemRole: 'Blocks any unverified or automated submission lacking explicit citizen sign-off.',
  },
  {
    number: '05',
    title: 'Government issues authoritative receipt',
    subtitle: 'Tamper-evident case record & SLA commitment',
    description:
      'Once authorized, the government interface records the grievance and returns a structured, verifiable receipt containing the responsible authority, timestamp, and expected timeline.',
    citizenControl: 'Holds an independent copy of the authoritative case record (e.g., DEMO-NSP-049218).',
    systemRole: 'Logs an immutable audit event distinguishing administrative intake from substantive resolution.',
  },
  {
    number: '06',
    title: 'Updates return through a supported channel',
    subtitle: 'Plain-language status & escalation readiness',
    description:
      'When the authority responds, the update returns through the citizen’s chosen channel—translating bureaucratic status codes into clear next steps and highlighting whether the outcome was actually achieved.',
    citizenControl: 'Reviews the response, requests clarification, or escalates to an appellate authority.',
    systemRole: 'Delivers signed status events to the citizen’s preferred interface (web, voice, or assisted kiosk).',
  },
];

export const HowItWorksScreen: React.FC = () => {
  const { activeCase, agentAuthorization, updateAgentAuthorization, navigate } = useCitizenJourney();
  const [selectedStep, setSelectedStep] = useState<number>(0);

  const togglePermission = (key: keyof typeof agentAuthorization) => {
    updateAgentAuthorization({
      [key]: !agentAuthorization[key],
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Signature Future Experience · How It Works in 2036</span>
          </div>
          <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] font-semibold">
            Conceptual 2036 Architecture — Not a Live Integration
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-3">
          Agent-Ready Government: Citizen-Authorized Resolution
        </h1>
        <p className="text-sm sm:text-base text-[#475569] max-w-3xl leading-relaxed">
          In 2036, citizens should not have to navigate fragmented departmental portals. Instead, government services expose structured, permissioned interfaces so a citizen’s trusted assistant can help prepare and track a case—while the citizen retains strict control and final authorization at every step.
        </p>

        {/* Strict Academic Framing Notice */}
        <div className="mt-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
          <p className="text-xs text-[#475569] leading-relaxed">
            <strong className="text-[#0F172A]">Future Vision Disclaimer:</strong> This screen illustrates a speculative 2036 service architecture for academic UX research. It does not imply that Aadhaar, DigiLocker, UMANG, API Setu, or CPGRAMS currently expose these agent interfaces or are connected to this prototype.
          </p>
        </div>
      </div>

      {/* 6-Node Visual Architecture Flow */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#93C5FD] block mb-1">
              End-to-End Trust Pipeline
            </span>
            <h2 className="font-display text-lg sm:text-xl font-semibold text-white">
              How a Citizen’s Trusted Assistant Interacts with Government in 2036
            </h2>
          </div>
          <span className="text-xs text-slate-300 font-mono">
            Human-in-the-loop by design
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              step: 'Node 1',
              label: 'Citizen',
              desc: 'Describes issue in own words & sets boundaries',
              icon: UserCheck,
              accent: 'border-blue-400/40 bg-blue-950/40',
            },
            {
              step: 'Node 2',
              label: 'Trusted assistant',
              desc: 'Structures draft & identifies likely pathway',
              icon: Sparkles,
              accent: 'border-indigo-400/40 bg-indigo-950/40',
            },
            {
              step: 'Node 3',
              label: 'Permission layer',
              desc: 'Enforces explicit citizen consent & scope',
              icon: KeyRound,
              accent: 'border-amber-400/40 bg-amber-950/40',
            },
            {
              step: 'Node 4',
              label: 'Authorized govt interface',
              desc: 'Verifies schema & receives structured case',
              icon: ShieldCheck,
              accent: 'border-emerald-400/40 bg-emerald-950/40',
            },
            {
              step: 'Node 5',
              label: 'Official case record',
              desc: 'Issues verifiable receipt & SLA milestones',
              icon: Database,
              accent: 'border-cyan-400/40 bg-cyan-950/40',
            },
            {
              step: 'Node 6',
              label: "Citizen's chosen channel",
              desc: 'Delivers plain-language updates & next steps',
              icon: Radio,
              accent: 'border-blue-400/40 bg-blue-950/40',
            },
          ].map((node, index) => {
            const IconComponent = node.icon;
            return (
              <div
                key={node.label}
                className={`relative rounded-xl p-4 border ${node.accent} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mb-2">
                    <span>{node.step}</span>
                    {index < 5 && <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-2.5 text-white">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-semibold text-sm text-white mb-1">
                    {node.label}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{node.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive 6-Step Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-2.5">
          <div className="px-1 mb-2">
            <h2 className="font-display text-base font-bold text-[#0F172A]">
              6-Step Safeguarded Protocol
            </h2>
            <p className="text-xs text-[#475569]">
              Select any step to inspect how citizen agency is protected.
            </p>
          </div>
          {ARCHITECTURE_STEPS.map((item, idx) => {
            const isSelected = idx === selectedStep;
            return (
              <button
                key={item.number}
                type="button"
                onClick={() => setSelectedStep(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-white border-[#1D4ED8] shadow-xs ring-2 ring-[#1D4ED8]/10'
                    : 'bg-white/70 border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]'
                }`}
              >
                <span
                  className={`text-xs font-mono font-bold px-2 py-1 rounded-md shrink-0 ${
                    isSelected
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-[#F1F5F9] text-[#475569]'
                  }`}
                >
                  {item.number}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-semibold text-sm text-[#0F172A]">
                    {item.title}
                  </div>
                  <div className="text-xs text-[#475569] truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Inspector + Interactive Permission Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1 rounded-md">
                Step {ARCHITECTURE_STEPS[selectedStep].number} of 06
              </span>
              <span className="text-xs text-[#475569] font-medium">
                Demo Case: {activeCase.referenceId}
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-[#0F172A] mb-2">
              {ARCHITECTURE_STEPS[selectedStep].title}
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed mb-6">
              {ARCHITECTURE_STEPS[selectedStep].description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#047857] mb-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Citizen Authority & Control</span>
                </div>
                <p className="text-xs text-[#065F46] leading-relaxed">
                  {ARCHITECTURE_STEPS[selectedStep].citizenControl}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                  <Lock className="w-4 h-4 text-[#1D4ED8]" />
                  <span>2036 Interface Guarantee</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {ARCHITECTURE_STEPS[selectedStep].systemRole}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Permission Boundary Sandbox */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <Sliders className="w-4 h-4 text-[#1D4ED8]" />
              <h3 className="font-display text-base font-bold text-[#0F172A]">
                Interactive Permission Layer (Prototype Controls)
              </h3>
            </div>
            <p className="text-xs text-[#475569] mb-4 leading-relaxed">
              Test how the citizen permission layer governs what the assistant is allowed to do during this prototype session:
            </p>

            <div className="space-y-3">
              <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                <div>
                  <div className="text-sm font-semibold text-[#0F172A]">
                    Allow AI-assisted draft structuring
                  </div>
                  <div className="text-xs text-[#475569] mt-0.5">
                    Permits the assistant to organize your narrative into the 3-part grievance structure while keeping your original words intact.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={agentAuthorization.allowDraftAssistance}
                  onChange={() => togglePermission('allowDraftAssistance')}
                  className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#1D4ED8] focus:ring-[#1D4ED8]"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                <div>
                  <div className="text-sm font-semibold text-[#0F172A]">
                    Permissioned document metadata preview
                  </div>
                  <div className="text-xs text-[#475569] mt-0.5">
                    Allows checking whether your scholarship application and institute verification items are listed in your case checklist.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={agentAuthorization.permissionedDocumentRetrievalPreview}
                  onChange={() => togglePermission('permissionedDocumentRetrievalPreview')}
                  className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#1D4ED8] focus:ring-[#1D4ED8]"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                <div>
                  <div className="text-sm font-semibold text-[#0F172A]">
                    Plain-language response translation
                  </div>
                  <div className="text-xs text-[#475569] mt-0.5">
                    Permits translating departmental disposal replies into clear “what is resolved vs. what remains unresolved” summaries.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={agentAuthorization.allowResponsePlainLanguageSummary}
                  onChange={() => togglePermission('allowResponsePlainLanguageSummary')}
                  className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#1D4ED8] focus:ring-[#1D4ED8]"
                />
              </label>
            </div>
          </div>

          {/* Required Fallback Experience Card */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#B45309]">
                Guaranteed Non-AI Fallback
              </div>
              <p className="text-sm font-semibold text-[#0F172A]">
                “If your assistant cannot connect, continue through the official service or human support.”
              </p>
              <p className="text-xs text-[#78350F]">
                Digital assistance is never a barrier. Citizens can always bypass AI tools entirely or request a human callback.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/assistance')}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#F59E0B] text-[#B45309] text-xs font-semibold hover:bg-[#FEF3C7] transition-colors"
              >
                Human Support & Offline Help
              </button>
              <button
                type="button"
                onClick={() => navigate('/review')}
                className="px-4 py-2.5 rounded-xl bg-[#1D4ED8] text-white text-xs font-semibold hover:bg-[#1E40AF] transition-colors inline-flex items-center gap-1.5"
              >
                <span>Inspect Review & Authorize</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

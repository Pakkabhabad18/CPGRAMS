import React, { useState } from 'react';
import {
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Lock,
  HelpCircle,
} from 'lucide-react';
import { useCitizenJourney } from '../context/CitizenJourneyContext';
import { RoutePath } from '../utils/grievanceLogic';

const FILING_STEPS: Array<{ route: RoutePath; stepNum: string; label: string }> = [
  { route: '/discover', stepNum: '01', label: 'Understand Issue' },
  { route: '/recommendation', stepNum: '02', label: 'Recommended Pathway' },
  { route: '/prepare', stepNum: '03', label: 'Prepare Grievance' },
  { route: '/review', stepNum: '04', label: 'Review & Authorize' },
  { route: '/confirmation', stepNum: '05', label: 'Confirmation' },
];

export const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentRoute,
    navigate,
    lastSavedAt,
    toastMessage,
    dismissToast,
    accessibilityPrefs,
    updateAccessibilityPrefs,
    resetDemoJourney,
  } = useCitizenJourney();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ label: string; route: RoutePath; matchRoutes?: RoutePath[] }> = [
    { label: 'Home', route: '/' },
    {
      label: 'Find a Pathway',
      route: '/discover',
      matchRoutes: ['/discover', '/recommendation', '/prepare', '/review', '/confirmation', '/alternatives'],
    },
    {
      label: 'My Journey',
      route: '/track',
      matchRoutes: ['/track', '/response'],
    },
    { label: 'How 2036 Works', route: '/how-it-works' },
    { label: 'Human Help', route: '/assistance' },
  ];

  const isFilingStep = FILING_STEPS.some((s) => s.route === currentRoute);
  const activeStepIndex = FILING_STEPS.findIndex((s) => s.route === currentRoute);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, route: RoutePath) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(route);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F172A] ${
        accessibilityPrefs.largeText ? 'text-[17px]' : 'text-base'
      }`}
    >
      {/* Top Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="text-lg font-bold tracking-tight text-[#0D2137] whitespace-nowrap shrink-0"
          >
            CPGRAMS 2036
          </a>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]"
          >
            {navItems.map((item) => {
              const isActive =
                currentRoute === item.route ||
                (item.matchRoutes && item.matchRoutes.includes(currentRoute));
              return (
                <a
                  key={item.route}
                  href={item.route}
                  onClick={(e) => handleNavClick(e, item.route)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                    isActive
                      ? 'text-[#0D2137] font-semibold border-[#1D4ED8]'
                      : 'border-transparent hover:text-[#0D2137] hover:border-[#CBD5E1]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + mobile menu toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/track')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <span>Active Case: DEMO-NSP-049218</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl border border-[#CBD5E1] text-[#0D2137] hover:bg-[#F4F5F7]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFFFF] border-b border-[#CBD5E1] px-4 pt-2 pb-4 space-y-2">
            <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive =
                  currentRoute === item.route ||
                  (item.matchRoutes && item.matchRoutes.includes(currentRoute));
                return (
                  <a
                    key={item.route}
                    href={item.route}
                    onClick={(e) => handleNavClick(e, item.route)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-[#F4F5F7] text-[#0D2137] font-semibold'
                        : 'text-[#475569] hover:bg-[#F4F5F7] hover:text-[#0D2137]'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
            <div className="pt-2 border-t border-[#E2E8F0] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/track');
                }}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#1D4ED8] rounded-xl hover:bg-[#1E3A8A] text-center"
              >
                Open Active Case (DEMO-NSP-049218)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  resetDemoJourney();
                }}
                className="w-full py-2 px-4 text-xs font-semibold text-[#0D2137] border border-[#CBD5E1] rounded-xl hover:bg-[#F4F5F7] text-center"
              >
                Reset Demo Journey
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sub-header Utility Strip: Product Promise, Prototype Disclosure & Demo Controls */}
      <div className="bg-[#F4F5F7] border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 py-2 flex flex-wrap items-center justify-between gap-4 text-xs text-[#475569]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#0D2137]">
              One issue. One journey. One accountable outcome.
            </span>
            <span aria-hidden="true">·</span>
            <span>Academic UX Prototype (Not an official Government service)</span>
            {lastSavedAt && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular text-[#059669]">{lastSavedAt}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                updateAccessibilityPrefs({
                  continueWithoutAI: !accessibilityPrefs.continueWithoutAI,
                })
              }
              className="hover:text-[#0D2137] underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              {accessibilityPrefs.continueWithoutAI ? 'AI Assistance: Off' : 'AI Assistance: On'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() =>
                updateAccessibilityPrefs({ largeText: !accessibilityPrefs.largeText })
              }
              className="hover:text-[#0D2137] underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              {accessibilityPrefs.largeText ? 'Standard Text' : 'Larger Text'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={resetDemoJourney}
              className="inline-flex items-center gap-1 font-medium text-[#1D4ED8] hover:text-[#0D2137] cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset demo</span>
            </button>
          </div>
        </div>

        {/* Stepper Bar when inside the 5-step resolution preparation flow */}
        {isFilingStep && (
          <div className="bg-[#FFFFFF] border-t border-[#E2E8F0]">
            <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 py-3">
              <nav aria-label="Grievance Preparation Steps">
                <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {FILING_STEPS.map((step, index) => {
                    const isCompleted = index < activeStepIndex;
                    const isCurrent = index === activeStepIndex;
                    return (
                      <li key={step.route}>
                        <button
                          type="button"
                          onClick={() => navigate(step.route)}
                          aria-current={isCurrent ? 'step' : undefined}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                            isCurrent
                              ? 'bg-[#FAF9F6] border-[#1D4ED8] text-[#0D2137] shadow-2xs'
                              : isCompleted
                              ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0D2137] hover:bg-[#F4F5F7]'
                              : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#64748B] hover:text-[#0D2137]'
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="block text-[11px] font-mono-tabular uppercase tracking-wider text-[#64748B]">
                              Step {step.stepNum}
                            </span>
                            <span className="block text-xs font-semibold truncate">
                              {step.label}
                            </span>
                          </div>
                          {isCompleted && (
                            <CheckCircle2
                              className="w-4 h-4 text-[#059669] shrink-0"
                              aria-label="Completed step"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-md bg-[#0D2137] text-white px-4 py-3 rounded-xl border border-[#1D4ED8] shadow-md flex items-center justify-between gap-4"
        >
          <span className="text-sm">{toastMessage}</span>
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            className="text-xs text-[#CBD5E1] hover:text-white px-2 py-1 rounded cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {children}
      </main>

      {/* Institutional Footer with All 10 Screens + 2036 Explainer */}
      <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] mt-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2 md:col-span-1">
              <p className="text-base font-bold text-[#0D2137]">CPGRAMS 2036</p>
              <p className="text-xs font-semibold text-[#1D4ED8]">
                “One issue. One journey. One accountable outcome.”
              </p>
              <p className="text-xs text-[#475569] leading-relaxed">
                Citizen Resolution Companion — An academic UX redesign prototype demonstrating
                citizen-first resolution without bureaucratic complexity.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0D2137]">
                Screens 01 – 05 (Intake &amp; Filing)
              </p>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li>
                  <a
                    href="/"
                    onClick={(e) => handleNavClick(e, '/')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    01. Resolution Home
                  </a>
                </li>
                <li>
                  <a
                    href="/discover"
                    onClick={(e) => handleNavClick(e, '/discover')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    02. Understand My Issue
                  </a>
                </li>
                <li>
                  <a
                    href="/recommendation"
                    onClick={(e) => handleNavClick(e, '/recommendation')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    03. Recommended Pathway
                  </a>
                </li>
                <li>
                  <a
                    href="/prepare"
                    onClick={(e) => handleNavClick(e, '/prepare')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    04. Prepare My Grievance
                  </a>
                </li>
                <li>
                  <a
                    href="/review"
                    onClick={(e) => handleNavClick(e, '/review')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    05. Review &amp; Authorize
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0D2137]">
                Screens 06 – 10 (Resolution &amp; Support)
              </p>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li>
                  <a
                    href="/confirmation"
                    onClick={(e) => handleNavClick(e, '/confirmation')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    06. Confirmation Receipt
                  </a>
                </li>
                <li>
                  <a
                    href="/track"
                    onClick={(e) => handleNavClick(e, '/track')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    07. My Resolution Journey
                  </a>
                </li>
                <li>
                  <a
                    href="/response"
                    onClick={(e) => handleNavClick(e, '/response')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    08. Understand the Response
                  </a>
                </li>
                <li>
                  <a
                    href="/alternatives"
                    onClick={(e) => handleNavClick(e, '/alternatives')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    09. Explore Alternatives
                  </a>
                </li>
                <li>
                  <a
                    href="/assistance"
                    onClick={(e) => handleNavClick(e, '/assistance')}
                    className="hover:text-[#0D2137] hover:underline"
                  >
                    10. Human Assistance
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0D2137]">
                2036 Architecture &amp; Controls
              </p>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li>
                  <a
                    href="/how-it-works"
                    onClick={(e) => handleNavClick(e, '/how-it-works')}
                    className="hover:text-[#0D2137] hover:underline font-medium text-[#1D4ED8]"
                  >
                    Signature Future Experience: How 2036 Works
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={resetDemoJourney}
                    className="hover:text-[#0D2137] hover:underline text-left cursor-pointer"
                  >
                    Reset Demo Case (DEMO-NSP-049218)
                  </button>
                </li>
                <li className="text-[#64748B] pt-1">
                  Browser-local persistence only. No real government affiliation or filing.
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" aria-hidden="true" />
              <span>
                Academic UX Redesign Prototype · Simulated Case DEMO-NSP-049218 · Not an official
                Government of India service.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Saved in local browser storage
              </span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => navigate('/assistance')}
                className="inline-flex items-center gap-1 text-[#0D2137] font-medium hover:underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                Human Help
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

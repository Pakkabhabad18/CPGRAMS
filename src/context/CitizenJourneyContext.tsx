import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  RoutePath,
  IssueCategory,
  DiscoveryAnswers,
  GrievanceDraft,
  PathwayRecommendation,
  DemoGrievanceCase,
  JourneyStageId,
  DEFAULT_SCHOLARSHIP_ISSUE,
  INITIAL_DISCOVERY_ANSWERS,
  createInitialDraftFromDiscovery,
  computePathwayRecommendation,
  createConsistentDemoCase,
} from '../utils/grievanceLogic';

const STORAGE_KEY = 'cpgrams_2036_citizen_state_v2';

export interface AccessibilityPrefs {
  largeText: boolean;
  simplifiedLanguage: boolean;
  continueWithoutAI: boolean;
  preferredLanguage: string;
}

export interface AgentAuthorizationState {
  allowDraftAssistance: boolean;
  allowResponsePlainLanguageSummary: boolean;
  permissionedDocumentRetrievalPreview: boolean;
}

interface StoredState {
  issueNarrative: string;
  selectedCategory: IssueCategory;
  discoveryAnswers: DiscoveryAnswers;
  grievanceDraft: GrievanceDraft;
  lastSavedAt: string | null;
  activeCase: DemoGrievanceCase;
  accessibilityPrefs: AccessibilityPrefs;
  agentAuthorization: AgentAuthorizationState;
}

interface CitizenJourneyContextValue extends StoredState {
  currentRoute: RoutePath;
  previousRoute: RoutePath;
  recommendation: PathwayRecommendation;
  toastMessage: string | null;
  navigate: (route: RoutePath) => void;
  goBack: (fallback?: RoutePath) => void;
  setIssueNarrative: (val: string) => void;
  setSelectedCategory: (cat: IssueCategory) => void;
  updateDiscoveryAnswers: (partial: Partial<DiscoveryAnswers>) => void;
  updateGrievanceDraft: (partial: Partial<GrievanceDraft>) => void;
  syncDraftFromDiscovery: () => void;
  saveDraftNow: (customMessage?: string) => void;
  submitDemoGrievance: () => DemoGrievanceCase;
  updateActiveCaseStage: (stageId: JourneyStageId) => void;
  resetDemoJourney: () => void;
  updateAccessibilityPrefs: (partial: Partial<AccessibilityPrefs>) => void;
  updateAgentAuthorization: (partial: Partial<AgentAuthorizationState>) => void;
  revokeAllAgentPermissions: () => void;
  showToast: (msg: string) => void;
  dismissToast: () => void;
}

const VALID_ROUTES: RoutePath[] = [
  '/',
  '/discover',
  '/recommendation',
  '/prepare',
  '/review',
  '/confirmation',
  '/track',
  '/response',
  '/alternatives',
  '/assistance',
  '/how-it-works',
];

const ROUTE_TITLES: Record<RoutePath, string> = {
  '/': 'Resolution Home — CPGRAMS 2036 Citizen Resolution Companion',
  '/discover': 'Understand My Issue — CPGRAMS 2036',
  '/recommendation': 'Your Next Best Step — CPGRAMS 2036',
  '/prepare': 'Prepare My Grievance — CPGRAMS 2036',
  '/review': 'Review & Authorize — CPGRAMS 2036',
  '/confirmation': 'Demo Case Ready — CPGRAMS 2036',
  '/track': 'My Resolution Journey — CPGRAMS 2036',
  '/response': 'Understand the Response — CPGRAMS 2036',
  '/alternatives': 'Explore Alternatives — CPGRAMS 2036',
  '/assistance': 'Human Assistance — CPGRAMS 2036',
  '/how-it-works': 'How It Works in 2036 — Agent-Ready Government',
};

function normalizePath(pathname: string): RoutePath {
  const cleaned = pathname.replace(/\/+$/, '') || '/';
  if (VALID_ROUTES.includes(cleaned as RoutePath)) {
    return cleaned as RoutePath;
  }
  return '/';
}

function getDefaultStoredState(): StoredState {
  const initialDraft = createInitialDraftFromDiscovery(
    DEFAULT_SCHOLARSHIP_ISSUE,
    INITIAL_DISCOVERY_ANSWERS
  );
  const initialRec = computePathwayRecommendation(
    DEFAULT_SCHOLARSHIP_ISSUE,
    INITIAL_DISCOVERY_ANSWERS
  );
  const demoCase = createConsistentDemoCase(
    initialDraft,
    initialRec,
    'awaiting-update'
  );

  return {
    issueNarrative: DEFAULT_SCHOLARSHIP_ISSUE,
    selectedCategory: 'delayed-payment',
    discoveryAnswers: INITIAL_DISCOVERY_ANSWERS,
    grievanceDraft: initialDraft,
    lastSavedAt: 'Saved locally in browser',
    activeCase: demoCase,
    accessibilityPrefs: {
      largeText: false,
      simplifiedLanguage: false,
      continueWithoutAI: false,
      preferredLanguage: 'English (Multilingual Companion Ready)',
    },
    agentAuthorization: {
      allowDraftAssistance: true,
      allowResponsePlainLanguageSummary: true,
      permissionedDocumentRetrievalPreview: false,
    },
  };
}

const CitizenJourneyContext = createContext<CitizenJourneyContextValue | null>(null);

export const CitizenJourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<RoutePath>(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/'
  );
  const [previousRoute, setPreviousRoute] = useState<RoutePath>('/');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [state, setState] = useState<StoredState>(() => {
    if (typeof window === 'undefined') return getDefaultStoredState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...getDefaultStoredState(), ...parsed };
      }
    } catch {
      // Fallback to default state
    }
    return getDefaultStoredState();
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    document.title = ROUTE_TITLES[currentRoute] || 'CPGRAMS 2036 — Citizen Resolution Companion';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentRoute]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const navigate = useCallback(
    (route: RoutePath) => {
      if (route !== currentRoute) {
        setPreviousRoute(currentRoute);
        window.history.pushState({}, '', route);
        setCurrentRoute(route);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [currentRoute]
  );

  const goBack = useCallback(
    (fallback: RoutePath = '/') => {
      if (previousRoute && previousRoute !== currentRoute) {
        const target = previousRoute;
        setPreviousRoute('/');
        window.history.pushState({}, '', target);
        setCurrentRoute(target);
      } else {
        window.history.pushState({}, '', fallback);
        setCurrentRoute(fallback);
      }
    },
    [previousRoute, currentRoute]
  );

  const recommendation = computePathwayRecommendation(
    state.issueNarrative,
    state.discoveryAnswers
  );

  const setIssueNarrative = useCallback((val: string) => {
    setState((prev) => ({
      ...prev,
      issueNarrative: val,
      grievanceDraft: {
        ...prev.grievanceDraft,
        citizenOriginalStatement: val,
      },
    }));
  }, []);

  const setSelectedCategory = useCallback((cat: IssueCategory) => {
    setState((prev) => ({ ...prev, selectedCategory: cat }));
  }, []);

  const updateDiscoveryAnswers = useCallback((partial: Partial<DiscoveryAnswers>) => {
    setState((prev) => ({
      ...prev,
      discoveryAnswers: { ...prev.discoveryAnswers, ...partial },
    }));
  }, []);

  const updateGrievanceDraft = useCallback((partial: Partial<GrievanceDraft>) => {
    setState((prev) => ({
      ...prev,
      grievanceDraft: { ...prev.grievanceDraft, ...partial },
    }));
  }, []);

  const syncDraftFromDiscovery = useCallback(() => {
    setState((prev) => {
      const updatedDraft = createInitialDraftFromDiscovery(
        prev.issueNarrative,
        prev.discoveryAnswers
      );
      return {
        ...prev,
        grievanceDraft: {
          ...updatedDraft,
          attachments: prev.grievanceDraft.attachments,
        },
      };
    });
  }, []);

  const saveDraftNow = useCallback(
    (customMessage?: string) => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const label = `Saved locally at ${timeStr}`;
      setState((prev) => ({ ...prev, lastSavedAt: label }));
      showToast(customMessage || `${label} (Browser-local demo storage).`);
    },
    [showToast]
  );

  const submitDemoGrievance = useCallback(() => {
    let createdCase!: DemoGrievanceCase;
    setState((prev) => {
      const rec = computePathwayRecommendation(
        prev.issueNarrative,
        prev.discoveryAnswers
      );
      createdCase = createConsistentDemoCase(
        prev.grievanceDraft,
        rec,
        'awaiting-update'
      );
      return {
        ...prev,
        activeCase: createdCase,
        lastSavedAt: 'Demo Case Authorized Locally',
      };
    });
    return createdCase;
  }, []);

  const updateActiveCaseStage = useCallback(
    (stageId: JourneyStageId) => {
      setState((prev) => ({
        ...prev,
        activeCase: {
          ...prev.activeCase,
          currentStageId: stageId,
          currentStatusLabel:
            stageId === 'sample-response-received'
              ? 'Sample Response Available — Action Needed (Demo)'
              : stageId === 'demo-authorized'
              ? 'Demo Authorization Completed'
              : 'Awaiting Illustrative Status Update (Demo)',
        },
      }));
      showToast('Updated interactive demo timeline stage.');
    },
    [showToast]
  );

  const resetDemoJourney = useCallback(() => {
    const fresh = getDefaultStoredState();
    setState(fresh);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore
    }
    window.history.pushState({}, '', '/');
    setCurrentRoute('/');
    showToast('Demo journey reset to initial scholarship scenario (DEMO-NSP-049218).');
  }, [showToast]);

  const updateAccessibilityPrefs = useCallback((partial: Partial<AccessibilityPrefs>) => {
    setState((prev) => ({
      ...prev,
      accessibilityPrefs: { ...prev.accessibilityPrefs, ...partial },
    }));
  }, []);

  const updateAgentAuthorization = useCallback((partial: Partial<AgentAuthorizationState>) => {
    setState((prev) => ({
      ...prev,
      agentAuthorization: { ...prev.agentAuthorization, ...partial },
    }));
  }, []);

  const revokeAllAgentPermissions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      accessibilityPrefs: {
        ...prev.accessibilityPrefs,
        continueWithoutAI: true,
      },
      agentAuthorization: {
        allowDraftAssistance: false,
        allowResponsePlainLanguageSummary: false,
        permissionedDocumentRetrievalPreview: false,
      },
    }));
    showToast('Switched to Direct Citizen Mode (AI assistance disabled).');
  }, [showToast]);

  const dismissToast = useCallback(() => setToastMessage(null), []);

  return (
    <CitizenJourneyContext.Provider
      value={{
        ...state,
        currentRoute,
        previousRoute,
        recommendation,
        toastMessage,
        navigate,
        goBack,
        setIssueNarrative,
        setSelectedCategory,
        updateDiscoveryAnswers,
        updateGrievanceDraft,
        syncDraftFromDiscovery,
        saveDraftNow,
        submitDemoGrievance,
        updateActiveCaseStage,
        resetDemoJourney,
        updateAccessibilityPrefs,
        updateAgentAuthorization,
        revokeAllAgentPermissions,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </CitizenJourneyContext.Provider>
  );
};

export function useCitizenJourney(): CitizenJourneyContextValue {
  const ctx = useContext(CitizenJourneyContext);
  if (!ctx) {
    throw new Error('useCitizenJourney must be used within CitizenJourneyProvider');
  }
  return ctx;
}

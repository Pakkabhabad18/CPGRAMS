export type RoutePath =
  | '/'
  | '/discover'
  | '/recommendation'
  | '/prepare'
  | '/review'
  | '/confirmation'
  | '/track'
  | '/response'
  | '/alternatives'
  | '/assistance'
  | '/how-it-works';

export type IssueCategory =
  | 'delayed-payment'
  | 'document-issue'
  | 'service-denied'
  | 'something-else';

export type JourneyStageId =
  | 'issue-understood'
  | 'recommended-pathway'
  | 'draft-reviewed'
  | 'demo-authorized'
  | 'awaiting-update'
  | 'sample-response-received';

export interface DiscoveryAnswers {
  schemeName: string;
  issueBeganWhen: string;
  currentPortalStatus: string;
  contactedService: 'yes-institution' | 'yes-portal' | 'no' | 'unsure' | '';
  referenceNumberValue: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  source: 'simulated-upload' | 'citizen-checklist';
  sizeLabel: string;
  statusNote: string;
}

export interface GrievanceDraft {
  title: string;
  citizenOriginalStatement: string;
  whatHappened: string;
  evidenceAvailable: string;
  requestedOutcome: string;
  aiAssistedSummary: string;
  schemeOrService: string;
  referenceNumber: string;
  attachments: AttachmentItem[];
  authorizationConfirmed: boolean;
}

export interface AlternativePathway {
  id: string;
  scenarioCategory:
    | 'Outside grievance scope'
    | 'Different responsible authority'
    | 'Direct service correction'
    | 'Additional information required';
  title: string;
  whyItMayHelp: string;
  eligibilityOrScopeUncertainty: string;
  whatToPrepare: string;
  redirectsToExternalService: boolean;
  externalServiceNote: string;
}

export interface PathwayRecommendation {
  headline: string;
  issueHeadline: string;
  recommendedPathwayTitle: string;
  potentialAuthorityIllustrative: string;
  recommendationBasis: string[];
  needsVerification: string[];
  whySuggested: string[];
  supportingInformation: string[];
  uncertainties: string[];
  whatHappensNext: string[];
  alternatives: AlternativePathway[];
}

export interface JourneyTimelineStep {
  id: JourneyStageId;
  title: string;
  state: 'completed' | 'current' | 'upcoming';
  timestampLabel: string;
  actorLabel: string;
  summary: string;
  detail: string;
}

export interface AuthoritativeEventSchema {
  eventLabel: string;
  source: string;
  timestamp: string;
  responsibleAuthority: string;
  verificationStatus: string;
}

export interface DemoGrievanceCase {
  referenceId: string;
  isSimulatedPrototype: true;
  createdAtLabel: string;
  lastUpdatedLabel: string;
  title: string;
  citizenOriginalStatement: string;
  aiAssistedSummary: string;
  whatHappened: string;
  evidenceAvailable: string;
  requestedOutcome: string;
  schemeOrService: string;
  illustrativeDestination: string;
  currentStageId: JourneyStageId;
  currentStatusLabel: string;
  currentResponsibleStepIllustrative: string;
  whatIsKnown: string[];
  whatIsNotYetKnown: string[];
  pendingCitizenActions: string[];
  suggestedNextAction: string;
  followUpPreparation: string[];
  attachments: AttachmentItem[];
  authoritativeEventExample: AuthoritativeEventSchema;
  sampleResponse: {
    demoBadge: string;
    referenceTag: string;
    dateLabel: string;
    issuingAuthorityIllustrative: string;
    administrativeStatusLabel: string;
    substantiveOutcomeStatus: string;
    officialText: string;
    plainLanguageExplanation: string;
    whatIsResolved: string[];
    whatRemainsUnresolved: string[];
    wasRequestedOutcomeAchieved: {
      achieved: boolean;
      headline: string;
      explanation: string;
    };
    followUpOptions: Array<{
      id: string;
      title: string;
      description: string;
      ruleCondition: string;
      targetRoute: RoutePath;
    }>;
  };
}

export const DEMO_REFERENCE_ID = 'DEMO-NSP-049218';

export const DEFAULT_CASE_TITLE = 'Delayed scholarship disbursement despite verification.';

export const DEFAULT_SCHOLARSHIP_ISSUE =
  "My scholarship payment hasn't arrived, even after several months.";

export const INITIAL_DISCOVERY_ANSWERS: DiscoveryAnswers = {
  schemeName: 'Post-Matric Scholarship Scheme (National Scholarship Portal)',
  issueBeganWhen: 'About 4 months ago (June 2036)',
  currentPortalStatus: 'Application verified by institute; disbursement pending',
  contactedService: 'yes-institution',
  referenceNumberValue: 'DEMO-NSP-049218',
};

export const JOURNEY_STAGES_ORDER: JourneyStageId[] = [
  'issue-understood',
  'recommended-pathway',
  'draft-reviewed',
  'demo-authorized',
  'awaiting-update',
  'sample-response-received',
];

export function detectSensitivePersonalData(text: string): string[] {
  const warnings: string[] = [];
  if (!text) return warnings;

  const aadhaarRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/;
  if (aadhaarRegex.test(text)) {
    warnings.push(
      'Please remove any 12-digit Aadhaar number. CPGRAMS 2036 never requires Aadhaar numbers in descriptions.'
    );
  }

  const otpOrPassRegex = /\b(otp|password|pin|cvv)\s*[:=-]?\s*\d{3,8}\b/i;
  if (otpOrPassRegex.test(text)) {
    warnings.push('Never include OTPs, passwords, PINs, or CVV codes.');
  }

  const bankAcctRegex = /\b(account\s*no|a\/c\s*no|iban|ifsc)\b.*?\b\d{9,18}\b/i;
  if (bankAcctRegex.test(text)) {
    warnings.push(
      'Avoid entering full bank account numbers. Only your demo application reference ID is needed.'
    );
  }

  return warnings;
}

export function computeUnderstandingSummary(
  issueNarrative: string,
  discovery: DiscoveryAnswers
): {
  understoodFacts: Array<{ label: string; value: string }>;
  missingInformation: string[];
} {
  const understoodFacts: Array<{ label: string; value: string }> = [
    {
      label: 'Core issue',
      value: issueNarrative.trim() || DEFAULT_SCHOLARSHIP_ISSUE,
    },
  ];

  const missingInformation: string[] = [];

  if (discovery.schemeName.trim() && discovery.schemeName !== "I'm not sure") {
    understoodFacts.push({ label: 'Scheme / service', value: discovery.schemeName.trim() });
  } else {
    missingInformation.push('Specific scholarship scheme name (helps verify Central vs. State nodal cell)');
  }

  if (discovery.issueBeganWhen.trim()) {
    understoodFacts.push({ label: 'When issue began', value: discovery.issueBeganWhen.trim() });
  } else {
    missingInformation.push('Approximate month when institutional verification was completed');
  }

  if (discovery.currentPortalStatus.trim()) {
    understoodFacts.push({ label: 'Current status seen', value: discovery.currentPortalStatus.trim() });
  } else {
    missingInformation.push('Current status text shown on your scholarship portal dashboard');
  }

  if (discovery.contactedService) {
    const contactMap: Record<string, string> = {
      'yes-institution': 'Contacted institute nodal officer',
      'yes-portal': 'Contacted scholarship portal helpdesk',
      no: 'Has not yet contacted service provider',
      unsure: 'Unsure which office was contacted',
    };
    understoodFacts.push({
      label: 'Prior follow-up',
      value: contactMap[discovery.contactedService] || 'Not specified',
    });
  } else {
    missingInformation.push('Whether your institute nodal officer has already verified the application');
  }

  return { understoodFacts, missingInformation };
}

export function createInitialDraftFromDiscovery(
  issueNarrative: string,
  discovery: DiscoveryAnswers
): GrievanceDraft {
  const cleanNarrative = issueNarrative.trim() || DEFAULT_SCHOLARSHIP_ISSUE;
  const scheme =
    discovery.schemeName.trim() && discovery.schemeName !== "I'm not sure"
      ? discovery.schemeName.trim()
      : 'Post-Matric Scholarship Scheme (Illustrative)';
  const refNum = discovery.referenceNumberValue.trim() || DEMO_REFERENCE_ID;

  const whatHappened = `${cleanNarrative} My application (${refNum}) under ${scheme} was verified at the institution level (${discovery.issueBeganWhen || 'several months ago'}), and the portal currently shows: "${discovery.currentPortalStatus || 'Verified by institute; disbursement pending'}".`;

  const evidenceAvailable =
    '1. Scholarship Application Verification Receipt (DEMO-NSP-049218)\n2. Portal status snapshot showing institutional verification completed.';

  const requestedOutcome =
    'Provide the specific reason for the payment disbursement hold and confirm what step or verification is required to release the pending scholarship installment.';

  const aiAssistedSummary = `Applicant reports a delayed scholarship disbursement (${refNum}) under ${scheme}. Institutional verification was completed (${discovery.issueBeganWhen || '4 months ago'}), with portal status showing "${discovery.currentPortalStatus || 'Verified, disbursement pending'}". Applicant requests a trace of the payment batch hold and clear instructions for any required action.`;

  return {
    title: DEFAULT_CASE_TITLE,
    citizenOriginalStatement: cleanNarrative,
    whatHappened,
    evidenceAvailable,
    requestedOutcome,
    aiAssistedSummary,
    schemeOrService: scheme,
    referenceNumber: refNum,
    attachments: [
      {
        id: 'att-1',
        name: 'Institute_Verification_Slip_DEMO-NSP-049218.pdf',
        source: 'simulated-upload',
        sizeLabel: '184 KB',
        statusNote: 'Simulated upload — Demo metadata only',
      },
    ],
    authorizationConfirmed: false,
  };
}

export function computePathwayRecommendation(
  issueNarrative: string,
  discovery: DiscoveryAnswers
): PathwayRecommendation {
  const schemeKnown =
    Boolean(discovery.schemeName.trim()) &&
    discovery.schemeName.trim().toLowerCase() !== "i'm not sure";

  return {
    headline: 'Your next best step',
    issueHeadline: 'Scholarship disbursement delayed after institute verification.',
    recommendedPathwayTitle: 'File a Structured Disbursement Trace with the Scholarship Nodal Cell',
    potentialAuthorityIllustrative: schemeKnown
      ? `Illustrative Authority: Central/State Scholarship Disbursement Nodal Desk — ${discovery.schemeName}`
      : 'Illustrative Authority: Public Scholarship Disbursement Nodal Desk (Subject to scheme verification)',
    recommendationBasis: [
      'Institutional verification is already marked complete',
      `Timeline exceeds standard processing window (${discovery.issueBeganWhen || '4+ months'})`,
      `Reference ID (${discovery.referenceNumberValue || DEMO_REFERENCE_ID}) is available for batch tracing`,
    ],
    needsVerification: [
      'Central Ministry vs. State Directorate funding split',
      'Direct Benefit Transfer (DBT / NPCI) bank account mapper status',
    ],
    whySuggested: [
      'Because your college has already verified the application, the bottleneck lies in the post-verification sanction queue or banking settlement gateway.',
      'A structured disbursement trace prompts the nodal cell to inspect the payment batch log rather than returning the query to your college.',
    ],
    supportingInformation: [
      `Stated issue: "${issueNarrative.trim() || DEFAULT_SCHOLARSHIP_ISSUE}"`,
      `Portal status reported: "${discovery.currentPortalStatus || 'Verified by institute; disbursement pending'}"`,
      `Demo Reference ID: ${discovery.referenceNumberValue || DEMO_REFERENCE_ID}`,
    ],
    uncertainties: [
      'Whether the hold is caused by pending departmental sanction release or a bank-side NPCI/DBT seeding mismatch.',
      'Exact jurisdiction between Central and State nodal authorities until official scheme records are matched.',
    ],
    whatHappensNext: [
      'You review and edit a 3-part structured draft (What happened, Evidence, Requested outcome).',
      'You explicitly authorize creating the demo record—the AI assistant never submits on its own.',
      'You track each stage and receive a plain-language breakdown separating administrative closure from actual payment resolution.',
    ],
    alternatives: [
      {
        id: 'alt-direct-bank',
        scenarioCategory: 'Direct service correction',
        title: 'Direct Bank / NPCI DBT Seeding Check',
        whyItMayHelp:
          'Many post-verification scholarship holds occur because the citizen’s bank account is inactive or unseeded on the NPCI Direct Benefit Transfer mapper.',
        eligibilityOrScopeUncertainty:
          'A grievance officer cannot modify your bank account linkage; only your bank branch can update NPCI mapper seeding.',
        whatToPrepare:
          'Bring your application ID (DEMO-NSP-049218) and bank passbook to your branch and ask to verify active DBT seeding status.',
        redirectsToExternalService: true,
        externalServiceNote:
          'Redirects outside grievance filing to banking self-service / branch verification (Conceptual).',
      },
      {
        id: 'alt-state-authority',
        scenarioCategory: 'Different responsible authority',
        title: 'State Higher Education / Social Welfare Directorate Route',
        whyItMayHelp:
          'If your scholarship is funded and disbursed directly by a State Government portal rather than a Central Ministry, routing directly to the State Directorate avoids cross-portal transfer delays.',
        eligibilityOrScopeUncertainty:
          'Depends on whether your specific scheme is a Centrally Sponsored Scheme or an exclusive State Scheme.',
        whatToPrepare:
          'Your state domicile certificate reference and district nodal verification acknowledgment.',
        redirectsToExternalService: false,
        externalServiceNote:
          'Can be prepared using the same structured summary packet.',
      },
      {
        id: 'alt-institute-correction',
        scenarioCategory: 'Additional information required',
        title: 'Institutional Nodal Officer Re-Verification Request',
        whyItMayHelp:
          'Appropriate if your portal status shows "Defective" or "Pending at Institute Level" rather than "Verified".',
        eligibilityOrScopeUncertainty:
          'Central grievance desks typically close cases that have not yet completed Level-1 college verification.',
        whatToPrepare:
          'Bonafide student certificate, fee receipt, and previous semester mark sheet.',
        redirectsToExternalService: false,
        externalServiceNote:
          'Handled directly at your college or university scholarship desk.',
      },
      {
        id: 'alt-outside-scope',
        scenarioCategory: 'Outside grievance scope',
        title: 'Fresh Application or Missed Deadline Appeal Window',
        whyItMayHelp:
          'If an application was never submitted before the statutory scheme closing date, standard grievance redress cannot override scheme cut-off rules.',
        eligibilityOrScopeUncertainty:
          'Requires an official scheme extension notice from the administering department.',
        whatToPrepare:
          'Proof of technical portal outage if submission failed on the final deadline date.',
        redirectsToExternalService: true,
        externalServiceNote:
          'Handled via scheme portal notice board rather than individual grievance redress.',
      },
    ],
  };
}

export function improveGrievanceDraftParts(
  draft: GrievanceDraft,
  discovery: DiscoveryAnswers
): {
  whatHappened: string;
  evidenceAvailable: string;
  requestedOutcome: string;
  aiAssistedSummary: string;
  changesNote: string;
} {
  const ref = draft.referenceNumber.trim() || DEMO_REFERENCE_ID;
  const scheme = draft.schemeOrService.trim() || discovery.schemeName;

  const whatHappened = `My scholarship payment under ${scheme} (Application Reference: ${ref}) has been delayed for ${discovery.issueBeganWhen || 'several months'}. Institutional verification was completed, and my portal dashboard currently shows "${discovery.currentPortalStatus || 'Verified by institute; disbursement pending'}", but no payment batch has been released.`;

  const evidenceAvailable =
    draft.evidenceAvailable.trim() ||
    `1. Application Reference ID: ${ref}\n2. Institutional verification confirmation slip\n3. Current portal status message`;

  const requestedOutcome =
    '1. Identify the specific bottleneck holding disbursement (sanction queue vs. bank/DBT mapper status).\n2. Provide a clear action step or re-initiation timeline so the scholarship payment can be completed.';

  const aiAssistedSummary = `Structured Disbursement Trace (${ref}): Post-Matric Scholarship verified at institute level (${discovery.issueBeganWhen || '4 months ago'}); awaiting payment batch release or DBT mapper clarification.`;

  return {
    whatHappened,
    evidenceAvailable,
    requestedOutcome,
    aiAssistedSummary,
    changesNote:
      'Refined your 3-part draft into clear, concise civic points while keeping your original citizen statement intact.',
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof GrievanceDraft, string>>;
  piiWarnings: string[];
  suggestedMissingInfo: string[];
}

export function validateGrievanceDraft(draft: GrievanceDraft): ValidationResult {
  const errors: Partial<Record<keyof GrievanceDraft, string>> = {};

  if (!draft.title || draft.title.trim().length < 6) {
    errors.title = 'Please enter a clear grievance title (at least 6 characters).';
  }
  if (!draft.whatHappened || draft.whatHappened.trim().length < 20) {
    errors.whatHappened = 'Please describe what happened in at least 20 characters.';
  }
  if (!draft.requestedOutcome || draft.requestedOutcome.trim().length < 10) {
    errors.requestedOutcome = 'Please state the outcome or clarification you are requesting.';
  }

  const combined = `${draft.title} ${draft.whatHappened} ${draft.evidenceAvailable} ${draft.requestedOutcome} ${draft.citizenOriginalStatement}`;
  const piiWarnings = detectSensitivePersonalData(combined);

  const suggestedMissingInfo: string[] = [];
  if (!draft.whatHappened.toLowerCase().includes('demo-nsp') && !draft.referenceNumber.trim()) {
    suggestedMissingInfo.push('Include your application reference ID (e.g., DEMO-NSP-049218)');
  }
  if (draft.attachments.length === 0) {
    suggestedMissingInfo.push('Consider attaching your verification slip (simulated upload available)');
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    piiWarnings,
    suggestedMissingInfo,
  };
}

export function buildJourneyTimeline(activeStageId: JourneyStageId): JourneyTimelineStep[] {
  const activeIdx = JOURNEY_STAGES_ORDER.indexOf(activeStageId);

  const steps: Array<Omit<JourneyTimelineStep, 'state'>> = [
    {
      id: 'issue-understood',
      title: 'Issue understood',
      timestampLabel: '31 Oct 2036 · 09:30 IST (Demo)',
      actorLabel: 'Citizen + Companion Intake',
      summary: 'Captured delayed scholarship issue and verified institute-level completion.',
      detail:
        'Identified Post-Matric Scholarship case (DEMO-NSP-049218) delayed 4 months after college verification.',
    },
    {
      id: 'recommended-pathway',
      title: 'Recommended pathway',
      timestampLabel: '31 Oct 2036 · 09:34 IST (Demo)',
      actorLabel: 'Pathway Routing Guidance',
      summary: 'Matched to Illustrative Scholarship Disbursement Nodal Desk.',
      detail:
        'Flagged Central/State funding split and DBT bank mapper status as items requiring official verification.',
    },
    {
      id: 'draft-reviewed',
      title: 'Draft reviewed',
      timestampLabel: '31 Oct 2036 · 09:38 IST (Demo)',
      actorLabel: 'Citizen Review',
      summary: 'Structured 3-part grievance prepared alongside preserved citizen statement.',
      detail:
        'Included What Happened, Available Evidence (DEMO-NSP-049218), and Specific Requested Outcome.',
    },
    {
      id: 'demo-authorized',
      title: 'Demo authorization completed',
      timestampLabel: '31 Oct 2036 · 09:42 IST (Demo)',
      actorLabel: 'Explicit Citizen Consent',
      summary: 'Citizen explicitly authorized demo record creation (DEMO-NSP-049218).',
      detail:
        'Simulated prototype receipt issued locally. No real government portal was contacted.',
    },
    {
      id: 'awaiting-update',
      title: 'Awaiting illustrative status update',
      timestampLabel: 'Simulated Stage · Demo Queue',
      actorLabel: 'Illustrative Nodal Desk',
      summary: 'Batch trace & PFMS/DBT settlement mapper inspection stage.',
      detail:
        'In a live deployment, the nodal officer checks whether payment failed due to bank seeding or pending sanction.',
    },
    {
      id: 'sample-response-received',
      title: 'Sample response available for comprehension',
      timestampLabel: 'Simulated Stage · Demo Response',
      actorLabel: 'Response Comprehension Companion',
      summary: 'Illustrative departmental note posted — requires citizen action at bank.',
      detail:
        'Administrative note explains a DBT bank mapper hold. Substantive resolution remains pending until payment arrives.',
    },
  ];

  return steps.map((step, index) => {
    let state: 'completed' | 'current' | 'upcoming' = 'upcoming';
    if (index < activeIdx) state = 'completed';
    else if (index === activeIdx) state = 'current';
    return { ...step, state };
  });
}

export function createConsistentDemoCase(
  draft: GrievanceDraft,
  recommendation: PathwayRecommendation,
  stageId: JourneyStageId = 'awaiting-update'
): DemoGrievanceCase {
  return {
    referenceId: DEMO_REFERENCE_ID,
    isSimulatedPrototype: true,
    createdAtLabel: '31 Oct 2036 · 09:42 IST (Simulated Demo Time)',
    lastUpdatedLabel: '31 Oct 2036 · 10:30 IST (Simulated Demo Update)',
    title: draft.title.trim() || DEFAULT_CASE_TITLE,
    citizenOriginalStatement: draft.citizenOriginalStatement || DEFAULT_SCHOLARSHIP_ISSUE,
    aiAssistedSummary: draft.aiAssistedSummary,
    whatHappened: draft.whatHappened,
    evidenceAvailable: draft.evidenceAvailable,
    requestedOutcome: draft.requestedOutcome,
    schemeOrService: draft.schemeOrService,
    illustrativeDestination: recommendation.potentialAuthorityIllustrative,
    currentStageId: stageId,
    currentStatusLabel:
      stageId === 'sample-response-received'
        ? 'Sample Response Received — Action Needed (Demo)'
        : 'Awaiting Illustrative Status Update (Demo)',
    currentResponsibleStepIllustrative:
      'Illustrative Scholarship Disbursement Nodal Desk — Batch & DBT Mapper Trace',
    whatIsKnown: [
      'Your college/institution completed Level-1 application verification 4 months ago.',
      'Your structured demo case (DEMO-NSP-049218) includes the reference ID and requested outcome.',
      'The illustrative response identifies an NPCI / Direct Benefit Transfer (DBT) bank mapper hold.',
    ],
    whatIsNotYetKnown: [
      'The exact date when the next payment re-initiation batch will execute after bank seeding.',
      'Whether your bank branch has already updated the NPCI mapper in the current settlement cycle.',
    ],
    pendingCitizenActions: [
      'Inspect the sample response breakdown on the "Understand the Response" screen.',
      'Verify active Aadhaar-DBT seeding status with your bank branch using your reference ID.',
    ],
    suggestedNextAction:
      'Review the sample departmental response in plain language to see what was resolved and what still requires action.',
    followUpPreparation: [
      'Keep demo reference DEMO-NSP-049218 and your bank passbook ready when visiting your bank branch.',
      'Once your bank confirms active NPCI mapper seeding, record the confirmation date for follow-up if payment does not arrive.',
    ],
    attachments: draft.attachments,
    authoritativeEventExample: {
      eventLabel: 'Future Authoritative Event Schema (Conceptual Preview)',
      source: 'Signed Nodal Gateway Event · API Setu / Public Grievance Ledger (Conceptual)',
      timestamp: '2036-10-31T10:30:00+05:30 (Illustrative ISO-8601)',
      responsibleAuthority: 'Illustrative Scholarship Disbursement Nodal Cell (Unit #NSP-04)',
      verificationStatus: 'Cryptographically Signed Receipt · Citizen-Verifiable (Concept Only)',
    },
    sampleResponse: {
      demoBadge: 'DEMO SAMPLE RESPONSE — NOT AN OFFICIAL GOVERNMENT COMMUNICATION',
      referenceTag: `${DEMO_REFERENCE_ID} / NODAL-REPLY-SIM`,
      dateLabel: '31 Oct 2036 · Simulated Record',
      issuingAuthorityIllustrative:
        'Illustrative Scholarship Disbursement Nodal Cell (Prototype Simulation)',
      administrativeStatusLabel: 'Administratively Answered (Action Advised)',
      substantiveOutcomeStatus: 'Substantive Outcome Pending (Payment Not Yet Credited)',
      officialText:
        'Reference grievance DEMO-NSP-049218: Verification records confirm that Institutional Verification (Level-1) and State Nodal Verification (Level-2) are approved. However, payment instruction under Batch #DBT-2036-Q3 could not be settled due to "NPCI Mapper Status: Inactive / Unseeded Account" returned by the public financial management gateway. The applicant is advised to seed their bank account for Direct Benefit Transfer (DBT) at their home branch. Case is marked disposed with advisory.',
      plainLanguageExplanation:
        'Your scholarship eligibility and college verification are completely fine. However, when the system tried to send your money, the banking network blocked the transfer because your bank account is not marked as active for Direct Benefit Transfers (DBT). Even though the department marked this query as "answered", your money has NOT been paid yet.',
      whatIsResolved: [
        'Confirmed that your college and state nodal verifications are approved (no eligibility defect).',
        'Identified the exact technical reason the payment stopped (NPCI/DBT bank mapper inactive).',
      ],
      whatRemainsUnresolved: [
        'Your scholarship funds have not yet arrived in your bank account.',
        'The response does not provide a specific date for when the payment will be retried after you visit your bank.',
      ],
      wasRequestedOutcomeAchieved: {
        achieved: false,
        headline: 'Partially — Cause identified, but payment is not yet received',
        explanation:
          'CPGRAMS 2036 never equates administrative closure ("Case Disposed with Advisory") with substantive resolution. Your issue is only truly resolved when the scholarship funds are credited.',
      },
      followUpOptions: [
        {
          id: 'followup-bank',
          title: 'Complete DBT Bank Seeding & Log Follow-up Readiness',
          description:
            'Visit your bank branch to activate NPCI/DBT mapper seeding, then keep this case open in your companion tracker until payment is credited.',
          ruleCondition: 'Subject to banking gateway settlement cycle (typically 7–15 working days)',
          targetRoute: '/track',
        },
        {
          id: 'followup-alternatives',
          title: 'Request Re-Initiation If Bank Seeding Was Already Active',
          description:
            'If your bank confirms DBT seeding was already active before Batch #DBT-2036-Q3, explore a targeted re-verification pathway.',
          ruleCondition: 'Subject to official nodal appeal & re-initiation rules',
          targetRoute: '/alternatives',
        },
        {
          id: 'followup-human',
          title: 'Prepare Case Packet for Human Assisted Support',
          description:
            'Generate a one-page plain-language summary packet to take to an assisted facilitation centre or nodal helpdesk.',
          ruleCondition: 'Available at any stage without AI dependency',
          targetRoute: '/assistance',
        },
      ],
    },
  };
}

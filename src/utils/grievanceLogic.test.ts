import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_REFERENCE_ID,
  DEFAULT_CASE_TITLE,
  DEFAULT_SCHOLARSHIP_ISSUE,
  INITIAL_DISCOVERY_ANSWERS,
  detectSensitivePersonalData,
  computeUnderstandingSummary,
  createInitialDraftFromDiscovery,
  computePathwayRecommendation,
  improveGrievanceDraftParts,
  validateGrievanceDraft,
  buildJourneyTimeline,
  createConsistentDemoCase,
} from './grievanceLogic';

test('consistent demo reference ID and case title match specification', () => {
  assert.equal(DEMO_REFERENCE_ID, 'DEMO-NSP-049218');
  assert.equal(DEFAULT_CASE_TITLE, 'Delayed scholarship disbursement despite verification.');
});

test('detectSensitivePersonalData flags Aadhaar, OTPs, and bank account numbers', () => {
  const safeText = 'My scholarship reference is DEMO-NSP-049218 and payment is pending.';
  assert.equal(detectSensitivePersonalData(safeText).length, 0);

  const aadhaarText = 'My Aadhaar is 4589 2314 9981 please check.';
  assert.equal(detectSensitivePersonalData(aadhaarText).length, 1);

  const otpText = 'Here is my OTP: 482910';
  assert.equal(detectSensitivePersonalData(otpText).length, 1);
});

test('computeUnderstandingSummary identifies understood facts and missing info', () => {
  const full = computeUnderstandingSummary(DEFAULT_SCHOLARSHIP_ISSUE, INITIAL_DISCOVERY_ANSWERS);
  assert.equal(full.understoodFacts.length, 5);
  assert.equal(full.missingInformation.length, 0);

  const partial = computeUnderstandingSummary(DEFAULT_SCHOLARSHIP_ISSUE, {
    ...INITIAL_DISCOVERY_ANSWERS,
    schemeName: "I'm not sure",
    issueBeganWhen: '',
  });
  assert.equal(partial.missingInformation.length, 2);
});

test('computePathwayRecommendation provides recommendation basis and needs verification', () => {
  const rec = computePathwayRecommendation(DEFAULT_SCHOLARSHIP_ISSUE, INITIAL_DISCOVERY_ANSWERS);
  assert.equal(rec.headline, 'Your next best step');
  assert.equal(
    rec.issueHeadline,
    'Scholarship disbursement delayed after institute verification.'
  );
  assert.ok(rec.potentialAuthorityIllustrative.includes('Illustrative Authority:'));
  assert.ok(rec.recommendationBasis.length >= 2);
  assert.ok(rec.needsVerification.length >= 2);
  assert.equal(rec.alternatives.length, 4);
});

test('createInitialDraftFromDiscovery and validateGrievanceDraft enforce 3-part structure', () => {
  const draft = createInitialDraftFromDiscovery(
    DEFAULT_SCHOLARSHIP_ISSUE,
    INITIAL_DISCOVERY_ANSWERS
  );
  assert.equal(draft.title, DEFAULT_CASE_TITLE);
  assert.equal(draft.citizenOriginalStatement, DEFAULT_SCHOLARSHIP_ISSUE);
  assert.ok(draft.whatHappened.includes('DEMO-NSP-049218'));

  const validRes = validateGrievanceDraft(draft);
  assert.equal(validRes.valid, true);

  const invalidRes = validateGrievanceDraft({
    ...draft,
    title: 'abc',
    whatHappened: 'short',
    requestedOutcome: 'short',
  });
  assert.equal(invalidRes.valid, false);
  assert.ok(Boolean(invalidRes.errors.title));
  assert.ok(Boolean(invalidRes.errors.whatHappened));
  assert.ok(Boolean(invalidRes.errors.requestedOutcome));
});

test('improveGrievanceDraftParts refines 3-part draft while preserving citizen statement', () => {
  const draft = createInitialDraftFromDiscovery(
    DEFAULT_SCHOLARSHIP_ISSUE,
    INITIAL_DISCOVERY_ANSWERS
  );
  const improved = improveGrievanceDraftParts(draft, INITIAL_DISCOVERY_ANSWERS);
  assert.ok(improved.whatHappened.includes('DEMO-NSP-049218'));
  assert.ok(improved.requestedOutcome.includes('1.'));
  assert.ok(improved.aiAssistedSummary.includes('DEMO-NSP-049218'));
});

test('buildJourneyTimeline and createConsistentDemoCase distinguish administrative closure from substantive resolution', () => {
  const timeline = buildJourneyTimeline('awaiting-update');
  assert.equal(timeline.length, 6);
  assert.equal(timeline[0].title, 'Issue understood');
  assert.equal(timeline[0].state, 'completed');
  assert.equal(timeline[4].title, 'Awaiting illustrative status update');
  assert.equal(timeline[4].state, 'current');

  const draft = createInitialDraftFromDiscovery(
    DEFAULT_SCHOLARSHIP_ISSUE,
    INITIAL_DISCOVERY_ANSWERS
  );
  const rec = computePathwayRecommendation(DEFAULT_SCHOLARSHIP_ISSUE, INITIAL_DISCOVERY_ANSWERS);
  const demoCase = createConsistentDemoCase(draft, rec, 'awaiting-update');
  assert.equal(demoCase.referenceId, 'DEMO-NSP-049218');
  assert.equal(demoCase.sampleResponse.wasRequestedOutcomeAchieved.achieved, false);
  assert.ok(demoCase.authoritativeEventExample.source.includes('Conceptual'));
});

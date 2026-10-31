/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CitizenJourneyProvider, useCitizenJourney } from './context/CitizenJourneyContext';
import { LayoutShell } from './components/LayoutShell';
import { HomeScreen } from './screens/HomeScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { RecommendationScreen } from './screens/RecommendationScreen';
import { PrepareScreen } from './screens/PrepareScreen';
import { ReviewScreen } from './screens/ReviewScreen';
import { ConfirmationScreen } from './screens/ConfirmationScreen';
import { TrackScreen } from './screens/TrackScreen';
import { ResponseScreen } from './screens/ResponseScreen';
import { AlternativesScreen } from './screens/AlternativesScreen';
import { AssistanceScreen } from './screens/AssistanceScreen';
import { HowItWorksScreen } from './screens/HowItWorksScreen';

const RouteViewport: React.FC = () => {
  const { currentRoute } = useCitizenJourney();

  switch (currentRoute) {
    case '/':
      return <HomeScreen />;
    case '/discover':
      return <DiscoverScreen />;
    case '/recommendation':
      return <RecommendationScreen />;
    case '/prepare':
      return <PrepareScreen />;
    case '/review':
      return <ReviewScreen />;
    case '/confirmation':
      return <ConfirmationScreen />;
    case '/track':
      return <TrackScreen />;
    case '/response':
      return <ResponseScreen />;
    case '/alternatives':
      return <AlternativesScreen />;
    case '/assistance':
      return <AssistanceScreen />;
    case '/how-it-works':
      return <HowItWorksScreen />;
    default:
      return <HomeScreen />;
  }
};

export default function App() {
  return (
    <CitizenJourneyProvider>
      <LayoutShell>
        <RouteViewport />
      </LayoutShell>
    </CitizenJourneyProvider>
  );
}

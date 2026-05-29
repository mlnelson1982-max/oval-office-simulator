import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import CharacterSelection from './components/CharacterSelection';
import CharacterCreator from './components/CharacterCreator';
import CabinetSelection from './components/CabinetSelection';
import Dashboard from './components/Dashboard';
import Cabinet from './components/Cabinet';
import Congress from './components/Congress';
import WarRoom from './components/WarRoom';
import Factions from './components/Factions';
import EventModal from './components/EventModal';
import ElectionSummary from './components/ElectionSummary';
import { Activity, Sliders, Landmark, Users, Flag, Shield } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';

export default function App() {
  const {
    selectedPresident,
    presidentName,
    customAvatar,
    treasurySec,
    stateSec,
    defenseSec,
    turn,
    politicalCapital,
    gdpGrowth,
    debt,
    gdp,
    revenue,
    spending,
    security,
    welfare,
    approval,
    policies,
    proposedBill,
    factions,
    congress,
    activeEvent,
    history,
    gameOver,
    electionResults,
    warEscalation,
    defcon,
    militaryReadiness,
    marketIndex,
    marketChange,
    countries,
    alliesSupport,
    rivalAggression,
    isAtWar,
    warProgress,
    turnNotification,
    selectPresident,
    setCustomAvatar,
    appointCabinet,
    proposeBillToCongress,
    lobbyParty,
    voteOnProposedBill,
    interactWithCountry,
    runMilitaryAction,
    declareWar,
    resolveCrisis,
    advanceTurn,
    resetGame,
    setPolicies
  } = useGameState();

  const [welcomeSeen, setWelcomeSeen] = useState(false);
  const [avatarCustomized, setAvatarCustomized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'cabinet' | 'congress' | 'warRoom' | 'factions'

  const handleReset = () => {
    setWelcomeSeen(false);
    setAvatarCustomized(false);
    resetGame();
  };

  // Tab content switching
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            selectedPresident={selectedPresident}
            presidentName={presidentName}
            customAvatar={customAvatar}
            turn={turn}
            politicalCapital={politicalCapital}
            gdpGrowth={gdpGrowth}
            debt={debt}
            gdp={gdp}
            revenue={revenue}
            spending={spending}
            security={security}
            welfare={welfare}
            approval={approval}
            history={history}
            advanceTurn={advanceTurn}
            marketIndex={marketIndex}
            marketChange={marketChange}
            turnNotification={turnNotification}
          />
        );
      case 'cabinet':
        return (
          <Cabinet
            policies={policies}
            politicalCapital={politicalCapital}
            proposedBill={proposedBill}
            proposeBillToCongress={proposeBillToCongress}
            setPolicies={setPolicies}
            factions={factions}
          />
        );
      case 'congress':
        return (
          <Congress
            politicalCapital={politicalCapital}
            congress={congress}
            proposedBill={proposedBill}
            lobbyParty={lobbyParty}
            voteOnProposedBill={voteOnProposedBill}
            factions={factions}
          />
        );
      case 'warRoom':
        return (
          <WarRoom
            politicalCapital={politicalCapital}
            warEscalation={warEscalation}
            defcon={defcon}
            militaryReadiness={militaryReadiness}
            runMilitaryAction={runMilitaryAction}
            countries={countries}
            alliesSupport={alliesSupport}
            rivalAggression={rivalAggression}
            isAtWar={isAtWar}
            warProgress={warProgress}
            declareWar={declareWar}
            interactWithCountry={interactWithCountry}
          />
        );
      case 'factions':
        return (
          <Factions
            factions={factions}
            policies={policies}
          />
        );
      default:
        return null;
    }
  };

  // Step 0: Welcome Screen
  if (!welcomeSeen) {
    return <WelcomeScreen onStart={() => setWelcomeSeen(true)} />;
  }

  // Step 1: Onboarding President Template Profile Picker
  if (!selectedPresident) {
    return (
      <div className="mobile-app-container" style={{ justifyContent: 'center', padding: '16px' }}>
        <CharacterSelection selectPresident={selectPresident} />
      </div>
    );
  }

  // Step 2: Onboarding Character Looks Creator
  if (!avatarCustomized) {
    return (
      <div className="mobile-app-container" style={{ justifyContent: 'center', padding: '16px' }}>
        <CharacterCreator 
          onSave={(selections) => {
            setCustomAvatar(selections);
            setAvatarCustomized(true);
          }} 
        />
      </div>
    );
  }

  // Step 3: Onboarding Cabinet Advisors Appointer
  if (!treasurySec || !stateSec || !defenseSec) {
    return (
      <div className="mobile-app-container" style={{ justifyContent: 'center', padding: '16px' }}>
        <CabinetSelection appointCabinet={appointCabinet} />
      </div>
    );
  }

  return (
    <div className="mobile-app-container">
      {/* App Header */}
      <header className="app-header">
        <h1 className="app-title">
          <Flag size={20} style={{ color: 'var(--color-primary)' }} />
          <span>Oval Office Simulator</span>
        </h1>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', padding: '4px 10px', borderRadius: '6px' }}>
          Term {Math.ceil(turn / 4)}/4
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        {renderTabContent()}
      </main>

      {/* Navigation Footer (5 Tabs) */}
      <nav className="app-nav" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <Activity size={20} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('cabinet')}
          className={`nav-item ${activeTab === 'cabinet' ? 'active' : ''}`}
        >
          <Sliders size={20} />
          <span>Cabinet</span>
        </button>
        <button
          onClick={() => setActiveTab('congress')}
          className={`nav-item ${activeTab === 'congress' ? 'active' : ''}`}
        >
          <Landmark size={20} />
          <span>Congress</span>
        </button>
        <button
          onClick={() => setActiveTab('warRoom')}
          className={`nav-item ${activeTab === 'warRoom' ? 'active' : ''}`}
        >
          <Shield size={20} />
          <span>War Room</span>
        </button>
        <button
          onClick={() => setActiveTab('factions')}
          className={`nav-item ${activeTab === 'factions' ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Factions</span>
        </button>
      </nav>

      {/* Advisor Crisis Alert Modal overlays */}
      <EventModal
        activeEvent={activeEvent}
        resolveCrisis={resolveCrisis}
      />

      {/* End of Game / Election Summary overlay */}
      <ElectionSummary
        gameOver={gameOver}
        electionResults={electionResults}
        resetGame={handleReset}
        approval={approval}
        debt={debt}
        gdp={gdp}
      />
    </div>
  );
}

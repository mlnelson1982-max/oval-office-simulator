import { useState, useEffect } from 'react';

const INITIAL_COUNTRIES = [
  { id: 'uk', name: 'United Kingdom', leader: 'PM Alistair Vance', lat: 51.5, lng: -0.1, relation: 85, status: 'allied' },
  { id: 'germany', name: 'Germany', leader: 'Chancellor Sophie Brandt', lat: 52.5, lng: 13.4, relation: 70, status: 'friendly' },
  { id: 'japan', name: 'Japan', leader: 'PM Kenji Sato', lat: 35.6, lng: 139.6, relation: 75, status: 'friendly' },
  { id: 'china', name: 'China', leader: 'Premier Zhang', lat: 39.9, lng: 116.4, relation: 30, status: 'hostile' },
  { id: 'russia', name: 'Russia', leader: 'President Dmitry Volkov', lat: 55.7, lng: 37.6, relation: 20, status: 'hostile' }
];

const INITIAL_FACTIONS = [
  { id: 'capitalists', name: 'Capitalists', size: 15, loyalty: 50, icon: 'DollarSign', desc: 'Concerned with corporate tax rates, free markets, and GDP growth.' },
  { id: 'socialists', name: 'Socialists', size: 12, loyalty: 50, icon: 'Users', desc: 'Advocate for high social spending, carbon taxes, and corporate regulation.' },
  { id: 'liberals', name: 'Liberals', size: 25, loyalty: 50, icon: 'Globe', desc: 'Prioritize environmental policy, education spending, and gun control.' },
  { id: 'conservatives', name: 'Conservatives', size: 25, loyalty: 50, icon: 'Shield', desc: 'Focused on national security, border control, and low taxes.' },
  { id: 'workingclass', name: 'Working Class', size: 15, loyalty: 50, icon: 'Hammer', desc: 'Heavily impacted by income tax, public education, and healthcare.' },
  { id: 'wealthy', name: 'Wealthy', size: 8, loyalty: 50, icon: 'TrendingUp', desc: 'Sensitive to income and corporate tax rates, and capital markets.' }
];

const INITIAL_CONGRESS = { democrats: 48, republicans: 47, independents: 5 };
const INITIAL_POLICIES = {
  incomeTax: 35, corporateTax: 21, carbonTax: 10,
  militarySpending: 40, healthcareSpending: 35, educationSpending: 30,
  infrastructureSpending: 30, welfareSpending: 30, gunRegulation: 30,
  greenSubsidies: 25, borderControl: 40
};

const CRISES_EVENTS = [
  {
    id: 'submarine_standoff',
    title: 'Nuclear Submarine Standoff',
    description: 'A US nuclear submarine has a close encounter with a rival nation’s guided-missile destroyer in disputed international waters.',
    trigger: (state) => state.turn > 2 && state.warEscalation > 25 && Math.random() < 0.5,
    options: [
      {
        text: 'Hold ground and fire warning flares (Escalation rises, Hawk support).',
        impact: (prev) => ({
          warEscalation: Math.min(100, prev.warEscalation + 20),
          politicalCapital: Math.min(100, prev.politicalCapital + 10),
          factions: prev.factions.map(f => {
            if (f.id === 'conservatives') return { ...f, loyalty: Math.min(100, f.loyalty + 18) };
            if (f.id === 'liberals') return { ...f, loyalty: Math.max(0, f.loyalty - 15) };
            return f;
          })
        })
      },
      {
        text: 'Order a tactical retreat to de-escalate tension.',
        impact: (prev) => ({
          warEscalation: Math.max(0, prev.warEscalation - 15),
          security: Math.max(0, prev.security - 10),
          factions: prev.factions.map(f => {
            if (f.id === 'conservatives') return { ...f, loyalty: Math.max(0, f.loyalty - 20) };
            if (f.id === 'liberals') return { ...f, loyalty: Math.min(100, f.loyalty + 15) };
            return f;
          })
        })
      },
      {
        text: 'Initiate a direct diplomatic hotline conference (Cost: 15 PC).',
        impact: (prev) => {
          const discount = prev.stateSec === 'thomas' ? 5 : 0;
          return {
            politicalCapital: Math.max(0, prev.politicalCapital - (15 - discount)),
            warEscalation: Math.max(0, prev.warEscalation - 6),
            security: Math.min(100, prev.security + 5),
            factions: prev.factions.map(f => {
              if (f.id === 'workingclass') return { ...f, loyalty: Math.min(100, f.loyalty + 10) };
              return f;
            })
          };
        }
      }
    ]
  },
  {
    id: 'ally_invaded',
    title: 'Ally Border Incursion',
    description: 'A key democratic partner in East Europe reports aggressive troop buildups and shelling on their eastern frontier.',
    trigger: (state) => state.turn > 3 && Math.random() < 0.45,
    options: [
      {
        text: 'Deploy $120B in emergency military defense aid.',
        impact: (prev) => ({
          debt: prev.debt + 0.12,
          warEscalation: Math.min(100, prev.warEscalation + 15),
          security: Math.min(100, prev.security + 10),
          factions: prev.factions.map(f => {
            if (f.id === 'conservatives') return { ...f, loyalty: Math.min(100, f.loyalty + 15) };
            return f;
          })
        })
      },
      {
        text: 'Coordinate global economic sanctions on the aggressor.',
        impact: (prev) => ({
          gdpGrowth: prev.gdpGrowth - 0.5,
          warEscalation: Math.min(100, prev.warEscalation + 5),
          factions: prev.factions.map(f => {
            if (f.id === 'capitalists') return { ...f, loyalty: Math.max(0, f.loyalty - 12) };
            if (f.id === 'liberals') return { ...f, loyalty: Math.min(100, f.loyalty + 10) };
            return f;
          })
        })
      },
      {
        text: 'Express diplomatic concern but maintain formal neutrality.',
        impact: (prev) => ({
          security: Math.max(0, prev.security - 12),
          approval: Math.max(0, prev.approval - 8),
          factions: prev.factions.map(f => {
            if (f.id === 'conservatives') return { ...f, loyalty: Math.max(0, f.loyalty - 18) };
            if (f.id === 'socialists') return { ...f, loyalty: Math.min(100, f.loyalty + 5) };
            return f;
          })
        })
      }
    ]
  },
  {
    id: 'market_panic',
    title: 'Stock Market Liquidity Crisis',
    description: 'A sudden liquidity freeze on Wall Street causes a 10% stock market drop, threatening broader economic recession.',
    trigger: (state) => state.turn > 2 && Math.random() < 0.35,
    options: [
      {
        text: 'Bail out the financial institutions ($250B stimulus).',
        impact: (prev) => ({
          debt: prev.debt + 0.25,
          gdpGrowth: prev.gdpGrowth + 0.5,
          politicalCapital: Math.max(0, prev.politicalCapital - 10),
          marketIndex: prev.marketIndex * 1.05,
          factions: prev.factions.map(f => {
            if (f.id === 'capitalists') return { ...f, loyalty: Math.min(100, f.loyalty + 15) };
            if (f.id === 'wealthy') return { ...f, loyalty: Math.min(100, f.loyalty + 10) };
            if (f.id === 'socialists') return { ...f, loyalty: Math.max(0, f.loyalty - 20) };
            if (f.id === 'workingclass') return { ...f, loyalty: Math.max(0, f.loyalty - 10) };
            return f;
          })
        })
      },
      {
        text: 'Let the markets correct themselves and stand firm.',
        impact: (prev) => ({
          gdpGrowth: prev.gdpGrowth - 1.5,
          approval: Math.max(0, prev.approval - 12),
          marketIndex: prev.marketIndex * 0.82,
          factions: prev.factions.map(f => {
            if (f.id === 'capitalists') return { ...f, loyalty: Math.max(0, f.loyalty - 25) };
            if (f.id === 'wealthy') return { ...f, loyalty: Math.max(0, f.loyalty - 15) };
            if (f.id === 'workingclass') return { ...f, loyalty: Math.max(0, f.loyalty - 8) };
            return f;
          })
        })
      },
      {
        text: 'Deploy a direct citizen relief payment ($200B).',
        impact: (prev) => ({
          debt: prev.debt + 0.20,
          gdpGrowth: prev.gdpGrowth + 0.2,
          welfare: Math.min(100, prev.welfare + 8),
          factions: prev.factions.map(f => {
            if (f.id === 'workingclass') return { ...f, loyalty: Math.min(100, f.loyalty + 20) };
            if (f.id === 'socialists') return { ...f, loyalty: Math.min(100, f.loyalty + 15) };
            if (f.id === 'capitalists') return { ...f, loyalty: Math.max(0, f.loyalty - 10) };
            return f;
          })
        })
      }
    ]
  }
];

export function useGameState() {
  // Onboarding parameters
  const [selectedPresident, setSelectedPresident] = useState(null);
  const [presidentName, setPresidentName] = useState('');
  const [customAvatar, setCustomAvatar] = useState({
    skin: 'peach',
    hair: 'crop',
    color: 'black',
    attire: 'suit',
    accessory: 'none',
    background: 'ovalOffice',
    aiPortrait: null
  });

  const [treasurySec, setTreasurySec] = useState(null);
  const [stateSec, setStateSec] = useState(null);
  const [defenseSec, setDefenseSec] = useState(null);

  // Core gameplay states
  const [turn, setTurn] = useState(1);
  const [politicalCapital, setPoliticalCapital] = useState(55);
  const [gdpGrowth, setGdpGrowth] = useState(2.8);
  const [debt, setDebt] = useState(28.5);
  const [gdp, setGdp] = useState(23.2);
  const [revenue, setRevenue] = useState(4.8);
  const [spending, setSpending] = useState(5.2);
  const [security, setSecurity] = useState(60);
  const [welfare, setWelfare] = useState(55);
  const [approval, setApproval] = useState(52);

  // Stock Market State
  const [marketIndex, setMarketIndex] = useState(10000);
  const [marketChange, setMarketChange] = useState(0);

  // Geopolitical Geographies
  const [countries, setCountries] = useState(INITIAL_COUNTRIES);
  const [alliesSupport, setAlliesSupport] = useState(60);
  const [rivalAggression, setRivalAggression] = useState(25);
  const [warEscalation, setWarEscalation] = useState(10);
  const [defcon, setDefcon] = useState(5);
  const [militaryReadiness, setMilitaryReadiness] = useState(60);
  const [warOperationsSpending, setWarOperationsSpending] = useState(0);

  // Active War Status
  const [isAtWar, setIsAtWar] = useState(false);
  const [warProgress, setWarProgress] = useState(0);

  // Notification and alerts
  const [turnNotification, setTurnNotification] = useState(null);

  // Policies and bills
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [proposedBill, setProposedBill] = useState(null);
  const [factions, setFactions] = useState(INITIAL_FACTIONS);
  const [congress, setCongress] = useState(INITIAL_CONGRESS);
  const [activeEvent, setActiveEvent] = useState(null);

  // History Snapshots
  const [history, setHistory] = useState([
    { turn: 1, debt: 28.5, gdp: 23.2, gdpGrowth: 2.8, approval: 52, welfare: 55, security: 60, escalation: 10, market: 10000 }
  ]);

  // Game over state
  const [gameOver, setGameOver] = useState(null); // 'bankruptcy' | 'impeachment' | 'coup' | 'globalwar' | 'defeat' | 're-election-won' | 're-election-lost'
  const [electionResults, setElectionResults] = useState(null);

  // Handle DEFCON limits
  useEffect(() => {
    let nextDefcon = 5;
    if (warEscalation > 80) nextDefcon = 1;
    else if (warEscalation > 60) nextDefcon = 2;
    else if (warEscalation > 40) nextDefcon = 3;
    else if (warEscalation > 20) nextDefcon = 4;
    setDefcon(nextDefcon);
  }, [warEscalation]);

  // Select President dossier picker
  const selectPresident = (name, avatarPath, characterId) => {
    setPresidentName(name);
    setSelectedPresident(characterId);
  };

  // Appoint Cabinet members portfolios
  const appointCabinet = (treasuryId, stateId, defenseId) => {
    setTreasurySec(treasuryId);
    setStateSec(stateId);
    setDefenseSec(defenseId);

    // Dynamic starting adjustments
    let startWelfare = welfare;
    let startSecurity = security;
    let startGdpGrowth = gdpGrowth;
    let startPolicies = { ...policies };
    let startReadiness = militaryReadiness;

    // Apply President Perks
    if (selectedPresident === 'sterling') {
      startWelfare = 70;
      startPolicies.educationSpending = 40;
      startPolicies.healthcareSpending = 45;
      startPolicies.incomeTax = 40;
    } else if (selectedPresident === 'vance') {
      startSecurity = 75;
      startPolicies.militarySpending = 55;
      startPolicies.borderControl = 50;
    } else if (selectedPresident === 'cross') {
      startGdpGrowth = 4.3;
      startPolicies.corporateTax = 15;
      startPolicies.infrastructureSpending = 40;
    }

    // Apply Cabinet Perks
    if (treasuryId === 'rodriguez') {
      startGdpGrowth += 0.4;
    } else if (treasuryId === 'olivia') {
      startWelfare = Math.max(0, startWelfare - 5);
    }

    if (defenseId === 'arthur') {
      startReadiness = 75;
    }

    setWelfare(startWelfare);
    setSecurity(startSecurity);
    setGdpGrowth(Number(startGdpGrowth.toFixed(2)));
    setPolicies(startPolicies);
    setMilitaryReadiness(startReadiness);

    setFactions(prevFactions => {
      return prevFactions.map(f => {
        let loyalty = f.loyalty;
        
        if (selectedPresident === 'sterling') {
          if (f.id === 'socialists') loyalty += 15;
          if (f.id === 'liberals') loyalty += 10;
          if (f.id === 'capitalists') loyalty -= 10;
          if (f.id === 'wealthy') loyalty -= 15;
        } else if (selectedPresident === 'vance') {
          if (f.id === 'conservatives') loyalty += 20;
          if (f.id === 'liberals') loyalty -= 10;
        } else if (selectedPresident === 'cross') {
          if (f.id === 'capitalists') loyalty += 20;
          if (f.id === 'wealthy') loyalty += 15;
          if (f.id === 'socialists') loyalty -= 15;
          if (f.id === 'workingclass') loyalty -= 10;
        }

        if (treasuryId === 'rodriguez') {
          if (f.id === 'workingclass') loyalty += 10;
        }

        return { ...f, loyalty: Math.max(5, Math.min(95, loyalty)) };
      });
    });
  };

  // Recompute budgets
  useEffect(() => {
    if (!selectedPresident) return;

    const taxRevenue = (
      (policies.incomeTax * 0.08) + 
      (policies.corporateTax * 0.04) + 
      (policies.carbonTax * 0.015)
    );
    const revenueFactor = treasurySec === 'olivia' ? 1.05 : 1.0;
    const newRevenue = Number((1.5 + taxRevenue * revenueFactor).toFixed(2));

    const serviceSpending = (
      (policies.militarySpending * 0.035) +
      (policies.healthcareSpending * 0.035) +
      (policies.educationSpending * 0.02) +
      (policies.infrastructureSpending * 0.018) +
      (policies.welfareSpending * 0.025) +
      (policies.greenSubsidies * 0.008) +
      (policies.borderControl * 0.006)
    );

    let defconAlertFee = 0;
    if (defcon === 3) defconAlertFee = 0.10;
    if (defcon === 2) defconAlertFee = 0.28;
    if (defcon === 1) defconAlertFee = 0.60;

    const characterDefenseCharge = selectedPresident === 'vance' ? 0.05 : 0;
    const activeWarCharge = isAtWar ? 0.80 : 0;
    const rodriguezOverhead = treasurySec === 'rodriguez' ? 0.15 : 0;

    const newSpending = Number((1.8 + serviceSpending + warOperationsSpending + defconAlertFee + characterDefenseCharge + activeWarCharge + rodriguezOverhead).toFixed(2));

    setRevenue(newRevenue);
    setSpending(newSpending);
  }, [policies, warOperationsSpending, defcon, selectedPresident, treasurySec, isAtWar]);

  useEffect(() => {
    let totalWeight = 0;
    let sumLoyalty = 0;
    factions.forEach(f => {
      totalWeight += f.size;
      sumLoyalty += f.loyalty * f.size;
    });
    const avgApproval = Math.round(sumLoyalty / (totalWeight || 1));
    setApproval(avgApproval);
  }, [factions]);

  // Propose a bill
  const proposeBillToCongress = (policyKey, targetValue) => {
    const prevValue = policies[policyKey];
    const difference = targetValue - prevValue;

    let baseDemVotes = 30;
    let baseRepVotes = 30;
    let baseIndVotes = 50;

    if (policyKey === 'incomeTax' || policyKey === 'corporateTax') {
      if (difference > 0) {
        baseDemVotes += 45; baseRepVotes -= 28;
      } else {
        baseDemVotes -= 20; baseRepVotes += 55;
      }
    } else if (policyKey === 'carbonTax' || policyKey === 'greenSubsidies' || policyKey === 'gunRegulation') {
      if (difference > 0) {
        baseDemVotes += 50; baseRepVotes -= 30;
      } else {
        baseDemVotes -= 20; baseRepVotes += 35;
      }
    } else if (policyKey === 'militarySpending' || policyKey === 'borderControl') {
      if (difference > 0) {
        baseDemVotes -= 25; baseRepVotes += 50;
      } else {
        baseDemVotes += 35; baseRepVotes -= 30;
      }
    } else if (policyKey === 'healthcareSpending' || policyKey === 'educationSpending' || policyKey === 'welfareSpending') {
      if (difference > 0) {
        baseDemVotes += 48; baseRepVotes -= 28;
      } else {
        baseDemVotes -= 25; baseRepVotes += 40;
      }
    } else if (policyKey === 'infrastructureSpending') {
      baseDemVotes += 30; baseRepVotes += 20;
    }

    const approvalBonus = Math.round((approval - 50) * 0.4);
    baseDemVotes = Math.max(5, Math.min(95, baseDemVotes + approvalBonus));
    baseRepVotes = Math.max(5, Math.min(95, baseRepVotes + approvalBonus));
    baseIndVotes = Math.max(5, Math.min(95, baseIndVotes + approvalBonus));

    const demWeight = (congress.democrats - 48) * 0.8;
    const repWeight = (congress.republicans - 47) * 0.8;

    baseDemVotes = Math.max(5, Math.min(95, Math.round(baseDemVotes + demWeight)));
    baseRepVotes = Math.max(5, Math.min(95, Math.round(baseRepVotes + repWeight)));

    setProposedBill({
      policyKey,
      targetValue,
      prevValue,
      votes: {
        democrats: baseDemVotes,
        republicans: baseRepVotes,
        independents: baseIndVotes
      },
      lobbyCount: 0,
      lobbyCost: 15
    });
  };

  const lobbyParty = (party) => {
    if (!proposedBill || politicalCapital < proposedBill.lobbyCost) return;

    setPoliticalCapital(prev => prev - proposedBill.lobbyCost);
    setProposedBill(prev => {
      const nextVotes = { ...prev.votes };
      nextVotes[party] = Math.min(98, nextVotes[party] + 15);
      return {
        ...prev,
        votes: nextVotes,
        lobbyCount: prev.lobbyCount + 1
      };
    });
  };

  const voteOnProposedBill = () => {
    if (!proposedBill) return { passed: false };

    const demYes = Math.round(congress.democrats * (proposedBill.votes.democrats / 100));
    const repYes = Math.round(congress.republicans * (proposedBill.votes.republicans / 100));
    const indYes = Math.round(congress.independents * (proposedBill.votes.independents / 100));

    const totalYes = demYes + repYes + indYes;
    const totalNo = 100 - totalYes;
    const passed = totalYes >= 50;

    let message = '';
    if (passed) {
      message = `Bill passed Congress by ${totalYes} - ${totalNo}! Dynamic adjustments applied.`;
      setPolicies(prev => ({ ...prev, [proposedBill.policyKey]: proposedBill.targetValue }));

      const diff = proposedBill.targetValue - proposedBill.prevValue;
      const magnitude = diff / 10;
      setPoliticalCapital(prev => Math.min(100, prev + 5));

      setFactions(prevFactions => {
        return prevFactions.map(f => {
          let loyaltyChange = 0;
          switch (proposedBill.policyKey) {
            case 'incomeTax':
              if (f.id === 'wealthy') loyaltyChange = magnitude * -1.8;
              if (f.id === 'workingclass') loyaltyChange = magnitude * -0.4;
              if (f.id === 'capitalists') loyaltyChange = magnitude * -0.9;
              if (f.id === 'socialists') loyaltyChange = magnitude * 0.8;
              break;
            case 'corporateTax':
              if (f.id === 'capitalists') loyaltyChange = magnitude * -2.2;
              if (f.id === 'wealthy') loyaltyChange = magnitude * -1.0;
              if (f.id === 'socialists') loyaltyChange = magnitude * 1.5;
              break;
            case 'carbonTax':
              if (f.id === 'liberals') loyaltyChange = magnitude * 1.6;
              if (f.id === 'socialists') loyaltyChange = magnitude * 0.8;
              if (f.id === 'capitalists') loyaltyChange = magnitude * -0.8;
              if (f.id === 'conservatives') loyaltyChange = magnitude * -1.2;
              break;
            case 'militarySpending':
              if (f.id === 'conservatives') loyaltyChange = magnitude * 1.4;
              if (f.id === 'socialists') loyaltyChange = magnitude * -0.9;
              if (f.id === 'liberals') loyaltyChange = magnitude * -0.6;
              break;
            case 'healthcareSpending':
              if (f.id === 'workingclass') loyaltyChange = magnitude * 1.2;
              if (f.id === 'socialists') loyaltyChange = loyaltyChange = magnitude * 1.0;
              if (f.id === 'liberals') loyaltyChange = loyaltyChange = magnitude * 0.8;
              if (f.id === 'capitalists') loyaltyChange = loyaltyChange = magnitude * -0.6;
              break;
            case 'educationSpending':
              if (f.id === 'liberals') loyaltyChange = magnitude * 1.2;
              if (f.id === 'workingclass') loyaltyChange = magnitude * 0.9;
              if (f.id === 'socialists') loyaltyChange = magnitude * 0.6;
              break;
            case 'infrastructureSpending':
              if (f.id === 'workingclass') loyaltyChange = magnitude * 0.8;
              if (f.id === 'capitalists') loyaltyChange = magnitude * 0.6;
              break;
            case 'welfareSpending':
              if (f.id === 'socialists') loyaltyChange = magnitude * 1.8;
              if (f.id === 'workingclass') loyaltyChange = magnitude * 1.5;
              if (f.id === 'capitalists') loyaltyChange = magnitude * -1.2;
              if (f.id === 'wealthy') loyaltyChange = magnitude * -1.0;
              break;
            case 'gunRegulation':
              if (f.id === 'liberals') loyaltyChange = magnitude * 1.8;
              if (f.id === 'socialists') loyaltyChange = magnitude * 0.8;
              if (f.id === 'conservatives') loyaltyChange = magnitude * -2.4;
              break;
            case 'greenSubsidies':
              if (f.id === 'liberals') loyaltyChange = magnitude * 1.5;
              if (f.id === 'socialists') loyaltyChange = magnitude * 0.8;
              if (f.id === 'capitalists') loyaltyChange = magnitude * -0.3;
              break;
            case 'borderControl':
              if (f.id === 'conservatives') loyaltyChange = magnitude * 1.8;
              if (f.id === 'liberals') loyaltyChange = magnitude * -1.6;
              if (f.id === 'socialists') loyaltyChange = magnitude * -0.9;
              break;
            default:
              break;
          }
          const finalLoyalty = Math.max(0, Math.min(100, Math.round(f.loyalty + loyaltyChange)));
          return { ...f, loyalty: finalLoyalty };
        });
      });

      if (proposedBill.policyKey === 'militarySpending') {
        setSecurity(prev => Math.max(0, Math.min(100, Math.round(prev + magnitude * 0.75))));
      } else if (proposedBill.policyKey === 'borderControl') {
        setSecurity(prev => Math.max(0, Math.min(100, Math.round(prev + magnitude * 0.5))));
      } else if (proposedBill.policyKey === 'gunRegulation') {
        setSecurity(prev => Math.max(0, Math.min(100, Math.round(prev + magnitude * 0.3))));
      }

      if (proposedBill.policyKey === 'healthcareSpending' || proposedBill.policyKey === 'welfareSpending') {
        setWelfare(prev => Math.max(0, Math.min(100, Math.round(prev + magnitude * 0.6))));
      } else if (proposedBill.policyKey === 'educationSpending') {
        setWelfare(prev => Math.max(0, Math.min(100, Math.round(prev + magnitude * 0.45))));
      }

      let gdpMod = 0;
      if (proposedBill.policyKey === 'incomeTax') gdpMod -= magnitude * 0.08;
      if (proposedBill.policyKey === 'corporateTax') gdpMod -= magnitude * 0.12;
      if (proposedBill.policyKey === 'infrastructureSpending') gdpMod += magnitude * 0.06;
      setGdpGrowth(prev => Number((prev + gdpMod).toFixed(2)));

      if (proposedBill.policyKey === 'corporateTax') {
        setMarketIndex(prev => Math.max(1000, Math.round(prev * (1 - magnitude * 0.05))));
      }
    } else {
      message = `Bill defeated in Congress ${totalYes} - ${totalNo}! You lost political capital.`;
      setPoliticalCapital(prev => Math.max(0, prev - 8));
    }

    setProposedBill(null);
    return { passed, message, totalYes, totalNo };
  };

  // Diplomatic Interactions
  const interactWithCountry = (countryId, actionId) => {
    let costPC = 15;
    const isThomas = stateSec === 'thomas';
    if (isThomas) costPC = Math.max(5, costPC - 5);

    if (politicalCapital < costPC) return { success: false, msg: 'Insufficient Political Capital.' };

    setPoliticalCapital(prev => prev - costPC);

    let feedback = '';
    setCountries(prevList => {
      return prevList.map(c => {
        if (c.id === countryId) {
          let nextRelation = c.relation;
          let nextStatus = c.status;

          if (actionId === 'trade') {
            nextRelation = Math.min(100, nextRelation + 15);
            setGdpGrowth(prev => Number((prev + 0.35).toFixed(2)));
            setFactions(fList => fList.map(f => {
              if (f.id === 'conservatives') return { ...f, loyalty: Math.max(0, f.loyalty - 8) };
              if (f.id === 'capitalists') return { ...f, loyalty: Math.min(100, f.loyalty + 8) };
              return f;
            }));
            feedback = `Drafted a bilateral trade agreement with ${c.name}. relations +15, GDP growth +0.35%.`;
          } else if (actionId === 'aid') {
            nextRelation = Math.min(100, nextRelation + 20);
            setDebt(prev => prev + 0.08);
            setSecurity(prev => Math.min(100, prev + 5));
            feedback = `Dispatched $80B in defense support to ${c.name}. Relations +20, debt increased.`;
          } else if (actionId === 'threaten') {
            nextRelation = Math.max(0, nextRelation - 25);
            setRivalAggression(prev => Math.min(100, prev + 15));
            setWarEscalation(prev => Math.min(100, prev + 12));
            setPoliticalCapital(prev => Math.min(100, prev + 10));
            feedback = `Issued formal diplomatic ultimatum to ${c.name}. Relations tanked, Aggression & Escalation rose.`;
          } else if (actionId === 'lobby') {
            nextRelation = Math.min(100, nextRelation + 8);
            feedback = `Lobbied diplomatic committees in ${c.name}. Relations +8.`;
          }

          if (nextRelation >= 80) nextStatus = 'allied';
          else if (nextRelation >= 60) nextStatus = 'friendly';
          else if (nextRelation >= 40) nextStatus = 'neutral';
          else nextStatus = 'hostile';

          return { ...c, relation: nextRelation, status: nextStatus };
        }
        return c;
      });
    });

    return { success: true, msg: feedback };
  };

  // General war mobilization operations
  const runMilitaryAction = (actionId) => {
    let costPC = 0;
    const isThomas = stateSec === 'thomas';
    const isVictoria = stateSec === 'victoria';

    if (actionId === 'strike_group') {
      costPC = 20;
      if (politicalCapital < costPC) return false;
      setPoliticalCapital(prev => prev - costPC);
      
      setWarOperationsSpending(prev => prev + 0.06);
      
      const readGain = isVictoria ? 18 : 15;
      setMilitaryReadiness(prev => Math.min(100, prev + readGain));
      setWarEscalation(prev => Math.max(0, prev - 10));
      setSecurity(prev => Math.min(100, prev + 8));
      setGdpGrowth(prev => Number((prev - 0.2).toFixed(2)));
      return { success: true, description: 'Carrier Strike Group deployed to regional waters, projecting national strength.' };
    } else if (actionId === 'sanctions') {
      costPC = 15;
      if (politicalCapital < costPC) return false;
      setPoliticalCapital(prev => prev - costPC);

      setWarEscalation(prev => Math.max(0, prev - 12));
      setGdpGrowth(prev => Number((prev - 0.4).toFixed(2)));
      setFactions(prev => prev.map(f => {
        if (f.id === 'capitalists' || f.id === 'wealthy') return { ...f, loyalty: Math.max(0, f.loyalty - 6) };
        return f;
      }));
      return { success: true, description: 'Economic sanctions enacted. Escalation slowed at the cost of GDP growth.' };
    } else if (actionId === 'cyber_op') {
      costPC = 25;
      if (politicalCapital < costPC) return false;
      setPoliticalCapital(prev => prev - costPC);

      const hasChen = defenseSec === 'chen';
      const failed = hasChen ? false : Math.random() < 0.25;

      if (failed) {
        setWarEscalation(prev => Math.min(100, prev + 10));
        setSecurity(prev => Math.max(0, prev - 5));
        return { success: true, description: 'Intelligence compromise! Cyber operation failed and leaked, triggering local escalation.' };
      } else {
        setWarEscalation(prev => Math.max(0, prev - 15));
        setMilitaryReadiness(prev => Math.min(100, prev + 8));
        setSecurity(prev => Math.min(100, prev + 4));
        return { success: true, description: 'Cyber operation succeeded! Rival comm structures disabled.' };
      }
    } else if (actionId === 'mobilize') {
      costPC = isThomas ? 40 : 30;
      if (politicalCapital < costPC) return false;
      setPoliticalCapital(prev => prev - costPC);

      setWarOperationsSpending(prev => prev + 0.12);
      
      const baseGain = defenseSec === 'chen' ? 20 : 25;
      const readGain = isVictoria ? Math.round(baseGain * 1.2) : baseGain;

      setMilitaryReadiness(prev => Math.min(100, prev + readGain));
      setSecurity(prev => Math.min(100, prev + 12));
      setWarEscalation(prev => Math.min(100, prev + 12));
      setFactions(prev => prev.map(f => {
        if (f.id === 'workingclass') return { ...f, loyalty: Math.max(0, f.loyalty - 10) };
        if (f.id === 'conservatives') return { ...f, loyalty: Math.min(100, f.loyalty + 12) };
        return f;
      }));
      return { success: true, description: 'Ground troops mobilized and military reservists activated. Defense levels fortified.' };
    }

    return false;
  };

  // Declare War
  const declareWar = () => {
    if (isAtWar) return;
    setIsAtWar(true);
    setWarProgress(5);
    setWarEscalation(70);
    setRivalAggression(Math.max(65, rivalAggression));
    setFactions(prev => prev.map(f => {
      if (f.id === 'liberals' || f.id === 'socialists') return { ...f, loyalty: Math.max(5, f.loyalty - 20) };
      if (f.id === 'conservatives') return { ...f, loyalty: Math.min(95, f.loyalty + 15) };
      return f;
    }));
  };

  const resolveCrisis = (optionIndex) => {
    if (!activeEvent) return;

    const chosenOption = activeEvent.options[optionIndex];
    const impact = chosenOption.impact({
      turn, politicalCapital, gdpGrowth, debt, gdp, revenue, spending, security, welfare, approval, factions, warEscalation, stateSec, marketIndex
    });

    if (impact.debt !== undefined) setDebt(prev => Number(impact.debt.toFixed(2)));
    if (impact.gdpGrowth !== undefined) setGdpGrowth(prev => Number(impact.gdpGrowth.toFixed(2)));
    if (impact.politicalCapital !== undefined) setPoliticalCapital(impact.politicalCapital);
    if (impact.security !== undefined) setSecurity(prev => Math.max(0, Math.min(100, Math.round(impact.security))));
    if (impact.welfare !== undefined) setWelfare(prev => Math.max(0, Math.min(100, Math.round(impact.welfare))));
    if (impact.approval !== undefined) setApproval(prev => Math.max(0, Math.min(100, Math.round(impact.approval))));
    if (impact.factions !== undefined) setFactions(impact.factions);
    if (impact.warEscalation !== undefined) setWarEscalation(prev => Math.max(0, Math.min(100, Math.round(impact.warEscalation))));
    if (impact.marketIndex !== undefined) setMarketIndex(prev => Math.max(1000, Math.round(impact.marketIndex)));

    setActiveEvent(null);
  };

  const simulateElection = () => {
    const regions = [
      { name: 'Northeast', electoralVotes: 102, weights: { liberals: 1.4, socialists: 1.3, wealthy: 1.2, workingclass: 1.0, capitalists: 0.9, conservatives: 0.6 } },
      { name: 'West Coast', electoralVotes: 78, weights: { liberals: 1.5, socialists: 1.4, capitalists: 1.1, workingclass: 0.8, wealthy: 0.9, conservatives: 0.5 } },
      { name: 'South', electoralVotes: 160, weights: { conservatives: 1.6, capitalists: 1.2, workingclass: 1.1, wealthy: 1.0, liberals: 0.6, socialists: 0.4 } },
      { name: 'Midwest', electoralVotes: 64, weights: { conservatives: 1.3, workingclass: 1.2, capitalists: 1.1, liberals: 0.8, wealthy: 0.8, socialists: 0.5 } },
      { name: 'Rust Belt / Swing', electoralVotes: 134, weights: { workingclass: 1.6, conservatives: 1.1, capitalists: 0.9, liberals: 0.9, wealthy: 0.7, socialists: 0.6 } }
    ];

    let playerElectoralVotes = 0;
    let rivalElectoralVotes = 0;
    const details = [];

    regions.forEach(reg => {
      let weightedSum = 0;
      let totalWeights = 0;

      factions.forEach(f => {
        const weight = reg.weights[f.id] || 1.0;
        weightedSum += f.loyalty * weight * f.size;
        totalWeights += weight * f.size;
      });

      const regionalApproval = weightedSum / totalWeights;
      const playerWin = regionalApproval >= 51.5;
      
      if (playerWin) playerElectoralVotes += reg.electoralVotes;
      else rivalElectoralVotes += reg.electoralVotes;

      details.push({
        name: reg.name,
        electoralVotes: reg.electoralVotes,
        approval: Math.round(regionalApproval),
        winner: playerWin ? 'Player' : 'Opponent'
      });
    });

    const won = playerElectoralVotes >= 270;
    setElectionResults({
      playerVotes: playerElectoralVotes,
      opponentVotes: rivalElectoralVotes,
      won,
      details
    });

    if (won) setGameOver('re-election-won');
    else setGameOver('re-election-lost');
  };

  const runMidtermElections = () => {
    let demShift = 0;
    let repShift = 0;

    if (approval >= 58) {
      demShift += 4; repShift -= 4;
    } else if (approval <= 43) {
      demShift -= 6; repShift += 6;
    } else {
      demShift -= 2; repShift += 2;
    }

    if (gdpGrowth >= 3.2) {
      demShift += 2; repShift -= 2;
    } else if (gdpGrowth <= 1.0) {
      demShift -= 3; repShift += 3;
    }

    const newDems = Math.max(30, Math.min(70, congress.democrats + demShift));
    const newReps = Math.max(30, Math.min(70, congress.republicans + repShift));
    const newInds = 100 - newDems - newReps;

    setCongress({ democrats: newDems, republicans: newReps, independents: newInds });

    const text = newDems >= 50 
      ? `Mid-term Elections: The Presidential coalition maintains control of the Senate (${newDems}-${newReps})!`
      : `Mid-term Elections: The opposition party secures a Senate majority (${newReps}-${newDems})! Passing bills will be more challenging.`;
    
    setTurnNotification(text);
  };

  const advanceTurn = () => {
    const debtToGdpRatio = (debt / gdp) * 100;
    if (debtToGdpRatio > 250) {
      setGameOver('bankruptcy');
      return;
    }
    if (approval <= 5) {
      setGameOver('coup');
      return;
    }
    if (warEscalation >= 100) {
      setGameOver('globalwar');
      return;
    }
    if (isAtWar && militaryReadiness <= 0) {
      setGameOver('defeat');
      return;
    }

    let congressTension = 50;
    const libLoyalty = factions.find(f => f.id === 'liberals')?.loyalty || 50;
    const conLoyalty = factions.find(f => f.id === 'conservatives')?.loyalty || 50;
    congressTension = Math.round((libLoyalty * 0.5) + (conLoyalty * 0.5));
    if (congressTension <= 8) {
      setGameOver('impeachment');
      return;
    }

    if (turn === 16) {
      simulateElection();
      return;
    }

    const nextTurn = turn + 1;
    setTurn(nextTurn);
    setTurnNotification(null);

    if (nextTurn === 9) {
      runMidtermElections();
    }

    setWarOperationsSpending(0);

    const interestRate = treasurySec === 'olivia' ? 0.02 : 0.025;
    const interestCost = debt * interestRate;
    const currentDeficit = spending - revenue;
    const newDebt = Number((debt + (currentDeficit / 4) + (interestCost / 4)).toFixed(2));
    
    let escDrift = 0;
    if (militaryReadiness < 40) escDrift += 3;
    if (security < 45) escDrift += 2;
    if (defcon === 2) escDrift += 1;
    if (defcon === 1) escDrift += 3;

    if (stateSec === 'thomas') escDrift -= 2;
    
    const finalEscalation = Math.max(0, Math.min(100, Math.round(warEscalation + escDrift)));
    setWarEscalation(finalEscalation);

    let nextWarProgress = warProgress;
    let nextIsAtWar = isAtWar;
    if (isAtWar) {
      const diff = militaryReadiness - rivalAggression;
      const progressDelta = Math.max(2, Math.round(diff / 2 + 6));
      nextWarProgress = Math.min(100, warProgress + progressDelta);
      setWarProgress(nextWarProgress);

      setMilitaryReadiness(prev => Math.max(0, prev - 10));

      if (nextWarProgress >= 100) {
        nextIsAtWar = false;
        setIsAtWar(false);
        setWarEscalation(15);
        setRivalAggression(10);
        setPoliticalCapital(prev => Math.min(100, prev + 40));
        setFactions(fList => fList.map(f => {
          if (f.id === 'conservatives') return { ...f, loyalty: Math.min(100, f.loyalty + 20) };
          if (f.id === 'liberals') return { ...f, loyalty: Math.min(100, f.loyalty + 15) };
          return f;
        }));
        setTurnNotification('War Victory! The US military secured total triumph. Peace restored.');
      }
    }

    let tensionGdpDrag = 0;
    if (defcon === 2) tensionGdpDrag = -0.4;
    if (defcon === 1) tensionGdpDrag = -0.9;
    if (isAtWar) tensionGdpDrag = -1.5;
    
    const finalGdpGrowth = Number(Math.max(-5, gdpGrowth + tensionGdpDrag).toFixed(2));
    const newGdp = Number((gdp * (1 + (finalGdpGrowth / 100) / 4)).toFixed(2));

    setDebt(newDebt);
    setGdp(newGdp);

    const gdpFactor = finalGdpGrowth * 185;
    const taxFactor = - (policies.corporateTax - 21) * 35;
    const deficitFactor = - currentDeficit * 120;
    const escalationFactor = - warEscalation * 15;
    const treasuryFactor = treasurySec === 'olivia' ? 180 : 0;
    
    const randomWalk = (Math.random() - 0.47) * 450;
    const marketDelta = Math.round(gdpFactor + taxFactor + deficitFactor + escalationFactor + treasuryFactor + randomWalk);
    const finalMarket = Math.max(1000, marketIndex + marketDelta);
    
    setMarketIndex(finalMarket);
    setMarketChange(marketDelta);

    if (finalMarket < 5500 && marketIndex >= 5500) {
      setTurnNotification('Wall Street Alert: The stock market has crashed! Public panic spreads.');
      setFactions(fList => fList.map(f => ({ ...f, loyalty: Math.max(5, f.loyalty - 15) })));
    } else if (finalMarket > 15000 && marketIndex <= 15000) {
      setTurnNotification('Wall Street Alert: Bull market breaks records! Business approval surges.');
      setFactions(fList => fList.map(f => {
        if (f.id === 'capitalists' || f.id === 'wealthy') return { ...f, loyalty: Math.min(95, f.loyalty + 15) };
        return f;
      }));
    }

    setPoliticalCapital(prev => Math.min(100, prev + 12 + Math.round(approval * 0.15)));

    const snapshot = {
      turn: nextTurn,
      debt: newDebt,
      gdp: newGdp,
      gdpGrowth: finalGdpGrowth,
      approval,
      welfare,
      security,
      escalation: finalEscalation,
      market: finalMarket
    };
    setHistory(prev => [...prev, snapshot]);

    if (!nextIsAtWar) {
      checkForCrises(nextTurn);
    }
  };

  const resetGame = () => {
    setSelectedPresident(null);
    setPresidentName('');
    setCustomAvatar({
      skin: 'peach',
      hair: 'crop',
      color: 'black',
      attire: 'suit',
      accessory: 'none',
      background: 'ovalOffice',
      aiPortrait: null
    });
    setTreasurySec(null);
    setStateSec(null);
    setDefenseSec(null);
    setTurn(1);
    setPoliticalCapital(55);
    setGdpGrowth(2.8);
    setDebt(28.5);
    setGdp(23.2);
    setPolicies(INITIAL_POLICIES);
    setProposedBill(null);
    setFactions(INITIAL_FACTIONS);
    setCongress(INITIAL_CONGRESS);
    setActiveEvent(null);
    setWarEscalation(10);
    setMilitaryReadiness(60);
    setWarOperationsSpending(0);
    setMarketIndex(10000);
    setMarketChange(0);
    setCountries(INITIAL_COUNTRIES);
    setAlliesSupport(60);
    setRivalAggression(25);
    setIsAtWar(false);
    setWarProgress(0);
    setTurnNotification(null);
    setHistory([
      { turn: 1, debt: 28.5, gdp: 23.2, gdpGrowth: 2.8, approval: 52, welfare: 55, security: 60, escalation: 10, market: 10000 }
    ]);
    setGameOver(null);
    setElectionResults(null);
  };

  return {
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
  };
}

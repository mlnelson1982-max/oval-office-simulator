import React, { useState } from 'react';
import { Activity, Landmark, ShieldCheck, HeartCrack, ChevronRight, Zap } from 'lucide-react';

const POLICY_LABELS = {
  incomeTax: 'Income Tax Reform',
  corporateTax: 'Corporate Taxation Bill',
  carbonTax: 'Carbon Emissions Pricing Act',
  militarySpending: 'Defense Appropriations Bill',
  healthcareSpending: 'Universal Healthcare Expansion',
  educationSpending: 'Federal Education Funding Plan',
  infrastructureSpending: 'National Infrastructure Dev Act',
  welfareSpending: 'Social Safety Net Expansion',
  gunRegulation: 'Firearms Safety Standards Act',
  greenSubsidies: 'Green Energy Subsidies Act',
  borderControl: 'Border Security & Customs Act'
};

export default function Congress({
  politicalCapital,
  congress,
  proposedBill,
  lobbyParty,
  voteOnProposedBill,
  factions
}) {
  const [voteAnimation, setVoteAnimation] = useState(false);
  const [voteOutcome, setVoteOutcome] = useState(null); // { passed, message, totalYes, totalNo }

  // Generate coordinates for a 100-seat semi-circle (representing the US Senate)
  const generateSenateSeats = () => {
    const seats = [];
    const rows = [
      { radius: 60, count: 26 },
      { radius: 85, count: 34 },
      { radius: 110, count: 40 }
    ];

    // Allocate seat colors by party sequence: 48 Democrats, 5 Independents, 47 Republicans
    let seatIndex = 0;
    const getPartyClass = (idx) => {
      if (idx < 48) return 'seat-dem'; // Democrat (cyan/blue)
      if (idx < 53) return 'seat-ind'; // Independent (yellow/amber)
      return 'seat-rep'; // Republican (red/rose)
    };

    rows.forEach((row, rowIdx) => {
      for (let i = 0; i < row.count; i++) {
        // Distribute angle from 180 (left) to 0 (right) degrees
        const anglePercent = i / (row.count - 1 || 1);
        const angleRad = Math.PI - anglePercent * Math.PI;

        // Position coordinates (centered around x: 120, y: 130)
        const x = 120 + row.radius * Math.cos(angleRad);
        const y = 130 - row.radius * Math.sin(angleRad);

        seats.push({
          x,
          y,
          partyClass: getPartyClass(seatIndex)
        });
        seatIndex++;
      }
    });

    return seats;
  };

  const seats = generateSenateSeats();

  const handleCallVote = () => {
    setVoteAnimation(true);
    setVoteOutcome(null);

    // Run short voting simulation delay
    setTimeout(() => {
      const outcome = voteOnProposedBill();
      setVoteOutcome(outcome);
      setVoteAnimation(false);
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Senate Chamber Visual Graphic */}
      <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
        <span className="status-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Landmark size={14} /> United States Senate Seating
        </span>

        <div className="congress-chamber">
          <div className="seat-arc">
            {seats.map((seat, idx) => (
              <div 
                key={idx} 
                className={`congress-seat ${seat.partyClass}`} 
                style={{ left: `${seat.x}px`, top: `${seat.y}px` }}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.75rem', marginTop: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-info)' }} /> Democrats ({congress.democrats})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-warning)' }} /> Independents ({congress.independents})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-danger)' }} /> Republicans ({congress.republicans})
          </span>
        </div>
      </div>

      {/* Active legislation control panel */}
      {proposedBill ? (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <span className="status-label" style={{ color: 'var(--color-primary)' }}>Legislation Pending Approval</span>
          <h3 style={{ fontFamily: 'var(--font-display)', margin: '4px 0 10px 0', fontSize: '1.2rem' }}>
            {POLICY_LABELS[proposedBill.policyKey] || proposedBill.policyKey}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Adjusts target level from <span style={{ fontWeight: 600 }}>{proposedBill.prevValue}%</span> to <span style={{ fontWeight: 600, color: 'white' }}>{proposedBill.targetValue}%</span>. Projections indicate the voting breakdowns below.
          </p>

          {/* Projection breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {/* Democrats progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-info)', fontWeight: 600 }}>Democrats Support</span>
                <span>{proposedBill.votes.democrats}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '6px', margin: 0 }}>
                <div className="progress-bar-fill fill-primary" style={{ width: `${proposedBill.votes.democrats}%`, background: 'var(--color-info)' }} />
              </div>
            </div>

            {/* Republicans progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>Republicans Support</span>
                <span>{proposedBill.votes.republicans}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '6px', margin: 0 }}>
                <div className="progress-bar-fill fill-danger" style={{ width: `${proposedBill.votes.republicans}%` }} />
              </div>
            </div>

            {/* Independents progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>Independents Support</span>
                <span>{proposedBill.votes.independents}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '6px', margin: 0 }}>
                <div className="progress-bar-fill fill-warning" style={{ width: `${proposedBill.votes.independents}%` }} />
              </div>
            </div>
          </div>

          {/* Lobby buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <span className="status-label" style={{ fontSize: '0.7rem' }}>Lobbying Actions</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => lobbyParty('democrats')}
                disabled={politicalCapital < proposedBill.lobbyCost || voteAnimation}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <span>Lobby Dems</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)' }}>-15 PC</span>
              </button>
              <button
                onClick={() => lobbyParty('republicans')}
                disabled={politicalCapital < proposedBill.lobbyCost || voteAnimation}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <span>Lobby Reps</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)' }}>-15 PC</span>
              </button>
            </div>
          </div>

          {/* Vote action */}
          <button
            onClick={handleCallVote}
            disabled={voteAnimation}
            className="btn btn-primary pulse-glow"
            style={{ width: '100%', padding: '14px', borderRadius: '12px' }}
          >
            {voteAnimation ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap className="spin-animation" size={16} /> Counting Senator Ballots...
              </span>
            ) : (
              <span>Call Legislative Vote</span>
            )}
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <Landmark size={48} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
          <h4 style={{ fontWeight: 600 }}>Senate is Recessed</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
            No legislation is currently under review. Go to the Cabinet cabinet, adjust a policy slider, and click "Propose Bill" to begin negotiations.
          </p>
        </div>
      )}

      {/* Roll call vote outcome modal display */}
      {voteOutcome && (
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: `4px solid ${voteOutcome.passed ? 'var(--color-success)' : 'var(--color-danger)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {voteOutcome.passed ? (
              <ShieldCheck className="trend-up" size={24} />
            ) : (
              <HeartCrack className="trend-down" size={24} style={{ color: 'var(--color-danger)' }} />
            )}
            <span style={{ fontWeight: 700, fontSize: '1rem', color: voteOutcome.passed ? 'var(--color-success)' : 'var(--color-danger)' }}>
              Bill {voteOutcome.passed ? 'PASSED' : 'DEFEATED'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {voteOutcome.message}
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>YES Votes: <span style={{ color: 'var(--color-success)' }}>{voteOutcome.totalYes}</span></span>
            <span>NO Votes: <span style={{ color: 'var(--color-danger)' }}>{voteOutcome.totalNo}</span></span>
          </div>
        </div>
      )}

    </div>
  );
}

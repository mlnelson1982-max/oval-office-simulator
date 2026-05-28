import React from 'react';
import { Award, Landmark, RefreshCw, AlertOctagon, Sparkles, TrendingDown, ShieldAlert, HeartCrack, Flame, Swords } from 'lucide-react';

export default function ElectionSummary({
  gameOver,
  electionResults,
  resetGame,
  approval,
  debt,
  gdp
}) {
  if (!gameOver) return null;

  const debtToGdp = Number(((debt / gdp) * 100).toFixed(1));

  const getGameOverData = () => {
    switch (gameOver) {
      case 'bankruptcy':
        return {
          title: 'National Bankruptcy',
          desc: `Your national debt-to-GDP ratio reached a catastrophic ${debtToGdp}%. The federal government defaulted, leading to global financial panic and economic collapse.`,
          icon: <AlertOctagon size={48} style={{ color: 'var(--color-danger)' }} />,
          isVictory: false
        };
      case 'coup':
        return {
          title: 'Administrative Collapse',
          desc: 'Your public approval rating fell below 5%. Widespread civil unrest, gridlock, and military intervention have forced an immediate transition of power.',
          icon: <ShieldAlert size={48} style={{ color: 'var(--color-danger)' }} />,
          isVictory: false
        };
      case 'impeachment':
        return {
          title: 'Impeached and Convicted',
          desc: 'With Congressional support hitting rock bottom, the House voted to impeach and the Senate convicted you for executive negligence and failures in leadership.',
          icon: <HeartCrack size={48} style={{ color: 'var(--color-danger)' }} />,
          isVictory: false
        };
      case 'globalwar':
        return {
          title: 'Global War Conflict',
          desc: 'Conflict escalation reached 100%. Military standoffs escalated past diplomacy, triggering total direct warfare and nuclear alerts with rival superpowers.',
          icon: <Flame size={48} style={{ color: 'var(--color-danger)' }} />,
          isVictory: false
        };
      case 'defeat':
        return {
          title: 'Military Defeat',
          desc: 'During active combat operations, your military readiness was depleted to 0%. US defense lines collapsed, forcing immediate national surrender and unconditional terms.',
          icon: <Swords size={48} style={{ color: 'var(--color-danger)' }} />,
          isVictory: false
        };
      case 're-election-won':
        return {
          title: 'Re-election Victory!',
          desc: `Congratulations! You successfully completed your term and secured ${electionResults?.playerVotes} Electoral Votes, winning another 4 years in the Oval Office.`,
          icon: <Award size={48} style={{ color: 'var(--color-success)' }} />,
          isVictory: true
        };
      case 're-election-lost':
        return {
          title: 'Electoral Defeat',
          desc: `One-term President. You failed to secure the necessary 270 electoral votes, capturing only ${electionResults?.playerVotes} electoral votes against your opponent.`,
          icon: <TrendingDown size={48} style={{ color: 'var(--color-danger)' }} />,
          isVictory: false
        };
      default:
        return {
          title: 'Term Concluded',
          desc: 'Your tenure as President has ended.',
          icon: <Landmark size={48} />,
          isVictory: false
        };
    }
  };

  const data = getGameOverData();

  return (
    <div className="modal-overlay" style={{ position: 'fixed', zIndex: 110 }}>
      <div className="glass-panel modal-content pulse-glow" style={{ maxWidth: '440px', border: data.isVictory ? '1px solid var(--color-success-glow)' : '1px solid var(--color-danger-glow)', padding: '28px' }}>
        
        {/* Central Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '50%', border: '1px solid var(--border-glass)' }}>
            {data.icon}
          </div>
        </div>

        {/* Title & Cause */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="status-label" style={{ color: data.isVictory ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            SIMULATION RESOLVED
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 12px 0' }}>
            {data.title}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {data.desc}
          </p>
        </div>

        {/* Electoral College Voting Ticker */}
        {electionResults && (
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '24px' }}>
            <span className="status-label" style={{ display: 'block', textAlign: 'center', marginBottom: '8px', fontSize: '0.7rem' }}>
              Electoral College Results (270 to Win)
            </span>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--color-info)' }}>You: {electionResults.playerVotes}</span>
              <span style={{ color: 'var(--color-danger)' }}>Opponent: {electionResults.opponentVotes}</span>
            </div>

            {/* Voting Bar Slider */}
            <div className="progress-bar-container" style={{ height: '10px', background: 'var(--color-danger)', margin: '4px 0 16px 0' }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(electionResults.playerVotes / 538) * 100}%`, background: 'var(--color-info)', boxShadow: 'none' }}
              />
            </div>

            {/* Regional breakdown */}
            <div className="usa-map-container">
              {electionResults.details.map(reg => (
                <div 
                  key={reg.name} 
                  className={`region-tile ${reg.winner === 'Player' ? 'tile-winner-dem' : 'tile-winner-rep'}`}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{reg.name}</div>
                  <div style={{ fontSize: '0.75rem', display: 'flex', gap: '12px' }}>
                    <span>Approval: {reg.approval}%</span>
                    <span style={{ fontWeight: 700 }}>{reg.electoralVotes} EV</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start Over Button */}
        <button
          onClick={resetGame}
          className="btn btn-primary pulse-glow"
          style={{ width: '100%', padding: '16px', borderRadius: '16px' }}
        >
          <RefreshCw size={16} /> Restart Presidential Term
        </button>

      </div>
    </div>
  );
}

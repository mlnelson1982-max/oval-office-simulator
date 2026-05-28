import React, { useState } from 'react';
import InteractiveGlobe from './InteractiveGlobe';
import { Shield, ShieldAlert, Cpu, Globe, Crosshair, HelpCircle, Activity, Heart, Swords, Landmark, Ban } from 'lucide-react';

const DEFCON_STATES = {
  5: { name: 'DEFCON 5 - NORMAL', desc: 'Peacetime readiness. Security operations are standard.', color: 'var(--color-info)' },
  4: { name: 'DEFCON 4 - DOUBLE GUARD', desc: 'Increased intelligence gathering and border security patrols.', color: 'var(--color-success)' },
  3: { name: 'DEFCON 3 - ROUND HOUSE', desc: 'Air force readiness increased. Defense forces prepared for mobilization.', color: 'var(--color-warning)' },
  2: { name: 'DEFCON 2 - FAST PACE', desc: 'Armed forces prepared for deployment. Critical security threats active.', color: '#f97316' },
  1: { name: 'DEFCON 1 - COCKED PISTOL', desc: 'Maximum alert status. Immediate risk of global war conflict.', color: 'var(--color-danger)' }
};

export default function WarRoom({
  politicalCapital,
  warEscalation,
  defcon,
  militaryReadiness,
  runMilitaryAction,
  countries,
  alliesSupport,
  rivalAggression,
  isAtWar,
  warProgress,
  declareWar,
  interactWithCountry
}) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [actionLog, setActionLog] = useState('');
  const [logColor, setLogColor] = useState('var(--text-muted)');

  const activeDefcon = DEFCON_STATES[defcon] || DEFCON_STATES[5];

  const handleMilitaryAction = (actionId) => {
    const outcome = runMilitaryAction(actionId);
    if (outcome && outcome.success) {
      setActionLog(outcome.description);
      if (outcome.description.includes('compromise') || outcome.description.includes('failed')) {
        setLogColor('var(--color-danger)');
      } else {
        setLogColor('var(--color-success)');
      }
    }
  };

  const handleDiplomaticAction = (actionId) => {
    if (!selectedCountry) return;
    const outcome = interactWithCountry(selectedCountry.id, actionId);
    if (outcome.success) {
      setActionLog(outcome.msg);
      setLogColor('var(--color-success)');
      
      // Update selected country local reference to match updated state list
      const updated = countries.find(c => c.id === selectedCountry.id);
      if (updated) setSelectedCountry(updated);
    } else {
      setActionLog(outcome.msg);
      setLogColor('var(--color-danger)');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* DEFCON Status Box */}
      <div 
        className="glass-panel pulse-glow" 
        style={{ 
          padding: '16px', 
          textAlign: 'center', 
          borderLeft: `5px solid ${activeDefcon.color}`,
          borderRight: `5px solid ${activeDefcon.color}`
        }}
      >
        <span className="status-label" style={{ color: activeDefcon.color, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          NATIONAL SECURITY ADVISORY
        </span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 2px 0', color: activeDefcon.color }}>
          {activeDefcon.name}
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {activeDefcon.desc}
        </p>
      </div>

      {/* Geopolitical indices display */}
      <div className="status-grid">
        {/* Allies Support Index */}
        <div className="glass-panel status-card">
          <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Heart size={12} /> Allies Support
          </span>
          <div className="status-value">{alliesSupport}%</div>
          <div className="progress-bar-container" style={{ height: '4px', marginTop: '6px' }}>
            <div className="progress-bar-fill fill-success" style={{ width: `${alliesSupport}%` }} />
          </div>
        </div>

        {/* Rival Aggression Index */}
        <div className="glass-panel status-card">
          <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldAlert size={12} /> Rival Aggression
          </span>
          <div className="status-value" style={{ color: rivalAggression >= 60 ? 'var(--color-danger)' : 'var(--text-main)' }}>
            {rivalAggression}%
          </div>
          <div className="progress-bar-container" style={{ height: '4px', marginTop: '6px' }}>
            <div 
              className="progress-bar-fill fill-danger" 
              style={{ width: `${rivalAggression}%`, background: rivalAggression >= 60 ? 'var(--color-danger)' : 'var(--color-primary)' }} 
            />
          </div>
        </div>
      </div>

      {/* Interactive 3D Globe */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Globe size={14} /> Interactive Geopolitical Globe
        </span>
        <InteractiveGlobe 
          countries={countries}
          selectedCountry={selectedCountry}
          onSelectCountry={setSelectedCountry}
        />
      </div>

      {/* Action execution output log */}
      {actionLog && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '10px 14px', 
            fontSize: '0.75rem', 
            background: 'rgba(255,255,255,0.01)', 
            borderLeft: `3px solid ${logColor}`,
            fontFamily: 'monospace'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>COMMS REPORT:</span>{' '}
          <span style={{ color: logColor }}>{actionLog}</span>
        </div>
      )}

      {/* Selected Country Diplomatic Dossier */}
      {selectedCountry && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <span className="status-label">Diplomatic Dossier</span>
          
          {/* Header info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 12px 0' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800 }}>{selectedCountry.name}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Leader: {selectedCountry.leader}</span>
            </div>
            
            {/* Status pill */}
            <span 
              className="hud-pill" 
              style={{ 
                padding: '4px 10px', 
                fontSize: '0.7rem', 
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: selectedCountry.status === 'allied' ? 'rgba(6, 182, 212, 0.12)' 
                  : selectedCountry.status === 'friendly' ? 'rgba(16, 185, 129, 0.12)'
                  : selectedCountry.status === 'hostile' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255,255,255,0.02)',
                color: selectedCountry.status === 'allied' ? 'var(--color-info)' 
                  : selectedCountry.status === 'friendly' ? 'var(--color-success)'
                  : selectedCountry.status === 'hostile' ? 'var(--color-warning)' : 'var(--text-muted)',
                border: '1px solid currentColor'
              }}
            >
              {selectedCountry.status} ({selectedCountry.relation}%)
            </span>
          </div>

          {/* Diplomatic Actions Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <button
              onClick={() => handleDiplomaticAction('trade')}
              disabled={politicalCapital < 15}
              className="btn btn-secondary"
              style={{ padding: '8px', fontSize: '0.75rem', flexDirection: 'column', gap: '2px' }}
            >
              <span style={{ fontWeight: 600 }}>Propose Trade Deal</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Relations +15, GDP +0.35%</span>
            </button>

            <button
              onClick={() => handleDiplomaticAction('aid')}
              disabled={politicalCapital < 15}
              className="btn btn-secondary"
              style={{ padding: '8px', fontSize: '0.75rem', flexDirection: 'column', gap: '2px' }}
            >
              <span style={{ fontWeight: 600 }}>Send Defense Aid</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Relations +20, Cost: $80B</span>
            </button>

            <button
              onClick={() => handleDiplomaticAction('threaten')}
              disabled={politicalCapital < 15 || selectedCountry.status === 'allied'}
              className="btn btn-secondary"
              style={{ padding: '8px', fontSize: '0.75rem', flexDirection: 'column', gap: '2px' }}
            >
              <span style={{ fontWeight: 600 }}>Issue Red Line</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-danger)' }}>Relations -25, Aggression +15</span>
            </button>

            <button
              onClick={() => handleDiplomaticAction('lobby')}
              disabled={politicalCapital < 10}
              className="btn btn-secondary"
              style={{ padding: '8px', fontSize: '0.75rem', flexDirection: 'column', gap: '2px' }}
            >
              <span style={{ fontWeight: 600 }}>Lobby Officials</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Relations +8 | Cost: 10 PC</span>
            </button>
          </div>
        </div>
      )}

      {/* Active War Campaign Theater Panel */}
      {isAtWar ? (
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--color-danger)', background: 'rgba(244, 63, 94, 0.03)' }}>
          <span className="status-label" style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Swords size={14} /> COMBAT THEATER IN PROGRESS
          </span>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>War Progress</h3>
            <span style={{ fontWeight: 700, color: 'var(--color-danger)' }}>{warProgress}%</span>
          </div>

          <div className="progress-bar-container" style={{ height: '10px', background: 'rgba(255,255,255,0.05)', margin: '4px 0 16px 0' }}>
            <div className="progress-bar-fill fill-danger" style={{ width: `${warProgress}%` }} />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Campaign Metrics:</span>
            <span>• Estimated advancement speed: <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>+{Math.max(2, Math.round((militaryReadiness - rivalAggression)/2 + 6))}%</span> / turn.</span>
            <span>• Financial overhead: <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>-$800B</span> / turn.</span>
            <span>• GDP growth rate drag: <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>-1.5%</span> due to economic mobilization.</span>
          </div>
        </div>
      ) : (
        /* Regular military operations board */
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="status-label" style={{ marginBottom: '4px' }}>Strategic Operations Board</span>
          
          <button
            onClick={() => handleMilitaryAction('strike_group')}
            disabled={politicalCapital < 20}
            className="btn btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', textAlign: 'left' }}>
              <Crosshair size={16} style={{ color: 'var(--color-primary)' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Deploy Carrier Strike Group</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Ready +15, Escalation -10 | Budget Cost</div>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-primary)' }}>-20 PC</span>
          </button>

          <button
            onClick={() => handleMilitaryAction('sanctions')}
            disabled={politicalCapital < 15}
            className="btn btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', textAlign: 'left' }}>
              <Globe size={16} style={{ color: 'var(--color-warning)' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Enact Diplomatic Sanctions</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Escalation -12 | GDP growth -0.4%</div>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-primary)' }}>-15 PC</span>
          </button>

          <button
            onClick={() => handleMilitaryAction('cyber_op')}
            disabled={politicalCapital < 25}
            className="btn btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', textAlign: 'left' }}>
              <Cpu size={16} style={{ color: 'var(--color-info)' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Launch Covert Cyber Operation</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Escalation -15, Ready +8 | 25% Alert Risk</div>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-primary)' }}>-25 PC</span>
          </button>

          <button
            onClick={() => handleMilitaryAction('mobilize')}
            disabled={politicalCapital < 30}
            className="btn btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', textAlign: 'left' }}>
              <ShieldAlert size={16} style={{ color: 'var(--color-danger)' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Mobilize Ground Reserves</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Readiness +25, Security +12 | Escalation +12</div>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-primary)' }}>-30 PC</span>
          </button>

          {/* Formally Declare War option */}
          {(rivalAggression >= 60 || warEscalation >= 60) && (
            <div style={{ marginTop: '10px', background: 'rgba(244, 63, 94, 0.05)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.4' }}>
                WARNING: High national tensions allow for formal war declarations. Going to war will shift focus to military operations, draining budgets and GDP growth.
              </p>
              <button
                onClick={declareWar}
                className="btn pulse-glow"
                style={{ width: '100%', background: 'var(--color-danger)', color: 'white', fontWeight: 700, display: 'flex', gap: '8px', padding: '12px' }}
              >
                <Swords size={16} /> FORMALLY DECLARE WAR
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

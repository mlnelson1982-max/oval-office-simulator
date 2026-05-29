import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';

const POLICY_DETAILS = {
  incomeTax:            { label: 'Income Tax Rate',      min: 10, max: 70, unit: '%', desc: 'Direct tax levied on citizens personal earnings.',        unlocksAt: 1  },
  corporateTax:         { label: 'Corporate Tax Rate',   min: 5,  max: 50, unit: '%', desc: 'Tax rate imposed on business net profits.',               unlocksAt: 1  },
  carbonTax:            { label: 'Carbon Tax Rate',      min: 0,  max: 50, unit: '%', desc: 'Environmental tax on carbon-producing energy sources.',   unlocksAt: 3  },
  militarySpending:     { label: 'Military Budget',      min: 10, max: 90, unit: '%', desc: 'Resource allocation for defense and strategic forces.',   unlocksAt: 1  },
  healthcareSpending:   { label: 'Public Healthcare',    min: 10, max: 80, unit: '%', desc: 'Government subsidies for public medical services.',       unlocksAt: 2  },
  educationSpending:    { label: 'Public Education',     min: 10, max: 80, unit: '%', desc: 'Funding for national schools, universities, and grants.', unlocksAt: 2  },
  infrastructureSpending:{ label: 'Infrastructure Dev',  min: 5,  max: 75, unit: '%', desc: 'Budgets for highways, transit, grids, and technology.',   unlocksAt: 4  },
  welfareSpending:      { label: 'Social Safety Net',    min: 5,  max: 80, unit: '%', desc: 'Unemployment benefits, pension aid, and food stamps.',    unlocksAt: 3  },
  gunRegulation:        { label: 'Firearms Regulation',  min: 0,  max: 100, unit:'%', desc: 'Background check stringency and weapon licensing.',       unlocksAt: 5  },
  greenSubsidies:       { label: 'Clean Energy Grants',  min: 0,  max: 100, unit:'%', desc: 'Subsidies and tax credits for renewable energy projects.',unlocksAt: 6  },
  borderControl:        { label: 'Border Enforcement',   min: 10, max: 95, unit: '%', desc: 'Funding for border patrols, custom centers, and fencing.',unlocksAt: 4  },
};

export default function Cabinet({
  policies,
  politicalCapital,
  proposedBill,
  proposeBillToCongress,
  setPolicies,
  factions,
  turn = 1
}) {
  const [selectedGroup, setSelectedGroup] = useState('taxes'); // 'taxes' | 'spending' | 'regulation'
  const [tempValues, setTempValues] = useState({ ...policies });

  // Reset temp values back to standard state
  const resetSliderChanges = () => {
    setTempValues({ ...policies });
  };

  const handleSliderChange = (policyKey, val) => {
    setTempValues(prev => ({
      ...prev,
      [policyKey]: Number(val)
    }));
  };

  // Policy categories mapping
  const groups = {
    taxes: ['incomeTax', 'corporateTax', 'carbonTax'],
    spending: ['militarySpending', 'healthcareSpending', 'educationSpending', 'infrastructureSpending', 'welfareSpending'],
    regulation: ['gunRegulation', 'greenSubsidies', 'borderControl']
  };

  // Preview the impact of a policy change on the voter factions
  const getPolicyImpactPreview = (policyKey, targetVal) => {
    const prevVal = policies[policyKey];
    const diff = targetVal - prevVal;
    if (diff === 0) return [];

    const magnitude = diff / 10;
    const impacts = [];

    switch (policyKey) {
      case 'incomeTax':
        impacts.push({ name: 'Wealthy', change: Math.round(magnitude * -1.8) });
        impacts.push({ name: 'Working Class', change: Math.round(magnitude * -0.4) });
        impacts.push({ name: 'Capitalists', change: Math.round(magnitude * -0.9) });
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * 0.8) });
        break;
      case 'corporateTax':
        impacts.push({ name: 'Capitalists', change: Math.round(magnitude * -2.2) });
        impacts.push({ name: 'Wealthy', change: Math.round(magnitude * -1.0) });
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * 1.5) });
        break;
      case 'carbonTax':
        impacts.push({ name: 'Liberals', change: Math.round(magnitude * 1.6) });
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * 0.8) });
        impacts.push({ name: 'Capitalists', change: Math.round(magnitude * -0.8) });
        impacts.push({ name: 'Conservatives', change: Math.round(magnitude * -1.2) });
        break;
      case 'militarySpending':
        impacts.push({ name: 'Conservatives', change: Math.round(magnitude * 1.4) });
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * -0.9) });
        impacts.push({ name: 'Liberals', change: Math.round(magnitude * -0.6) });
        break;
      case 'healthcareSpending':
        impacts.push({ name: 'Working Class', change: Math.round(magnitude * 1.2) });
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * 1.0) });
        impacts.push({ name: 'Liberals', change: Math.round(magnitude * 0.8) });
        impacts.push({ name: 'Capitalists', change: Math.round(magnitude * -0.6) });
        break;
      case 'educationSpending':
        impacts.push({ name: 'Liberals', change: Math.round(magnitude * 1.2) });
        impacts.push({ name: 'Working Class', change: Math.round(magnitude * 0.9) });
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * 0.6) });
        break;
      case 'infrastructureSpending':
        impacts.push({ name: 'Working Class', change: Math.round(magnitude * 0.8) });
        impacts.push({ name: 'Capitalists', change: Math.round(magnitude * 0.6) });
        break;
      case 'welfareSpending':
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * 1.8) });
        impacts.push({ name: 'Working Class', change: Math.round(magnitude * 1.5) });
        impacts.push({ name: 'Capitalists', change: Math.round(magnitude * -1.2) });
        impacts.push({ name: 'Wealthy', change: Math.round(magnitude * -1.0) });
        break;
      case 'gunRegulation':
        impacts.push({ name: 'Liberals', change: Math.round(magnitude * 1.8) });
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * 0.8) });
        impacts.push({ name: 'Conservatives', change: Math.round(magnitude * -2.4) });
        break;
      case 'greenSubsidies':
        impacts.push({ name: 'Liberals', change: Math.round(magnitude * 1.5) });
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * 0.8) });
        impacts.push({ name: 'Capitalists', change: Math.round(magnitude * -0.3) });
        break;
      case 'borderControl':
        impacts.push({ name: 'Conservatives', change: Math.round(magnitude * 1.8) });
        impacts.push({ name: 'Liberals', change: Math.round(magnitude * -1.6) });
        impacts.push({ name: 'Socialists', change: Math.round(magnitude * -0.9) });
        break;
      default:
        break;
    }

    return impacts.filter(imp => imp.change !== 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Category selector */}
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setSelectedGroup('taxes')}
          className="btn" 
          style={{ flex: 1, padding: '10px 6px', fontSize: '0.8rem', background: selectedGroup === 'taxes' ? 'var(--color-primary)' : 'transparent', color: selectedGroup === 'taxes' ? 'white' : 'var(--text-muted)' }}
        >
          Taxes
        </button>
        <button 
          onClick={() => setSelectedGroup('spending')}
          className="btn" 
          style={{ flex: 1, padding: '10px 6px', fontSize: '0.8rem', background: selectedGroup === 'spending' ? 'var(--color-primary)' : 'transparent', color: selectedGroup === 'spending' ? 'white' : 'var(--text-muted)' }}
        >
          Budgets
        </button>
        <button 
          onClick={() => setSelectedGroup('regulation')}
          className="btn" 
          style={{ flex: 1, padding: '10px 6px', fontSize: '0.8rem', background: selectedGroup === 'regulation' ? 'var(--color-primary)' : 'transparent', color: selectedGroup === 'regulation' ? 'white' : 'var(--text-muted)' }}
        >
          Regulations
        </button>
      </div>

      {/* Bill in Congress warning */}
      {proposedBill && (
        <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid var(--color-warning)' }}>
          <AlertCircle className="trend-down" size={20} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>Legislation Pending:</span> Propose new policies after resolving the current bill in the Congress tab.
          </div>
        </div>
      )}

      {/* Policy list rendering */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {groups[selectedGroup].map(key => {
          const info = POLICY_DETAILS[key];
          const isLocked = turn < (info.unlocksAt || 1);
          const curVal = policies[key];
          const tempVal = tempValues[key];
          const diff = tempVal - curVal;
          const impacts = getPolicyImpactPreview(key, tempVal);

          return (
            <div key={key} className={`glass-panel ${isLocked ? '' : ''}`}
              style={{ padding: '16px', position: 'relative', opacity: isLocked ? 0.6 : 1, overflow: 'hidden' }}>

              {/* LOCKED OVERLAY */}
              {isLocked && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 5,
                  background: 'rgba(6,10,24,0.7)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '6px', borderRadius: '14px',
                }}>
                  <Shield size={20} style={{ color: 'var(--color-warning)', opacity: 0.8 }} />
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--color-warning)', letterSpacing: '0.1em' }}>
                    CLASSIFIED  --  UNLOCKS TURN {info.unlocksAt}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                    {info.unlocksAt - turn} quarter{info.unlocksAt - turn !== 1 ? 's' : ''} remaining
                  </span>
                </div>
              )}

              <div className="policy-header">
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{info.label}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{info.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                    {tempVal}{info.unit}
                  </span>
                  {diff !== 0 && (
                    <span style={{ fontSize: '0.8rem', marginLeft: '6px', fontWeight: 600, color: diff > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      ({diff > 0 ? '+' : ''}{diff}{info.unit})
                    </span>
                  )}
                </div>
              </div>

              <div className="slider-container" style={{ margin: '14px 0 10px 0' }}>
                <input
                  type="range"
                  min={info.min}
                  max={info.max}
                  value={tempVal}
                  onChange={(e) => handleSliderChange(key, e.target.value)}
                  disabled={!!proposedBill || isLocked}
                  className="policy-slider"
                />
              </div>

              {/* Dynamic Faction Feedback Preview */}
              {diff !== 0 && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px dashed var(--border-glass)' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={10} /> Predicted Faction Feedback
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {impacts.map(imp => (
                      <div key={imp.name} style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{imp.name}</span>
                        <span style={{ fontWeight: 600, color: imp.change > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                          {imp.change > 0 ? '+' : ''}{imp.change}% loyalty
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Individual propose action */}
              {diff !== 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button 
                    onClick={() => {
                      proposeBillToCongress(key, tempVal);
                    }}
                    disabled={!!proposedBill || politicalCapital < 15}
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                  >
                    Propose Bill (Cost: 15 PC)
                  </button>
                  <button 
                    onClick={() => handleSliderChange(key, curVal)}
                    className="btn btn-secondary" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

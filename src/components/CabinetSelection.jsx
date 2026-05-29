import React, { useState } from 'react';
import { DollarSign, Globe, Shield, User, Award, ShieldAlert, BadgeInfo } from 'lucide-react';

const CANDIDATES = {
  treasury: [
    {
      id: 'olivia',
      name: 'Olivia Vance',
      title: 'The Fiscal Hawk',
      trait: 'Deficit Restraint',
      desc: 'Focused on reducing debt service and balancing budgets. Olivia will tighten interest costs, but welfare programs will feel the squeeze.',
      perks: [
        'Interest rate cost reduced by 0.5% (saves billions on high debt).',
        'Social Welfare index penalized by -5 points starting offset.'
      ],
      icon: <DollarSign size={18} />
    },
    {
      id: 'rodriguez',
      name: 'Marcus Rodriguez',
      title: 'The Keynesian Stimulator',
      trait: 'Aggressive Investment',
      desc: 'Advocates for government-led economic growth. Marcus will boost overall GDP growth and satisfy labor unions, but increases government overhead.',
      perks: [
        'Starts with +0.4% baseline GDP growth and +10% Working Class loyalty.',
        'Increases baseline government spending by $150B in overhead costs.'
      ],
      icon: <Award size={18} />
    }
  ],
  state: [
    {
      id: 'thomas',
      name: 'Thomas Sterling',
      title: 'The Diplomatic Dove',
      trait: 'Peacebuilder',
      desc: 'A seasoned ambassador who favors multilateralism. Thomas makes diplomatic actions cheaper and naturally cools global war escalation, but opposes heavy military deployments.',
      perks: [
        'Diplomatic interactions cost -5 PC. War escalation drifts down by -2% per turn.',
        'Mobilizing ground troops costs +10 PC extra due to diplomatic delays.'
      ],
      icon: <Globe size={18} />
    },
    {
      id: 'victoria',
      name: 'Victoria Vance',
      title: 'The Strategic Hawk',
      trait: 'Iron Diplomacy',
      desc: 'Proponent of armed deterrence and strength projection. Victoria optimizes defense readiness rates and reduces mobilization friction, but makes peaceful de-escalation more costly.',
      perks: [
        'Mobilization PC costs reduced by -5 PC.',
        'All military readiness gains are boosted by +20% (e.g. +18% instead of +15%).'
      ],
      icon: <ShieldAlert size={18} />
    }
  ],
  defense: [
    {
      id: 'arthur',
      name: 'Gen. Arthur Pendelton',
      title: 'The Traditional General',
      trait: 'Force Readiness',
      desc: 'Believes in troop numbers, carrier groups, and strong physical borders. Arthur ensures high starting troop readiness, but requires heavy capital for border modifications.',
      perks: [
        'Military readiness starts higher (+15% starting offset).',
        'Border control policy modifications cost +5 PC extra due to logistics.'
      ],
      icon: <Shield size={18} />
    },
    {
      id: 'chen',
      name: 'Dr. Sarah Chen',
      title: 'The Cyber Theorist',
      trait: 'Digital Shield',
      desc: 'An expert in electronic warfare and cyber defense. Sarah ensures cyber operations succeed with absolute precision, but reduces readiness gains from traditional infantry mobilization.',
      perks: [
        'Covert cyber operations have a 100% success rate (never fail).',
        'Traditional ground mobilization readiness gains are reduced by -5%.'
      ],
      icon: <User size={18} />
    }
  ]
};

export default function CabinetSelection({ appointCabinet }) {
  const [selections, setSelections] = useState({
    treasury: 'olivia',
    state: 'thomas',
    defense: 'arthur'
  });

  const handleSelect = (category, id) => {
    setSelections(prev => ({ ...prev, [category]: id }));
  };

  const handleConfirm = () => {
    appointCabinet(selections.treasury, selections.state, selections.defense);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
      
      {/* Title block */}
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
          Assemble Your Cabinet
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Select the advisors who will lead your administration. Your choices dictate interest rates, diplomatic influence, and cyber security metrics.
        </p>
      </div>

      {/* Grid selector panels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Treasury Selector */}
        <div>
          <span className="status-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <DollarSign size={12} /> Secretary of the Treasury
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {CANDIDATES.treasury.map(c => {
              const active = selections.treasury === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelect('treasury', c.id)}
                  className="glass-panel"
                  style={{
                    padding: '14px 12px',
                    cursor: 'pointer',
                    border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                    background: active ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: active ? 'white' : 'var(--text-muted)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>{c.title}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>{c.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* State Selector */}
        <div>
          <span className="status-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <Globe size={12} /> Secretary of State
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {CANDIDATES.state.map(c => {
              const active = selections.state === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelect('state', c.id)}
                  className="glass-panel"
                  style={{
                    padding: '14px 12px',
                    cursor: 'pointer',
                    border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                    background: active ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: active ? 'white' : 'var(--text-muted)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>{c.title}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>{c.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Defense Selector */}
        <div>
          <span className="status-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <Shield size={12} /> Secretary of Defense
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {CANDIDATES.defense.map(c => {
              const active = selections.defense === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelect('defense', c.id)}
                  className="glass-panel"
                  style={{
                    padding: '14px 12px',
                    cursor: 'pointer',
                    border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                    background: active ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: active ? 'white' : 'var(--text-muted)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>{c.title}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>{c.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Confirmation Dossier */}
      <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-glass)' }}>
        <span className="status-label" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
          <BadgeInfo size={12} /> Active Administration Traits
        </span>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '16px' }}>
          {/* Treasury perk detail */}
          <li style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 600, color: 'white' }}>Treasury Sec:</span>{' '}
            {selections.treasury === 'olivia' ? 'Reduced national interest charges, welfare penalty.' : 'Boosts GDP rate & working class approval, budget surcharge.'}
          </li>
          {/* State perk detail */}
          <li style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 600, color: 'white' }}>State Sec:</span>{' '}
            {selections.state === 'thomas' ? 'Diplomacy discounts, Y-turn auto de-escalation drift, mobilization penalty.' : 'Mobilization discounts, readiness boost multipliers.'}
          </li>
          {/* Defense perk detail */}
          <li style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 600, color: 'white' }}>Defense Sec:</span>{' '}
            {selections.defense === 'arthur' ? 'Higher starting base readiness, border policy penalty.' : 'Cyber operations guaranteed 100% success rate, mobilization penalty.'}
          </li>
        </ul>
      </div>

      {/* Appoint & Start */}
      <button
        onClick={handleConfirm}
        className="btn btn-primary pulse-glow"
        style={{ width: '100%', padding: '16px', borderRadius: '16px' }}
      >
        Appoint Cabinet & Take Office
      </button>

    </div>
  );
}

import React from 'react';
import { AlertTriangle, AlertOctagon, Sparkles, TrendingDown, ShieldAlert } from 'lucide-react';

export default function EventModal({ activeEvent, resolveCrisis }) {
  if (!activeEvent) return null;

  // Map appropriate warning icons based on crisis key
  const getCrisisIcon = (id) => {
    switch (id) {
      case 'wall_street_crash':
        return <TrendingDown size={36} className="trend-down" style={{ color: 'var(--color-danger)' }} />;
      case 'cyber_attack':
        return <ShieldAlert size={36} style={{ color: 'var(--color-warning)' }} />;
      case 'border_surge':
        return <AlertOctagon size={36} style={{ color: 'var(--color-primary)' }} />;
      default:
        return <AlertTriangle size={36} style={{ color: 'var(--color-warning)' }} />;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content pulse-glow" style={{ maxWidth: '420px', border: '1px solid var(--border-glass-glow)' }}>
        
        {/* Header Warning Symbol */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '50%', border: '1px solid var(--border-glass)' }}>
            {getCrisisIcon(activeEvent.id)}
          </div>
        </div>

        {/* Title & Description */}
        <div style={{ textAlign: 'center' }}>
          <span className="status-label" style={{ color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            CRISIS ALERT
          </span>
          <h2 className="modal-title" style={{ justifyContent: 'center', margin: '4px 0 12px 0', fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
            {activeEvent.title}
          </h2>
          <p className="modal-description" style={{ fontSize: '0.85rem' }}>
            {activeEvent.description}
          </p>
        </div>

        {/* Decision Stack */}
        <div className="modal-options-stack">
          {activeEvent.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => resolveCrisis(idx)}
              className="option-button"
            >
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>
                {opt.text}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={10} /> Choose to enact this presidential action
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

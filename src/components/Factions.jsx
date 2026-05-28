import React from 'react';
import * as Icons from 'lucide-react';

export default function Factions({ factions, policies }) {
  
  // Helper to render lucide icons dynamically based on name strings
  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    if (IconComponent) {
      return <IconComponent size={16} />;
    }
    return <Icons.Users size={16} />;
  };

  // Helper to dynamically calculate current quotes from demographic representatives
  const getFactionFeedback = (factionId) => {
    switch (factionId) {
      case 'capitalists':
        if (policies.corporateTax <= 20) {
          return "“Profits are soaring! The current corporate tax rate is highly competitive and boosts jobs.”";
        } else if (policies.corporateTax >= 35) {
          return "“Businesses are stifled. Corporate tax levels are forcing operations overseas.”";
        }
        return "“Market conditions are reasonable, but we are keeping a close watch on regulations.”";
      
      case 'socialists':
        if (policies.welfareSpending >= 55 && policies.corporateTax >= 28) {
          return "“We applaud the strong safety nets and efforts to tax corporate greed.”";
        } else if (policies.welfareSpending <= 25) {
          return "“Social inequality is rampant. Government must immediately reinforce safety nets.”";
        }
        return "“The safety net is holding, but corporate taxation remains too low.”";
      
      case 'liberals':
        if (policies.greenSubsidies >= 50 && policies.gunRegulation >= 50) {
          return "“We are making historic strides on clean energy, education, and gun safety.”";
        } else if (policies.gunRegulation <= 20 || policies.greenSubsidies <= 15) {
          return "“Disastrous. Environmental subsidies and firearm controls are dangerously weak.”";
        }
        return "“Progress is moderate, but we need more ambitious green investment.”";
      
      case 'conservatives':
        if (policies.militarySpending >= 55 && policies.borderControl >= 55) {
          return "“A secure nation! Excellent funding for our borders and our brave armed forces.”";
        } else if (policies.borderControl <= 25) {
          return "“Security is compromised. The southern border checkpoints are severely undermanned.”";
        }
        return "“Security is acceptable, though we must remain vigilant against external threats.”";
      
      case 'workingclass':
        if (policies.healthcareSpending >= 50 && policies.incomeTax <= 30) {
          return "“Healthcare is well funded and tax relief has improved our weekly wages.”";
        } else if (policies.incomeTax >= 45 || policies.healthcareSpending <= 25) {
          return "“Hardworking families are struggling under high taxes and poor public health services.”";
        }
        return "“Living costs are tight, but public infrastructure and schools are holding up.”";
      
      case 'wealthy':
        if (policies.incomeTax <= 25 && policies.corporateTax <= 20) {
          return "“Tax conditions are highly favorable. Capital is growing and financial markets are healthy.”";
        } else if (policies.incomeTax >= 50) {
          return "“Punitive income tax levels are forcing capital flight. This is hostile to wealth.”";
        }
        return "“Tax burdens are currently manageable, though income taxes could be flatter.”";
      
      default:
        return "“We hope the administration keeps its promises.”";
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      
      <div className="glass-panel" style={{ padding: '12px 16px' }}>
        <span className="status-label">Demographic Electorate</span>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Loyalty represents voter support within each demographic. Size dictates their voting weight in the general election.
        </div>
      </div>

      {factions.map(f => {
        const quote = getFactionFeedback(f.id);
        
        return (
          <div key={f.id} className="glass-panel faction-item">
            
            <div className="faction-header">
              <div className="faction-name">
                <span style={{ color: 'var(--color-primary)' }}>{renderIcon(f.icon)}</span>
                <span>{f.name}</span>
              </div>
              <span className="faction-size">Share: {f.size}%</span>
            </div>

            {/* Loyalty bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Loyalty</span>
                <span style={{ fontWeight: 600, color: f.loyalty >= 60 ? 'var(--color-success)' : f.loyalty <= 35 ? 'var(--color-danger)' : 'var(--text-main)' }}>
                  {f.loyalty}%
                </span>
              </div>
              <div className="progress-bar-container" style={{ height: '6px', margin: 0 }}>
                <div 
                  className={`progress-bar-fill ${f.loyalty >= 60 ? 'fill-success' : f.loyalty <= 35 ? 'fill-danger' : 'fill-primary'}`} 
                  style={{ width: `${f.loyalty}%` }}
                />
              </div>
            </div>

            {/* Faction feedback quote */}
            <div style={{ marginTop: '10px', padding: '8px 10px', background: 'rgba(255,255,255,0.01)', borderLeft: '2px solid rgba(255,255,255,0.1)', borderRadius: '0 6px 6px 0' }}>
              <p style={{ fontStyle: 'italic', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {quote}
              </p>
            </div>

          </div>
        );
      })}

    </div>
  );
}

import React, { useState } from 'react';
import AvatarSvg from './AvatarSvg';
import { DollarSign, Shield, Users, TrendingUp, ChevronRight, Activity, Globe, Landmark, TrendingDown } from 'lucide-react';

const PRESIDENT_METADATA = {
  sterling: { name: 'Dr. Clara Sterling', title: 'The Progressive Academic' },
  vance: { name: 'Gen. Marcus Vance', title: 'The Decorated Veteran' },
  cross: { name: 'Aiden Cross', title: 'The Silicon Valley Maverick' }
};

export default function Dashboard({
  selectedPresident,
  presidentName,
  customAvatar,
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
  history,
  advanceTurn,
  marketIndex,
  marketChange,
  turnNotification
}) {
  const [activeChart, setActiveChart] = useState('approval'); // 'approval' | 'economy' | 'social' | 'market'

  const deficit = Number((spending - revenue).toFixed(2));
  const debtToGdp = Number(((debt / gdp) * 100).toFixed(1));

  const dossier = PRESIDENT_METADATA[selectedPresident] || {
    name: 'President of the United States',
    title: 'Executive Commander-in-Chief'
  };

  const displayName = presidentName || dossier.name;

  const getQuarterText = (t) => {
    const year = Math.ceil(t / 4);
    const quarter = ((t - 1) % 4) + 1;
    const quarterNames = ['Q1 (Spring)', 'Q2 (Summer)', 'Q3 (Autumn)', 'Q4 (Winter)'];
    return `Year ${year}, ${quarterNames[quarter - 1]}`;
  };

  const renderSvgChart = () => {
    if (history.length < 2) {
      return (
        <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Simulate a few quarters to populate historical trends.
        </div>
      );
    }

    const width = 360;
    const height = 120;
    const padding = 15;

    let dataPoints = [];
    let minVal = 0;
    let maxVal = 100;
    let strokeColor = 'var(--color-primary)';
    
    if (activeChart === 'approval') {
      dataPoints = history.map(h => h.approval);
      minVal = Math.min(...dataPoints, 30);
      maxVal = Math.max(...dataPoints, 70);
      strokeColor = 'var(--color-info)';
    } else if (activeChart === 'economy') {
      dataPoints = history.map(h => h.gdpGrowth);
      minVal = Math.min(...dataPoints, -2);
      maxVal = Math.max(...dataPoints, 6);
      strokeColor = 'var(--color-success)';
    } else if (activeChart === 'social') {
      dataPoints = history.map(h => ((h.welfare + h.security) / 2));
      minVal = Math.min(...dataPoints, 20);
      maxVal = Math.max(...dataPoints, 80);
      strokeColor = 'var(--color-primary)';
    } else if (activeChart === 'market') {
      dataPoints = history.map(h => h.market || 10000);
      minVal = Math.min(...dataPoints, 5000);
      maxVal = Math.max(...dataPoints, 15000);
      strokeColor = 'var(--color-warning)';
    }

    const range = maxVal - minVal || 1;

    const points = history.map((snapshot, idx) => {
      const x = padding + (idx / (history.length - 1)) * (width - 2 * padding);
      const val = activeChart === 'approval' 
        ? snapshot.approval 
        : activeChart === 'economy' 
          ? snapshot.gdpGrowth 
          : activeChart === 'social' 
            ? ((snapshot.welfare + snapshot.security) / 2)
            : (snapshot.market || 10000);
      
      const y = height - padding - ((val - minVal) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="pulse-glow" style={{ overflow: 'visible', background: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}>
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        
        {history.length > 0 && (() => {
          const coords = points.split(' ').pop().split(',');
          return (
            <circle
              cx={coords[0]}
              cy={coords[1]}
              r="6"
              fill={strokeColor}
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          );
        })()}
      </svg>
    );
  };

  return (
    <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Turn Alerts Notification Banners */}
      {turnNotification && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '12px 16px', 
            borderLeft: '4px solid var(--color-warning)', 
            fontSize: '0.8rem', 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center',
            background: 'rgba(245, 158, 11, 0.03)' 
          }}
        >
          <Landmark size={18} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
          <span>{turnNotification}</span>
        </div>
      )}

      {/* President Dossier Header Card */}
      <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--border-glass-glow)' }}>
            <AvatarSvg avatar={customAvatar} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{displayName}</h4>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{dossier.title}</span>
          </div>
        </div>

        {/* Stock Market Index Ticker Display */}
        <div style={{ textAlign: 'right' }}>
          <span className="status-label" style={{ fontSize: '0.6rem', display: 'block' }}>Wall Street</span>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>
            {marketIndex.toLocaleString()}
          </span>
          <span 
            style={{ 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              marginLeft: '4px',
              color: marketChange >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
            }}
          >
            {marketChange >= 0 ? '▲' : '▼'} {Math.abs(marketChange)}
          </span>
        </div>
      </div>

      {/* HUD Header Strip */}
      <div className="glass-panel hud-strip">
        <div className="hud-pill turn-pill">
          {getQuarterText(turn)}
        </div>
        <div className="hud-pill pc-pill">
          <Activity size={16} />
          <span>{politicalCapital} PC</span>
        </div>
      </div>

      {/* Main Approval Panel — Circular Ring Gauge */}
      {(() => {
        const r = 52;
        const circ = 2 * Math.PI * r;
        const offset = circ - (approval / 100) * circ;
        const approvalColor = approval >= 60 ? 'var(--color-success)' : approval <= 35 ? 'var(--color-danger)' : 'var(--color-warning)';
        const glowClass = approval >= 60 ? 'panel-glow-success' : approval <= 35 ? 'panel-glow-danger pulse-danger' : 'panel-glow-warning';
        return (
          <div className={`glass-panel ${glowClass}`} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ flexShrink: 0, position: 'relative', width: 120, height: 120 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r={r}
                  fill="none"
                  stroke={approvalColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease', filter: `drop-shadow(0 0 6px ${approvalColor})` }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.7rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: approvalColor, lineHeight: 1 }}>{approval}%</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>Approval</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <span className="status-label" style={{ fontSize: '0.65rem' }}>Administration Approval Rating</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                {approval >= 65 ? '🟢 Strong mandate. Bonus PC and higher Congress support.' : approval <= 35 ? '🔴 Dangerously low. Risk of impeachment or coup.' : '🟡 Public sentiment is stable.'}
              </p>
              <div className="progress-bar-container" style={{ margin: '12px 0 0 0' }}>
                <div className={`progress-bar-fill ${approval >= 60 ? 'fill-success' : approval <= 40 ? 'fill-danger' : 'fill-warning'}`} style={{ width: `${approval}%` }} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Grid of core metrics */}
      <div className="status-grid">
        {/* Economy GDP Card */}
        <div className={`glass-panel status-card ${gdpGrowth >= 2 ? 'panel-glow-success' : gdpGrowth < 0 ? 'panel-glow-danger' : ''}`}>
          <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> GDP Growth
          </span>
          <div className="status-value" style={{ color: gdpGrowth >= 2 ? 'var(--color-success)' : gdpGrowth < 0 ? 'var(--color-danger)' : 'var(--text-main)' }}>
            {gdpGrowth >= 0 ? '+' : ''}{gdpGrowth}%
          </div>
          <div className={`status-trend ${gdpGrowth >= 2.0 ? 'trend-up' : 'trend-down'}`}>
            <span>GDP: ${gdp}T</span>
          </div>
        </div>

        {/* Debt & Deficit Card */}
        <div className={`glass-panel status-card ${deficit > 1 ? 'panel-glow-danger' : deficit <= 0 ? 'panel-glow-success' : ''}`}>
          <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign size={12} /> National Debt
          </span>
          <div className="status-value">${debt}T</div>
          <div className={`status-trend ${deficit <= 0 ? 'trend-up' : 'trend-down'}`}>
            <span>{deficit > 0 ? `Deficit: -$${deficit}T` : `Surplus: +$${Math.abs(deficit)}T`}</span>
          </div>
        </div>

        {/* Security Index */}
        <div className={`glass-panel status-card ${security >= 60 ? 'panel-glow-success' : security < 35 ? 'panel-glow-danger' : ''}`}>
          <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Shield size={12} /> Security Index
          </span>
          <div className="status-value" style={{ color: security >= 60 ? 'var(--color-success)' : security < 35 ? 'var(--color-danger)' : 'var(--text-main)' }}>
            {security}%
          </div>
          <div className="progress-bar-container" style={{ height: '4px', marginTop: '6px' }}>
            <div className={`progress-bar-fill ${security >= 60 ? 'fill-success' : security < 35 ? 'fill-danger' : 'fill-primary'}`} style={{ width: `${security}%` }} />
          </div>
        </div>

        {/* Welfare Index */}
        <div className={`glass-panel status-card ${welfare >= 60 ? 'panel-glow-success' : welfare < 35 ? 'panel-glow-danger' : ''}`}>
          <span className="status-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} /> Welfare Index
          </span>
          <div className="status-value" style={{ color: welfare >= 60 ? 'var(--color-success)' : welfare < 35 ? 'var(--color-danger)' : 'var(--text-main)' }}>
            {welfare}%
          </div>
          <div className="progress-bar-container" style={{ height: '4px', marginTop: '6px' }}>
            <div className={`progress-bar-fill ${welfare >= 60 ? 'fill-success' : welfare < 35 ? 'fill-danger' : 'fill-primary'}`} style={{ width: `${welfare}%` }} />
          </div>
        </div>
      </div>

      {/* Debt-to-GDP Ratio Meter */}
      <div className="glass-panel" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="status-label" style={{ fontSize: '0.7rem' }}>Debt-to-GDP Ratio</span>
          <div style={{ fontWeight: 600, fontSize: '1rem', fontFamily: 'var(--font-display)', color: debtToGdp > 150 ? 'var(--color-danger)' : 'var(--text-main)' }}>
            {debtToGdp}%
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Bankruptcy limit: 250%
        </div>
      </div>

      {/* Interactive Charts section */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span className="status-label">Historical Trends</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button 
              className="btn" 
              style={{ padding: '4px 8px', fontSize: '0.7rem', background: activeChart === 'approval' ? 'rgba(255,255,255,0.08)' : 'transparent', border: '1px solid var(--border-glass)' }}
              onClick={() => setActiveChart('approval')}
            >
              Approval
            </button>
            <button 
              className="btn" 
              style={{ padding: '4px 8px', fontSize: '0.7rem', background: activeChart === 'economy' ? 'rgba(255,255,255,0.08)' : 'transparent', border: '1px solid var(--border-glass)' }}
              onClick={() => setActiveChart('economy')}
            >
              GDP
            </button>
            <button 
              className="btn" 
              style={{ padding: '4px 8px', fontSize: '0.7rem', background: activeChart === 'social' ? 'rgba(255,255,255,0.08)' : 'transparent', border: '1px solid var(--border-glass)' }}
              onClick={() => setActiveChart('social')}
            >
              Social
            </button>
            <button 
              className="btn" 
              style={{ padding: '4px 8px', fontSize: '0.7rem', background: activeChart === 'market' ? 'rgba(255,255,255,0.08)' : 'transparent', border: '1px solid var(--border-glass)' }}
              onClick={() => setActiveChart('market')}
            >
              Market
            </button>
          </div>
        </div>
        
        {renderSvgChart()}
      </div>

      {/* Advance Turn Button */}
      <button 
        onClick={advanceTurn}
        className="btn btn-primary" 
        style={{ padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', width: '100%' }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>End Quarter {turn}/16</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Advance to next quarter <ChevronRight size={18} />
        </span>
      </button>

    </div>
  );
}

import React, { useState } from 'react';
import { Shield, Sparkles, BookOpen, GraduationCap, Award, Zap } from 'lucide-react';

const CHARACTERS = [
  {
    id: 'sterling',
    name: 'Dr. Clara Sterling',
    title: 'The Progressive Academic',
    avatar: '/avatar_sterling.png',
    bio: 'A former economics professor and Senator, Clara advocates for systemic social reform, tax equity, and strong welfare programs. She is highly popular with academic and social circles but faces severe friction from industrial coalitions.',
    perks: [
      'Starts with +15% Welfare index and increased initial public health budgets.',
      'Starting Socialists and Liberals loyalty set to +65% and +60%.',
      'Starting Capitalists and Wealthy loyalty penalized by -10%.'
    ],
    theme: 'rgba(6, 182, 212, 0.25)',
    icon: <GraduationCap size={18} />
  },
  {
    id: 'vance',
    name: 'Gen. Marcus Vance',
    title: 'The Decorated Veteran',
    avatar: '/avatar_vance.png',
    bio: 'A retired four-star general and national security advisor, Vance approaches governance through the lens of defense readiness, borders, and national sovereignty. Highly respected by military circles, but critiqued by social groups.',
    perks: [
      'Starts with +15% Security Index and increased military budgets.',
      'Starting Conservatives loyalty set to +70%.',
      'Baseline government spending increased by $50B to cover defense overhead.'
    ],
    theme: 'rgba(244, 63, 94, 0.25)',
    icon: <Shield size={18} />
  },
  {
    id: 'cross',
    name: 'Aiden Cross',
    title: 'The Silicon Valley Maverick',
    avatar: '/avatar_cross.png',
    bio: 'An ambitious tech billionaire and venture capitalist, Aiden brings a disruptive, corporate efficiency angle to the White House. He prioritizes technology infrastructure, deregulation, and lowering corporate tax burdens to drive growth.',
    perks: [
      'Starts with a high +4.3% GDP Growth Rate and low 15% Corporate Tax.',
      'Starting Capitalists and Wealthy loyalty set to +70% and +65%.',
      'Starting Socialists and Working Class loyalty penalized by -15%.'
    ],
    theme: 'rgba(16, 185, 129, 0.25)',
    icon: <Zap size={18} />
  }
];

export default function CharacterSelection({ selectPresident }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const activeChar = CHARACTERS[selectedIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
      
      {/* Title block */}
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
          Select Presidential Candidate
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Choose your character to establish your administration’s background, starting policy sheets, and demographic faction alignments.
        </p>
      </div>

      {/* Profile selector tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {CHARACTERS.map((char, idx) => (
          <button
            key={char.id}
            onClick={() => setSelectedIdx(idx)}
            className="glass-panel"
            style={{
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              border: selectedIdx === idx ? `1px solid ${char.theme.replace('0.25', '0.6')}` : '1px solid var(--border-glass)',
              background: selectedIdx === idx ? char.theme : 'rgba(255,255,255,0.01)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <div style={{ color: selectedIdx === idx ? 'white' : 'var(--text-muted)' }}>
              {char.icon}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', color: selectedIdx === idx ? 'white' : 'var(--text-muted)' }}>
              {char.name.split(' ').pop()}
            </span>
          </button>
        ))}
      </div>

      {/* Selected character dossier details */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Dossier Header */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <img 
            src={activeChar.avatar} 
            alt={activeChar.name} 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '12px', 
              objectFit: 'cover', 
              border: `2px solid ${activeChar.theme.replace('0.25', '0.6')}`,
              boxShadow: `0 0 16px ${activeChar.theme}`
            }} 
          />
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {activeChar.title}
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800 }}>
              {activeChar.name}
            </h3>
          </div>
        </div>

        {/* Bio text */}
        <div>
          <span className="status-label" style={{ fontSize: '0.7rem' }}>BACKGROUND DOSSIER</span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6', marginTop: '4px' }}>
            {activeChar.bio}
          </p>
        </div>

        {/* Perks list */}
        <div>
          <span className="status-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} /> STARTING CAMPAIGN PERKS
          </span>
          <ul style={{ paddingLeft: '16px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeChar.perks.map((perk, pIdx) => (
              <li key={pIdx} style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Start Game CTA */}
        <button
          onClick={() => selectPresident(activeChar.id)}
          className="btn btn-primary pulse-glow"
          style={{ width: '100%', padding: '14px', borderRadius: '12px', marginTop: '6px' }}
        >
          Take the Oath of Office
        </button>

      </div>

    </div>
  );
}

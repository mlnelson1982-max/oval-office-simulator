import React, { useState } from 'react';
import { User, Shield, GraduationCap, Zap, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const AVATARS = [
  { id: 'look1', path: 'https://d8j0ntlcm91z4.cloudfront.net/user_2zmSOfXpLNkGQt3EPoGk8wAvuhO/hf_20260529_015218_d0e1397e-756f-4cdf-a4e7-49d72680d4f2.png', label: 'Subject Alpha' },
  { id: 'look2', path: 'https://d8j0ntlcm91z4.cloudfront.net/user_2zmSOfXpLNkGQt3EPoGk8wAvuhO/hf_20260529_015227_06a84c38-3b55-4c4b-8288-be7a65116bbc.png', label: 'Subject Bravo' },
  { id: 'look3', path: 'https://d8j0ntlcm91z4.cloudfront.net/user_2zmSOfXpLNkGQt3EPoGk8wAvuhO/hf_20260529_015236_3dfe7d94-7e6a-467a-99a4-9f02b0900935.png', label: 'Subject Charlie' },
];

const BACKGROUNDS = [
  {
    id: 'sterling',
    name: 'The Progressive Academic',
    desc: 'Focus on social welfare, education, and progressive taxation.',
    perks: ['+15% Welfare', 'Higher initial education budget', 'Lower income inequality'],
    icon: <GraduationCap size={20} />
  },
  {
    id: 'vance',
    name: 'The Decorated Veteran',
    desc: 'Focus on national security, borders, and military strength.',
    perks: ['+15% Security', 'Increased defense readiness', 'Strict border control'],
    icon: <Shield size={20} />
  },
  {
    id: 'cross',
    name: 'The Silicon Maverick',
    desc: 'Focus on economic growth, deregulation, and tech infrastructure.',
    perks: ['+4.3% Starting GDP Growth', 'Lower corporate taxes', 'Tech industry boom'],
    icon: <Zap size={20} />
  }
];

export default function CharacterSelection({ selectPresident }) {
  const [name, setName] = useState('');
  const [selectedLookIdx, setSelectedLookIdx] = useState(0);
  const [selectedBgIdx, setSelectedBgIdx] = useState(0);

  const handleStart = () => {
    if (!name.trim()) return;
    selectPresident(
      name,
      AVATARS[selectedLookIdx].path,
      BACKGROUNDS[selectedBgIdx].id
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      {/* Tactical Header */}
      <div style={{ borderLeft: '4px solid var(--color-warning)', paddingLeft: '16px', marginBottom: '8px' }}>
        <h2 style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-warning)' }}>
          SECURE TERMINAL: COMMANDER_INIT
        </h2>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          LEVEL 5 CLEARANCE REQUIRED • SUBJECT: EXECUTIVE ONBOARDING
        </p>
      </div>

      {/* Dossier Section */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(245, 158, 11, 0.2)', background: 'rgba(15, 23, 42, 0.9)' }}>
        
        {/* Name Entry */}
        <div>
          <label className="status-label" style={{ color: 'var(--color-warning)', fontSize: '0.65rem' }}>ENTER COMMANDER NAME</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="TYPE_NAME_HERE..."
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-glass)',
              borderRadius: '4px',
              padding: '12px',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '1rem',
              marginTop: '8px',
              outline: 'none',
              borderBottom: name ? '1px solid var(--color-warning)' : '1px solid var(--border-glass)'
            }}
          />
        </div>

        {/* Look Picker */}
        <div>
          <label className="status-label" style={{ color: 'var(--color-warning)', fontSize: '0.65rem' }}>SELECT VISUAL IDENTIFIER</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '12px' }}>
            <button 
              onClick={() => setSelectedLookIdx((prev) => (prev - 1 + AVATARS.length) % AVATARS.length)}
              className="btn-secondary" style={{ padding: '4px' }}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div style={{ position: 'relative' }}>
              <img 
                src={AVATARS[selectedLookIdx].path} 
                alt="Profile" 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '4px', 
                  border: '2px solid var(--color-warning)',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.1)'
                }} 
              />
              <div style={{ position: 'absolute', bottom: '-8px', left: '0', right: '0', background: 'var(--color-warning)', color: 'black', fontSize: '0.6rem', textAlign: 'center', fontWeight: 800, padding: '2px 0' }}>
                ID: {AVATARS[selectedLookIdx].label.toUpperCase()}
              </div>
            </div>

            <button 
              onClick={() => setSelectedLookIdx((prev) => (prev + 1) % AVATARS.length)}
              className="btn-secondary" style={{ padding: '4px' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Ideology Selector */}
        <div>
          <label className="status-label" style={{ color: 'var(--color-warning)', fontSize: '0.65rem' }}>SELECT DOCTRINE BACKGROUND</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {BACKGROUNDS.map((bg, idx) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBgIdx(idx)}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  background: selectedBgIdx === idx ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)',
                  border: selectedBgIdx === idx ? '1px solid var(--color-warning)' : '1px solid var(--border-glass)',
                  borderRadius: '4px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <div style={{ color: selectedBgIdx === idx ? 'var(--color-warning)' : 'var(--text-muted)' }}>
                  {bg.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedBgIdx === idx ? 'white' : 'var(--text-muted)' }}>
                    {bg.name.toUpperCase()}
                  </div>
                  {selectedBgIdx === idx && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {bg.desc}
                    </div>
                  )}
                </div>
                {selectedBgIdx === idx && <Check size={16} style={{ color: 'var(--color-warning)' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="btn"
          style={{ 
            width: '100%', 
            padding: '16px', 
            background: name.trim() ? 'var(--color-warning)' : '#1e293b', 
            color: 'black', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            fontFamily: 'monospace',
            letterSpacing: '0.1em',
            borderRadius: '4px',
            marginTop: '10px'
          }}
        >
          {name.trim() ? 'INITIALIZE COMMAND' : 'AWAITING COMMANDER_NAME...'}
        </button>

      </div>

      {/* Military/Tactical Footer Decals */}
      <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.3, padding: '0 8px' }}>
        <div style={{ fontSize: '0.5rem', fontFamily: 'monospace' }}>
          MODEL: WH-714 // REV: 2026.05.28<br />
          LOC: WASHINGTON_DC_COORD
        </div>
        <div style={{ fontSize: '0.5rem', fontFamily: 'monospace', textAlign: 'right' }}>
          ENCRYPTION: AES-256-GCM<br />
          STATE: SECURE_LINK_STABLE
        </div>
      </div>

    </div>
  );
}

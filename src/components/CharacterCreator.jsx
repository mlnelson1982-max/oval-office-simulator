import React, { useState } from 'react';
import AvatarSvg from './AvatarSvg';
import { Palette, Sparkles, Shirt, Shield, Eye, HelpCircle } from 'lucide-react';

const CREATOR_OPTIONS = {
  skin: [
    { id: 'peach', label: 'Peach' },
    { id: 'tan', label: 'Tan' },
    { id: 'bronze', label: 'Bronze' },
    { id: 'brown', label: 'Brown' }
  ],
  hair: [
    { id: 'crop', label: 'Cropped' },
    { id: 'slicked', label: 'Slicked' },
    { id: 'bob', label: 'Bob Cut' },
    { id: 'waves', label: 'Wavy' },
    { id: 'curly', label: 'Curly' }
  ],
  color: [
    { id: 'black', label: 'Black' },
    { id: 'brown', label: 'Brown' },
    { id: 'blonde', label: 'Blonde' },
    { id: 'auburn', label: 'Auburn' },
    { id: 'gray', label: 'Gray' }
  ],
  attire: [
    { id: 'suit', label: 'Executive Suit' },
    { id: 'blazer', label: 'Academic Blazer' },
    { id: 'turtleneck', label: 'Turtleneck' }
  ],
  accessory: [
    { id: 'none', label: 'None' },
    { id: 'glasses', label: 'Glasses' },
    { id: 'pin', label: 'Flag Pin' }
  ],
  background: [
    { id: 'ovalOffice', label: 'Oval Office' },
    { id: 'pressRoom', label: 'Briefing Room' },
    { id: 'roseGarden', label: 'Rose Garden' }
  ]
};

export default function CharacterCreator({ onSave }) {
  const [selections, setSelections] = useState({
    skin: 'peach',
    hair: 'crop',
    color: 'black',
    attire: 'suit',
    accessory: 'none',
    background: 'ovalOffice'
  });

  const handleSelect = (category, id) => {
    setSelections(prev => ({
      ...prev,
      [category]: id
    }));
  };

  const handleConfirm = () => {
    onSave(selections);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
      
      {/* Title */}
      <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>
          Presidential Portrait Studio
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Design your custom appearance and select your official White House portrait setting.
        </p>
      </div>

      {/* Live Preview Avatar Screen */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          style={{ 
            width: '140px', 
            height: '140px', 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '3px solid var(--color-primary)',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
          }}
        >
          <AvatarSvg avatar={selections} />
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', letterSpacing: '0.05em' }}>
          OFFICIAL ADMINISTRATION PORTRAIT
        </span>
      </div>

      {/* Selectors scroll sheet */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '340px', overflowY: 'auto' }}>
        
        {/* Background Scene */}
        <div>
          <span className="status-label" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Palette size={10} /> Portrait Setting
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {CREATOR_OPTIONS.background.map(opt => {
              const active = selections.background === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('background', opt.id)}
                  className="btn"
                  style={{
                    padding: '8px 4px',
                    fontSize: '0.75rem',
                    background: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    color: active ? 'white' : 'var(--text-muted)'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skin Tone */}
        <div>
          <span className="status-label" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Palette size={10} /> Skin Tone
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {CREATOR_OPTIONS.skin.map(opt => {
              const active = selections.skin === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('skin', opt.id)}
                  className="btn"
                  style={{
                    padding: '8px 4px',
                    fontSize: '0.75rem',
                    background: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    color: active ? 'white' : 'var(--text-muted)'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hairstyle */}
        <div>
          <span className="status-label" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Sparkles size={10} /> Hairstyle
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {CREATOR_OPTIONS.hair.map(opt => {
              const active = selections.hair === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('hair', opt.id)}
                  className="btn"
                  style={{
                    padding: '8px 4px',
                    fontSize: '0.7rem',
                    background: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    color: active ? 'white' : 'var(--text-muted)'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hair Color */}
        <div>
          <span className="status-label" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Palette size={10} /> Hair Color
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
            {CREATOR_OPTIONS.color.map(opt => {
              const active = selections.color === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('color', opt.id)}
                  className="btn"
                  style={{
                    padding: '8px 2px',
                    fontSize: '0.65rem',
                    background: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    color: active ? 'white' : 'var(--text-muted)'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Attire */}
        <div>
          <span className="status-label" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Shirt size={10} /> Dress Attire
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {CREATOR_OPTIONS.attire.map(opt => {
              const active = selections.attire === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('attire', opt.id)}
                  className="btn"
                  style={{
                    padding: '8px 4px',
                    fontSize: '0.7rem',
                    background: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    color: active ? 'white' : 'var(--text-muted)'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accessories */}
        <div>
          <span className="status-label" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Eye size={10} /> Accessories
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {CREATOR_OPTIONS.accessory.map(opt => {
              const active = selections.accessory === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('accessory', opt.id)}
                  className="btn"
                  style={{
                    padding: '8px 4px',
                    fontSize: '0.75rem',
                    background: active ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    color: active ? 'white' : 'var(--text-muted)'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Save Button */}
      <button
        onClick={handleConfirm}
        className="btn btn-primary pulse-glow"
        style={{ width: '100%', padding: '16px', borderRadius: '16px' }}
      >
        Confirm Appearance
      </button>

    </div>
  );
}

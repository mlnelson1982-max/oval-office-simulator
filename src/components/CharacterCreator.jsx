import React, { useState } from 'react';
import AvatarSvg from './AvatarSvg';
import { Palette, Sparkles, Shirt, Shield, Eye, HelpCircle } from 'lucide-react';

const CREATOR_OPTIONS = {
  skin: [
    { id: 'peach',  label: 'Peach',  hex: '#ffd1b3' },
    { id: 'tan',    label: 'Tan',    hex: '#e0a97c' },
    { id: 'bronze', label: 'Bronze', hex: '#b5794a' },
    { id: 'brown',  label: 'Brown',  hex: '#6e4424' }
  ],
  hair: [
    { id: 'crop',    label: 'Cropped' },
    { id: 'slicked', label: 'Slicked' },
    { id: 'bob',     label: 'Bob Cut' },
    { id: 'waves',   label: 'Wavy' },
    { id: 'curly',   label: 'Curly' }
  ],
  color: [
    { id: 'black',  label: 'Black',  hex: '#111827' },
    { id: 'brown',  label: 'Brown',  hex: '#5c3d24' },
    { id: 'blonde', label: 'Blonde', hex: '#eab308' },
    { id: 'auburn', label: 'Auburn', hex: '#b91c1c' },
    { id: 'gray',   label: 'Gray',   hex: '#9ca3af' }
  ],
  attire: [
    { id: 'suit',       label: 'Executive Suit' },
    { id: 'blazer',     label: 'Academic Blazer' },
    { id: 'turtleneck', label: 'Turtleneck' }
  ],
  accessory: [
    { id: 'none',    label: 'None' },
    { id: 'glasses', label: 'Glasses' },
    { id: 'pin',     label: 'Flag Pin' }
  ],
  background: [
    { id: 'ovalOffice',  label: 'Oval Office',    icon: '🏛️' },
    { id: 'pressRoom',   label: 'Briefing Room',  icon: '🎙️' },
    { id: 'roseGarden',  label: 'Rose Garden',    icon: '🌹' }
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
      <div className="glass-panel panel-glow-primary" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,15,35,0.9)' }}>
        {/* Presidential portrait frame */}
        <div style={{ position: 'relative' }}>
          {/* Ornate corner decals */}
          <div style={{ position: 'absolute', top: -6, left: -6, width: 14, height: 14, borderTop: '2px solid rgba(212,168,67,0.6)', borderLeft: '2px solid rgba(212,168,67,0.6)' }} />
          <div style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, borderTop: '2px solid rgba(212,168,67,0.6)', borderRight: '2px solid rgba(212,168,67,0.6)' }} />
          <div style={{ position: 'absolute', bottom: -6, left: -6, width: 14, height: 14, borderBottom: '2px solid rgba(212,168,67,0.6)', borderLeft: '2px solid rgba(212,168,67,0.6)' }} />
          <div style={{ position: 'absolute', bottom: -6, right: -6, width: 14, height: 14, borderBottom: '2px solid rgba(212,168,67,0.6)', borderRight: '2px solid rgba(212,168,67,0.6)' }} />
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid rgba(212,168,67,0.4)',
            boxShadow: '0 0 30px rgba(212,168,67,0.15), 0 8px 24px rgba(0,0,0,0.6)',
          }}>
            <AvatarSvg avatar={selections} />
          </div>
        </div>
        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'rgba(212,168,67,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            OFFICIAL ADMINISTRATION PORTRAIT
          </div>
          <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.08em' }}>
            {CREATOR_OPTIONS.background.find(b => b.id === selections.background)?.icon} {CREATOR_OPTIONS.background.find(b => b.id === selections.background)?.label}
          </div>
        </div>
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
                <button key={opt.id} onClick={() => handleSelect('background', opt.id)} className="btn"
                  style={{ padding: '10px 4px', fontSize: '0.7rem', flexDirection: 'column', gap: '3px',
                    background: active ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: active ? '1px solid var(--color-primary)' : '1px solid var(--border-glass)',
                    color: active ? 'white' : 'var(--text-muted)' }}>
                  <span style={{ fontSize: '1rem' }}>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skin Tone — color swatches */}
        <div>
          <span className="status-label" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Palette size={10} /> Skin Tone
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {CREATOR_OPTIONS.skin.map(opt => {
              const active = selections.skin === opt.id;
              return (
                <button key={opt.id} onClick={() => handleSelect('skin', opt.id)} title={opt.label}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: active ? '3px solid white' : '2px solid rgba(255,255,255,0.15)',
                    background: opt.hex, cursor: 'pointer', boxShadow: active ? `0 0 10px ${opt.hex}88` : 'none',
                    transition: 'all 0.15s ease', transform: active ? 'scale(1.15)' : 'scale(1)' }} />
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

        {/* Hair Color — color swatches */}
        <div>
          <span className="status-label" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
            <Palette size={10} /> Hair Color
          </span>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {CREATOR_OPTIONS.color.map(opt => {
              const active = selections.color === opt.id;
              return (
                <button key={opt.id} onClick={() => handleSelect('color', opt.id)} title={opt.label}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: active ? '3px solid white' : '2px solid rgba(255,255,255,0.15)',
                    background: opt.hex, cursor: 'pointer', boxShadow: active ? `0 0 8px ${opt.hex}88` : 'none',
                    transition: 'all 0.15s ease', transform: active ? 'scale(1.18)' : 'scale(1)' }} />
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

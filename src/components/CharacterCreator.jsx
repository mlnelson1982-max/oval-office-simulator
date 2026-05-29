import React, { useState } from 'react';
import AvatarSvg from './AvatarSvg';
import { Palette, Sparkles, Shirt, Shield, Eye, HelpCircle, Image, Key, Loader2 } from 'lucide-react';

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
    background: 'ovalOffice',
    aiPortrait: null
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const buildPortraitPrompt = (sel) => {
    const skinText = {
      peach: 'fair peach skin tone',
      tan: 'warm tan skin tone',
      bronze: 'deep bronze skin tone',
      brown: 'rich brown skin tone'
    }[sel.skin] || 'natural skin tone';

    const hairText = {
      crop: 'short cropped hair style',
      slicked: 'slicked-back combed hair style',
      bob: 'bob cut hair style',
      waves: 'flowing wavy hair style',
      curly: 'short curly hair style'
    }[sel.hair] || 'neat hair';

    const colorText = sel.color + ' hair color';

    const attireText = {
      suit: 'a dark executive suit with a blue tie and white collared shirt',
      blazer: 'a classic green academic blazer with a white shirt',
      turtleneck: 'a modern black turtleneck sweater'
    }[sel.attire] || 'professional attire';

    const accessoryText = {
      none: '',
      glasses: 'wearing classic black-framed reading glasses',
      pin: 'wearing a small American flag pin on the lapel'
    }[sel.accessory] || '';

    const bgText = {
      ovalOffice: 'inside the historic White House Oval Office, with mahogany wood paneling and elegant blue drapery curtains with gold trim in the background',
      pressRoom: 'standing at a dark wood podium with the official White House press briefing seal visible in the background',
      roseGarden: 'standing outside in the White House Rose Garden, with lush green foliage, blooming roses, and classic white columns in the soft-focus background'
    }[sel.background] || 'inside the White House';

    return `A highly professional, realistic, cinematic official photographic portrait of the President of the United States. The president has a ${skinText}, ${hairText} of ${colorText}, and is ${accessoryText ? accessoryText + ' and ' : ''}wearing ${attireText}. Setting is ${bgText}. Studio lighting, professional presidential portrait photography, award-winning, highly detailed, photorealistic, 8k resolution.`;
  };

  const handleGenerateAI = async () => {
    if (!apiKey.trim()) {
      setGenerationError('Please enter a valid Gemini API Key.');
      return;
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    
    const prompt = buildPortraitPrompt(selections);
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [
              {
                prompt: prompt
              }
            ],
            parameters: {
              sampleCount: 1,
              aspectRatio: '1:1',
              outputMimeType: 'image/jpeg',
              personGeneration: 'ALLOW_ADULT'
            }
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const base64Data = data.predictions?.[0]?.bytesBase64Encoded;
      
      if (!base64Data) {
        throw new Error('No image predictions returned from Gemini API.');
      }
      
      const imageUrl = `data:image/jpeg;base64,${base64Data}`;
      setSelections(prev => ({
        ...prev,
        aiPortrait: imageUrl
      }));
    } catch (err) {
      console.error(err);
      setGenerationError(err.message || 'Failed to generate AI portrait.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = (category, id) => {
    setSelections(prev => ({
      ...prev,
      [category]: id,
      aiPortrait: null // Reset AI portrait since traits changed
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
            position: 'relative'
          }}>
            {selections.aiPortrait ? (
              <img src={selections.aiPortrait} alt="AI Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <AvatarSvg avatar={selections} />
            )}
            
            {/* Overlay generating status */}
            {isGenerating && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '8px', zIndex: 10
              }}>
                <Loader2 size={24} style={{ color: 'var(--color-primary)', animation: 'spin 1.5s linear infinite' }} />
                <span style={{ fontSize: '0.55rem', fontFamily: 'monospace', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>
                  CALLING NANO BANANA...
                </span>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: 'rgba(212,168,67,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {selections.aiPortrait ? 'AI GENERATED PORTRAIT' : 'OFFICIAL VECTOR PORTRAIT'}
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

      {/* AI GENERATION CONTROLS */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="status-label" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem' }}>
            <Sparkles size={12} /> NANO BANANA AI ENGINE (IMAGEN 3)
          </span>
          <span style={{ fontSize: '0.55rem', fontFamily: 'monospace', color: 'rgba(212,175,55,0.5)' }}>
            REALISTIC PORTRAIT MOD
          </span>
        </div>

        {/* API Key Entry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Key size={10} /> ENTER GEMINI API KEY
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              localStorage.setItem('gemini_api_key', e.target.value);
            }}
            placeholder="AI Studio API Key (AI_KEY)..."
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-glass)',
              borderRadius: '4px',
              padding: '10px 12px',
              color: 'white',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          />
          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
            Get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Google AI Studio</a>. Saved locally.
          </span>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateAI}
          disabled={isGenerating || !apiKey.trim()}
          className="btn btn-secondary"
          style={{
            width: '100%', padding: '12px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: apiKey.trim() ? 'var(--color-primary)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, gap: '8px'
          }}
        >
          <Image size={14} />
          <span>{isGenerating ? 'GENERATING REAL PORTRAIT...' : selections.aiPortrait ? 'REGENERATE AI PORTRAIT' : 'GENERATE AI REAL PORTRAIT'}</span>
        </button>

        {generationError && (
          <div style={{ color: 'var(--color-danger)', fontSize: '0.7rem', padding: '8px', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '4px', lineHeight: 1.4 }}>
            Error: {generationError}
          </div>
        )}

        {selections.aiPortrait && (
          <div style={{ fontSize: '0.65rem', color: 'var(--color-success)', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
            ✓ Realistic portrait generated! Tap "Confirm Appearance" to set this as your official dossier photo.
          </div>
        )}
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

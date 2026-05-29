import React from 'react';

const SKIN_TONES = {
  peach: '#ffd1b3',
  tan: '#e0a97c',
  bronze: '#b5794a',
  brown: '#6e4424'
};

const HAIR_COLORS = {
  black: '#111827',
  brown: '#5c3d24',
  blonde: '#eab308',
  auburn: '#b91c1c',
  gray: '#9ca3af'
};

export default function AvatarSvg({ avatar }) {
  const {
    skin = 'peach',
    hair = 'crop',
    color = 'black',
    attire = 'suit',
    accessory = 'none',
    background = 'ovalOffice'
  } = avatar || {};

  const skinColor = SKIN_TONES[skin] || SKIN_TONES.peach;
  const hairColor = HAIR_COLORS[color] || HAIR_COLORS.black;

  // Render Background Graphic
  const renderBackground = () => {
    switch (background) {
      case 'pressRoom':
        // Press Briefing Room: Blue wall backdrop with White House seal circle outline
        return (
          <>
            <rect width="100" height="100" fill="#0f172a" />
            {/* Press Seal Backdrop */}
            <circle cx="50" cy="40" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
            <circle cx="50" cy="40" r="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 2" />
            {/* Podium silhouette */}
            <rect x="36" y="80" width="28" height="20" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line x1="50" y1="80" x2="50" y2="92" stroke="#d4af37" strokeWidth="1.5" />
          </>
        );
      case 'roseGarden':
        // Rose Garden: Soft green backdrop with white arches/columns
        return (
          <>
            <rect width="100" height="100" fill="#064e3b" />
            {/* Soft garden foliage circles */}
            <circle cx="20" cy="40" r="30" fill="#065f46" opacity="0.6" />
            <circle cx="80" cy="35" r="25" fill="#047857" opacity="0.5" />
            <circle cx="50" cy="30" r="20" fill="#065f46" opacity="0.4" />
            {/* Columns */}
            <rect x="5" y="10" width="8" height="90" fill="rgba(255,255,255,0.06)" />
            <rect x="87" y="10" width="8" height="90" fill="rgba(255,255,255,0.06)" />
            <path d="M 0,15 H 100 M 0,22 H 100" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </>
        );
      case 'ovalOffice':
      default:
        // Classic Oval Office: mahogany wall gradient and golden drape arch
        return (
          <>
            {/* Wall background */}
            <rect width="100" height="100" fill="#1e1b18" />
            <rect width="100" height="100" fill="url(#mahoganyGrad)" />
            {/* Blue Curtains */}
            <path d="M 0,0 C 20,25 30,0 30,0 C 35,25 45,0 45,0 L 50,0 L 55,0 C 55,0 65,25 70,0 C 70,0 80,25 100,0 L 100,20 C 100,20 85,35 90,90 L 100,95 L 100,100 L 0,100 L 0,95 L 10,90 C 15,35 0,20 0,20 Z" fill="#1e3a8a" opacity="0.85" />
            <path d="M 0,0 C 20,25 30,0 30,0 C 35,25 45,0 45,0 L 50,0" fill="none" stroke="#d4af37" strokeWidth="1.5" />
            <path d="M 100,0 C 80,25 70,0 70,0 C 65,25 55,0 55,0 L 50,0" fill="none" stroke="#d4af37" strokeWidth="1.5" />
            {/* Gold curtain tie bands */}
            <path d="M 0,55 C 8,55 10,60 10,60 L 0,63" fill="none" stroke="#d4af37" strokeWidth="1" />
            <path d="M 100,55 C 92,55 90,60 90,60 L 100,63" fill="none" stroke="#d4af37" strokeWidth="1" />
          </>
        );
    }
  };

  // Render Hairstyle Paths
  const renderHair = () => {
    switch (hair) {
      case 'slicked':
        // Combed back, clean side-part
        return (
          <path 
            d="M 33,35 C 33,20 40,16 50,16 C 60,16 67,20 67,35 C 67,36 68,39 65,39 C 62,39 63,33 50,23 C 37,33 38,39 35,39 C 32,39 33,36 33,35 Z" 
            fill={hairColor} 
          />
        );
      case 'bob':
        // Mid-length bob framing face
        return (
          <path 
            d="M 32,38 C 30,22 36,15 50,15 C 64,15 70,22 68,38 C 68,48 70,55 69,57 C 68,58 66,54 65,42 C 65,35 63,22 50,22 C 37,22 35,35 35,42 C 34,54 32,58 31,57 C 30,55 32,48 32,38 Z" 
            fill={hairColor} 
          />
        );
      case 'waves':
        // Long wavy hair flowing down shoulders
        return (
          <path 
            d="M 32,35 C 31,20 37,14 50,14 C 63,14 69,20 68,35 C 67,48 72,55 71,68 C 70,72 65,65 64,52 C 64,40 64,22 50,22 C 36,22 36,40 36,52 C 35,65 30,72 29,68 C 28,55 33,48 32,35 Z" 
            fill={hairColor} 
          />
        );
      case 'curly':
        // Afro/curly cloud around head
        return (
          <path 
            d="M 30,35 C 26,30 28,22 34,18 C 38,14 44,12 50,14 C 56,12 62,14 66,18 C 72,22 74,30 70,35 C 72,42 69,49 66,51 C 65,48 64,40 50,21 C 36,40 35,48 34,51 C 31,49 28,42 30,35 Z" 
            fill={hairColor} 
          />
        );
      case 'crop':
      default:
        // Short crop cut
        return (
          <path 
            d="M 34,35 C 33,23 38,18 50,18 C 62,18 67,23 66,35 C 66,35 65,32 60,30 C 55,28 50,29 50,29 C 50,29 45,28 40,30 C 35,32 34,35 34,35 Z" 
            fill={hairColor} 
          />
        );
    }
  };

  // Render Attire
  const renderAttire = () => {
    switch (attire) {
      case 'blazer':
        // Tweed/Academic Blazer with white shirt collar
        return (
          <>
            {/* Blazer Base */}
            <path d="M 28,82 L 72,82 L 78,100 L 22,100 Z" fill="#0f5132" />
            <path d="M 40,82 L 60,82 L 64,100 L 36,100 Z" fill="#ffffff" /> {/* White Shirt */}
            {/* Lapels */}
            <path d="M 28,82 L 44,95 L 42,100 L 22,100 Z" fill="#0a3622" />
            <path d="M 72,82 L 56,95 L 58,100 L 78,100 Z" fill="#0a3622" />
          </>
        );
      case 'turtleneck':
        // Modern black turtleneck
        return (
          <path d="M 28,82 L 72,82 L 76,100 L 24,100 Z" fill="#1e1e1e" />
        );
      case 'suit':
      default:
        // Executive Suit with tie
        const tieColor = background === 'pressRoom' ? '#dc2626' : '#2563eb'; // Red in Press Room, Blue in Oval Office
        return (
          <>
            {/* Suit jacket outer body */}
            <path d="M 28,82 L 72,82 L 78,100 L 22,100 Z" fill="#1e293b" />
            {/* White inner shirt V neck */}
            <path d="M 42,82 L 58,82 L 50,96 Z" fill="#ffffff" />
            {/* Color tie */}
            <path d="M 48,82 L 52,82 L 53,96 L 50,100 L 47,96 Z" fill={tieColor} />
            {/* Suit Lapels */}
            <path d="M 28,82 L 44,92 L 40,100 L 22,100 Z" fill="#0f172a" />
            <path d="M 72,82 L 56,92 L 60,100 L 78,100 Z" fill="#0f172a" />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}>
      <defs>
        {/* Gradients */}
        <radialGradient id="mahoganyGrad" cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor="#2e1b12" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0c0705" stopOpacity="0.95" />
        </radialGradient>
      </defs>

      {/* 1. Background scene */}
      {renderBackground()}

      {/* 2. Character Body & Head base */}
      {/* Neck */}
      <path d="M 43,65 L 57,65 L 58,83 L 42,83 Z" fill={skinColor} />
      <path d="M 43,65 L 57,65 L 55,72 L 45,72 Z" fill="rgba(0,0,0,0.12)" /> {/* Shadow under chin */}
      
      {/* Face shape */}
      <path d="M 34,44 C 34,30 40,24 50,24 C 60,24 66,30 66,44 C 66,56 58,68 50,68 C 42,68 34,56 34,44 Z" fill={skinColor} />

      {/* 3. Eyes, Eyebrows and Mouth */}
      {/* Eyebrows */}
      <path d="M 41,37 Q 44,35 47,38" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 59,37 Q 56,35 53,38" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Eyes */}
      <circle cx="44" cy="41" r="2" fill="#2d3748" />
      <circle cx="56" cy="41" r="2" fill="#2d3748" />
      <circle cx="44.8" cy="40.2" r="0.6" fill="#ffffff" /> {/* Eye reflection glints */}
      <circle cx="56.8" cy="40.2" r="0.6" fill="#ffffff" />
      
      {/* Nose */}
      <path d="M 50,42 L 48.5,50 Q 50,51 51.5,50" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" strokeLinecap="round" />
      
      {/* Smile Mouth */}
      <path d="M 43,56 Q 50,61 57,56" fill="none" stroke="#be123c" strokeWidth="1.8" strokeLinecap="round" />

      {/* 4. Attire (Jacket/Shirt) */}
      {renderAttire()}

      {/* 5. Hairstyle overlay */}
      {renderHair()}

      {/* 6. Accessory overlay */}
      {/* Flag pin */}
      {accessory === 'pin' && attire !== 'turtleneck' && (
        <g transform="translate(34, 88)">
          <rect x="0" y="0" width="3.5" height="2.5" fill="#1e3a8a" />
          <rect x="1.5" y="0" width="2" height="1.2" fill="#ef4444" />
          <rect x="1.5" y="1.2" width="2" height="1.3" fill="#ffffff" />
        </g>
      )}
      
      {/* Glasses */}
      {accessory === 'glasses' && (
        <g>
          {/* Left frame */}
          <circle cx="44" cy="41" r="5" fill="none" stroke="#111827" strokeWidth="1.2" />
          {/* Right frame */}
          <circle cx="56" cy="41" r="5" fill="none" stroke="#111827" strokeWidth="1.2" />
          {/* Bridge */}
          <path d="M 49,41 Q 50,39 51,41" fill="none" stroke="#111827" strokeWidth="1.2" />
          {/* Sides */}
          <path d="M 39,41 L 34,40" fill="none" stroke="#111827" strokeWidth="1.0" />
          <path d="M 61,41 L 66,40" fill="none" stroke="#111827" strokeWidth="1.0" />
        </g>
      )}

    </svg>
  );
}

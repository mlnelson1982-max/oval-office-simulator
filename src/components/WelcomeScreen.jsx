import React, { useState, useEffect, useRef } from 'react';

const HERO_IMAGE = 'https://d8j0ntlcm91z4.cloudfront.net/user_2zmSOfXpLNkGQt3EPoGk8wAvuhO/hf_20260529_015150_8f443934-f3ec-4734-ae39-bc23fa0abb49.png';

const BG_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_2zmSOfXpLNkGQt3EPoGk8wAvuhO/hf_20260529_015445_b7d6237c-98b6-47bd-9ea5-f1f3eeda737c.mp4';

export default function WelcomeScreen({ onStart }) {
  const [titleVisible, setTitleVisible] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [scanline, setScanline] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setTitleVisible(true), 300);
    const t2 = setTimeout(() => setSubtitleVisible(true), 900);
    const t3 = setTimeout(() => setCtaVisible(true), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Slow scanline sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setScanline(prev => (prev + 0.3) % 100);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      background: '#070911',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      {/* === BACKGROUND LAYER === */}
      {BG_VIDEO ? (
        <video
          ref={videoRef}
          src={BG_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 0.55,
            filter: 'saturate(0.8) brightness(0.7)',
          }}
        />
      ) : (
        <img
          src={HERO_IMAGE}
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 0.5,
            filter: 'saturate(0.75) brightness(0.65)',
          }}
        />
      )}

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 25%, rgba(15,11,9,0.85) 70%, rgba(0,0,0,0.95) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Top + bottom gradient bands */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.85) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Moving scan beam */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0,
        top: `${scanline}%`,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.15), rgba(212,175,55,0.3), rgba(212,175,55,0.15), transparent)',
        pointerEvents: 'none',
        zIndex: 3,
        transition: 'top 0.016s linear',
      }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(212,175,55,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* === CONTENT LAYER === */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        padding: '0 24px',
        maxWidth: 480,
        width: '100%',
      }}>

        {/* Classification badge */}
        <div style={{
          fontSize: '0.6rem',
          fontFamily: 'monospace',
          letterSpacing: '0.18em',
          color: 'rgba(245,158,11,0.7)',
          border: '1px solid rgba(245,158,11,0.25)',
          padding: '4px 14px',
          borderRadius: '2px',
          marginBottom: '24px',
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          TS/SCI // EXECUTIVE ACCESS ONLY
        </div>

        {/* Seal icon */}
        <div style={{
          fontSize: '2.5rem',
          marginBottom: '16px',
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.6))',
        }}>
          🏛️
        </div>

        {/* Main Title */}
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
          marginBottom: '4px',
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s',
          background: 'linear-gradient(135deg, #ffffff 0%, #f3e8c9 50%, #d4af37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: 'none',
        }}>
          OVAL OFFICE
        </h1>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
          letterSpacing: '0.12em',
          lineHeight: 1.1,
          marginBottom: '20px',
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s',
          background: 'linear-gradient(135deg, #d4a843 0%, #fbbf24 50%, #d4a843 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          SIMULATOR
        </h1>

        {/* Divider */}
        <div style={{
          width: subtitleVisible ? '140px' : '0px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)',
          marginBottom: '20px',
          transition: 'width 0.8s ease',
        }} />

        {/* Subtitle */}
        <p style={{
          fontSize: '0.75rem',
          color: 'rgba(148,163,184,0.85)',
          letterSpacing: '0.12em',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          marginBottom: '40px',
          opacity: subtitleVisible ? 1 : 0,
          transform: subtitleVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          lineHeight: 1.8,
        }}>
          Command the nation. Shape history.<br />
          Every decision has consequences.
        </p>

        {/* Feature pills */}
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '40px',
          opacity: subtitleVisible ? 1 : 0,
          transform: subtitleVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
        }}>
          {['16 Turns', 'Live Congress', 'War Room', 'Globe Intel', '5 Factions'].map(tag => (
            <span key={tag} style={{
              fontSize: '0.6rem',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
              color: 'rgba(247,231,180,0.8)',
              border: '1px solid rgba(212,175,55,0.2)',
              background: 'rgba(212,175,55,0.07)',
              padding: '4px 10px',
              borderRadius: '4px',
            }}>{tag}</span>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          style={{
            padding: '18px 48px',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#000',
            background: 'linear-gradient(135deg, #d4a843, #f59e0b, #d4a843)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
            transition: 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.2s ease',
            boxShadow: '0 0 30px rgba(212,168,67,0.35), 0 4px 20px rgba(0,0,0,0.4)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 0 50px rgba(212,168,67,0.55), 0 6px 30px rgba(0,0,0,0.5)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(212,168,67,0.35), 0 4px 20px rgba(0,0,0,0.4)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          ▶ &nbsp; TAKE COMMAND
        </button>

        {/* Footer status line */}
        <div style={{
          marginTop: '28px',
          fontSize: '0.5rem',
          fontFamily: 'monospace',
          color: 'rgba(100,116,139,0.6)',
          letterSpacing: '0.1em',
          opacity: ctaVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}>
          CLASSIFICATION: TOP SECRET // REV 2026 // WHITEHOUSE SECURE TERMINAL
        </div>
      </div>

      {/* Corner HUD decals */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <div style={{ fontSize: '0.5rem', fontFamily: 'monospace', color: 'rgba(212,175,55,0.4)', lineHeight: 1.8 }}>
          SYS: ONLINE<br />ENC: AES-256-GCM
        </div>
      </div>
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, textAlign: 'right' }}>
        <div style={{ fontSize: '0.5rem', fontFamily: 'monospace', color: 'rgba(212,175,55,0.4)', lineHeight: 1.8 }}>
          {new Date().getFullYear()}.{String(new Date().getMonth()+1).padStart(2,'0')}.{String(new Date().getDate()).padStart(2,'0')}<br />
          WASHINGTON_DC
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10 }}>
        <div style={{ width: 40, height: 40, border: '1px solid rgba(212,175,55,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 6, height: 6, background: 'rgba(16,185,129,0.8)', borderRadius: '50%', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }} />
        </div>
      </div>
    </div>
  );
}

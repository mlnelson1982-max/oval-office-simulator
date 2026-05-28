import React, { useRef, useEffect, useState } from 'react';

export default function InteractiveGlobe({ countries, selectedCountry, onSelectCountry }) {
  const canvasRef = useRef(null);
  const [rotationX, setRotationX] = useState(0.4); // Pitch
  const [rotationY, setRotationY] = useState(0.5); // Yaw
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotStart = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);

  const GLOBE_RADIUS = 50;

  // Convert Lat/Lng to 3D Cartesian Coordinates on a sphere of radius R
  const latLngToCartesian = (lat, lng, R) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -R * Math.sin(phi) * Math.sin(theta);
    const y = R * Math.cos(phi);
    const z = R * Math.sin(phi) * Math.cos(theta);

    return { x, y, z };
  };

  // Apply 3D coordinate rotation on axes X and Y
  const rotatePoint = (pt, rotX, rotY) => {
    // Rotate Y (Yaw)
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    let x1 = pt.x * cosY - pt.z * sinY;
    let z1 = pt.x * sinY + pt.z * cosY;
    let y1 = pt.y;

    // Rotate X (Pitch)
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    let y2 = y1 * cosX - z1 * sinX;
    let z2 = y1 * sinX + z1 * cosX;
    let x2 = x1;

    return { x: x2, y: y2, z: z2 };
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animId;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const render = () => {
      // Clear screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Auto rotation drift if not user dragging
      let currRotY = rotationY;
      if (autoRotateRef.current && !isDragging) {
        currRotY += 0.003;
        setRotationY(currRotY);
      }

      // Draw background atmospheric glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, GLOBE_RADIUS - 10, centerX, centerY, GLOBE_RADIUS + 15);
      glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.03)');
      glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, GLOBE_RADIUS + 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw Sphere Backdrop outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, GLOBE_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // Render Parallels (latitude rings)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 0.5;
      const parallelSteps = [-60, -30, 0, 30, 60];
      parallelSteps.forEach(lat => {
        ctx.beginPath();
        let drawing = false;

        for (let lng = -180; lng <= 180; lng += 5) {
          const pt3d = latLngToCartesian(lat, lng, GLOBE_RADIUS);
          const rotPt = rotatePoint(pt3d, rotationX, currRotY);

          // Only draw points on the front hemisphere (z > 0)
          if (rotPt.z > 0) {
            const sx = centerX + rotPt.x;
            const sy = centerY + rotPt.y;
            if (!drawing) {
              ctx.moveTo(sx, sy);
              drawing = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      });

      // Render Meridians (longitude rings)
      const meridianSteps = [0, 45, 90, 135, 180, 225, 270, 315];
      meridianSteps.forEach(lng => {
        ctx.beginPath();
        let drawing = false;

        for (let lat = -90; lat <= 90; lat += 5) {
          const pt3d = latLngToCartesian(lat, lng, GLOBE_RADIUS);
          const rotPt = rotatePoint(pt3d, rotationX, currRotY);

          if (rotPt.z > 0) {
            const sx = centerX + rotPt.x;
            const sy = centerY + rotPt.y;
            if (!drawing) {
              ctx.moveTo(sx, sy);
              drawing = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            drawing = false;
          }
        }
        ctx.stroke();
      });

      // Render Country Nodes
      countries.forEach(c => {
        const pt3d = latLngToCartesian(c.lat, c.lng, GLOBE_RADIUS);
        const rotPt = rotatePoint(pt3d, rotationX, currRotY);

        if (rotPt.z > 0) {
          const sx = centerX + rotPt.x;
          const sy = centerY + rotPt.y;

          // Select color coding based on relationship
          let color = '#9ca3af'; // Neutral
          if (c.status === 'allied') color = 'var(--color-info)';
          if (c.status === 'friendly') color = 'var(--color-success)';
          if (c.status === 'hostile') color = 'var(--color-warning)';
          if (c.status === 'war') color = 'var(--color-danger)';

          const isSelected = selectedCountry && selectedCountry.id === c.id;

          // Pulsing halo for active selection
          if (isSelected) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(sx, sy, 7 + Math.sin(Date.now() / 150) * 2, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Filled node circle
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(sx, sy, isSelected ? 4.5 : 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Text label
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.font = '700 8px sans-serif';
          ctx.fillText(c.name, sx + 6, sy + 3);

          // Save active coordinates on the country object for click-checking
          c.projectedX = sx;
          c.projectedY = sy;
          c.projectedZ = rotPt.z;
        } else {
          c.projectedX = null;
          c.projectedY = null;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [rotationX, rotationY, isDragging, countries, selectedCountry]);

  // Drag interaction math handlers
  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    autoRotateRef.current = false;
    dragStart.current = { x: clientX, y: clientY };
    rotStart.current = { x: rotationX, y: rotationY };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;

    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;

    // Adjust sensitivity scaling
    const sensitivity = 0.007;
    setRotationY(rotStart.current.y + dx * sensitivity);
    setRotationX(Math.max(-Math.PI/3, Math.min(Math.PI/3, rotStart.current.x + dy * sensitivity)));
  };

  const handleEnd = () => {
    setIsDragging(false);
    // Restart auto rotate after 4 seconds of inactivity
    setTimeout(() => {
      if (!isDragging) autoRotateRef.current = true;
    }, 4000);
  };

  // Node clicks check
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let clickedCountry = null;
    let closestDist = 12;

    countries.forEach(c => {
      if (c.projectedX !== null) {
        const dist = Math.hypot(c.projectedX - clickX, c.projectedY - clickY);
        if (dist < closestDist) {
          closestDist = dist;
          clickedCountry = c;
        }
      }
    });

    if (clickedCountry) {
      onSelectCountry(clickedCountry);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={220}
        height={160}
        onClick={handleCanvasClick}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          background: 'rgba(255,255,255,0.01)',
          borderRadius: '12px',
          touchAction: 'none'
        }}
      />
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
        Swipe to rotate the globe • Tap nodes to open dossiers
      </div>
    </div>
  );
}

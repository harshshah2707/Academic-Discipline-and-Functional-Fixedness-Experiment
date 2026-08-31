import React from 'react';

/**
 * High-quality, clean, neutral SVG representations for experimental stimuli.
 * Designed specifically for cognitive psychology experiments with neutral backgrounds
 * and clear, unmistakable visual forms.
 */
export const StimulusSvg = ({ name, className = "w-64 h-64 mx-auto" }) => {
  const normName = (name || '').toLowerCase().trim();

  if (normName === 'coin') {
    return (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Coin stimulus">
        <circle cx="100" cy="100" r="80" fill="#E2E8F0" stroke="#475569" strokeWidth="6" />
        <circle cx="100" cy="100" r="70" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="100" cy="100" r="55" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
        <path d="M100 65 L110 88 L135 88 L115 103 L122 126 L100 112 L78 126 L85 103 L65 88 L90 88 Z" fill="#94A3B8" opacity="0.6" />
        <text x="100" y="148" textAnchor="middle" fill="#475569" fontSize="13" fontWeight="bold" fontFamily="sans-serif">1</text>
      </svg>
    );
  }

  if (normName === 'paperclip') {
    return (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Paperclip stimulus">
        <path
          d="M 75 140 
             L 75 65 
             A 25 25 0 0 1 125 65 
             L 125 145 
             A 35 35 0 0 1 55 145 
             L 55 55 
             A 45 45 0 0 1 145 55 
             L 145 130"
          stroke="#334155"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M 77 138 
             L 77 65 
             A 23 23 0 0 1 123 65 
             L 123 145 
             A 33 33 0 0 1 57 145 
             L 57 55 
             A 43 43 0 0 1 143 55 
             L 143 130"
          stroke="#94A3B8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  if (normName === 'brick') {
    return (
      <svg className={className} viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Brick stimulus">
        <polygon points="40,70 120,40 200,70 120,100" fill="#CB6D51" stroke="#7C2D12" strokeWidth="3" />
        <polygon points="40,70 120,100 120,150 40,120" fill="#9A3412" stroke="#7C2D12" strokeWidth="3" />
        <polygon points="120,100 200,70 200,120 120,150" fill="#B45309" stroke="#7C2D12" strokeWidth="3" />
        <ellipse cx="80" cy="70" rx="14" ry="6" fill="#881337" opacity="0.4" />
        <ellipse cx="120" cy="60" rx="14" ry="6" fill="#881337" opacity="0.4" />
        <ellipse cx="160" cy="70" rx="14" ry="6" fill="#881337" opacity="0.4" />
      </svg>
    );
  }

  if (normName === 'newspaper') {
    return (
      <svg className={className} viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Newspaper stimulus">
        <rect x="42" y="32" width="140" height="150" rx="3" fill="#94A3B8" />
        <rect x="38" y="28" width="140" height="150" rx="3" fill="#F8FAFC" stroke="#475569" strokeWidth="3" />
        <rect x="48" y="38" width="120" height="16" fill="#334155" rx="1" />
        <rect x="52" y="42" width="60" height="8" fill="#F8FAFC" rx="1" />
        <rect x="48" y="60" width="55" height="40" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" rx="2" />
        <rect x="110" y="60" width="58" height="5" fill="#64748B" rx="1" />
        <rect x="110" y="70" width="58" height="4" fill="#94A3B8" rx="1" />
        <rect x="110" y="78" width="54" height="4" fill="#94A3B8" rx="1" />
        <rect x="110" y="86" width="58" height="4" fill="#94A3B8" rx="1" />
        <rect x="110" y="94" width="45" height="4" fill="#94A3B8" rx="1" />
        <rect x="48" y="110" width="55" height="4" fill="#64748B" rx="1" />
        <rect x="48" y="118" width="55" height="3" fill="#94A3B8" rx="1" />
        <rect x="48" y="125" width="50" height="3" fill="#94A3B8" rx="1" />
        <rect x="48" y="132" width="55" height="3" fill="#94A3B8" rx="1" />
        <rect x="48" y="139" width="48" height="3" fill="#94A3B8" rx="1" />
        <rect x="48" y="146" width="52" height="3" fill="#94A3B8" rx="1" />
        <rect x="110" y="110" width="58" height="4" fill="#64748B" rx="1" />
        <rect x="110" y="118" width="58" height="3" fill="#94A3B8" rx="1" />
        <rect x="110" y="125" width="55" height="3" fill="#94A3B8" rx="1" />
        <rect x="110" y="132" width="58" height="3" fill="#94A3B8" rx="1" />
        <rect x="110" y="139" width="50" height="3" fill="#94A3B8" rx="1" />
        <rect x="110" y="146" width="56" height="3" fill="#94A3B8" rx="1" />
      </svg>
    );
  }

  if (normName === 'spoon') {
    return (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Spoon stimulus">
        <g transform="rotate(-35 100 100)">
          <ellipse cx="100" cy="55" rx="22" ry="32" fill="#E2E8F0" stroke="#334155" strokeWidth="4" />
          <ellipse cx="98" cy="55" rx="16" ry="24" fill="#CBD5E1" />
          <ellipse cx="94" cy="50" rx="8" ry="15" fill="#F8FAFC" opacity="0.8" />
          <path d="M96 85 L96 165 C96 172 104 172 104 165 L104 85 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="4" strokeLinejoin="round" />
          <path d="M98 90 L98 160" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (normName === 'cup') {
    return (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cup stimulus">
        <path d="M 135 75 C 170 75 170 125 135 125" fill="none" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
        <path d="M 135 75 C 168 75 168 125 135 125" fill="none" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
        <path d="M 50 60 L 60 150 C 60 160 130 160 130 150 L 140 60 Z" fill="#E2E8F0" stroke="#334155" strokeWidth="5" />
        <ellipse cx="95" cy="60" rx="45" ry="12" fill="#F1F5F9" stroke="#334155" strokeWidth="4" />
        <path d="M 64 75 L 72 142" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (normName === 'rubber band') {
    return (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rubber band stimulus">
        <path
          d="M 50 80 
             C 40 40, 150 40, 160 90 
             C 170 140, 120 165, 80 155 
             C 40 145, 60 110, 50 80 Z"
          fill="#FEF08A"
          stroke="#CA8A04"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 80 
             C 40 40, 150 40, 160 90 
             C 170 140, 120 165, 80 155 
             C 40 145, 60 110, 50 80 Z"
          fill="none"
          stroke="#EAB308"
          strokeWidth="6"
        />
        <path
          d="M 65 75 C 80 55, 130 55, 145 80"
          fill="none"
          stroke="#FEF9C3"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className={`${className} flex flex-col items-center justify-center bg-slate-100 border-2 border-slate-300 rounded-lg p-6 text-center`}>
      <span className="text-5xl mb-2">📦</span>
      <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{name}</span>
    </div>
  );
};

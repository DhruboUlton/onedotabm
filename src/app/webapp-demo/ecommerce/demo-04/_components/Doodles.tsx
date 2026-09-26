import React from 'react';

export function WonderSproutLogo({ className = 'h-12 w-auto' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-11 h-11 shrink-0 drop-shadow-sm"
      >
        {/* Soft yellow backdrop circle */}
        <circle cx="27" cy="27" r="25" fill="#FFEFE4" stroke="#F7941E" strokeWidth="2.5" />
        {/* Rainbow arc */}
        <path
          d="M12 36C12 25.5 20.5 17 31 17C37 17 41 20 44 24"
          stroke="#EB1551"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M16 37C16 28 23 21 31 21C36 21 39 23 41 26"
          stroke="#F7941E"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M20 38C20 31 25.5 25 31 25C34 25 37 27 38 29"
          stroke="#1CBBB4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Green Sprout Leaf */}
        <path
          d="M26 38C26 31 34 25 40 28C40 35 33 40 26 38Z"
          fill="#1CBBB4"
          stroke="#0A6375"
          strokeWidth="1.5"
        />
        {/* Little Yellow Spark Star */}
        <path
          d="M39 13L40.5 16.5L44 17L41.2 19.5L42 23L39 21L36 23L36.8 19.5L34 17L37.5 16.5L39 13Z"
          fill="#FFDA43"
          stroke="#F7941E"
          strokeWidth="1"
        />
      </svg>
      <div className="flex flex-col">
        <span className="font-bubblegum text-2xl sm:text-3xl tracking-wide leading-none text-[#0F172A] flex items-center">
          <span className="text-[#EB1551]">Wonder</span>
          <span className="text-[#0A6375]">Sprout</span>
        </span>
        <span className="text-[10px] tracking-widest uppercase font-bold text-[#F7941E] font-nunito mt-0.5">
          Play • Learn • Grow
        </span>
      </div>
    </div>
  );
}

export function RocketDoodle({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      {/* Flame trail */}
      <path
        d="M24 76C18 84 10 92 8 96C14 92 22 86 28 80Z"
        fill="#F7941E"
      />
      <path
        d="M26 74C22 80 16 85 14 88C18 85 24 81 28 78Z"
        fill="#FFDA43"
      />
      {/* Fins */}
      <path d="M30 68L18 64L24 50Z" fill="#EB1551" />
      <path d="M50 88L46 76L60 70Z" fill="#EB1551" />
      {/* Rocket body */}
      <path
        d="M28 52C32 36 50 18 68 12C74 10 84 8 88 12C92 16 90 26 88 32C82 50 64 68 48 72C40 74 34 72 30 66L28 52Z"
        fill="#1CBBB4"
        stroke="#0A6375"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Nose cone */}
      <path
        d="M74 16C78 12 84 8 88 12C92 16 88 22 84 26C80 20 77 17 74 16Z"
        fill="#EB1551"
      />
      {/* Porthole window */}
      <circle cx="62" cy="38" r="9" fill="#FFFFFF" stroke="#0A6375" strokeWidth="2.5" />
      <circle cx="62" cy="38" r="5" fill="#FFEFE4" />
    </svg>
  );
}

export function CloudShape({ className = 'w-full text-white' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M0 120V40C120 40 160 10 280 25C400 40 460 0 600 15C740 30 820 5 960 20C1100 35 1180 5 1300 25C1380 40 1410 20 1440 30V120H0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CloudTopDivider({ className = 'w-full text-[#0A6375]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M0 90V45C90 45 130 15 220 28C310 40 380 8 480 22C580 35 660 10 760 25C860 40 930 15 1030 28C1130 40 1200 12 1300 24C1370 32 1410 18 1440 35V90H0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WavyDivider({ className = 'w-full text-[#EB1551]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M0 12C75 22 125 2 200 12C275 22 325 2 400 12C475 22 525 2 600 12C675 22 725 2 800 12C875 22 925 2 1000 12C1075 22 1125 2 1200 12"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="8 6"
      />
    </svg>
  );
}

export function SunDoodle({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="14" fill="#FFDA43" stroke="#F7941E" strokeWidth="2.5" />
      {/* Rays */}
      <path d="M32 6V12M32 52V58M6 32H12M52 32H58M14 14L18 18M46 46L50 50M14 50L18 46M46 18L50 14" stroke="#F7941E" strokeWidth="3" strokeLinecap="round" />
      {/* Cute smiley face */}
      <circle cx="28" cy="30" r="1.5" fill="#0F172A" />
      <circle cx="36" cy="30" r="1.5" fill="#0F172A" />
      <path d="M28 35C29.5 37 34.5 37 36 35" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function StarDoodle({ className = 'w-8 h-8 text-[#FFDA43]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

import React from 'react';

interface CartoonSvgProps {
  name: string;
  className?: string;
  size?: number | string;
}

export const CartoonSvg: React.FC<CartoonSvgProps> = ({ name, className = '', size = 120 }) => {
  const s = size;

  // Add a common cartoon filter for shadow styling or highlight effects if desired
  switch (name.toLowerCase()) {
    case 'soup':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          {/* Bowl background highlight shadow */}
          <circle cx="60" cy="65" r="48" fill="#FFFBEB" opacity="0.6" />
          
          {/* Outer Rim */}
          <circle cx="60" cy="65" r="42" fill="#DC2626" stroke="#991B1B" strokeWidth="4.5" />
          <circle cx="60" cy="65" r="36" fill="#EF4444" />
          
          {/* Tasty Tomato Orange Broth */}
          <circle cx="60" cy="65" r="31" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
          <circle cx="60" cy="65" r="29" fill="#EA580C" />
          
          {/* Glare effect */}
          <path d="M 38,43 A 24,24 0 0 1 82,43 C 78,41 42,41 38,43 Z" fill="#FFFFFF" opacity="0.3" />
          <path d="M 34,70 A 24,24 0 0 0 54,88 C 50,86 36,78 34,70 Z" fill="#FFFFFF" opacity="0.15" />
          
          {/* Alphabet Noodles floating around inside the broth */}
          {/* S */}
          <g transform="translate(38, 52) rotate(-15)">
            <text x="0" y="0" fontFamily="sans-serif" fontWeight="950" fontSize="14" fill="#FEF3C7" stroke="#9A3412" strokeWidth="2" textAnchor="middle" dominantBaseline="central">S</text>
          </g>
          {/* O */}
          <g transform="translate(54, 48) rotate(15)">
            <text x="0" y="0" fontFamily="sans-serif" fontWeight="950" fontSize="13" fill="#FEF3C7" stroke="#9A3412" strokeWidth="2" textAnchor="middle" dominantBaseline="central">O</text>
          </g>
          {/* U */}
          <g transform="translate(70, 56) rotate(-25)">
            <text x="0" y="0" fontFamily="sans-serif" fontWeight="950" fontSize="14" fill="#FEF3C7" stroke="#9A3412" strokeWidth="2" textAnchor="middle" dominantBaseline="central">U</text>
          </g>
          {/* P */}
          <g transform="translate(80, 72) rotate(10)">
            <text x="0" y="0" fontFamily="sans-serif" fontWeight="950" fontSize="14.5" fill="#FEF3C7" stroke="#9A3412" strokeWidth="2" textAnchor="middle" dominantBaseline="central">P</text>
          </g>
          {/* A */}
          <g transform="translate(42, 74) rotate(35)">
            <text x="0" y="0" fontFamily="sans-serif" fontWeight="950" fontSize="13" fill="#FEF3C7" stroke="#9A3412" strokeWidth="2" textAnchor="middle" dominantBaseline="central">A</text>
          </g>
          {/* B */}
          <g transform="translate(60, 76) rotate(-10)">
            <text x="0" y="0" fontFamily="sans-serif" fontWeight="950" fontSize="13.5" fill="#FEF3C7" stroke="#9A3412" strokeWidth="2" textAnchor="middle" dominantBaseline="central">B</text>
          </g>

          {/* A cute little handle for the bowl */}
          <path d="M 18,65 Q 12,65 14,58 Q 18,52 23,58" fill="none" stroke="#991B1B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 102,65 Q 108,65 106,58 Q 102,52 97,58" fill="none" stroke="#991B1B" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'cat':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          {/* Background Highlight */}
          <circle cx="60" cy="65" r="48" fill="#FEE2E2" />
          {/* Ears */}
          <polygon points="25,45 45,15 55,40" fill="#F87171" stroke="#7F1D1D" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="32,42 42,22 49,38" fill="#FCA5A5" />
          
          <polygon points="95,45 75,15 65,40" fill="#F87171" stroke="#7F1D1D" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="88,42 78,22 71,38" fill="#FCA5A5" />

          {/* Head */}
          <ellipse cx="60" cy="65" rx="42" ry="35" fill="#FCA5A5" stroke="#7F1D1D" strokeWidth="4" />

          {/* Cheeks */}
          <circle cx="35" cy="74" r="8" fill="#F87171" opacity="0.6" />
          <circle cx="85" cy="74" r="8" fill="#F87171" opacity="0.6" />

          {/* Eyes */}
          <circle cx="45" cy="58" r="7" fill="#111827" />
          <circle cx="43" cy="55" r="2.5" fill="#FFFFFF" />
          <circle cx="75" cy="58" r="7" fill="#111827" />
          <circle cx="73" cy="55" r="2.5" fill="#FFFFFF" />

          {/* Nose */}
          <polygon points="60,68 55,63 65,63" fill="#F43F5E" stroke="#7F1D1D" strokeWidth="2" strokeLinejoin="round" />

          {/* Mouth */}
          <path d="M 52,72 Q 56,76 60,72 Q 64,76 68,72" fill="none" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="22" y1="70" x2="5" y2="68" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="76" x2="3" y2="78" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />
          
          <line x1="98" y1="70" x2="115" y2="68" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />
          <line x1="98" y1="76" x2="117" y2="78" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'dog':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="65" r="48" fill="#FEF3C7" />
          {/* Ears */}
          <path d="M 22,35 C 10,40 10,75 22,78 C 28,80 32,55 30,35 Z" fill="#D97706" stroke="#451A03" strokeWidth="4" strokeLinejoin="round" />
          <path d="M 98,35 C 110,40 110,75 98,78 C 92,80 88,55 90,35 Z" fill="#D97706" stroke="#451A03" strokeWidth="4" strokeLinejoin="round" />

          {/* Head */}
          <circle cx="60" cy="62" r="35" fill="#f59e0b" stroke="#451A03" strokeWidth="4" />

          {/* Snout */}
          <ellipse cx="60" cy="74" rx="18" ry="12" fill="#FEF3C7" stroke="#451A03" strokeWidth="3" />

          {/* Nose */}
          <ellipse cx="60" cy="69" rx="8" ry="6" fill="#1F2937" />
          <circle cx="58" cy="67" r="2" fill="#FFFFFF" />

          {/* Eyes */}
          <circle cx="48" cy="52" r="6" fill="#111827" />
          <circle cx="46" cy="50" r="2.2" fill="#FFFFFF" />
          <circle cx="72" cy="52" r="6" fill="#111827" />
          <circle cx="70" cy="50" r="2.2" fill="#FFFFFF" />

          {/* Tongue */}
          <path d="M 56,80 Q 60,94 64,80 Z" fill="#EF4444" stroke="#451A03" strokeWidth="3" />
          <line x1="60" y1="78" x2="60" y2="85" stroke="#451A03" strokeWidth="2" />

          {/* Cheeks */}
          <circle cx="36" cy="67" r="6" fill="#F59E0B" opacity="0.6" />
          <circle cx="84" cy="67" r="6" fill="#F59E0B" opacity="0.6" />
        </svg>
      );

    case 'sun':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="60" r="50" fill="#FFFBEB" />
          {/* Waves / Rays */}
          <g stroke="#9A3412" strokeWidth="4" fill="#FBBF24" strokeLinejoin="round">
            <polygon points="60,10 70,25 50,25" />
            <polygon points="60,110 70,95 50,95" />
            <polygon points="10,60 25,70 25,50" />
            <polygon points="110,60 95,70 95,50" />
            
            <polygon points="25,25 42,35 32,45" />
            <polygon points="95,95 78,85 88,75" />
            <polygon points="95,25 78,35 88,45" />
            <polygon points="25,95 42,85 32,75" />
          </g>

          {/* Core */}
          <circle cx="60" cy="60" r="30" fill="#F59E0B" stroke="#9A3412" strokeWidth="4" />

          {/* Eye Sparkles */}
          <circle cx="50" cy="54" r="5" fill="#111827" />
          <circle cx="48" cy="51" r="2" fill="#FFFFFF" />
          <circle cx="70" cy="54" r="5" fill="#111827" />
          <circle cx="68" cy="51" r="2" fill="#FFFFFF" />

          {/* Smile */}
          <path d="M 48,68 Q 60,80 72,68" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
          {/* Sweet Rosy Cheeks */}
          <circle cx="39" cy="64" r="5" fill="#EF4444" opacity="0.6" />
          <circle cx="81" cy="64" r="5" fill="#EF4444" opacity="0.6" />
        </svg>
      );

    case 'star':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="62" r="48" fill="#FEF9C3" />
          {/* Star shape */}
          <polygon 
            points="60,15 73,46 106,46 79,66 89,98 60,78 31,98 41,66 14,46 47,46" 
            fill="#FACC15" 
            stroke="#713F12" 
            strokeWidth="4.5" 
            strokeLinejoin="round" 
          />

          {/* Eyes */}
          <circle cx="50" cy="54" r="4.5" fill="#111827" />
          <circle cx="48" cy="52" r="1.5" fill="#FFFFFF" />
          <circle cx="70" cy="54" r="4.5" fill="#111827" />
          <circle cx="68" cy="52" r="1.5" fill="#FFFFFF" />

          {/* Sweet Smile */}
          <path d="M 52,64 Q 60,71 68,64" fill="none" stroke="#713F12" strokeWidth="3" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="44" cy="63" r="4.5" fill="#F43F5E" opacity="0.7" />
          <circle cx="76" cy="63" r="4.5" fill="#F43F5E" opacity="0.7" />
        </svg>
      );

    case 'fish':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="65" r="48" fill="#E0F2FE" />
          {/* Tail Fin */}
          <path d="M 18,60 L 2,42 L 8,60 L 2,78 Z" fill="#0EA5E9" stroke="#0369A1" strokeWidth="4" strokeLinejoin="round" />
          
          {/* Main Body */}
          <ellipse cx="50" cy="60" rx="32" ry="24" fill="#38BDF8" stroke="#0369A1" strokeWidth="4" />

          {/* Eye */}
          <circle cx="68" cy="52" r="6" fill="#111827" />
          <circle cx="66" cy="49" r="2" fill="#FFFFFF" />

          {/* Smile */}
          <path d="M 68,66 Q 72,72 65,74" fill="none" stroke="#0369A1" strokeWidth="3.5" strokeLinecap="round" />

          {/* Fin */}
          <path d="M 45,64 Q 38,76 46,78" fill="#0EA5E9" stroke="#0369A1" strokeWidth="3" strokeLinejoin="round" />

          {/* Bubbles */}
          <circle cx="95" cy="40" r="5" fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.7" />
          <circle cx="108" cy="28" r="3" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.7" />
        </svg>
      );

    case 'frog':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="65" r="48" fill="#ECFDF5" />
          {/* Big Bulbous Eye Sockets */}
          <circle cx="42" cy="40" r="16" fill="#4ADE80" stroke="#065F46" strokeWidth="4" />
          <circle cx="78" cy="40" r="16" fill="#4ADE80" stroke="#065F46" strokeWidth="4" />

          {/* Eye Whites and Pupils */}
          <circle cx="42" cy="40" r="11" fill="#FFFFFF" />
          <circle cx="42" cy="40" r="6" fill="#111827" />
          <circle cx="40" cy="38" r="2" fill="#FFFFFF" />

          <circle cx="78" cy="40" r="11" fill="#FFFFFF" />
          <circle cx="78" cy="40" r="6" fill="#111827" />
          <circle cx="76" cy="38" r="2" fill="#FFFFFF" />

          {/* Main Body/Face representation */}
          <ellipse cx="60" cy="70" rx="42" ry="32" fill="#4ADE80" stroke="#065F46" strokeWidth="4" />

          {/* Tiny Crown-like spots */}
          <circle cx="35" cy="58" r="3.5" fill="#22C55E" />
          <circle cx="85" cy="58" r="3.5" fill="#22C55E" />

          {/* Giant Smile */}
          <path d="M 38,72 Q 60,94 82,72" fill="none" stroke="#065F46" strokeWidth="4" strokeLinecap="round" />

          {/* Blush */}
          <circle cx="34" cy="72" r="6" fill="#EF4444" opacity="0.5" />
          <circle cx="86" cy="72" r="6" fill="#EF4444" opacity="0.5" />
        </svg>
      );

    case 'tree':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="65" r="48" fill="#F0FDF4" />
          {/* Trunk */}
          <rect x="52" y="70" width="16" height="35" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="4" />
          
          {/* Leaves cloud */}
          <path 
            d="M 60,20 C 40,20 30,35 32,50 C 18,54 18,72 32,76 C 36,86 52,86 60,76 C 68,86 84,86 88,76 C 102,72 102,54 88,50 C 90,35 80,20 60,20 Z" 
            fill="#22C55E" 
            stroke="#14532D" 
            strokeWidth="4" 
            strokeLinejoin="round" 
          />

          {/* Little face on the tree canopy */}
          <circle cx="50" cy="46" r="4" fill="#14532D" />
          <circle cx="70" cy="46" r="4" fill="#14532D" />
          <path d="M 54,54 Q 60,60 66,54" fill="none" stroke="#14532D" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'cake':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="65" r="48" fill="#FDF2F8" />
          {/* Plate */}
          <ellipse cx="60" cy="98" rx="42" ry="8" fill="#E2E8F0" stroke="#475569" strokeWidth="4" />

          {/* Cake Layers */}
          <rect x="28" y="55" width="64" height="38" rx="6" fill="#F472B6" stroke="#831843" strokeWidth="4" />
          {/* Frosting drips */}
          <path d="M 28,68 Q 36,75 44,68 Q 52,75 60,68 Q 68,75 76,68 Q 84,75 92,68 L 92,55 L 28,55 Z" fill="#FCE7F3" stroke="#831843" strokeWidth="4" strokeLinejoin="round" />

          {/* Candle */}
          <rect x="57" y="32" width="6" height="24" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="2" />
          {/* Candle Fire Flame */}
          <path d="M 60,14 Q 55,24 60,32 Q 65,24 60,14 Z" fill="#F59E0B" stroke="#9A3412" strokeWidth="2" />

          {/* Eyes and Mouth on Cake */}
          <circle cx="48" cy="78" r="3.5" fill="#831843" />
          <circle cx="72" cy="78" r="3.5" fill="#831843" />
          <path d="M 56,84 Q 60,88 64,84" fill="none" stroke="#831843" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'apple':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="65" r="48" fill="#FEF2F2" />
          {/* Stem */}
          <path d="M 60,40 Q 64,22 72,18" fill="none" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M 61,30 Q 75,20 72,32 Q 62,38 61,30 Z" fill="#22C55E" stroke="#16532D" strokeWidth="2.5" />

          {/* Apple Main Body */}
          <path 
            d="M 60,48 C 50,42 22,44 26,72 C 28,88 48,102 60,96 C 72,102 92,88 94,72 C 98,44 70,42 60,48 Z" 
            fill="#EF4444" 
            stroke="#7F1D1D" 
            strokeWidth="4.5" 
            strokeLinejoin="round" 
          />

          {/* Eyes and Mouth */}
          <circle cx="45" cy="65" r="5" fill="#7F1D1D" />
          <circle cx="43" cy="63" r="1.5" fill="#FFFFFF" />
          <circle cx="75" cy="65" r="5" fill="#7F1D1D" />
          <circle cx="73" cy="63" r="1.5" fill="#FFFFFF" />
          
          <path d="M 52,74 Q 60,83 68,74" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="36" cy="72" r="4" fill="#F87171" opacity="0.8" />
          <circle cx="84" cy="72" r="4" fill="#F87171" opacity="0.8" />
        </svg>
      );

    case 'bird':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="65" r="48" fill="#EFF6FF" />
          {/* Tail */}
          <path d="M 28,68 L 10,78 L 18,65 L 12,56 L 25,60 Z" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="3.5" strokeLinejoin="round" />

          {/* Body */}
          <circle cx="56" cy="65" r="28" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="4" />

          {/* Wing */}
          <path d="M 40,65 Q 46,82 58,65 Z" fill="#2563EB" stroke="#1E3A8A" strokeWidth="3" />

          {/* Eye */}
          <circle cx="68" cy="56" r="6" fill="#111827" />
          <circle cx="66" cy="53" r="2" fill="#FFFFFF" />

          {/* Rosy Cheek */}
          <circle cx="58" cy="64" r="4" fill="#F43F5E" opacity="0.6" />

          {/* Beak */}
          <polygon points="80,58 98,63 80,68" fill="#F59E0B" stroke="#1E3A8A" strokeWidth="3" strokeLinejoin="round" />
          
          {/* Feet */}
          <line x1="48" y1="92" x2="42" y2="105" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="64" y1="92" x2="70" y2="105" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'caterpillar':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          {/* Segments of caterpillar */}
          <circle cx="30" cy="68" r="14" fill="#84CC16" stroke="#365314" strokeWidth="3" />
          <circle cx="50" cy="64" r="15" fill="#4ADE80" stroke="#365314" strokeWidth="3" />
          <circle cx="70" cy="62" r="16" fill="#22C55E" stroke="#365314" strokeWidth="3" />
          {/* Head */}
          <circle cx="92" cy="54" r="18" fill="#10B981" stroke="#365314" strokeWidth="4.5" />

          {/* Feet */}
          <ellipse cx="30" cy="81" rx="4" ry="3" fill="#4D7C0F" />
          <ellipse cx="50" cy="78" rx="4" ry="3" fill="#4D7C0F" />
          <ellipse cx="70" cy="77" rx="4" ry="3" fill="#4D7C0F" />
          
          {/* Antennae */}
          <path d="M 88,38 Q 84,26 80,25" fill="none" stroke="#365314" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="24" r="3" fill="#D97706" />

          <path d="M 96,38 Q 100,26 104,25" fill="none" stroke="#365314" strokeWidth="3" strokeLinecap="round" />
          <circle cx="104" cy="24" r="3" fill="#D97706" />

          {/* Eyes */}
          <circle cx="88" cy="46" r="3" fill="#1F2937" />
          <circle cx="98" cy="46" r="3" fill="#1F2937" />

          {/* Blush */}
          <circle cx="83" cy="52" r="2.5" fill="#F43F5E" opacity="0.8" />
          <circle cx="101" cy="52" r="2.5" fill="#F43F5E" opacity="0.8" />

          {/* Smile */}
          <path d="M 90,52 Q 93,56 96,52" fill="none" stroke="#365314" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'leaf':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          {/* Cute leaf with a caterpillar bite out of it! */}
          <path 
            d="M 12,98 C 42,98 98,82 108,12 C 98,42 42,42 12,98 Z" 
            fill="#22C55E" 
            stroke="#14532D" 
            strokeWidth="4" 
            strokeLinejoin="round" 
          />
          {/* Veins */}
          <path d="M 12,98 Q 60,60 108,12" fill="none" stroke="#166534" strokeWidth="3" />
          <path d="M 36,80 Q 56,86 64,92" fill="none" stroke="#166534" strokeWidth="2.5" />
          <path d="M 60,60 Q 75,70 82,78" fill="none" stroke="#166534" strokeWidth="2.5" />
          <path d="M 45,70 Q 30,55 24,48" fill="none" stroke="#166534" strokeWidth="2.5" />
          <path d="M 72,48 Q 55,35 48,28" fill="none" stroke="#166534" strokeWidth="2.5" />

          {/* Bite out of leaf */}
          <circle cx="90" cy="30" r="14" fill="#FFFFFF" />
          <circle cx="94" cy="42" r="10" fill="#FFFFFF" />
          <path d="M 76,32 C 80,36 82,42 86,46" fill="none" stroke="#14532D" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'worm':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          <circle cx="60" cy="65" r="48" fill="#FDF4FF" />
          {/* Wobbly background garden stem */}
          <path d="M 30,85 Q 60,102 90,85" stroke="#D97706" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.3" />

          {/* Pink wiggling worm body segments */}
          <path 
            d="M 25,80 Q 35,55 45,65 Q 55,75 65,60 Q 75,45 85,55" 
            fill="none" 
            stroke="#F472B6" 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M 25,80 Q 35,55 45,65 Q 55,75 65,60 Q 75,45 85,55" 
            fill="none" 
            stroke="#DB2777" 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeDasharray="4,10"
            opacity="0.3" 
          />

          {/* Eyes on Head (segment 85,55) */}
          <circle cx="80" cy="51" r="2.5" fill="#111827" />
          <circle cx="86" cy="53" r="2.5" fill="#111827" />
          {/* Mouth */}
          <path d="M 83,56 Q 85,58 82,59" fill="none" stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'badge':
      return (
        <svg width={s} height={s} viewBox="0 0 120 120" className={className}>
          {/* Colorful prize badge */}
          <circle cx="60" cy="60" r="50" fill="#FEF3C7" stroke="#D97706" strokeWidth="4" />
          {/* Ribbon */}
          <polygon points="40,85 40,115 60,100 80,115 80,85" fill="#EF4444" stroke="#991B1B" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="60" cy="55" r="32" fill="#FBBF24" stroke="#D97706" strokeWidth="4" />
          
          {/* Star logo */}
          <polygon points="60,34 67,48 82,48 70,58 75,72 60,63 45,72 50,58 38,48 53,48" fill="#FFFFFF" />
        </svg>
      );

    default:
      return (
        <div 
          style={{ width: s, height: s }} 
          className="flex items-center justify-center bg-amber-100 rounded-full border-4 border-amber-300 text-3xl"
        >
          🎁
        </div>
      );
  }
};

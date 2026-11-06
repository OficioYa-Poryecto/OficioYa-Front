/**
 * Logo de OficioYa en SVG.
 * Props:
 *  - variant: 'color' (default) | 'white'  — esquema de color
 *  - height: alto en px (default 36)
 */
export default function BrandLogo({ variant = 'color', height = 36 }) {
  const isWhite = variant === 'white';
  const dark  = isWhite ? '#ffffff' : '#1E2D40';
  const orange = isWhite ? '#ffffff' : '#dc623f';
  const iconBg = isWhite ? 'rgba(255,255,255,0.15)' : '#fff0e9';
  const iconFg = isWhite ? '#ffffff' : '#dc623f';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      viewBox="0 0 180 44"
      fill="none"
      aria-label="OficioYa"
      role="img"
    >
      {/* Círculo de fondo del ícono */}
      <circle cx="22" cy="22" r="20" fill={iconBg} />

      {/* Llave inglesa simplificada */}
      <path
        d="M14 22 Q14 16 20 15 L28 23 Q30 25 28 27 L22 29 Q16 30 14 24 Z"
        fill="none"
        stroke={iconFg}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Check / palomita dentro del círculo */}
      <polyline
        points="15,22 20,27 29,16"
        stroke={iconFg}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Borde del círculo */}
      <circle cx="22" cy="22" r="20" stroke={iconFg} strokeWidth="2" fill="none" />

      {/* Texto "Oficio" */}
      <text
        x="48"
        y="29"
        fontFamily="'DM Sans Variable', system-ui, sans-serif"
        fontWeight="700"
        fontSize="20"
        fill={dark}
        letterSpacing="-0.5"
      >
        Oficio
      </text>
      {/* Texto "Ya" en naranja */}
      <text
        x="121"
        y="29"
        fontFamily="'DM Sans Variable', system-ui, sans-serif"
        fontWeight="700"
        fontSize="20"
        fill={orange}
        letterSpacing="-0.5"
      >
        Ya
      </text>
    </svg>
  );
}


import { motion } from 'framer-motion'

/**
 * HealthcareBackground
 * 
 * Provides a unified, realistic clinical background system across all application pages:
 * 1. Medical Cross / Hospital Plus matrix pattern
 * 2. Animated ECG cardiogram pulse wave
 * 3. Surgical teal, hospital cyan, and clinical blue ambient lighting
 * 
 * Variants:
 * - 'app': Subtle, non-intrusive for patient dashboard, records, charts, and tables
 * - 'doctor': Clinical pro ambiance with surgical teal and deep slate navy
 * - 'auth': Centered ambient focus with radial mask for login/registration cards
 * - 'landing': Full hero scale with high-impact clinical presence
 */
export function HealthcareBackground({ variant = 'app', className = '' }) {
  const patternId = `medical-cross-grid-${variant}`

  // Opacity & styling settings tailored per page type
  const isDoctor = variant === 'doctor'
  const isAuth = variant === 'auth'
  const isLanding = variant === 'landing'

  const patternOpacity = isLanding 
    ? 'text-slate-400/20 dark:text-slate-700/20' 
    : isDoctor 
    ? 'text-teal-900/15 dark:text-teal-400/12'
    : isAuth
    ? 'text-slate-400/22 dark:text-slate-600/25'
    : 'text-slate-400/18 dark:text-slate-700/18'

  const pulseOpacity = isLanding 
    ? 'opacity-15 dark:opacity-10' 
    : isDoctor 
    ? 'opacity-14 dark:opacity-12' 
    : isAuth
    ? 'opacity-16 dark:opacity-12'
    : 'opacity-12 dark:opacity-10'

  const pulseColor = isDoctor
    ? 'text-teal-500 dark:text-teal-400'
    : 'text-teal-600 dark:text-teal-400'

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Medical Cross / Hospital Plus Pattern Matrix */}
      <svg
        className={`absolute inset-0 w-full h-full ${patternOpacity} ${
          isAuth 
            ? '[mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_50%,transparent_100%)]' 
            : '[mask-image:radial-gradient(ellipse_90%_75%_at_50%_25%,#000_65%,transparent_100%)]'
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={patternId} width="44" height="44" patternUnits="userSpaceOnUse">
            {/* Medical Cross Symbol */}
            <path
              d="M22 16v12M16 22h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Micro diagnostic grid dot */}
            <circle cx="2" cy="2" r="0.75" fill="currentColor" opacity="0.45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* 2. Flowing Ambient Cardiogram / ECG Telemetry Pulse Wave */}
      <div className={`absolute ${isAuth ? 'top-[22%]' : 'top-[80px]'} left-0 w-full h-32 ${pulseOpacity} pointer-events-none overflow-hidden`}>
        <svg 
          className={`w-full h-full ${pulseColor} stroke-current fill-none`} 
          viewBox="0 0 1440 90" 
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0 45 L350 45 L370 20 L380 75 L395 10 L410 55 L425 45 L850 45 L870 20 L880 75 L895 10 L910 55 L925 45 L1440 45"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathOffset: 0 }}
            animate={{ pathOffset: [0, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      </div>

      {/* Secondary subtle ECG pulse line for wider dashboard screens */}
      {!isAuth && (
        <div className="absolute top-[55%] left-0 w-full h-24 opacity-6 dark:opacity-8 pointer-events-none overflow-hidden">
          <svg 
            className="w-full h-full text-cyan-600 dark:text-cyan-400 stroke-current fill-none" 
            viewBox="0 0 1440 90" 
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0 45 L500 45 L520 25 L530 70 L545 15 L560 50 L575 45 L1100 45 L1120 25 L1130 70 L1145 15 L1160 50 L1175 45 L1440 45"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathOffset: 0 }}
              animate={{ pathOffset: [0, -1] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
          </svg>
        </div>
      )}

      {/* 3. Surgical Teal & Hospital Cyan Ambient Gradients */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-teal-500/12 via-blue-500/8 to-transparent dark:from-teal-600/10 dark:via-blue-600/6 rounded-full blur-[130px]"
      />

      <motion.div
        animate={{ x: [0, 18, 0], y: [0, -16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[25%] -right-[5%] w-[550px] h-[550px] bg-teal-400/8 dark:bg-teal-500/8 rounded-full blur-[130px]"
      />

      <motion.div
        animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[60%] -left-[5%] w-[550px] h-[550px] bg-blue-500/8 dark:bg-blue-600/8 rounded-full blur-[140px]"
      />
    </div>
  )
}

export default HealthcareBackground

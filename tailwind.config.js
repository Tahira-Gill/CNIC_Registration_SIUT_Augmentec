/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E1F1B',
          soft: '#16302A',
        },
        pine: {
          50: '#EAF3EF',
          100: '#CDE4DA',
          200: '#9FCBB8',
          300: '#6BAF95',
          400: '#3D8E72',
          500: '#1F6650',
          600: '#195341',
          700: '#144233',
          800: '#0F3327',
          900: '#0B261D',
        },
        bone: {
          DEFAULT: '#F6F3EA',
          dim: '#EFEADC',
        },
        gold: {
          DEFAULT: '#B8923F',
          light: '#D9BA76',
          dark: '#8E6E2C',
        },
        verify: {
          DEFAULT: '#2C5F78',
          light: '#4C86A0',
          dark: '#1E4557',
        },
        coral: {
          DEFAULT: '#C1502E',
          light: '#E07E5B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'card-grid':
          'linear-gradient(rgba(246,243,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(246,243,234,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '18px 18px',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-120%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(220%)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        scan: 'scan 2.2s ease-in-out infinite',
        fadeUp: 'fadeUp 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}


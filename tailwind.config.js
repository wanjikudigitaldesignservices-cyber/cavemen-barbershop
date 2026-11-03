/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cavemen: {
          charcoal: '#151515',
          black: '#090909',
          offwhite: '#F2F0EA',
          bronze: '#A78355',
          bronzeLight: '#C7A779',
          bronzeDark: '#8A683E',
          softgrey: '#9E9D99',
          card: '#121212',
          cardElevated: '#181818',
          border: 'rgba(242, 240, 234, 0.1)',
          borderSubtle: 'rgba(242, 240, 234, 0.05)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Cinzel', 'Georgia', 'serif'],
        cinzel: ['Cinzel', 'Georgia', 'serif'],
        editorial: ['"Cormorant Garamond"', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.25em',
        widest: '0.2em',
        wider: '0.1em',
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(167, 131, 85, 0.06)',
        'bronze-glow': '0 0 30px rgba(167, 131, 85, 0.25)',
        'bronze-subtle': '0 0 15px rgba(167, 131, 85, 0.12)',
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at center, transparent 30%, rgba(9, 9, 9, 0.85) 100%)',
        'subtle-grain': 'radial-gradient(rgba(242, 240, 234, 0.03) 1px, transparent 0)',
      }
    },
  },
  plugins: [],
}

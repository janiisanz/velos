/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        void: {
          50: '#f2f3f5',
          100: '#d9dce1',
          200: '#b2b8c2',
          300: '#7e8999',
          400: '#5a6574',
          500: '#3b4553',
          600: '#282f3a',
          700: '#1a2029',
          800: '#10151d',
          900: '#090c11'
        },
        venom: {
          100: '#d6ffd8',
          300: '#71ff7a',
          500: '#2de03a',
          700: '#1f8f2a'
        }
      },
      boxShadow: {
        atmospheric: '0 20px 55px rgba(0, 0, 0, 0.45)',
        panel: '0 10px 30px rgba(0, 0, 0, 0.35)'
      },
      backgroundImage: {
        noise:
          "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.06), transparent 36%), radial-gradient(circle at 90% 80%, rgba(45,224,58,0.08), transparent 35%)"
      }
    }
  },
  plugins: []
};

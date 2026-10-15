/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bahij_TheSansArabic', 'sans-serif'],
      },
      
      colors: {
        foreground: "var(--foreground)",
        'primary'   : '#05453a',
        'secondary' : 'rgb(23 23 23)',
      
        background: "var(--background)",
        container: "rgba(var(--container))",
        border: "rgba(var(--border))",
        "card": "rgba(var(--card))",
        "side-nav": "rgba(var(--side-nav))",
        
        "color": "rgba(var(--color))",
        'negative-color': "rgba(var(--negative-color))",
      },
      height:{
        'custom-screen': 'calc(100vh-64px)'
      },
      backgroundImage:{
        // 'login-image':"url('/Login.png')"
      }
    },  
  },
  plugins: [],
}
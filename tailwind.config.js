/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './*.md',
    './_layouts/**/*.html',
    './_includes/**/*.html',
    './blog/**/*.{html,md}',
    './_posts/**/*.{html,md,mdx}',
    './work.md',
    './contact.md',
    './thanks.md'
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        base: {
          900: '#0b0c0f',
          800: '#111217',
          700: '#181A20'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}

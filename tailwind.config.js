module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}', './src/modules/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    fontSize: ['hover', 'group-hover', 'responsive'],
    textColor: ['dark'],
    height: ['hover', 'group-hover']
  },
}

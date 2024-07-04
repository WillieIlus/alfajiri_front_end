import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'torea-bay': {
          '50': '#eff4fe',
          '100': '#e1ebfe',
          '200': '#c9d8fc',
          '300': '#a8bef9',
          '400': '#859af4',
          '500': '#6777ed',
          '600': '#4b52e0',
          '700': '#3c3fc6',
          '800': '#303495',
          '900': '#30357f',
          '950': '#1c1e4a',
        },
        'emerald': {
          '50': '#effef6',
          '100': '#dafeeb',
          '200': '#b6fcd9',
          '300': '#7ef7bb',
          '400': '#3fe995',
          '500': '#15ce73',
          '600': '#0bae5e',
          '700': '#0d884c',
          '800': '#106b40',
          '900': '#0f5836',
          '950': '#02311c',
        },
        'gallery': {
          '50': '#f8f8f8',
          '100': '#efefef',
          '200': '#dcdcdc',
          '300': '#bdbdbd',
          '400': '#989898',
          '500': '#7c7c7c',
          '600': '#656565',
          '700': '#525252',
          '800': '#464646',
          '900': '#3d3d3d',
          '950': '#292929',
        },
        'carnation': {
          '50': '#fff1f1',
          '100': '#ffe3e4',
          '200': '#ffccd0',
          '300': '#ffa1a9',
          '400': '#ff5668',
          '500': '#f93a54',
          '600': '#e7173d',
          '700': '#c30d32',
          '800': '#a30e31',
          '900': '#8b1031',
          '950': '#4e0315',
        },
      },
      fontFamily: {
        sans: ['"Montserrat"', 'sans-serif'],
      },
    }
  }
}

import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

/** Wzrusz brand tokens on Aura — light fields only (no system dark mode). */
export const WzruszAuraPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fff5eb',
      100: '#ffe4cc',
      200: '#ffc999',
      300: '#ffa866',
      400: '#ff8233',
      500: '#f06000',
      600: '#cc5200',
      700: '#a34300',
      800: '#7a3300',
      900: '#522200',
      950: '#291100',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#f06000',
          contrastColor: '#ffffff',
          hoverColor: '#cc5200',
          activeColor: '#a34300',
        },
        formField: {
          background: '#ffffff',
          filledBackground: '#ffffff',
          filledHoverBackground: '#ffffff',
          filledFocusBackground: '#ffffff',
          borderColor: '#a8bdd0',
          hoverBorderColor: '#8aa8c0',
          focusBorderColor: '#f06000',
          color: '#01468e',
          placeholderColor: '#3d5f73',
          iconColor: '#3d5f73',
        },
        highlight: {
          background: '#fff5eb',
          focusBackground: '#ffe4cc',
          color: '#cc5200',
          focusColor: '#a34300',
        },
        content: {
          background: '#ffffff',
          hoverBackground: '#fffad7',
          borderColor: '#d4e4ef',
          color: '#01468e',
          hoverColor: '#01468e',
        },
      },
    },
  },
});

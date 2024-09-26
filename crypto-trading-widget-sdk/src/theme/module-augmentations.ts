import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    secondaryButton: PaletteColorOptions;
    paperSecondaryBackground: PaletteColorOptions;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    secondaryButton: PaletteColor;
    paperSecondaryBackground: PaletteColor;
  }

  interface TypeText {
    primaryButton: string;
    secondaryButton: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    inputInner: true;
    containedSecondary: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    info: true;
    tooltip: true;
  }
}

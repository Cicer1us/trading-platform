import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    secondaryButton: PaletteColorOptions;
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    secondaryButton: PaletteColor;
  }

  interface TypeText {
    primaryButton: string;
    secondaryButton: string;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    black: true;
    tooltip: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    inputInner: true;
    containedSecondary: true;
    redButton: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    assetInput: true;
  }
}

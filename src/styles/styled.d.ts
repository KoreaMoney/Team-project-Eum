import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      white: string;
      black: string;
      gray10: string;
      gray20: string;
      gray30: string;
      gray40: string;
      gray50: string;
      gray60: string;
      red: string;
      brandColor: string;
      button: string;
    };
    fontSize: {
      headline48: string;
      title24: string;
      title36: string;
      body16: string;
      label12: string;
      bottom20: string;
      like30: string;
    };
    fontWeight: {
      bold: number;
      medium: number;
      regular: number;
      light: number;
    };
  }
}

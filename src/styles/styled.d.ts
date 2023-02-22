import 'styled-components';
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      white: string;
      gray10: string;
      gray20: string;
      gray30: string;
      gray40: string;
      gray50: string;
      gray60: string;
      black: string;
    };
    fontSize: {
      headline: string;
      title: string;
      body: string;
      lable: string;
      botton: string;
    };
    fontWeight: {
      bold: number;
      medium: number;
      regular: number;
      light: number;
    };
  }
}

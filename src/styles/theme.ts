import { DefaultTheme } from 'styled-components';

enum Colors {
  'WHITE' = '#FFFFFF',
  'GRAY10' = '#EBEAEA',
  'GRAY20' = '#C2C1C1',
  'GRAY30' = '#999797',
  'GRAY40' = '#707070',
  'GRAY50' = '#555555',
  'GRAY60' = '#2F3233',
  'BLACK' = '#000000',
  'BRAND_COLOR' = '#FFDA18',
  'RED' = '#FF0000',
  'BUTTON' = '#FF8868',
}

const theme: DefaultTheme = {
  colors: {
    white: Colors.WHITE,
    black: Colors.BLACK,
    gray10: Colors.GRAY10,
    gray20: Colors.GRAY20,
    gray30: Colors.GRAY30,
    gray40: Colors.GRAY40,
    gray50: Colors.GRAY50,
    gray60: Colors.GRAY60,
    brandColor: Colors.BRAND_COLOR,
    red: Colors.RED,
    button: Colors.BUTTON,
  },
  fontSize: {
    headline48: '48px',
    title24: '24px',
    title36: '36px',
    body16: '16px',
    label12: '12px',
    bottom20: '20px',
  },
  fontWeight: {
    bold: 800,
    medium: 700,
    regular: 500,
    light: 400,
  },
};
export { theme };

/**디자인 완성 시 추가 작성될 공간입니다
 * 현재 임시적으로 theme에 다크모드 관련 사항을 넣었습니다
 * 추후 theme.ts로 변경될 것입니다
 */
// export const lightTheme: DefaultTheme = {
//   bgColor: '#fff',
//   textColor: '#000',
//   accentColor: 'tomato',
// };

// export const darkTheme: DefaultTheme = {
//   bgColor: '#000',
//   textColor: '#fff',
//   accentColor: 'tomato',
// };

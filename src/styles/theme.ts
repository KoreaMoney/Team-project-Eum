import { DefaultTheme } from 'styled-components';

enum Colors {
  'WHITE' = '#FFFFFF',
  'BLACK' = '#000000',
  'GREEN' = '#06C755',
  'BLUE' = '#4270ED',
  'ORANGE01' = '#FF6C2C',
  'ORANGE02' = '#FF8955',
  'ORANGE03' = '#FFA179',
  'GRAY05' = '#F9F9F9',
  'GRAY10' = '#EBEAEA',
  'GRAY20' = '#C2C1C1',
  'GRAY30' = '#999797',
  'GRAY40' = '#707070',
  'GRAY50' = '#555555',
  'GRAY60' = '#2F3233',
}

const theme: DefaultTheme = {
  colors: {
    white: Colors.WHITE,
    black: Colors.BLACK,
    green: Colors.GREEN,
    Blue: Colors.BLUE,
    orange01: Colors.ORANGE01,
    orange02: Colors.ORANGE02,
    orange03: Colors.ORANGE03,
    gray05: Colors.GRAY05,
    gray10: Colors.GRAY10,
    gray20: Colors.GRAY20,
    gray30: Colors.GRAY30,
    gray40: Colors.GRAY40,
    gray50: Colors.GRAY50,
    gray60: Colors.GRAY60,
  },

  fontSize: {
    ad56: '56px',
    ad24: '24px',
    title64: '64px',
    title32: '32px',
    title20: '20px',
    title18: '18px',
    title16: '16px',
    title14: '14xp',
  },
  lineHeight: {
    ad56: '56px',
    ad24: '24px',
    title64: '64px',
    title32: '32px',
    title20: '20px',
    title18: '18px',
    title16: '16px',
    title14: '14xp',
  },
  fontWeight: {
    bold: 700,
    medium: 500,
    reqular: 300,
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

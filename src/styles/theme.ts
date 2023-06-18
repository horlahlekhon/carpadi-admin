import { createTheme } from '@material-ui/core'
import { createGlobalStyle } from 'styled-components'

export const t = {
  primaryDarkBlue: '#243773',
  primaryDeepBlue: '#162A69',
  primaryBlue: '#56A0D7',
  primaryAshBlue: '#424F65',
  primaryLite: '#CEDAFF',
  primaryExtraLite: '#E7F4FB',
  secondaryExtraBlue: '#2B55DB',
  secondaryDeepAshBlue: '#002E45',
  secondarySeaTone: '#51938F',
  secondaryCyan: '#24C8D2',
  white: '#FFFFFF',
  black: '#000000',
  deepGrey: '#212120',
  grey: '#767676',
  lightGrey: '#A3A3A3',
  liteGrey: '#DEDEDE',
  extraLiteGrey: '#F0F0F0',
  ultraGrey: '#F3F3F3',
  ultraLiteGrey: '#FCFCFC',
  alertValidation: '#FFB82E',
  alertValidationLite: '#FFEBA5',
  alertError: '#F93232',
  alertErrorLite: '#FFC1C1',
  alertSuccess: '#439F6E',
  alertSuccessLite: '#BCFFDB'
}

export const theme = createTheme({
  palette: {
    primary: {
      main: `${t.primaryDarkBlue}`,
      light: `${t.primaryBlue}`,
      dark: `${t.primaryDeepBlue}`,
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: `${t.primaryBlue}`,
      light: `${t.primaryExtraLite}`,
      dark: `${t.secondaryDeepAshBlue}`,
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#4caf50'
    }
  },
  typography: {
    fontFamily: 'Roboto',
    allVariants: {
      fontFamily: 'Roboto'
    }
  },
  overrides: {
    MuiBreadcrumbs: {
      root: {
        color: 'black !important',
        fontSize: '14px !important'
      },
      separator: {
        color: `${t.grey} !important`,
        height: '21px !important'
      }
    },
    MuiRadio: {
      colorSecondary: {
        color: `${t.primaryBlue} !important`
      }
    },
    MuiTypography: {
      root: {
        fontFamily: 'Roboto'
      },
      colorPrimary: {
        color: `${t.primaryDeepBlue} !important`
      },
      colorSecondary: {
        color: `${t.primaryBlue} !important`
      },
      colorTextPrimary: {
        color: `${t.primaryDeepBlue} !important`
      },
      colorTextSecondary: {
        color: `${t.primaryBlue} !important`
      }
    },
    MuiPaper: {
      root: {
        borderRadius: '12px !important'
      }
    }
  }
})

export const GlobalStyles = createGlobalStyle`
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: Roboto !important;
      font-weight: 400;
      font-style: normal;
    }

    option{
      cursor: pointer !important;
      margin: 10px !important;
    }

    
    .MuiFormLabel-root{
      line-height: 0 !important;
    }


    input, textarea, button {font-family: inherit}
    `
// background: ${({ theme }) => theme.body};
// color: ${({ theme }) => theme.text};

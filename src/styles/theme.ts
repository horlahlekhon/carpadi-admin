import { createTheme } from '@material-ui/core';
import { createGlobalStyle } from "styled-components";


export const theme = createTheme({
    palette: {
        primary: {
            main: "#243773",
            light: "#56A0D7",
            dark: "#424F65",
            contrastText: "#FFFFFF",
        },
        success: {
            main: "#4caf50",
        },
    },
})

export const t = {
    primaryDarkBlue: "#243773",
    primaryBlue: "#56A0D7",
    primaryAshBlue: "#424F65",
    primaryLite: "#CEDAFF",
    primaryExtraLite: "#E7F4FB",
    secondaryExtraBlue: "#2B55DB",
    secondaryDeepAshBlue: "#002E45",
    secondarySeaTone: "#51938F",
    secondaryCyan: "#24C8D2",
    white: "#FFFFFF",
    black: "#000000",
    deepGrey: "#212120",
    grey: "#767676",
    lightGrey: "#A3A3A3",
    liteGrey: "#DEDEDE",
    extraLiteGrey: "#F0F0F0",
    ultraGrey: "#F3F3F3",
    ultraLiteGrey: "#FCFCFC",
    alertValidation: "#FFB82E",
    alertValidationLite: "#FFEBA5",
    alertError: "#F93232",
    alertErrorLite: "#FFC1C1",
    alertSuccess: "#439F6E",
    alertSuccessLite: "#BCFFDB",
};

export const GlobalStyles = createGlobalStyle`
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background: ${({ theme }) => theme.body};
      color: ${({ theme }) => theme.text};
      font-family: Roboto !important;
      font-weight: 400;
      font-style: normal;
    }
    input, textarea, button {font-family: inherit}
    `;

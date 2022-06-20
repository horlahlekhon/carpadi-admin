import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import {
  ThemeProvider as MaterialUIThemeProvider,
  StylesProvider
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { theme, GlobalStyles } from '../styles/theme'
import { animations } from '../lib/animations'

const MyApp = ({ Component, pageProps, router }): JSX.Element => {
  const getLayout = Component.getLayout || ((page) => page)
  const [animation, setAnimation] = useState(animations[1])

  // Remove the server-side injected CSS.
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

  return getLayout(
    <StylesProvider injectFirst>
      <MaterialUIThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          <GlobalStyles />
          <CssBaseline />
          <LazyMotion features={domAnimation}>
            <AnimatePresence exitBeforeEnter={false}>
              <m.div
                key={router.route.concat(animation.name)}
                className="page-wrap"
                initial="initial"
                animate="animate"
                variants={animation.variants}
                transition={animation.transition}
              >
                <Component {...pageProps} />
              </m.div>
            </AnimatePresence>
          </LazyMotion>
        </StyledComponentsThemeProvider>
      </MaterialUIThemeProvider>
    </StylesProvider>
  )
}

export default MyApp

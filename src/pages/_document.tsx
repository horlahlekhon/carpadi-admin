import React from 'react'
import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { ServerStyleSheets as MaterialServerStyleSheets } from '@material-ui/core'

export default class CustomDocument extends NextDocument {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const styledComponentsSheet = new ServerStyleSheet()
    const materialUiSheets = new MaterialServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = (): any | Promise<any> =>
        originalRenderPage({
          enhanceApp: (App) => (
            props
          ): React.ReactElement<{
            sheet: ServerStyleSheet
          }> =>
            styledComponentsSheet.collectStyles(
              materialUiSheets.collect(<App {...props} />)
            )
        })

      const initialProps = await NextDocument.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [
          <React.Fragment key="styles">
            {initialProps.styles}
            {styledComponentsSheet.getStyleElement()}
            {materialUiSheets.getStyleElement()}
          </React.Fragment>
        ]
      }
    } finally {
      styledComponentsSheet.seal()
    }
  }

  render(): React.ReactElement {
    return (
      <Html lang="ja-JP">
        <Head>
          <title>Carpadi Admin</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

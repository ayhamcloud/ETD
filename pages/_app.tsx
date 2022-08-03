import '@/styles/global.css'
import type { AppProps } from 'next/app'
import { SnackbarProvider } from "notistack";

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <SnackbarProvider maxSnack={3}>
      <Component {...pageProps} />
    </SnackbarProvider>

  )
}

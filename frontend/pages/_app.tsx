import "@/styles/globals.css"
import "@/styles/ListMenu.css"
import "@/styles/ContextMenu.css"
import "@/styles/Popup.css"
import type { AppProps } from "next/app"
import "bootstrap/dist/css/bootstrap.css"
import { Logger, LogLevel } from "@/modules/logger";

export const LOG = new Logger(LogLevel.debug);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

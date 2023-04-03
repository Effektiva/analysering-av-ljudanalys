import "@/styles/globals.css"
import "@/styles/ListMenu.css"
import "@/styles/ContextMenu.css"
import "@/styles/Popup.css"
import "@/styles/InvestigationPage.css"
import "@/styles/SoundanalysisPage.css"
import "@/styles/SoundClassFilterInput.css"
import "@/styles/Graph.css"
import "@/styles/ProgressBar.css"
import "@/styles/MetaData.css"
import "@/styles/Notes.css"
import "@/styles/LeftMenu.css"
import "@/styles/MainView.css"
import type { AppProps } from "next/app"
import "bootstrap/dist/css/bootstrap.css"
import { Logger, LogLevel } from "@/modules/logger";

export const LOG = new Logger(LogLevel.debug);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

import "@/styles/globals.scss"
import "@/styles/ListMenu.scss"
import "@/styles/ContextMenu.scss"
import "@/styles/Popup.scss"
import "@/styles/InvestigationPage.scss"
import "@/styles/SoundanalysisPage.scss"
import "@/styles/SoundClassFilterInput.scss"
import "@/styles/Graph.scss"
import "@/styles/ProgressBar.scss"
import "@/styles/MetaData.scss"
import "@/styles/Notes.scss"
import "@/styles/LeftMenu.scss"
import "@/styles/MainView.scss"
import "@/styles/MediaControl.scss"
import "@/styles/FrontPage.scss"
import type { AppProps } from "next/app"
import "bootstrap/dist/css/bootstrap.css"
import { Logger, LogLevel } from "@/modules/logger";

export const LOG = new Logger(LogLevel.debug);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

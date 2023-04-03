import Head from "next/head"
import MainView from "@/components/MainView"

export default function Home() {
  return (
    <>
      <Head>
        <title>Frontend</title>
      </Head>
      <main>
        <div className="container">
          <MainView />
        </div>
      </main>
    </>
  )
}

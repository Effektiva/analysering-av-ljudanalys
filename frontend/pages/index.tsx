import Head from "next/head"
import AppView from "@/components/AppView"

export default function Home() {
  return (
    <>
      <Head>
        <title>Frontend</title>
      </Head>
      <main>
        <div className="container">
          <AppView />
        </div>
      </main>
    </>
  )
}

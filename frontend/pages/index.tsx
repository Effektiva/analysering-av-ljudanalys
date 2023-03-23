import Head from "next/head"
import styles from "@/styles/Home.module.css"
import LeftMenu from "@/components/LeftMenu"

export default function Home() {
  return (
    <>
      <Head>
        <title>Frontend</title>
      </Head>
      <main>
        <div className="container">
          <div className="row">
            <h1>Welcome to the frontend!</h1>
            <LeftMenu />
          </div>
        </div>
      </main>
    </>
  )
}

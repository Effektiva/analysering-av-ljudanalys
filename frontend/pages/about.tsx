import Head from "next/head"
import styles from "@/styles/Home.module.css"

function Header({ title }) {
  return <h1>{title ? title : "Welcome!"}</h1>
}

export default function About() {

  return (
    <>
      <Head>
        <title>Frontend - About</title>
      </Head>
      <main>
        <div className="container">
          <div className="row">
              <Header title="About page..."></Header>
          </div>
          <div className="row">
            <div className="col col-sm-3">
              <a href="./">Home</a>
            </div>
            <div className="col">
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

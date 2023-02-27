import Head from "next/head"
import styles from "@/styles/Home.module.css"
import InvestigationList from "../components/investigationList"
import axios from "axios";

function Header({ title }) {
  return <h1>{title ? title : "Welcome!"}</h1>
}

export default function Home() {
  function handleClick() {
    axios({
        method: "get",
        baseURL: "http://localhost:8000/",
        url: "/",
        withCredentials: false,
    })
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error.data);
    })
  }

  return (
    <>
      <Head>
        <title>Frontend</title>
      </Head>
      <main>
        <div className="container">
          <div className="row">
              <Header title="Welcome to the frontend!"></Header>
          </div>
          <div className="row">
            <div className="col col-sm-4">
              <a href="./about">About</a>
              <InvestigationList />
            </div>
            <div className="col">
              <a href="#" onClick={handleClick}>Click here to fetch from backend.</a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

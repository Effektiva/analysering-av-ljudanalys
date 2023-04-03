import React, { useState } from "react";

import LeftMenu, { Page } from "../DummyLeftMenu/DummyLeftMenu";
import FrontPage from "./FrontPage";
import InvestigationPage from "../InvestigationPage/InvestigationPage";
import DossierPage from "../DossierPage/DossierPage";

const DUMMY_DOSSIER_DATA = [
  {
    id: 0,
    name: "dossier 0"
  },
  {
    id: 1,
    name: "dossier 1"
  }
];

const MainLayout = () => {
  const [currentPage, setCurrentPage] = useState(Page.FrontPage);
  const [currentDataId, setCurrentDataId] = useState(0);
  const [dossiers, setDossiers] = useState(DUMMY_DOSSIER_DATA);

  const switchPageHandler = (page: Page, id: number) => {
    setCurrentPage(page);
    setCurrentDataId(id);
  }

  const filterDossierData = (id: number) => {
    return dossiers.filter((dossier) => {
      return dossier.id === id;
    })[0];
  }

  let pageComponent;

  switch(currentPage) {
    case Page.FrontPage:
      pageComponent = <FrontPage />
      break;
    case Page.DossierPage:
      pageComponent = <DossierPage data={filterDossierData(currentDataId)}/>
      break;
  }

  return (
    <div>
      <LeftMenu dossiers={dossiers} switchPage={switchPageHandler}/>
      {pageComponent}
    </div>
  );
}

export default MainLayout;
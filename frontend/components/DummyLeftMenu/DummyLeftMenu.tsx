import DossierList from "./DummyDossierList/DummyDossierList";

export enum Page {
    FrontPage,
    InvestigationPage,
    DossierPage
};

const LeftMenu = (props: any) => {
    const selectedDossierHandler = (id: number) => {
        props.switchPage(Page.DossierPage, id);
    }

    return (
        <div>
            <h1>Left Menu</h1>
            <DossierList dossiers={props.dossiers} selectedDossier={selectedDossierHandler}/>
        </div>
    );
}

export default LeftMenu;
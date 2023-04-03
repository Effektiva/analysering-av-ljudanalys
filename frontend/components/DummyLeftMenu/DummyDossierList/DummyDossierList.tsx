import Dossier from "./DummyDossier";

const DossierList = (props: any) => {
    const selectedDossierHandler = (id: number) => {
        props.selectedDossier(id);
    }

    return (
        <div>
            <h2>Dossier List</h2>
            <ul>
                {props.dossiers.map((dossier: any) => (
                    <Dossier 
                        key={dossier.id}
                        id={dossier.id}
                        name={dossier.name}
                        selectedDossier={selectedDossierHandler}
                    />
                ))}
            </ul>
        </div>
    );
}

export default DossierList;
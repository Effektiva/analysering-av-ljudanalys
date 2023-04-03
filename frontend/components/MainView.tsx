import { DUMMY_INVESTIGATION_LIST, DUMMY_SOUNDCHAIN } from "@/modules/DummyData";
import { useState } from "react";
import LeftMenu, { Type } from "./LeftMenu/LeftMenu";
import SoundanalysisPage from "./SoundanalysisPage/SoundanalysisPage";
import InvestigationPage from "./InvestigationPage/InvestigationPage";

/*
 * This is the definition of a Soundchain, as it is saved in the database.
 */
// TODO: move these? There'll be more than one of these, maybe save them all in a common file/folder
// or just have all of the here?
export type Soundchain = {
  id: number,
  name: string,
  startTime: number,
  endTime: number,
  state: string, // TODO: should be an enum, the enum is defined in branch 41 beneath components/LeftMenu/ListMenu/ListItem.tsx currently
  comments: Array<string> // TODO: should get its own struct, e.g. Array<comment>
}

/**
 * The MainView is the main component switching beteen pages (Investigations, Dossiers, etc)
 * and does this through passing a handler funktion through props to the LeftMenu component.
 * Whenever a user left clickes on a investigation, dossier or something else relevant in the
 * left menu, this handler funktion is called by the child component LeftMenu, passing an id
 * and type of the list item and the page is updated accordingly.
 */
const MainView = () => {
    const [page, setPage] = useState(<SoundanalysisPage soundchain={DUMMY_SOUNDCHAIN} />);

    // Attempt to obtain the right path to dossier sub data.
    const getSearchPath = (id: number) => {
        let num = id;
        let ids: number[] = [];
        while (num) {
            const remainder = num % 10;
            num -= remainder;
            num /= 10;
            ids = [remainder, ...ids];         // Appending to the back of the array.
        }
        return ids;
    }

    const filterById = (dataList: Array<any>, id: number) => {
        const [data] = dataList.filter((data) => {
            return data.id === id;
        })
        return data;
    }

    const selectedHandler = (type: Type, id: number) => {
        switch (type) {
            case Type.INVESTIGATION:
                const investigation = filterById(DUMMY_INVESTIGATION_LIST, id);
                setPage(<InvestigationPage />);
                break;
            case Type.DOSSIER: // Todo: need to figure out a good way to structure dossier data so that its easy to extract.
                setPage(<SoundanalysisPage soundchain={DUMMY_SOUNDCHAIN} />);
                break;
            default:
                break;
        }
    }

    return (
        <div className="main-view">
            <LeftMenu selected={selectedHandler}/>
            {page}
        </div>
    )
}

export default MainView;

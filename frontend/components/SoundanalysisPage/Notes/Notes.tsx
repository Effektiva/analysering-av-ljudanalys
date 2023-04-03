import { DUMMY_NOTES } from "@/modules/DummyData";
import { useState } from "react";
import NotesList from "./NoteList";

const STYLE_NAMESPACE = "notes__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
}

const Notes = () => {
  const [notes, setNotes] = useState(DUMMY_NOTES)

  return (
    <div className={Style.Container}>
      <div className={Style.Header}>Anteckningar</div>
      Tidpunkt: <input placeholder="1342" /><br />
      Anteckning: <textarea placeholder="Text" /><br />
      <button>Lägg till</button>

      <NotesList notes={notes} />
    </div>
  );
}

export default Notes;

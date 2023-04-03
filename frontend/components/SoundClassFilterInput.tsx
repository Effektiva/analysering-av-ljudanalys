import { useState } from "react";

const STYLE_NAMESPACE = "soundClassFilterInput__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  Input = STYLE_NAMESPACE + "input",
  List = STYLE_NAMESPACE + "list",
  ListContainer = STYLE_NAMESPACE + "listContainer",
  ListHeader = STYLE_NAMESPACE + "listHeader",
  ListRemove = STYLE_NAMESPACE + "listRemove",
}

const SoundClassFilterInput = () => {
  const [filters, setFilters] = useState([{id: 0, name: "Hund"}]);

  return (
    <div className={Style.Container}>
      <div className={Style.Header}>Filtrering</div>
      <input className={Style.Input} placeholder="Välj ljudklasser att filtrera på" />
      <div className={Style.ListContainer}>
        <div className={Style.ListHeader}>Aktiva filter</div>
        <div className={Style.List}>
          <ul>
            {
              filters.map(elem => {
                return <li key={elem.id}>
                        {elem.name}
                        <div className={Style.ListRemove}>X</div>
                       </li>;
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SoundClassFilterInput;

import { useState } from "react";
import ListMenu, { ItemType, ListEvent, ListEventResponse } from "@/components/ListMenu/ListMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { LOG as log } from "@/pages/_app";
import Dossier from "@/models/General/Dossier";
import APIService from "@/models/APIService";
import AppState from "@/state/AppState";

type Props = {
  selected: Function,
  dossiers: Array<Dossier>,
  appState: AppState,
}

const CONTEXT_MENUS: Array<ContextItem[]> = [
  [
    {
      id: ListEvent.ContextChangeText,
      text: "Byt namn",
    },
    {
      id: ListEvent.ContextCreateFolder,
      text: "Skapa underkatalog",
    },
    {
      id: ListEvent.ContextExport,
      text: "Exportera",
    },
    {
      id: ListEvent.ContextDelete,
      text: "Ta bort",
    }
  ],
  [
    {
      id: ListEvent.ContextChangeText,
      text: "Byt namn",
    },
    {
      id: ListEvent.ContextExport,
      text: "Exportera",
    },
    {
      id: ListEvent.ContextDelete,
      text: "Ta bort",
    }
  ],
  [
    {
      id: ListEvent.ContextDelete,
      text: "Ta bort från dossier",
    },
  ]
];

const DossierList = (props: Props) => {
  const [dossiers, setDossiers] = useState<Array<Dossier>>(props.dossiers);
  const [menuVisible, setMenuVisible] = useState<boolean>(true);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  const eventHandler = async (response: ListEventResponse) => {
    switch(response.event) {
      case ListEvent.ClickOnRoot:
      case ListEvent.ClickOnSubroot:
        // Ignore
        break;

      case ListEvent.ClickOnChild:
        props.selected(response.id);
        break;

      case ListEvent.ChangeTextOfRoot:
        if (response.value != undefined) {
          APIService.changeDossierName(response.id, response.value);
          let newDossiers = [...dossiers];
          let index = dossiers.findIndex((elem) => elem.id == response.id);
          newDossiers[index].name = response.value!;
          setDossiers(newDossiers);
        }
        break;

      case ListEvent.ChangeTextOfSubroot:
        if (response.value != undefined) {
          APIService.changeDossierName(response.id, response.value);
          let newDossiers = [...dossiers];
          let parentIndex = dossiers.findIndex((elem) => elem.id == response.parentID);
          let parent = newDossiers[parentIndex];
          let childIndex = parent.subdossiers!.findIndex((elem) => elem.id == response.id);
          parent.subdossiers![childIndex].name = response.value!;
          setDossiers(newDossiers);
        }
        break;

      case ListEvent.ContextCreateFolder:
        let index = dossiers.findIndex((elem) => elem.id === response.id);
        let name = "Ny subdossier " + dossiers[index].subdossiers.length;
        let id = await APIService.createSubDossier(response.id, name);
        if (id != -1) {
          log.debug(response.id);
          let newDossiers = [...dossiers];
          newDossiers[index].subdossiers.push(new Dossier(id, name, [], []));
          setDossiers(newDossiers);
        }
        break;

      case ListEvent.ContextExport:
        log.debug("Export", "(" + response.itemType + "):", response.id);
        break;

      case ListEvent.ContextDelete:
        switch(response.itemType) {
          case ItemType.Root:
            {
              let newDossiers = [...dossiers];
              let index = dossiers.findIndex((dos) => dos.id == response.id);
              newDossiers.splice(index, 1);
              setDossiers(newDossiers);
            }
            APIService.deleteDossier(response.id);
            break;
          case ItemType.Subroot:
            {
              let newDossiers = [...dossiers];
              let parentIndex = dossiers.findIndex((dos) => dos.id == response.parentID);

              if (parentIndex != -1) {
                let parent = newDossiers[parentIndex];
                let childIndex = parent.subdossiers!.findIndex((elem) => elem.id == response.id);
                parent.subdossiers.splice(childIndex, 1);
                setDossiers(newDossiers);
              } else {
                log.warning("Couldn't find parent index.")
              }
            }
            APIService.deleteDossier(response.id);
            break;
          case ItemType.Child:
            {
              let rootIndex = -1;
              let subrootIndex = -1;
              let childIndex = -1;

              // A child can be on two different levels, straight beneath a root dossier or
              // beneath a subroot dossier.
              dossiers.some((root, ri) => {
                // If it's straight beneath a root dossier, we'll find it here.
                root.soundfiles.forEach((file, i) => {
                  if (file.id == response.id) {
                    rootIndex = ri;
                    childIndex = i;
                  }
                });

                if (rootIndex != -1 && childIndex != -1) {
                  return true;
                } else {
                  // Otherwise we'll have to dig deeper
                  root.subdossiers.forEach((subroot, si) => {
                    subroot.soundfiles.forEach((file, i) => {
                      if (file.id == response.id) {
                        rootIndex = ri;
                        subrootIndex = si;
                        childIndex = i;
                      }
                    })
                  })
                }
              });

              // Remove the child.
              let newDossiers = dossiers;
              if (rootIndex != -1 && childIndex != -1 && subrootIndex == -1) {
                newDossiers[rootIndex].soundfiles.splice(childIndex, 1);
                let dossierID = newDossiers[rootIndex].id;
                APIService.deleteSoundfileFromDossier(dossierID!, response.id)
              } else if (rootIndex != -1 && childIndex != -1 && subrootIndex != -1) {
                newDossiers[rootIndex].subdossiers[subrootIndex].soundfiles.splice(childIndex, 1);
                let dossierID = newDossiers[rootIndex].subdossiers[subrootIndex].id;
                APIService.deleteSoundfileFromDossier(dossierID!, response.id)
              } else {
                log.warning("Couldn't find all indexes needed to remove soundfile from dossier.");
                return;
              }

              setDossiers(newDossiers);
              setForceUpdate(!forceUpdate);
            }
            break;
        }
        break;

      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  const addNewItem = async () => {
    let id = await APIService.createDossier("Ny dossier " + dossiers.length);
    if (id != -1) {
      setDossiers(prev => [...prev, new Dossier(id, "Ny dossier " + dossiers.length)]);
    }
  }

  const toggleVisibility = () => {
    setMenuVisible(!menuVisible);
  }

  return (
    <>
      <div className="dossier_listmenu">
        <span
          className={"listMenuHeader" + ( !menuVisible ? " collapsed" : "")}
          onClick={toggleVisibility}
        >
          Dossier
        </span>
        { menuVisible &&
          <ListMenu
            key={dossiers.length}
            items={dossiers.map((dossier) => dossier.asListItem())}
            contextMenus={CONTEXT_MENUS}
            eventHandler={eventHandler}
            toggleableRoots={true}
            selectedId={props.appState.selectedSoundclip?.id}
            forceUpdate={forceUpdate}
          />
        }
        <button className="listAddButton" onClick={addNewItem}>Ny dossier</button>
      </div>
    </>
  )
}

export default DossierList;

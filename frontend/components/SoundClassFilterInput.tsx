import { useEffect, useRef, useState } from "react";
import APIService from "@/models/APIService";
import useComponentVisible from "@/hooks/useComponentVisible";
import fuzzysort from "fuzzysort"

type Props = {
  filters: any[],
  setFilters: Function
}

const STYLE_NAMESPACE = "soundClassFilterInput__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  Input = STYLE_NAMESPACE + "input",
  List = STYLE_NAMESPACE + "list",
  ListContainer = STYLE_NAMESPACE + "listContainer",
  ListHeader = STYLE_NAMESPACE + "listHeader",
  ListRemove = STYLE_NAMESPACE + "listRemove",
  Popup = STYLE_NAMESPACE + "popup",
  PopupChoice = STYLE_NAMESPACE + "popupChoice",
}

const SoundClassFilterInput = (props: Props) => {
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const { ref: popupRef,
          isComponentVisible: popupVisible,
          setIsComponentVisible: setPopupVisible } = useComponentVisible(false);
  const [popupPosition, setPopupPosition] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const [useInputFilter, setUseInputFilter] = useState<boolean>(false);
  const [inputFilteredClasses, setInputFilteredClasses] = useState<Fuzzysort.KeyResults<any>>();
  const [choosableClasses, setChoosableClasses] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchMyAPI() {
      const data = await APIService.getAllSoundClasses();
      setAvailableClasses(structuredClone(data));
      setChoosableClasses(structuredClone(data));
    }

    fetchMyAPI();
    const rect = inputRef.current!.getBoundingClientRect();
    setPopupPosition([rect.x, rect.y + rect.height, rect.height, rect.width]);
  }, []);

  /*
   * If user starts to write in the input box, then we want to
   * start sorting the choosable classes on the input.
   */
  const inputHandler = () => {
    let input = inputRef.current!.value;
    if (input != "") {
      setUseInputFilter(true);
    } else {
      setUseInputFilter(false);
    }

    // We use fuzzysort to find the best candidates.
    const results = fuzzysort.go(input, choosableClasses, {key:"name"});
    setInputFilteredClasses(results);
  }

  /*
   * Adds a soundclass to active filters and removes the same soundclass
   * from choosable classes.
   */
  const clickHandler = (id: number) => {
    let newFilters = [...props.filters];
    newFilters.push(availableClasses.find((elem) => elem.id == id));
    props.setFilters(newFilters);
    let newChoosable = choosableClasses;
    let index = newChoosable.findIndex((elem) => elem.id == id);
    newChoosable.splice(index, 1);
    setChoosableClasses(newChoosable);
    inputHandler();
  }

  /*
   * Removes a soundclass from active filters and sorts it into
   * the choosable classes array.
   */
  const removeHandler = (id: number) => {
    let newFilters = [...props.filters];
    let index = newFilters.findIndex((elem) => elem.id == id);
    newFilters.splice(index, 1);
    props.setFilters(newFilters);
    let newChoosable = choosableClasses;
    newChoosable.push(availableClasses.find((elem) => elem.id == id));
    newChoosable.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
    setChoosableClasses(newChoosable);
    inputHandler();
  }

  return (
    <>
      <div className={Style.Container}>
        <div className={Style.Header}>Filtrering</div>
        <input
          ref={inputRef}
          onFocus={() => {
            setPopupVisible(true)
          }}
          onChange={inputHandler}
          className={Style.Input}
          placeholder="Välj ljudklasser att filtrera på"
        />
        <div className={Style.ListContainer}>
          <div className={Style.ListHeader}>Aktiva filter</div>
          <div className={Style.List}>
            <ul>
              { props.filters.length != 0 ?
                  props.filters.map(elem => {
                  return <li key={elem.id}>
                          {elem.name}
                          <div
                            onClick={() => { removeHandler(elem.id) }}
                            className={Style.ListRemove}
                          >X</div>
                         </li>;
                })
                : "Inga filter valda."
              }
            </ul>
          </div>
        </div>
      </div>
      <div
        ref={popupRef}
        className={Style.Popup}
        style={{
          display: popupVisible ? "block" : "none",
          top: popupPosition[1],
          left: popupPosition[0],
          width: popupPosition[3],
        }}
      >
        { useInputFilter ?
            inputFilteredClasses!.map((aClass: any) => {
              return <div
                        key={aClass.obj.id}
                        id={aClass.obj.id}
                        className={Style.PopupChoice}
                        onClick={() => { clickHandler(aClass.obj.id) }}
                      >{aClass.obj.name}</div>;
            })
          :
            choosableClasses.map((aClass) => {
              return <div
                        key={aClass.id}
                        id={aClass.id}
                        className={Style.PopupChoice}
                        onClick={() => { clickHandler(aClass.id) }}
                      >{aClass.name}</div>;
            })
        }
      </div>
    </>
  );
}

export default SoundClassFilterInput;

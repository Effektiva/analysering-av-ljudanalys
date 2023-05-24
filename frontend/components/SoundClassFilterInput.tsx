import { useEffect, useRef, useState } from "react";
import APIService from "@/models/APIService";
import useComponentVisible from "@/hooks/useComponentVisible";
import fuzzysort from "fuzzysort"
import { LOG as log } from '@/pages/_app';
import { debug } from "util";

type Props = {
  filters: any[],
  setFilters: Function
}

const STYLE_NAMESPACE = "soundClassFilterInput__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Top = STYLE_NAMESPACE + "top",
  Header = STYLE_NAMESPACE + "header",
  InputWrapper = STYLE_NAMESPACE + "inputWrapper",
  Input = STYLE_NAMESPACE + "input",
  List = STYLE_NAMESPACE + "list",
  ListContainer = STYLE_NAMESPACE + "listContainer",
  ListHeader = STYLE_NAMESPACE + "listHeader",
  ListRemove = STYLE_NAMESPACE + "listRemove",
  Popup = STYLE_NAMESPACE + "popup",
  PopupChoice = STYLE_NAMESPACE + "popupChoice",
}


const colorContrast = (color: any) : string => {

  if(
    ( typeof color == 'string' || color instanceof String )
    && color.length == 7 && color[0] == '#'
  ) {

    let r = Number("0x" + color.substring(1,3));
    let g = Number("0x" + color.substring(3,5));
    let b = Number("0x" + color.substring(5,7));

    // Luminance [0,1] from RGB and contrast [1,21] from luminance. Formulas (but simplified) from: https://www.w3.org/TR/WCAG20/
    let luminance = (0.2126*r + 0.7152*g + 0.0722*b)/255;
    let luminanceContrast = (20*luminance) + 1;
    let whiteContrast = 21 / luminanceContrast;   // white has luminance (#fff) 1
    let blackContrast = luminanceContrast;          // black has luminance (#000) 0

    if( whiteContrast > blackContrast ) {
      return "#ffffff";
    }
    else {
      return "#000000";
    }
  }

  return "#000000";
}

const SoundClassFilterInput = (props: Props) => {
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const { ref: popupRef,
    isComponentVisible: popupVisible,
    setIsComponentVisible: setPopupVisible } = useComponentVisible(false);
  const [useInputFilter, setUseInputFilter] = useState<boolean>(false);
  const [inputFilteredClasses, setInputFilteredClasses] = useState<Fuzzysort.KeyResults<any>>();
  const [choosableClasses, setChoosableClasses] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    APIService.getAllSoundClasses().then((data) => {
      setAvailableClasses(structuredClone(data));
      setChoosableClasses(structuredClone(data));
    }).catch((error) => {
      log.warning("Couldn't fetch all soundclasses:", error);
    });
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
    const results = fuzzysort.go(input, choosableClasses, { key: "name" });
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

  const colorContrast = (color: any) => {
    let saturation = color.red + color.green + color.blue;

    let isWhiter = saturation > 255*3 / 2;
    let rgb = 0;
    if( isWhiter ) {
      rgb = 255;
    }

    return {red: rgb, green: rgb, blue: rgb, alpha: 1};//new SassColor({red: rgb, green: rgb, blue: rgb, alpha:1});
  }

  return (
    <>
      <div className={Style.Container}>
        <div className={Style.Top}>
          <div className={Style.Header}>Filtrering</div>
          <div className={Style.InputWrapper}>
            <input
              ref={inputRef}
              onFocus={() => {
                setPopupVisible(true)
              }}
              onChange={inputHandler}
              className={Style.Input}

              placeholder={(useInputFilter && !inputFilteredClasses.length) || (!useInputFilter && !choosableClasses.length) ? "Alla ljudklasser är valda" : "Välj ljudklasser att filtrera på" }
              disabled={(useInputFilter && !inputFilteredClasses.length) || (!useInputFilter && !choosableClasses.length)}

              role="combobox"
              aria-controls="filter-popup"
              aria-expanded={popupVisible}
              aria-autocomplete="inline"
            />
            <div
              id="filter-popup"
              ref={popupRef}
              className={Style.Popup}
              style={{
                display: (popupVisible && ((useInputFilter && inputFilteredClasses.length) || (!useInputFilter && choosableClasses.length))) ? "block" : "none",
              }}
              role="listbox"
            >
              {useInputFilter ?
                inputFilteredClasses!.map((aClass: any) => {
                  return <div
                    key={aClass.obj.id}
                    id={aClass.obj.id}
                    className={Style.PopupChoice}
                    onClick={() => { clickHandler(aClass.obj.id) }}
                    role="option"
                  >{aClass.obj.name}</div>;
                })
                :
                choosableClasses.map((aClass) => {
                  return <div
                    key={aClass.id}
                    id={aClass.id}
                    className={Style.PopupChoice}
                    onClick={() => { clickHandler(aClass.id) }}
                    role="option"
                  >{aClass.name}</div>;
                })
              }
            </div>
          </div>
        </div>
        <div className={Style.ListContainer}>
          <div className={Style.ListHeader}>Aktiva filter</div>
          <ul className={Style.List}>
            {props.filters.length != 0 ?
              props.filters.map(elem => {
                return <li key={elem.id} style={{backgroundColor: elem.color, color: colorContrast(elem.color)}}>
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
    </>
  );
}

export default SoundClassFilterInput;

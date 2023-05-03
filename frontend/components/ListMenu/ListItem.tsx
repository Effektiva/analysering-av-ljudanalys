import { ReactNode, useState } from "react";
import { ListItemInput } from "./ListItemInput";
import * as LM from "./ListMenu";
import { ListItemType } from "./ListItemType";

type Props = {
  class: string,
  item: ListItemType,
  eventHandler: Function,
  itemType?: LM.ItemType,
  parentID?: number,
  changeTextID?: number,
  selected?: boolean,
  selectedId?: number | undefined,
  icon?: ReactNode
}

/**
 * A ListItem is what a ListMenu consists of.
 *
 * Props:
 * - class: The css class to use on this item.
 * - item: The actual ListItem to display here. The ListItem's given from ListMenu shouldn't have
 *   to contain all the things we need to pass down to childs when doing multilevel lists.
 * - eventHandler: The function from the parent that should be called when a ListItem is clicked, or
 *   the ListItem's ContextMenu is clicked.
 * - itemType?: Whether this is a Root, Subroot or Child node.
 * - parentID?: If this is a nested ListItem, this will contain the parents ID, otherwise undefined.
 * - changeTextID?: If we're changing the text of a ListItem within the ListMenu (ex. a dossiers name)
 *   then this is the ID of that ListItem. Otherwise undefined.
 * - tags?: If the item has any tags, empty by default. Fill with the enum Tag.
 */
export const ListItem = (props: Props) => {
  const [hidden, setHidden] = useState(false);

  /**
   * Prepare/serve left click events.
   */
  const clickHandler = (...pars: any[]) => {
    let response: LM.ListEventResponse = {
      id: (pars[0] != undefined) ? pars[0] : props.item.id,
      event: LM.ListEvent.UndefinedEvent,
      itemType: props.itemType,
    }

    if (props.itemType != LM.ItemType.Child && props.item.collapsable === true) {
      setHidden(!hidden);
    }

    switch(props.itemType) {
      default:
      case LM.ItemType.Root:
        response.event = LM.ListEvent.ClickOnRoot;
        break;
      case LM.ItemType.Subroot:
        response.event = LM.ListEvent.ClickOnSubroot;
        break;
      case LM.ItemType.Child:
        response.event = LM.ListEvent.ClickOnChild;
        break;
    }

    props.eventHandler(response);
  }

  /**
   * Prepare/serve context menu events.
   */
  const contextClickHandler = (event: React.MouseEvent, ...pars: any[]) => {
    event.preventDefault();

    let response: LM.ContextMenuResponse = {
      contextMenuIndex: -1,
      event: LM.ListEvent.UndefinedEvent,
      id: (pars[0] != undefined) ? pars[0] : props.item.id,
      cursor: [event.clientX, event.clientY],
      parentID: props.parentID,
    }

    switch(props.itemType) {
      default:
      case LM.ItemType.Root:
        response.contextMenuIndex = 0;
        response.event = LM.ListEvent.OpenContextRoot;
        break;
      case LM.ItemType.Subroot:
        response.contextMenuIndex = 1;
        response.event = LM.ListEvent.OpenContextSubroot;
        break;
      case LM.ItemType.Child:
        response.contextMenuIndex = 2;
        response.event = LM.ListEvent.OpenContextChild;
        break;
    }

    props.eventHandler(response);
  }

  /*
   * Returns the wanted css classes for the current ListItem.
   */
  const getStyleClasses = (mainClass: string, hidden: boolean, selected: boolean) => {
    let classes = mainClass + " ";

    if (props.item.subroots || props.item.children) {
      classes += LM.StyleClass.Collapsable + " ";
    }

    if (hidden) {
      classes += "collapsed ";
    }
    if (selected) {
      classes += "selected ";
    }

    return classes;
  }

  /*
   * We render the current ListItem and eventual children/subroots to this item.
   * Also if this item is the one that should have it's text changed, we exchange
   * with a ListItemInput.
   */
  return (
    <>
      <li>
        { props.item.id != props.changeTextID ?
            <div
              className={getStyleClasses(props.class, hidden, props.selected!)}
              >
              <div className="listItemButton"
                onClick={() => clickHandler()}
                onContextMenu={contextClickHandler}
                >
                { props.item.text } { props.icon }
              </div>
            </div>
          :
            <ListItemInput
              key={props.item.id}
              id={props.item.id}
              parent={props.parentID}
              text={props.item.text}
              itemType={props.itemType}
              changeHandler={props.eventHandler}
            />
        }

        { (props.item.subroots || props.item.children) &&
        <ul className="listMenu">
          { props.item.subroots &&
          <>
            {
              props.item.subroots.map((subroot: ListItemType) => {
                return <ListItem
                          key={subroot.id}
                          class={LM.StyleClass.Subroot}
                          itemType={LM.ItemType.Subroot}
                          parentID={subroot.id}
                          item={subroot}
                          changeTextID={props.changeTextID}
                          eventHandler={props.eventHandler}
                          selectedId={props.selectedId}
                        />
              })
            }
          </>
          }
          { props.item.children &&
          <>
            {
              props.item.children.map((child: ListItemType) => {
                return <ListItem
                          key={child.id}
                          parentID={props.item.id}
                          class={LM.StyleClass.Child + " " + LM.StyleClass.Action}
                          itemType={LM.ItemType.Child}
                          item={child}
                          eventHandler={props.eventHandler}
                          selected={props.selectedId === child.id}
                        />
              })
            }
          </>
          }
        </ul>
        }
      </li>
    </>
  )
}

export default ListItemType;

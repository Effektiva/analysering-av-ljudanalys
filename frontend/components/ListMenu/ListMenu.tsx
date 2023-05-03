import { ReactNode, useEffect, useState } from "react";
import useComponentVisible from "@/hooks/useComponentVisible";
import ContextMenu from "@/components/ContextMenu/ContextMenu";
import ContextItem from "@/components/ContextMenu/ContextItem";
import { ItemStatus, ListItemType } from "./ListItemType";
import { LOG as log } from "@/pages/_app";
import { ListItem } from "./ListItem";
import { FaCheckCircle, FaMinusCircle, FaCloud } from "react-icons/fa";

type Props = {
  items: Array<ListItemType>,
  eventHandler: Function,
  contextMenus?: Array<ContextItem[]>,
  toggleableRoots?: boolean,
  selectedId?: number,
}

/**
 * These are the events that can happen within a ListMenu. When implementing an actual ListMenu
 * the parent should pass along a eventHandler function that can handle at least a subset of these.
 */
export enum ListEvent {
  // Is passed if we can't determine the event (unlikely).
  UndefinedEvent,

  // When something within the ListMenu is left-clicked.
  ClickOnRoot = 0,
  ClickOnSubroot,
  ClickOnChild,

  // When the Enter key is pressed within a ListMenuInput (e.g. when changing text of an ListItem)
  ChangeTextOfRoot,
  ChangeTextOfSubroot,

  // Context menu options (sent when a choice is clicked within a context menu)
  ContextCreateFolder,
  ContextExport,
  ContextDelete,
  ContextAddToDossier,
  ContextSetStatus,

  /*
   * Below are internal events and doesn't have to be implented by parent components.
   */

  // This is sent from a ContextMenu when we want to change the text of a ListItem, handled
  // within this component. Basically echanges the ListItem to a ListItemInput which waits for
  // enter key to be pressed, then it passes ChangeTextOfRoot/ChangeTextOfSubroot to the parents
  // eventHandler.
  ContextChangeText,

  // Open contexts
  OpenContextRoot,
  OpenContextSubroot,
  OpenContextChild,
}

// The different list item types that exists.
export enum ItemType {
  Root = 0,
  Subroot,
  Child
}

/*
 * The available CSS classes used throghout a ListMenu.
 */
export enum StyleClass {
  Root = "listItemRoot",
  Child = "listItemChild",
  Subroot = "listItemSubroot",
  Collapsable = "listItemCollapsable",
  Action = "listItemAction",
  Invalid = "listItemInputInvalid",
}

/*
 * An EventResponse is given to the eventHandler passed to this component whenever something
 * happens within the list (left-click, context menu choicen, et.c.).
 *
 * event: The event that happened.
 * id: The ID of the ListItem that caused the event.
 * parentID: If the event was caused on a subroot.
 * value: Could be the new name when a namechange happens.
 * nodeType: The type of the node (root/subroot/child).
 */
export type ListEventResponse = {
  event: ListEvent,
  id: number,
  parentID?: number,
  value?: string,
  itemType?: ItemType,
}

// Used internally
export type ContextMenuResponse = {
  event: ListEvent,
  id: number,
  cursor: number[],
  contextMenuIndex: number,
  parentID?: number,
}

/**
 * The ListMenu is a (possibly two-level) list that has right-clickable items. The context menu
 * choices is passed through the Props (see below). The main point to care about when using
 * this component is that the eventHandler passed to this component will be called when an event
 * happens and get an EventResponse passed to it. See above for what an EventResponse is. A event
 * is one of the events you can see in the ListEvent enum.
 *
 * The list itself is a collection of Root-, Subroot- and Child-items The roots are
 * always at the top of the list and contain Subroots and Children. Subroots can only (practically)
 * contain Children. See below for an example.
 *
 * - FirstRoot
 *  - Subroot
 *    - ChildOfSubroot 1
 *    - ChildOfSubroot 2
 *  - ChildOfFirstRoot 1
 * - SecondRoot
 *  - ChildOfSecondRoot
 *
 * Props:
 * - items: An array of ListItems that should populate the list.
 * - eventHandler: A function that the parent provides that should be able to handle
 *   at least a subset of the ListEvent enum.
 * - contextMenus?: Nested array of context menus. The first index is context menu choices
 *   for a Root, the second for Subroot, the third for Child. Can be empty.
 * - toggleableRoots?: If Root and Subroots visibilty should be toggleable by clicking them.
 */
const ListMenu = (props: Props) => {
  const [items, setItems] = useState<ListItemType[]>(props.items);
  const [contextMenuIndexOpen, setContextMenuIndexOpen] = useState<number>(-1);
  const [cursorPosition, setCursorPosition] = useState<number[]>([0, 0]);
  const [contextMenuOwnerID, setContextMenuOwnerID] = useState<number>(-1);
  const [contextMenuParentID, setContextMenuParentID] = useState<number>(-1);
  const [changeTextID, setChangeTextID] = useState<number>(-1);

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  // We use this to hide the ContextMenu in case we get a click outside of the div that
  // contains the ContextMenu.
  const { ref: contextMenuRef,
          isComponentVisible: contextMenuVisible,
          setIsComponentVisible: setContextMenuVisible } = useComponentVisible(false);

  /**
   * Handles all the ListEvent's that gets thrown at us from ListItem's and ListItemInput's.
   */
  const eventHandler = (response: ListEventResponse | ContextMenuResponse) => {
    switch(response.event) {
      // We've been told that the user has finished changing the text of a ListItem.
      case ListEvent.ChangeTextOfRoot:
      case ListEvent.ChangeTextOfSubroot:
        setChangeTextID(-1);
        props.eventHandler(response);
        break;

      // A left-click has happened on a ListItem component.
      case ListEvent.ClickOnRoot:
      case ListEvent.ClickOnSubroot:
      case ListEvent.ClickOnChild:
        props.eventHandler(response);
        break;

      // Open the right context menu for the given item type.
      case ListEvent.OpenContextRoot:
      case ListEvent.OpenContextSubroot:
      case ListEvent.OpenContextChild:
        let contextResponse = response as ContextMenuResponse;
        setContextMenuIndexOpen(contextResponse.contextMenuIndex);
        setCursorPosition(contextResponse.cursor);
        setContextMenuOwnerID(contextResponse.id);
        setContextMenuParentID(contextResponse.parentID!);
        setContextMenuVisible(true);
        break;

      default:
        log.error("Bad event: ", response.event)
        break;
    }
  }

  /**
   * Handles all the events thrown to us from a ContextMenu component.
   */
  const contextMenuHandler = (event: ListEvent) => {
    setContextMenuIndexOpen(-1);
    let itemType = undefined;

    switch(contextMenuIndexOpen) {
      case 0:
        itemType = ItemType.Root;
        break;
      case 1:
        itemType = ItemType.Subroot;
        break;
      case 2:
        itemType = ItemType.Child;
        break;
      default:
        log.error("No context menu for that index: ", contextMenuIndexOpen);
        break;
    }

    // If we're changin text of an ListItem, we won't return this as an response
    // since we want to create an in-line input textbox.
    if (event == ListEvent.ContextChangeText) {
      setChangeTextID(contextMenuOwnerID);
      return;
    }

    let response: ListEventResponse = {
      id: contextMenuOwnerID,
      event: event,
      itemType: itemType,
      parentID: contextMenuParentID,
    }

    props.eventHandler(response);
  }

const iconForItem = (item: ListItemType): ReactNode => {
  switch (item.status) {
    case ItemStatus.Complete:
      return <FaCheckCircle/>
    case ItemStatus.Rejected:
        return <FaMinusCircle/>
    case ItemStatus.Running:
        return <FaCloud/>
    case undefined:
    case ItemStatus.None:
    default:
      return <></>
  }
}

  return (
    <>
      <ul className="listMenu">
        {
           items.map((item) => {
            return <ListItem
                      key={item.id}
                      class={StyleClass.Root + " " + (props.toggleableRoots ? StyleClass.Collapsable : StyleClass.Action)}
                      itemType={ItemType.Root}
                      changeTextID={changeTextID}
                      item={item}
                      eventHandler={eventHandler}
                      selected={props.toggleableRoots ? false : props.selectedId === item.id}
                      selectedId={props.selectedId}
                      icon={iconForItem(item)}
                    />
           })
        }
      </ul>
      { contextMenuVisible &&
      <>
        { props.contextMenus &&
          props.contextMenus.map((menu, index) => {
            if (index == contextMenuIndexOpen) {
              return <ContextMenu
                        key={index}
                        reference={contextMenuRef}
                        items={menu}
                        clickHandler={contextMenuHandler}
                        cursor={cursorPosition}
                      />
            }
          })
        }
        </>
      }
    </>
  )
}

export default ListMenu;

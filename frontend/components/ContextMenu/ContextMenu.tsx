import { LegacyRef } from "react";
import ContextItem from "./ContextItem";
import { ContextItem as ContextItemType } from "./ContextItem";

type Props = {
  reference: LegacyRef<HTMLDivElement>,
  items: Array<ContextItemType>,
  clickHandler: Function,
  cursor: number[],
}

/**
 * ContextMenu is a right-click menu. You feed it with the choices that should be available in the items props
 * (see ContextItem), it will then send what ID was pressed to the clickHandler on a click. The ID could be a number
 * or an enum, but if choose an enum then you need to specify it in the type inside of ./ContextItem.tsx.
 *
 * Props:
 * - reference: When a click happens outside of the reference the context menu should close.
 * - items: The items that the ContextMenu contains (e.g. clickable choices).
 * - clickHandler: A function provided by the parent where all events should be sent.
 * - cursor: The position of where the click happened, so that the ContextMenu is opened in the correct position.
 */
const ContextMenu = (props: Props) => {
  return (
    <div className="contextMenuContainer">
      <div
        className="contextMenu"
        ref={props.reference}
        style={{ left: props.cursor[0], top: props.cursor[1]}}
      >
        <ul>
          {
            props.items.map((item, index) =>
              <ContextItem
                key={index}
                id={item.id}
                name={item.text}
                clickHandler={props.clickHandler}
              />
            )
          }
        </ul>
      </div>
    </div>
  )
}

export default ContextMenu;

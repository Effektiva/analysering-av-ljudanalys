import { LegacyRef, ReactElement } from "react";

type Props = {
  component: ReactElement,
  reference: LegacyRef<HTMLDivElement>,
  closeHandler: Function,
}

const Popup = (props: Props) => {
  return (
    <div className="popupOverlay">
      <div ref={props.reference} className="popupContainer">
        <div className="popup">
          <div onClick={() => props.closeHandler()} className="popupCloseButton">X</div>
          { props.component }
        </div>
      </div>
    </div>
  )
}

export default Popup;

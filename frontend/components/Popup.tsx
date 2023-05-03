import { LegacyRef, ReactElement } from "react";

type Props = {
  component: ReactElement,
  title: string,
  reference: LegacyRef<HTMLDivElement>,
  closeHandler: Function,
}

const Popup = (props: Props) => {
  return (
    <div className="popupOverlay">
      <div ref={props.reference} className="popupContainer">
        <div className="popup">
          <div className="popupTop">
            <div className="popupTitle"> {props.title} </div>
            <div onClick={() => props.closeHandler()} className="popupCloseButton">X</div>
          </div>
          <div className="popupContent">
            { props.component }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup;

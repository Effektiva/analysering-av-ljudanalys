import { LegacyRef, ReactElement } from "react";

type Props = {
  component: ReactElement,
  title: string,
  reference: LegacyRef<HTMLDivElement>,
  closeHandler: Function,
}

const STYLE_NAMESPACE = "popup__";
enum Style {
  Overlay = STYLE_NAMESPACE + "overlay",
  Container = STYLE_NAMESPACE + "container",
  Popup = STYLE_NAMESPACE + "popup",
  Top = STYLE_NAMESPACE + "top",
  Title = STYLE_NAMESPACE + "title",
  CloseButton = STYLE_NAMESPACE + "closeButton",
  Content = STYLE_NAMESPACE + "content",
}

const Popup = (props: Props) => {
  return (
    <div className={Style.Overlay}>
      <div ref={props.reference} className={Style.Container}>
        <div className={Style.Popup}>
          <div className={Style.Top}>
            <div className={Style.Title}> {props.title} </div>
            <div onClick={() => props.closeHandler()} className={Style.CloseButton}>X</div>
          </div>
          <div className={Style.Content}>
            { props.component }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup;

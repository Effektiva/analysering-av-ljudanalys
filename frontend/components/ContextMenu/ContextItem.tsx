import { ListEvent as LEvent } from "../LeftMenu/ListMenu/ListMenu"

type Props = {
  id: number,
  name: string
  clickHandler: Function
}

export type ContextItem = {
  id: number | LEvent,
  text: string,
}

export const ContextItem = (props: Props) => {
  const handleClick = () => {
    props.clickHandler(props.id);
  }

  return (
    <>
      <li
        onClick={handleClick}
      >{props.name}</li>
    </>
  )
}

export default ContextItem;

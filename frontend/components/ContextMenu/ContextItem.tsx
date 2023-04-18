import { ListEvent } from "../ListMenu/ListMenu"

type Props = {
  id: number,
  name: string
  clickHandler: Function
}

export type ContextItem = {
  id: number | ListEvent,
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

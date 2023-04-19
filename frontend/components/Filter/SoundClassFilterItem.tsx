import { LOG as log } from "@/pages/_app"

const STYLE_NAMESPACE = "soundClassFilterInput__";
enum Style {
  ListRemove = STYLE_NAMESPACE + "listRemove",
}

export type FilterItem = {
  id: number,
  name: string
  certaintyLevel: number
}

export type Props = {
  filterProperties: FilterItem,
  onDeleteItemHandler: Function
}

const SoundClassFilterItem = (props: Props) => {
  const deleteHandler = () => {
    props.onDeleteItemHandler(props.filterProperties.name);
  }

  return (
    <li key={props.filterProperties.id}>
      {props.filterProperties.name}
      <div className={Style.ListRemove} onClick={deleteHandler}>X</div>
    </li>
  );
}

export default SoundClassFilterItem;

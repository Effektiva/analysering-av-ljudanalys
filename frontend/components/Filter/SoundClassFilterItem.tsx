const STYLE_NAMESPACE = "soundClassFilter__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Header = STYLE_NAMESPACE + "header",
  Input = STYLE_NAMESPACE + "input",
  List = STYLE_NAMESPACE + "list",
  ListContainer = STYLE_NAMESPACE + "listContainer",
  ListHeader = STYLE_NAMESPACE + "listHeader",
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
    <li className={Style.ListContainer} key={props.filterProperties.id}>
      <div className={Style.ListRemove} onClick={deleteHandler}>-</div>
      {props.filterProperties.name}
    </li>
  );
}

export default SoundClassFilterItem;

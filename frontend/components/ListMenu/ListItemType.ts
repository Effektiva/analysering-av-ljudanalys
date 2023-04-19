import { Tag } from "./Tag";

export type ListItemType = {
  id: number,
  text: string,
  collapsable: boolean,
  subroots?: Array<ListItemType>,
  children?: Array<ListItemType>,
  tags?: Array<Tag>
}

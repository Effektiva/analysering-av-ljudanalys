import { Tag } from "./Tag";

export type ListItemType = {
  id: number,
  text: string,
  collapsable: boolean,
  children?: Array<ListItemType>,
  tags?: Array<Tag>
}

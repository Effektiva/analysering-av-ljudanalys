import { Tag } from "./Tag";

export type ListItemType = {
  id: number,
  text: string,
  children?: Array<ListItemType>,
  tags?: Array<Tag>,
}

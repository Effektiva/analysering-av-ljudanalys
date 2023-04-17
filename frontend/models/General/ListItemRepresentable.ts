import { ListItemType } from "@/components/ListMenu/ListItemType";

interface ListItemRepresentable {
  asListItem(): ListItemType
}

export default ListItemRepresentable;

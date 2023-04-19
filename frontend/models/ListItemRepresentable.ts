import { ListItemType } from "@/components/ListMenu/ListItemType";

/**
 * Interface for classes that can be represented in a ListItem.
 */
interface ListItemRepresentable {
  asListItem(): ListItemType
}

export default ListItemRepresentable;

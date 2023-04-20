export enum ItemStatus {
  None,
  Running,
  Rejected,
  Complete
}

export type ListItemType = {
  id: number,
  text: string,
  collapsable: boolean,
  subroots?: Array<ListItemType>,
  children?: Array<ListItemType>,
  status?: ItemStatus
}

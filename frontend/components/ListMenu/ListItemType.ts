export enum ItemStatus {
  Untreated,
  AnalysisOngoing,
  AnalysisSucceeded,
  AnalysisFailed,
  Treated,
  Rejected,
  None,
}

export type ListItemType = {
  id: number,
  text: string,
  collapsable: boolean,
  subroots?: Array<ListItemType>,
  children?: Array<ListItemType>
}

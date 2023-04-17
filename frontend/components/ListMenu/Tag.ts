/*
 * The CSS classes used for the Tags a ListItem may contain.
 */
export enum Tag {
  // Files only
  FileReceived = "fileReceived",
  AnalysisSucceeded = "analysisSucceeded",
  SoundfileProcessed = "soundfileProcessed",
  SoundfileRejected = "soundfileRejected",

  // Soundchains only
  SoundchainAnalysed = "soundchainAnalysed",
  SoundchainRejected = "soundchainRejected",

  // Shared
  AnalysisUnstarted = "analysisUnstarted",
  AnalysisOngoing = "analysisOngoing",
  AnalysisFinished = "analysisFinished",
  AnalysisFailed = "analysisFailed",
}

enum SoundChainState {
  UnAnalysed = "unAnalysed", // We received the chain but have not analysed it yet
  AnalysisOngoing = "analysisOngoing",
  Analysed = "analysed",
  ManuallyAnalysed = "manuallyAnalysed",
  Rejected = "rejected"
}

export default SoundChainState;

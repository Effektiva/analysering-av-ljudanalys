import Note from "@/models/SoundAnalysis/Note";
import SoundChainState from "@/models/General/SoundChainState";
import TimeInClip from "@/models/SoundAnalysis/TimeInClip";
import Metadata from "@/models/SoundAnalysis/Metadata";
import Soundclip from "@/models/General/Soundclip";
import SoundChain from "@/models/General/SoundChain";
import Dossier from "@/models/General/Dossier";
import Investigation from "@/models/General/Investigation";

export const DUMMY_SOUNDFILE_LIST: Array<Soundclip> = [
  new Soundclip(
    0,
    new Metadata("2023-03-18_0600_0900", [new Dossier(0, "Kalle snackar"), new Dossier(1, "Test dossier 2")]),
    new Date("2020-03-18 06:00"),
    new Date("2020-03-18 09:00")
  ),
  new Soundclip(
    1,
    new Metadata("2020-13-37_0315_0722", []),
    new Date("2020-13-37 03:15"),
    new Date("2020-13-37 07:22")
  ),
  new Soundclip(
    2,
    new Metadata("2021-13-37_0315_0722", []),
    new Date("2021-13-37 03:15"),
    new Date("2021-13-37 07:22")
  ),
  new Soundclip(
    3,
    new Metadata("2022-13-37_0315_0722", []),
    new Date("2022-13-37 03:15"),
    new Date("2022-13-37 07:22")
  ),
]

export const KAROLINER_SOUNDFILE_LIST: Array<Soundclip> = [
  new Soundclip(
    0,
    new Metadata("1700-11-20_0600_0900", [new Dossier(0, "Kalle hugger"), new Dossier(1, "Stefan rider")]),
    new Date("1700-11-20 06:00"),
    new Date("1700-11-20 09:00")
  ),
  new Soundclip(
    1,
    new Metadata("1700-11-20_1012_1130", [new Dossier(0, "Åke avrättar"), new Dossier(1, "Stefan begår krigsbrott")]),
    new Date("1700-11-20 10:12"),
    new Date("1700-11-20 11:30")
  )
]

export const DUMMY_SOUNDFILE_LIST2: Array<Soundclip> = [
  new Soundclip(
    10,
    new Metadata("2023-06-20_0800_1700", [new Dossier(0, "Kalle snackar massa"), new Dossier(1, "Test dossier 3")]),
    new Date("2020-03-18 06:00"),
    new Date("2020-03-18 09:00")
  )
]

export const DUMMY_DOSSIER_LIST: Array<Dossier> = [
  new Dossier(
    0,
    "Favoriter",
    [
      new Dossier(10, "2223-33-21 1137"),
      new Dossier(11, "2123-04-12 1417"),
    ]
  ),
  new Dossier(
    1,
    "Suspekt snack",
    [
      new Dossier(20, "Kalle snackar", [], DUMMY_SOUNDFILE_LIST),
      new Dossier(21, "Länsman snackar", [], DUMMY_SOUNDFILE_LIST),
    ],
    DUMMY_SOUNDFILE_LIST
  ),
]

export const DUMMY_SOUNDCHAINS_LIST: Array<SoundChain> = [
  new SoundChain(
      0,
      "2023-03-18",
      new Date(),
      new Date(),
      SoundChainState.AnalysisOngoing,
      [
        new Note(0, new Date("2020-03-18 06:00"), new TimeInClip(10, 10), "Här hör jag en hund"),
        new Note(1, new Date("2020-03-18 07:00"), new TimeInClip(11, 0), "Här hör jag en get")
      ],
      DUMMY_SOUNDFILE_LIST
    ),
    new SoundChain(
      1,
      "2023-04-01",
      new Date(),
      new Date(),
      SoundChainState.ManuallyAnalysed,
      [
        new Note(0, new Date("2020-03-18 06:00"), new TimeInClip(10, 10), "Här hör jag en kapybara"),
        new Note(1, new Date("2020-03-18 07:00"), new TimeInClip(11, 0), "Här hör jag en humla")
      ],
      DUMMY_SOUNDFILE_LIST
    ),
    new SoundChain(
      2,
      "Massmord",
      new Date(),
      new Date(),
      SoundChainState.Rejected,
      [
        new Note(0, new Date("1700-11-19 06:00"), new TimeInClip(10, 10), "Här hör jag en ryss"),
        new Note(1, new Date("1700-11-20 07:00"), new TimeInClip(11, 0), "Här hör jag karoliner marschera i Narva")
      ],
      KAROLINER_SOUNDFILE_LIST
    )
]

export const DUMMY_SOUNDCHAINS_LIST2: Array<SoundChain> = [
  new SoundChain(
      10,
      "2023-05-18",
      new Date(),
      new Date(),
      SoundChainState.AnalysisOngoing,
      [
        new Note(0, new Date("2020-03-18 06:00"), new TimeInClip(10, 10), "Här hör jag en katt"),
        new Note(1, new Date("2020-03-18 07:00"), new TimeInClip(11, 0), "Här hör jag en giraff")
      ],
      DUMMY_SOUNDFILE_LIST2
    )
]

export const DUMMY_SOUNDCHAIN: SoundChain = DUMMY_SOUNDCHAINS_LIST[0];

export const DUMMY_INVESTIGATION_LIST: Array<Investigation> = [
  new Investigation(0, "Kalles Knarkaffärer", DUMMY_SOUNDCHAINS_LIST),
  new Investigation(1, "Länsmansjäveln", DUMMY_SOUNDCHAINS_LIST2),
]

export const DUMMY_INVESTIGATION: Investigation = DUMMY_INVESTIGATION_LIST[0];

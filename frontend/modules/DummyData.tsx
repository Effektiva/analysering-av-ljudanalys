import Note from "@/models/SoundAnalysis/Note";
import SoundChainState from "@/models/General/SoundChainState";
import TimeInClip from "@/models/SoundAnalysis/TimeInClip";
import Metadata from "@/models/SoundAnalysis/Metadata";
import Soundclip from "@/models/General/Soundclip";
import { ListItemType } from "@/components/ListMenu/ListItemType";
import SoundChain from "@/models/General/SoundChain";
import Dossier from "@/models/General/Dossier";

export const DUMMY_INVESTIGATION_LIST: Array<ListItemType> = [
  {
    id: 0,
    text: "Kalles Knarkaffärer",
  },
  {
    id: 1,
    text: "Länsmansjäveln",
  },
]

export const DUMMY_DOSSIER_LIST = [
  {
    id: 1,
    text: "Favoriter",
    children: [
      {
        id: 10,
        text: "2223-33-21 1137"
      },
      {
        id: 11,
        text: "2123-04-12 1417"
      }
    ],
  },
  // Another root
  {
    id: 2,
    text: "Suspekt snack",
    children: [
      {
        id: 20,
        text: "2001-03-11 1337"
      },
      {
        id: 21,
        text: "2013-04-01 1247"
      }
    ],
    subroots: [
      // A sub
      {
        id: 22,
        text: "Kalle snackar",
        children: [
          {
            id: 220,
            text: "2023-03-11 1337"
          },
          {
            id: 221,
            text: "2023-03-11 1437"
          }
        ],
      },
      // Another sub
      {
        id: 23,
        text: "Länsman snackar",
        children: [
          {
            id: 230,
            text: "1801-01-21 1437"
          },
          {
            id: 231,
            text: "1994-02-11 1437"
          }
        ],
      },
    ]
  },
]

export const DUMMY_DOSSIER_LIST_NOCHILD = [
  {
    id: 0,
    text: "Favoriter",
  },
  // Another root
  {
    id: 1,
    text: "Suspekt snack",
    subroots: [
      // A sub
      {
        id: 2,
        text: "Kalle snackar",
      },
      // Another sub
      {
        id: 3,
        text: "Länsman snackar",
      },
    ]
  },
]

export const DUMMY_SOUNDCHAINS_LIST: Array<SoundChain> = [
  new SoundChain(
    0,
    "2023-03-18",
    new Date(),
    new Date(),
    SoundChainState.Analysed,
    [
      new Note(0, new Date(), new TimeInClip(10, 10), "Ur dad is my hoe")
    ],
    [
      new Soundclip(2, new Metadata("2023-03-18_0600_0900", [new Dossier(0, "Testdoss")]), new Date(), new Date())
    ])
]

export const DUMMY_SOUNDFILES_LIST: Array<Soundclip> = [
  new Soundclip(
    0,
    new Metadata("2020-13-37_0315_0722", []),
    new Date("2020-13-37 03:15"),
    new Date("2020-13-37 07:22")
  ),
  new Soundclip(
    1,
    new Metadata("2021-13-37_0315_0722", []),
    new Date("2021-13-37 03:15"),
    new Date("2021-13-37 07:22")
  ),
  new Soundclip(
    2,
    new Metadata("2022-13-37_0315_0722", []),
    new Date("2022-13-37 03:15"),
    new Date("2022-13-37 07:22")
  ),
]

export const DUMMY_SOUNDCHAIN: SoundChain = DUMMY_SOUNDCHAINS_LIST[0];

export const DUMMY_NOTES: Note[] = [
  Note.fromJson({
    id: 0,
    date: "2021-03-15",
    time: "03:22",
    text: "Ökad intensitet in your mom."
  }),
  Note.fromJson({
    id: 1,
    date: "2021-03-10",
    time: "01:42",
    text: "Mycket hundskall, är det ett kodord?"
  })
]

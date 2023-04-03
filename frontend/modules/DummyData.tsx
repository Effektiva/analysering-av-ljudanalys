import { Soundchain } from "@/components/MainView";
import { ListItem, Tag } from "@/components/ListMenu/ListItem";

export const DUMMY_INVESTIGATION_LIST: Array<ListItem> = [
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

export const DUMMY_SOUNDCHAINS_LIST = [
  {
    id: 0,
    text: "2023-03-18",
    tags: [Tag.AnalysisUnstarted],
  },
  {
    id: 1,
    text: "2023-03-22",
    tags: [Tag.AnalysisOngoing],
  },
  {
    id: 2,
    text: "2025-01-14",
    tags: [Tag.AnalysisFinished, Tag.SoundchainAnalysed],
  },
]

export const DUMMY_SOUNDFILES_FILTERED_LIST = [
  {
    id: 0,
    text: "2020-13-37_0315_0722",
  },
]

export const DUMMY_SOUNDFILES_LIST = [
  {
    id: 0,
    text: "2020-13-37_0315_0722",
    tags: [Tag.FileReceived]
  },
  {
    id: 1,
    text: "2020-13-37_0722_1312",
    tags: [Tag.FileReceived]
  },
  {
    id: 2,
    text: "2020-11-12_1312_4312",
    tags: [Tag.SoundfileRejected]
  },
  {
    id: 3,
    text: "2020-11-12_4312_9857",
    tags: [Tag.AnalysisSucceeded, Tag.SoundfileProcessed]
  },
]

export const DUMMY_SOUNDCHAIN: Soundchain = {
  id: 0,
  name: "2023-04-01",
  startTime: 1500,
  endTime: 2323,
  state: "Test",
  comments: ["Aoeu", "ueoa"],
}

/* TODO: These should also have a type, but we should decide if
 * types that has to do with database models should be kept
 * in one and the same file or spread out where they fit
 */
export const DUMMY_NOTES = [
  {
    id: 0,
    date: "2021-03-15",
    time: "03:22",
    text: "Ökad intensitet i konversationen."
  },
  {
    id: 1,
    date: "2021-03-10",
    time: "01:42",
    text: "Mycket hundskall, är det ett kodord?"
  }
]

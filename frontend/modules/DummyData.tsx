import { ListItem } from "@/components/ListMenu/ListItem";

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
    id: 0,
    text: "Favoriter",
    children: [
      {
        id: 1,
        text: "2223-33-21 1137"
      },
      {
        id: 2,
        text: "2123-04-12 1417"
      }
    ],
  },
  // Another root
  {
    id: 1,
    text: "Suspekt snack",
    children: [
      {
        id: 3,
        text: "2001-03-11 1337"
      },
      {
        id: 4,
        text: "2013-04-01 1247"
      }
    ],
    subroots: [
      // A sub
      {
        id: 2,
        text: "Kalle snackar",
        children: [
          {
            id: 5,
            text: "2023-03-11 1337"
          },
          {
            id: 6,
            text: "2023-03-11 1437"
          }
        ],
      },
      // Another sub
      {
        id: 3,
        text: "Länsman snackar",
        children: [
          {
            id: 7,
            text: "1801-01-21 1437"
          },
          {
            id: 8,
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
  },
  {
    id: 1,
    text: "2023-03-22",
  },
]

export const DUMMY_SOUNDFILES_LIST = [
  {
    id: 0,
    text: "2020-13-37_0315_0722",
  },
  {
    id: 1,
    text: "2020-13-37_0722_1312",
  },
  {
    id: 2,
    text: "2020-11-12_1312_4312",
  },
  {
    id: 3,
    text: "2020-11-12_4312_9857",
  },
]

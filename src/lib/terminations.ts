const terminations = {
  "checkmate": {
    name: "Mat",
    description: "Hra skončila matem.",
    standard: 'normal',
  },
  "resignation": {
    name: "Rezignace",
    description: "Rezignace jednoho z hráčů.",
    standard: 'normal',
  },
  "time forfeit": {
    name: "Vypršení času",
    description: "Hráč prohrál na čas.",
  },
  "abandoned": {
    name: "Opustěná hra",
    description: "Hra byla opuštěna.",
  },
  "stalemate": {
    name: "Pat",
    description: "Hra skončila patem.",
    standard: 'normal',
  },
  "threefold repetition": {
    name: "Trojí opakování",
    description: "Hra skončila remízou kvůli trojímu opakování pozice.",
    standard: 'normal',
  },
  "insufficient material": {
    name: "Nedostatečný materiál",
    description: "Hra skončila remízou kvůli nedostatku materiálu k dání matu.",
    standard: 'normal',
  },
  "50 move rule": {
    name: "Pravidlo 50 tahů",
    description: "Hra skončila remízou podle pravidla 50 tahů.",
    standard: 'normal',
  },
  "adjudication": {
    name: "Arbitráž",
    description: "Hra byla ukončena arbitráží.",
  },
  "death": {
    name: "Úmrtí",
    description: "Hra skončila kvůli úmrtí jednoho z hráčů.",
  },
  "emergency": {
    name: "Nouzová situace",
    description: "Hra byla ukončena kvůli nouzové situaci.",
  },
  "rules infraction": {
    name: "Porušení pravidel",
    description: "Administrativní prohra kvůli nedodržení pravidel šachu nebo pravidel akce ze strany prohrávajícího hráče.",
  },
  "unknown": {
    name: "Neznámé",
    description: "Důvod ukončení hry není znám.",
  },
} as const;

export type Termination = keyof typeof terminations;

export interface TerminationDescription {
  name: string;
  description: string;
  standard?: 'normal';
}

export const terminationKeys = Object.keys(terminations) as [Termination, ...Termination[]];

export const getTerminationDescription = (termination: Termination): TerminationDescription => {
  return terminations[termination];
};

export const getTerminationOptions = (): { value: Termination; label: string }[] => {
  return terminationKeys.map((key) => ({ value: key, label: terminations[key].name }));
};

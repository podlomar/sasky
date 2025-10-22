import fs from 'node:fs/promises';
import path from 'node:path';
import { nanoid } from 'nanoid';
import { calculateEloRating } from './elo.js';

const gameResults = ['1-0', '0-1', '1/2-1/2'] as const;

export type GameResult = typeof gameResults[number];

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
  }
} as const;

export type Termination = keyof typeof terminations;

export type TerminationDescription = {
  name: string;
  description: string;
  standard?: 'normal';
};

export const getTerminationDescription = (termination: Termination): TerminationDescription => {
  return terminations[termination];
};

export const getTerminationOptions = (): { value: Termination; label: string }[] => {
  return Object.entries(terminations).map(([key, value]) => ({
    value: key as Termination,
    label: value.name,
  }));
};

export interface GameRating {
  gameId: string;
  newRating: number;
}

export interface GamePlayer {
  name: string;
  fullName: string;
  rating: number;
}

export interface Player extends GamePlayer {
  games: GameRating[];
}

export interface RatingChange {
  white: number;
  black: number;
}

export interface ChessGame {
  id: string;
  datetime: string;
  timeControl: string;
  url: string | null;
  description: string | null;
  white: GamePlayer;
  black: GamePlayer;
  result: GameResult;
  termination: Termination;
  ratingChange: RatingChange;
  pgn: string | null;
}

export const saveGames = async (games: ChessGame[]): Promise<void> => {
  try {
    const gamesFilePath = path.join('..', 'data', 'games.json');
    await fs.writeFile(gamesFilePath, JSON.stringify(games, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving games:', error);
    throw new Error('Failed to save games to data/games.json');
  }
};

export const savePlayers = async (players: Player[]): Promise<void> => {
  try {
    const playersFilePath = path.join('..', 'data', 'players.json');
    await fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving players:', error);
    throw new Error('Failed to save players to data/players.json');
  }
};

const compareByDateAndTime = (a: ChessGame, b: ChessGame): number => {
  const dateA = new Date(`${a.datetime}`);
  const dateB = new Date(`${b.datetime}`);
  return dateB.getTime() - dateA.getTime();
};

const sortGamesByDateAndTime = (games: ChessGame[]): ChessGame[] => {
  return games.sort(compareByDateAndTime);
};

export const getPlayerByName = (players: Player[], name: string): Player | null => {
  const player = players.find(player => player.name === name);
  return player ?? null;
};

export const recalculateRatings = async (
  games: ChessGame[], players: Player[]
): Promise<void> => {
  sortGamesByDateAndTime(games);

  for (const player of players) {
    player.rating = 800;
    player.games = [];
  }

  const reversedGames = [...games].reverse();
  for (const game of reversedGames) {
    const whitePlayer = getPlayerByName(players, game.white.name);
    const blackPlayer = getPlayerByName(players, game.black.name);

    if (whitePlayer === null || blackPlayer === null) {
      throw new Error(`Player not found: ${game.white.name} or ${game.black.name}`);
    }

    const scoreWhite = game.result === '1-0'
      ? 1
      : game.result === '0-1' ? 0 : 0.5;
    const scoreBlack = game.result === '0-1'
      ? 1
      : game.result === '1-0' ? 0 : 0.5;

    const newWhiteRating = calculateEloRating(
      whitePlayer.rating,
      blackPlayer.rating,
      scoreWhite
    );
    const newBlackRating = calculateEloRating(
      blackPlayer.rating,
      whitePlayer.rating,
      scoreBlack
    );

    game.ratingChange.white = newWhiteRating - whitePlayer.rating;
    game.ratingChange.black = newBlackRating - blackPlayer.rating;

    whitePlayer.rating = newWhiteRating;
    blackPlayer.rating = newBlackRating;

    game.white.rating = newWhiteRating;
    game.black.rating = newBlackRating;

    whitePlayer.games.push({ gameId: game.id, newRating: newWhiteRating });
    blackPlayer.games.push({ gameId: game.id, newRating: newBlackRating });
  }

  await saveGames(games);
  await savePlayers(players);
};

export const loadGames = async (): Promise<ChessGame[]> => {
  try {
    const gamesFilePath = path.join('..', 'data', 'games.json');
    const gamesData = await fs.readFile(gamesFilePath, 'utf-8');
    const games: ChessGame[] = JSON.parse(gamesData);
    return games;
  } catch (error) {
    console.error('Error loading games:', error);
    throw new Error('Failed to load games from data/games.json');
  }
}

export const loadGamesByPlayer = async (playerName: string): Promise<ChessGame[]> => {
  const games = await loadGames();
  return games.filter(game =>
    game.white.name.toLowerCase() === playerName.toLowerCase() ||
    game.black.name.toLowerCase() === playerName.toLowerCase()
  );
};

export const loadPlayers = async (): Promise<Player[]> => {
  try {
    const playersFilePath = path.join('..', 'data', 'players.json');
    const playersData = await fs.readFile(playersFilePath, 'utf-8');
    const players: Player[] = JSON.parse(playersData);
    return players;
  } catch (error) {
    console.error('Error loading players:', error);
    throw new Error('Failed to load players from data/players.json');
  }
};

export const saveGame = async (game: ChessGame): Promise<ChessGame> => {
  try {
    const games = await loadGames();
    const players = await loadPlayers();

    const newId = nanoid(8);
    const newGame: ChessGame = { ...game, id: newId };

    games.push(newGame);

    await recalculateRatings(games, players);

    return newGame;
  } catch (error) {
    console.error('Error saving game:', error);
    throw new Error('Failed to save game to data/games.json');
  }
};

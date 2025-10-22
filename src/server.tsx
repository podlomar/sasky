import { JSX } from 'react/jsx-runtime';
import express, { Request, Response } from 'express';
import { prerenderToNodeStream } from 'react-dom/static';
import { HomePage } from './pages/HomePage/index.js';
import { EnterGamePage } from './pages/EnterGamePage/index.js';
import { PlayersPage } from './pages/PlayersPage/index.js';
import { loadGames, loadPlayers, saveGame, recalculateRatings, getPlayerByName, ChessGame } from './db.js';
import { purifyPgn, postOnLichess } from './pgn.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('static'));
app.use('/img', express.static('img'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const render = async (component: JSX.Element, res: express.Response) => {
  const { prelude } = await prerenderToNodeStream(component);
  prelude.pipe(res);
};

const games = await loadGames();
const players = await loadPlayers();

console.log(`Loaded ${games.length} games and ${players.length} players from the database.`);
console.log('Recalculating player ratings...');
await recalculateRatings(games, players);

// const pgn = `
// [White "Martin Podloucký"]
// [Black "Karel Beneš"]
// [TimeControl "8+10"]
// [Result "0-1"]

// 1.e4 e5 2.Nf3 Nc6 3.Bb5 {This opening is called the Ruy Lopez.} 3...a6
// 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7
// 11.c4 c6 12.cxb5 axb5 13.Nc3 Bb7 14.Bg5 b4 15.Nb1 h6 16.Bh4 c5 17.dxe5
// Nxe4 18.Bxe7 Qxe7 19.exd6 Qf6 20.Nbd2 Nxd6 21.Nc4 Nxc4 22.Bxc4 Nb6
// 23.Ne5 Rae8 24.Bxf7+ Rxf7 25.Nxf7 Rxe1+ 26.Qxe1 Kxf7 27.Qe3 Qg5 28.Qxg5
// hxg5 29.b3 Ke6 30.a3 Kd6 31.axb4 cxb4 32.Ra5 Nd5 33.f3 Bc8 34.Kf2 Bf5
// 35.Ra7 g6 36.Ra6+ Kc5 37.Ke1 Nf4 38.g3 Nxh3 39.Kd2 Kb5 40.Rd6 Kc5 41.Ra6
// Nf2 42.g4 Bd3 43.Re6 1/2-1/2
// `;

// const purifiedPgn = purifyPgn(pgn);
// // const url = await postOnLichess(purifiedPgn);
// // console.log(`Game posted to Lichess: ${url}`);

app.get('/', async (req: Request, res: Response) => {
  const games = await loadGames();
  render(<HomePage totalGames={games.length} games={games} />, res);
});

app.get('/enter', async (req: Request, res: Response) => {
  const players = await loadPlayers();
  render(<EnterGamePage players={players} />, res);
});

app.get('/players', async (req: Request, res: Response) => {
  const players = await loadPlayers();
  render(<PlayersPage players={players} />, res);
});

app.post('/enter', async (req: Request, res: Response) => {
  try {
    const {
      datetime,
      timeControl,
      description,
      whitePlayer,
      blackPlayer,
      result,
      termination,
      pgn
    } = req.body;

    // Get current player ratings from the players data
    const players = await loadPlayers();
    const whitePlayerData = getPlayerByName(players, whitePlayer);
    const blackPlayerData = getPlayerByName(players, blackPlayer);

    if (whitePlayerData === null || blackPlayerData === null) {
      throw new Error(`Player not found: ${whitePlayer} or ${blackPlayer}`);
    }

    // Process the PGN
    const processedPgn = pgn === null ? null : purifyPgn(pgn);

    const newGame: ChessGame = {
      id: '',
      datetime,
      url: null,
      timeControl,
      description: description ?? null,
      white: {
        name: whitePlayerData.name,
        fullName: whitePlayerData.fullName,
        rating: whitePlayerData?.rating || 1500, // Use actual player rating or default
      },
      black: {
        name: blackPlayerData.name,
        fullName: blackPlayerData.fullName,
        rating: blackPlayerData?.rating || 1500, // Use actual player rating or default
      },
      result,
      termination,
      ratingChange: {
        white: 0, // Default rating change, will be computed later
        black: 0  // Default rating change, will be computed later
      },
      pgn: processedPgn
    };

    await postOnLichess(newGame);
    saveGame(newGame);

    // Redirect to home page after successful submission
    res.redirect('/');
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).send('Error adding game. Please try again.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


import { JSX } from 'react/jsx-runtime';
import express, { Request, Response } from 'express';
import { prerenderToNodeStream } from 'react-dom/static';
import { HomePage } from './pages/HomePage/index.js';
import { EnterGamePage } from './pages/EnterGamePage/index.js';
import { PlayersPage } from './pages/PlayersPage/index.js';
import { GamesTable } from './pages/HomePage/components/GamesTable/index.js';
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

app.get('/', async (req: Request, res: Response) => {
  const games = await loadGames();
  const rows = games.map(game => ({
    ...game,
    canDelete: true,
  }));

  render(<HomePage totalGames={games.length} gamesData={rows} />, res);
});

app.get('/enter', async (req: Request, res: Response) => {
  const players = await loadPlayers();
  render(<EnterGamePage players={players} />, res);
});

app.get('/players', async (req: Request, res: Response) => {
  const players = await loadPlayers();
  const games = await loadGames();
  render(<PlayersPage players={players} games={games} />, res);
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

    console.log('Received new game submission:', req.body);

    // Get current player ratings from the players data
    const players = await loadPlayers();

    if (whitePlayer === blackPlayer) {
      render(<EnterGamePage
        players={players}
        values={req.body}
        error="samePlayer"
      />, res);
      return;
    }

    const whitePlayerData = getPlayerByName(players, whitePlayer);
    const blackPlayerData = getPlayerByName(players, blackPlayer);

    if (whitePlayerData === null || blackPlayerData === null) {
      throw new Error(`Player not found: ${whitePlayer} or ${blackPlayer}`);
    }

    // Process the PGN
    const processedPgnResult = pgn === null || pgn.trim() === '' ? null : purifyPgn(pgn);

    if (processedPgnResult !== null && processedPgnResult.isFail()) {
      render(<EnterGamePage
        players={players}
        values={req.body}
        error="invalidPgn"
      />, res);
      return;
    }

    const processedPgn = processedPgnResult === null ? null : processedPgnResult.get();

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
    console.log(typeof error);
    res.status(500).send('Error adding game. Please try again.');
  }
});

app.delete('/game/:id', async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const games = await loadGames();
    const gameIndex = games.findIndex(game => game.id === gameId);

    if (gameIndex === -1) {
      res.status(404).send('Game not found');
      return;
    }

    games.splice(gameIndex, 1);
    const rows = games.map(game => ({
      ...game,
      canDelete: true,
    }));

    await recalculateRatings(games, await loadPlayers());
    render(<GamesTable gamesData={rows} />, res);
  }
  catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).send('Error deleting game. Please try again.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


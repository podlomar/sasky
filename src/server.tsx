import { JSX } from 'react/jsx-runtime';
import express, { Request, Response } from 'express';
import { prerenderToNodeStream } from 'react-dom/static';
import { HomePage } from './pages/HomePage/index.js';
import { EnterGamePage } from './pages/EnterGamePage/index.js';
import { loadGames, loadPlayers, saveGame, recalculateRatings } from './db.js';

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
await recalculateRatings(games, players);

app.get('/', async (req: Request, res: Response) => {
  const games = await loadGames();
  render(<HomePage totalGames={games.length} games={games} />, res);
});

app.get('/enter', async (req: Request, res: Response) => {
  const players = await loadPlayers();
  render(<EnterGamePage players={players} />, res);
});

app.post('/enter', async (req: Request, res: Response) => {
  try {
    const {
      date,
      time,
      description,
      whitePlayer,
      blackPlayer,
      result,
      endingType,
      pgn
    } = req.body;

    // Get current player ratings from the players data
    const players = await loadPlayers();
    const whitePlayerData = players.find(p => p.name === whitePlayer);
    const blackPlayerData = players.find(p => p.name === blackPlayer);

    const newGame = await saveGame({
      date,
      time,
      url: `https://lichess.org/study/auto-generated-${Date.now()}`, // Auto-generated URL
      description: description || 'Chess game',
      white: {
        name: whitePlayer,
        rating: whitePlayerData?.rating || 1500 // Use actual player rating or default
      },
      black: {
        name: blackPlayer,
        rating: blackPlayerData?.rating || 1500 // Use actual player rating or default
      },
      result,
      endingType,
      ratingChange: {
        white: 0, // Default rating change, will be computed later
        black: 0  // Default rating change, will be computed later
      },
      pgn
    });

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


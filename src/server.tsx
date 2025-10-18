import { JSX } from 'react/jsx-runtime';
import express, { Request, Response } from 'express';
import { prerenderToNodeStream } from 'react-dom/static';
import { HomePage } from './pages/HomePage/index.js';
import { EnterGamePage } from './pages/EnterGamePage/index.js';
import { loadGames, loadGamesByPlayer, loadPlayers, saveGame, ChessGame } from './db.js';

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
      url,
      description,
      whitePlayer,
      whiteRating,
      whiteRatingChange,
      blackPlayer,
      blackRating,
      blackRatingChange,
      result,
      pgn
    } = req.body;

    const newGame = await saveGame({
      date,
      url: url || '',
      description: description || '',
      white: {
        name: whitePlayer,
        rating: parseInt(whiteRating) || 1500
      },
      black: {
        name: blackPlayer,
        rating: parseInt(blackRating) || 1500
      },
      result,
      ratingChange: {
        white: parseInt(whiteRatingChange) || 0,
        black: parseInt(blackRatingChange) || 0
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

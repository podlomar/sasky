import { JSX } from 'react/jsx-runtime';
import express, { Request, Response } from 'express';
import { prerenderToNodeStream } from 'react-dom/static';
import { HomePage } from './pages/HomePage/index.js';

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

app.get('/', (req: Request, res: Response) => {
  render(<HomePage />, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import './layout.css';
import { version } from '../../../package.json';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export const Layout = ({ children, title = "IonCore" }: Props) => {
  return (
    <html lang="cs">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/css/style.css" />
      </head>

      <body>
        <nav className="navbar">
          <div className="nav-container">
            <a href="/" className="nav-brand">Šášky</a>
            <div className="nav-links">
              <a href="/" className="nav-link">Seznam her</a>
              <a href="/players" className="nav-link">Hráči</a>
              <a href="/enter" className="nav-link">Zadat hru</a>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {children}
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Šášky, verze {version}</p>
          </div>
        </footer>
      </body>
    </html>
  );
};


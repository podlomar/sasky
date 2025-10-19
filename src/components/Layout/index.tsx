import './layout.css';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export const Layout = ({ children, title = "IonCore" }: Props) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="IonCore - Pure SSR React Application Template" />
        <title>{title}</title>
        <link rel="stylesheet" href="/css/style.css" />
      </head>

      <body>
        <nav className="navbar">
          <div className="nav-container">
            <a href="/" className="nav-brand">♔ Newton Chess</a>
            <div className="nav-links">
              <a href="/" className="nav-link">All Games</a>
              <a href="/players" className="nav-link">Players</a>
              <a href="/enter" className="nav-link">Enter Game</a>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {children}
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Newton Chess. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
};


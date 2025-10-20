import { JSX } from "react";
import pkg from '../../../package.json';
import { Navbar } from "../Navbar/index.js";
import './layout.css';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export const Layout = ({ children, title = "IonCore" }: Props): JSX.Element => {
  return (
    <html lang="cs">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="/server.css" />
        <link rel="stylesheet" href="/css/style.css" />
      </head>

      <body>
        <Navbar />

        <main className="main-content">
          {children}
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Šášky, verze {pkg.version}</p>
          </div>
        </footer>
      </body>
    </html>
  );
};


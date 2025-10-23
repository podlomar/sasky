import { JSX } from "react";
import { Navbar } from "../Navbar/index.js";
import { Footer } from "../Footer/index.js";
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

        <main>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
};


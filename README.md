# IonCore

A pure Server-Side Rendering (SSR) React web application template built with modern tools and best practices.

## Features

- ⚡ **Pure SSR**: Server-side rendered React components for optimal performance and SEO
- 🚀 **React 19**: Built with the latest React version using JSX runtime
- 📦 **ESBuild**: Fast bundling and TypeScript compilation
- 🔄 **Hot Reload**: Development server with automatic rebuilds using Gulp and Nodemon
- 📁 **CSS Modules**: Scoped CSS with hash-based class names
- 🎯 **TypeScript**: Full TypeScript support with type safety
- 🌐 **Express**: Lightweight web server framework
- 📱 **Static Assets**: Optimized handling of static files and images

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Backend**: Express.js, Node.js
- **Build Tools**: ESBuild, Gulp
- **Development**: Nodemon for auto-restart
- **Styling**: CSS Modules with ESBuild plugin

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ioncore
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

This command will:
- Build the TypeScript files using Gulp and ESBuild
- Watch for file changes
- Automatically restart the server when changes are detected
- Server runs on `http://localhost:3000` (or the port specified in PORT environment variable)

Start the server:

```bash
npm start
```

### Production Build

Build the application for production:

```bash
npm run build
```

## How It Works

### Server-Side Rendering

IonCore uses React's `prerenderToNodeStream` to render React components on the server:

```tsx
const render = async (component: JSX.Element, res: express.Response) => {
  const { prelude } = await prerenderToNodeStream(component);
  prelude.pipe(res);
};
```

### Build Process

The build process uses ESBuild with Gulp for:

- **TypeScript Compilation**: Converts TypeScript/TSX to JavaScript
- **CSS Modules**: Processes CSS with scoped class names
- **Asset Optimization**: Handles images and static files
- **Bundle Creation**: Creates optimized bundles for production

### Development Workflow

1. **File Watching**: Gulp watches source files for changes
2. **Automatic Rebuild**: ESBuild recompiles changed files
3. **Server Restart**: Nodemon restarts the server when dist files change
4. **Hot Development**: Changes are reflected immediately in the browser

## Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)

### Build Configuration

Customize the build process by modifying:

- `gulpfile.js`: Build tasks and ESBuild configuration
- `tsconfig.json`: TypeScript compiler options
- `nodemon.json`: Development server settings

## Adding New Pages

1. Create a new folder in `src/pages/`
2. Add your React component with TypeScript
3. Import and use in `server.tsx`:

```tsx
import { NewPage } from './pages/NewPage/index.js';

app.get('/new-page', (req: Request, res: Response) => {
  render(<NewPage />, res);
});
```

## CSS Modules

IonCore supports CSS Modules out of the box. Create `.module.css` files and import them:

```tsx
import styles from './HomePage.module.css';

export const HomePage = () => {
  return <div className={styles.container}>Content</div>;
};
```

## Static Assets

- Place static files in the `static/` directory
- Images go in the `img/` directory
- Both are served by Express automatically

## Scripts

- `npm run dev`: Start development server with watch mode
- `npm run build`: Build for production
- `npm start`: Start production server

## License

MIT License - see LICENSE file for details

## Author

Martin Podloucký (podlouckymartin@gmail.com)

---

IonCore provides a solid foundation for building fast, SEO-friendly React applications with server-side rendering. Perfect for projects that need optimal performance and search engine optimization out of the box.

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { startKeepAlive } from './lib/keepAlive'

// Iniciar keep-alive para manter a API acordada
startKeepAlive();

createRoot(document.getElementById("root")!).render(<App />);

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { startKeepAlive } from './lib/keepAlive'

// Desabilitar Console Ninja
(window as any).__CONSOLE_NINJA_DISABLED__ = true;
(window as any).__CONSOLE_NINJA__ = null;
(window as any).consoleninja = null;

// Função para remover apenas o botão DataBot/Console Ninja
const removeDataBot = () => {
  // Remover elemento com a classe "fixed bottom-6 right-6" que contém o bot
  document.querySelectorAll('div.fixed.bottom-6.right-6 button .lucide-bot').forEach(el => {
    const button = el.closest('button');
    const container = button?.closest('div.fixed.bottom-6.right-6');
    if (container) container.remove();
  });

  // Remover por classe console-ninja
  document.querySelectorAll('[class*="console-ninja"], [id*="console-ninja"]').forEach(el => {
    el.remove();
  });

  // Remover script tags do Console Ninja
  document.querySelectorAll('script').forEach(script => {
    if (script.src?.includes('console-ninja') || script.textContent?.includes('consoleninja')) {
      script.remove();
    }
  });
};

// Remover quando React renderizar
createRoot(document.getElementById("root")!).render(<App />);

// Remover após um delay para deixar React renderizar
setTimeout(removeDataBot, 100);
setTimeout(removeDataBot, 500);
setTimeout(removeDataBot, 1000);

// Monitorar continuamente
setInterval(removeDataBot, 2000);

// Iniciar keep-alive para manter a API acordada
startKeepAlive();

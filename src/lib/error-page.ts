export interface ErrorPageOptions {
  title?: string;
  message?: string;
  statusCode?: number;
  showHomeButton?: boolean;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderErrorPage(options: ErrorPageOptions = {}): string {
  const {
    title = "Esta página não carregou",
    message = "Algo deu errado do nosso lado. Você pode tentar recarregar a página ou voltar para o início.",
    statusCode = 500,
    showHomeButton = true,
  } = options;

  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${safeTitle} (${statusCode})</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        --bg-color: #fafafa;
        --card-bg: #ffffff;
        --text-primary: #111827;
        --text-secondary: #4b5563;
        --border-color: #d1d5db;
        --btn-primary-bg: #111827;
        --btn-primary-text: #ffffff;
      }
      body {
        font: 15px/1.5 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: var(--bg-color);
        color: var(--text-primary);
        display: grid;
        place-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 1.5rem;
        box-sizing: border-box;
      }
      .card {
        max-width: 28rem;
        width: 100%;
        text-align: center;
        padding: 2rem;
        background: var(--card-bg);
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
      .code {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
      }
      h1 {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: var(--text-primary);
      }
      p {
        color: var(--text-secondary);
        margin: 0 0 1.5rem;
        font-size: 0.9375rem;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      a, button {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font: inherit;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        border: 1px solid transparent;
        transition: opacity 0.15s ease;
      }
      a:hover, button:hover {
        opacity: 0.9;
      }
      .primary {
        background: var(--btn-primary-bg);
        color: var(--btn-primary-text);
      }
      .secondary {
        background: var(--card-bg);
        color: var(--text-primary);
        border-color: var(--border-color);
      }
    </style>
  </head>
  <body>
    <main class="card" role="main">
      <div class="code">Erro ${statusCode}</div>
      <h1>${safeTitle}</h1>
      <p>${safeMessage}</p>
      <div class="actions">
        <button type="button" class="primary" onclick="window.location.reload()">Tentar novamente</button>
        ${
          showHomeButton
            ? `<a class="secondary" href="/">Ir para o início</a>`
            : ""
        }
      </div>
    </main>
  </body>
</html>`;
}
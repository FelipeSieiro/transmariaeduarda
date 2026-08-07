// Mantém apenas dígitos (telefones, CPF, CEP).
export function onlyDigits(valor: string | null | undefined): string {
  return (valor ?? "").replace(/\D/g, "");
}

// Iniciais para avatares: "Maria Eduarda Silva" -> "MS"
export function getInitials(nome?: string | null, fallback = "AL"): string {
  if (!nome) return fallback;

  const partes = nome.trim().split(" ").filter(Boolean);
  const primeira = partes[0];

  if (!primeira) return fallback;

  if (partes.length === 1) {
    return primeira.slice(0, 2).toUpperCase();
  }

  const ultima = partes[partes.length - 1] ?? primeira;

  return `${primeira[0] ?? ""}${ultima[0] ?? ""}`.toUpperCase();
}

// Normaliza texto para comparação de busca (minúsculo e sem espaços nas pontas).
export function normalizeSearch(valor: string | null | undefined): string {
  return (valor ?? "").toLowerCase().trim();
}

// Verifica se algum dos campos contém o termo buscado.
export function matchesSearch(
  termo: string,
  campos: readonly (string | null | undefined)[],
): boolean {
  const busca = normalizeSearch(termo);

  if (!busca) return true;

  return campos.some((campo) => normalizeSearch(campo).includes(busca));
}

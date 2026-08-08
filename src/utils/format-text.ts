// Mantém apenas dígitos (telefones, CPF, CEP).
export function onlyDigits(valor: string | null | undefined): string {
  return (valor ?? "").replace(/\D/g, "");
}

// Formata CPF: 12345678901 -> 123.456.789-01
export function formatCPF(cpf: string | null | undefined): string {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11) return cpf || "";

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Formata telefone: 11987654321 -> (11) 98765-4321
export function formatPhone(phone: string | null | undefined): string {
  const digits = onlyDigits(phone);
  if (digits.length === 0) return phone || "";

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return phone || "";
}

// Valida e formata email básico
export function formatEmail(email: string | null | undefined): string {
  if (!email) return "";
  return email.toLowerCase().trim();
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

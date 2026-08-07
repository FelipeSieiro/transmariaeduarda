const LOCALE = "pt-BR";
const PLACEHOLDER = "—";

// dd/mm/aaaa
export function formatDate(valor: string | Date | null | undefined): string {
  if (!valor) return PLACEHOLDER;

  const data = valor instanceof Date ? valor : new Date(valor);

  if (Number.isNaN(data.getTime())) return PLACEHOLDER;

  return data.toLocaleDateString(LOCALE);
}

// dd/mm/aaaa sem deslocamento de fuso (datas "puras" vindas da API)
export function formatDateUtc(valor: string | Date | null | undefined): string {
  if (!valor) return PLACEHOLDER;

  const data = valor instanceof Date ? valor : new Date(valor);

  if (Number.isNaN(data.getTime())) return PLACEHOLDER;

  return data.toLocaleDateString(LOCALE, { timeZone: "UTC" });
}

// Mês por extenso ("janeiro")
export function formatMonthName(
  valor: string | Date | null | undefined,
): string {
  if (!valor) return "";

  const data = valor instanceof Date ? valor : new Date(valor);

  if (Number.isNaN(data.getTime())) return "";

  return data.toLocaleDateString(LOCALE, { month: "long" });
}

// "07:00:00" -> "07:00"
export function formatTime(valor: string | null | undefined): string {
  if (!valor) return "";
  return valor.slice(0, 5);
}

// "07:00" -> "07:00:00" (formato aceito pela API)
export function toApiTime(valor: string): string {
  if (!valor) return "";
  return valor.length === 5 ? `${valor}:00` : valor;
}

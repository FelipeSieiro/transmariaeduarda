const LOCALE = "pt-BR";

// R$ 1.234,56
export function formatCurrency(
  valor: number | string | null | undefined,
): string {
  const numero = Number(valor ?? 0);

  if (Number.isNaN(numero)) return "R$ 0,00";

  return numero.toLocaleString(LOCALE, {
    style: "currency",
    currency: "BRL",
  });
}

// R$ 1.235 (sem centavos, para KPIs e gráficos)
export function formatCurrencyCompact(
  valor: number | string | null | undefined,
): string {
  const numero = Number(valor ?? 0);

  if (Number.isNaN(numero)) return "R$ 0";

  return numero.toLocaleString(LOCALE, {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

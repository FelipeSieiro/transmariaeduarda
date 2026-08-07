export type StatusVeiculo = "ativo" | "inativo" | "manutencao";

export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca?: string | null;
  ano?: number | string | null;
  capacidade?: number | null;
  motorista_id?: string | null;
  status?: StatusVeiculo | string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export type CreateVeiculoDTO = Partial<Veiculo>;

export type UpdateVeiculoDTO = Partial<Veiculo>;

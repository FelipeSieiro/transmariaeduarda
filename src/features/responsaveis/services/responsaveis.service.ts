import api from "@/config/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { createCrudService } from "@/services/http/create-crud-service";
import type { Responsavel } from "@/features/responsaveis/types/responsavel";
import type { ApiResponse } from "@/types/shared";

const crud = createCrudService<Responsavel, Partial<Responsavel>>(
  ENDPOINTS.RESPONSAVEIS,
);

// A criação pode responder com um array de um item, dependendo do endpoint.
async function create(payload: Partial<Responsavel>): Promise<Responsavel> {
  const response = await api.post<ApiResponse<Responsavel | Responsavel[]>>(
    ENDPOINTS.RESPONSAVEIS,
    payload,
  );
  const data = response.data.data;

  return Array.isArray(data) ? (data[0] as Responsavel) : data;
}

export const responsaveisService = { ...crud, create };

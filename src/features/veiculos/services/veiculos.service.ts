import { ENDPOINTS } from "@/constants/endpoints";
import { createCrudService } from "@/services/http/create-crud-service";
import type {
  CreateVeiculoDTO,
  UpdateVeiculoDTO,
  Veiculo,
} from "@/features/veiculos/types/veiculos";

export const veiculosService = createCrudService<
  Veiculo,
  CreateVeiculoDTO,
  UpdateVeiculoDTO
>(ENDPOINTS.VEICULOS);

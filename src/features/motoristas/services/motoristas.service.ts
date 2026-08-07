import { ENDPOINTS } from "@/constants/endpoints";
import { createCrudService } from "@/services/http/create-crud-service";
import type {
  CreateMotoristaDTO,
  Motorista,
  UpdateMotoristaDTO,
} from "@/features/motoristas/types/motorista";

export const motoristasService = createCrudService<
  Motorista,
  CreateMotoristaDTO,
  UpdateMotoristaDTO
>(ENDPOINTS.MOTORISTAS);

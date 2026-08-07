import api from "@/config/api";
import type { ApiResponse } from "@/types/shared";

// Contrato CRUD comum a todos os recursos da API.
// TEntity: modelo retornado; TCreate: payload de criação; TUpdate: payload de atualização.
export interface CrudService<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TCreate>,
> {
  getAll: () => Promise<TEntity[]>;
  getById: (id: string) => Promise<TEntity>;
  create: (payload: TCreate) => Promise<TEntity>;
  update: (id: string, payload: TUpdate) => Promise<TEntity>;
  remove: (id: string) => Promise<void>;
}

// Fábrica dos serviços REST: elimina a repetição de get/post/put/delete
// e a extração de `response.data.data` em cada feature.
export function createCrudService<
  TEntity,
  TCreate = Partial<TEntity>,
  TUpdate = Partial<TCreate>,
>(resource: string): CrudService<TEntity, TCreate, TUpdate> {
  const itemUrl = (id: string) => `${resource}/${id}`;

  return {
    async getAll() {
      const response = await api.get<ApiResponse<TEntity[]>>(resource);
      return response.data.data ?? [];
    },

    async getById(id) {
      const response = await api.get<ApiResponse<TEntity>>(itemUrl(id));
      return response.data.data;
    },

    async create(payload) {
      const response = await api.post<ApiResponse<TEntity>>(resource, payload);
      return response.data.data;
    },

    async update(id, payload) {
      const response = await api.put<ApiResponse<TEntity>>(
        itemUrl(id),
        payload,
      );
      return response.data.data;
    },

    async remove(id) {
      await api.delete<ApiResponse<unknown>>(itemUrl(id));
    },
  };
}

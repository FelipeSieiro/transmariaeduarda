// src/services/escolas.service.ts
import api from "@/lib/api";

export interface Escola {
    id: string;
    nome: string;
    endereco?: string;
    telefone?: string;
}

export async function listarEscolas(): Promise<Escola[]> {
    const response = await api.get("/escolas");

    return Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
}

// Objeto agrupador para compatibilidade com a sintaxe escolasService.getAll()
export const escolasService = {
    getAll: listarEscolas,
    listar: listarEscolas,
};
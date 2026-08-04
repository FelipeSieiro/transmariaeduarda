// src/services/escolas.service.ts
import api from "@/lib/api";
import { Escola } from "@/types";


export async function listarEscolas(): Promise<Escola[]> {
    const response = await api.get("/escolas");

    return Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
}


export const escolasService = {
    getAll: listarEscolas,
    listar: listarEscolas,
};
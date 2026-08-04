import api from "@/lib/api";

export interface Responsavel {
    id: string;
    nome: string;
    cpf?: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    observacoes?: string;
}

export async function listarResponsaveis(): Promise<Responsavel[]> {
    const response = await api.get("/responsaveis");
    return response.data.data as Responsavel[];
}

export async function buscarResponsavel(id: string): Promise<Responsavel> {
    const response = await api.get(`/responsaveis/${id}`);
    return response.data.data as Responsavel;
}

export async function criarResponsavel(responsavel: Partial<Responsavel>): Promise<Responsavel> {
    const response = await api.post("/responsaveis", responsavel);
    const data = response.data.data;
    return (Array.isArray(data) ? data[0] : data) as Responsavel;
}

export async function atualizarResponsavel(id: string, responsavel: Partial<Responsavel>): Promise<Responsavel> {
    const response = await api.put(`/responsaveis/${id}`, responsavel);
    return response.data.data as Responsavel;
}

export async function removerResponsavel(id: string): Promise<any> {
    const response = await api.delete(`/responsaveis/${id}`);
    return response.data;
}
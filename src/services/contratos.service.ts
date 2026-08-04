import api from "@/lib/api";
import { Contrato } from "@/types";


export async function listarContratos(): Promise<Contrato[]> {
    const response = await api.get("/contratos");
    return response.data.data;
}

export async function buscarContrato(id: string): Promise<Contrato | null> {
    const response = await api.get(`/contratos/${id}`);
    return response.data.data ?? null;
}

export async function buscarContratoPorAluno(alunoId: string): Promise<Contrato | null> {
    const response = await api.get("/contratos", {
        params: { aluno_id: alunoId },
    });

    const contratos = response.data.data;

    if (!contratos || contratos.length === 0) {
        return null;
    }

    return contratos[0];
}

export async function criarContrato(payload: CriarContratoPayload): Promise<Contrato> {
    const response = await api.post("/contratos", payload);
    return response.data.data;
}
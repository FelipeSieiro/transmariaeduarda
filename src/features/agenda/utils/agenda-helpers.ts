import type { Aluno } from "@/features/alunos/types/alunos";
import type { Rota } from "@/features/rotas/types/rota";
import type { AgendamentoRota } from "@/features/agenda/types/agendamento";

export function obterNomeEscola(aluno: Aluno): string {
  if (typeof aluno.escolas === "string") return aluno.escolas;
  if (aluno.escolas?.nome) return aluno.escolas.nome;
  return "Sem Escola";
}

export function obterNomeMotorista(
  r: Rota & {
    motorista?: string;
    motorista_nome?: string;
    motoristas?: { nome?: string };
    nome_motorista?: string;
    motorista_id?: string;
  }
): string {
  if (r.motorista) return r.motorista;
  if (r.motorista_nome) return r.motorista_nome;
  if (r.nome_motorista) return r.nome_motorista;
  if (r.motoristas?.nome) return r.motoristas.nome;

  if (r.motorista_id === "309d4044-12b4-442e-8975-f997bd1ddf29") return "Edson Paim";
  if (r.motorista_id === "2ba72fda-d196-4941-8537-5050c7797707") return "Karina Anastacio";

  return "Motorista não atribuído";
}

export interface AlunoComHorario extends Aluno {
  horarioTrajeto?: string | undefined;
  tipoTrajeto?: string | undefined;
}

export interface GrupoEscolaTurno {
  escola: string;
  turno: string;
  alunosEntrada: AlunoComHorario[];
  alunosSaida: AlunoComHorario[];
  totalAlunos: number;
}

export interface RotaComGrupos extends Rota {
  motoristaNome: string;
  grupos: GrupoEscolaTurno[];
  totalPassageiros: number;
}

export interface GrupoMotorista {
  motorista: string;
  rotas: RotaComGrupos[];
  totalPassageirosMotorista: number;
}

export function processarGruposPorMotorista(
  rotas: readonly Rota[],
  alunos: readonly Aluno[],
  agendamentos: readonly AgendamentoRota[],
  busca: string,
  rotaFiltro: string,
  turnoFiltro: string,
  diaSemanaIndex: number
): GrupoMotorista[] {
  const q = busca.toLowerCase().trim();
  const alunosMap = new Map(alunos.map((a) => [a.id, a]));
  const alunosComAgendamento = new Set(
    agendamentos.flatMap((ag) => (ag.aluno_id ? [ag.aluno_id] : []))
  );

  const rotasProcessadas: RotaComGrupos[] = rotas
    .filter((r) => rotaFiltro === "__todos__" || r.id === rotaFiltro)
    .map((rota) => {
      const mapaAlunosDia = new Map<string, AlunoComHorario>();

      agendamentos.forEach((ag) => {
        if (ag.rota_id !== rota.id || ag.dia_semana !== diaSemanaIndex || !ag.aluno_id)
          return;
        const aluno = alunosMap.get(ag.aluno_id);
        if (!aluno) return;

        if (
          (!q ||
            aluno.nome.toLowerCase().includes(q) ||
            aluno.matricula?.toLowerCase().includes(q)) &&
          (turnoFiltro === "__todos__" || aluno.turno === turnoFiltro)
        ) {
          mapaAlunosDia.set(aluno.id, {
            ...aluno,
            horarioTrajeto: ag.horario,
            tipoTrajeto: ag.tipo_trajeto,
          });
        }
      });

      if (diaSemanaIndex >= 1 && diaSemanaIndex <= 5) {
        alunos.forEach((aluno) => {
          if (!alunosComAgendamento.has(aluno.id) && aluno.rota_id === rota.id) {
            if (
              (!q ||
                aluno.nome.toLowerCase().includes(q) ||
                aluno.matricula?.toLowerCase().includes(q)) &&
              (turnoFiltro === "__todos__" || aluno.turno === turnoFiltro)
            ) {
              if (!mapaAlunosDia.has(aluno.id)) {
                mapaAlunosDia.set(aluno.id, {
                  ...aluno,
                  horarioTrajeto: undefined as string | undefined,
                  tipoTrajeto: undefined as string | undefined,
                });
              }
            }
          }
        });
      }

      const listaAlunos = Array.from(mapaAlunosDia.values());

      const gruposMap = new Map<string, { entrada: AlunoComHorario[]; saida: AlunoComHorario[] }>();
      listaAlunos.forEach((aluno) => {
        const escola = obterNomeEscola(aluno);
        const turno = aluno.turno || "Manhã";
        const chave = `${escola}___${turno}`;

        if (!gruposMap.has(chave)) {
          gruposMap.set(chave, { entrada: [], saida: [] });
        }

        const grupo = gruposMap.get(chave)!;
        // Separar por tipo de trajeto: entrada e saída
        if (aluno.tipoTrajeto === "saida" || aluno.tipoTrajeto === "saída") {
          grupo.saida.push(aluno);
        } else {
          // Considera entrada por padrão se não especificado
          grupo.entrada.push(aluno);
        }
      });

      const grupos: GrupoEscolaTurno[] = Array.from(gruposMap.entries()).map(
        ([chave, itens]) => {
          const [escola, turno] = chave.split("___");
          return {
            escola: escola || "Sem Escola",
            turno: turno || "Manhã",
            alunosEntrada: itens.entrada.sort((a, b) => (a.horarioTrajeto || "").localeCompare(b.horarioTrajeto || "")),
            alunosSaida: itens.saida.sort((a, b) => (a.horarioTrajeto || "").localeCompare(b.horarioTrajeto || "")),
            totalAlunos: itens.entrada.length + itens.saida.length,
          };
        }
      );

      return {
        ...rota,
        motoristaNome: obterNomeMotorista(rota as any),
        grupos,
        totalPassageiros: listaAlunos.length,
      };
    })
    .filter((rota) => (q || turnoFiltro !== "__todos__" ? rota.totalPassageiros > 0 : true));

  const motoristasMap = new Map<string, RotaComGrupos[]>();
  rotasProcessadas.forEach((rota) => {
    const mot = rota.motoristaNome;
    if (!motoristasMap.has(mot)) {
      motoristasMap.set(mot, []);
    }
    motoristasMap.get(mot)?.push(rota);
  });

  const resultado: GrupoMotorista[] = Array.from(motoristasMap.entries()).map(
    ([motorista, listaRotas]) => {
      const totalPassageirosMotorista = listaRotas.reduce(
        (acc, r) => acc + r.totalPassageiros,
        0
      );
      return {
        motorista,
        rotas: listaRotas,
        totalPassageirosMotorista,
      };
    }
  );

  return resultado;
}

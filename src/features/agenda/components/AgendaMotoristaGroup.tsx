import { Bus, ChevronDown, ChevronUp, User, School, Clock, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getInitials } from "@/utils/format-text";
import jsPDF from "jspdf";

interface AlunoComHorario {
  id: string;
  nome: string;
  foto_url?: string;
  endereco?: string;
  turno?: string;
  matricula?: string;
  horarioTrajeto?: string;
  tipoTrajeto?: string;
}

interface GrupoEscolaTurno {
  escola: string;
  turno: string;
  alunosEntrada: AlunoComHorario[];
  alunosSaida: AlunoComHorario[];
  totalAlunos: number;
}

interface RotaComGrupos {
  id: string;
  nome: string;
  motoristaNome: string;
  grupos: GrupoEscolaTurno[];
  totalPassageiros: number;
}

interface GrupoMotorista {
  motorista: string;
  rotas: RotaComGrupos[];
  totalPassageirosMotorista: number;
}

interface AgendaMotoristaGroupProps {
  grupo: GrupoMotorista;
  isOpen: boolean;
  onToggle: () => void;
  rotasAbertas: Record<string, boolean>;
  onToggleRota: (rotaId: string) => void;
  dataSelecionada: Date;
}

function obterNomeEscola(aluno: AlunoComHorario): string {
  if (typeof (aluno as any).escolas === "string") return (aluno as any).escolas;
  if (typeof (aluno as any).escola === "string") return (aluno as any).escola;
  return (aluno as any).escola?.nome ?? (aluno as any).escolas?.nome ?? (aluno as any).escola_nome ?? "Sem Escola";
}

function exportarMotoristaPDF(grupo: GrupoMotorista, dataSelecionada: Date) {
  const doc = new jsPDF();
  const { motorista, rotas, totalPassageirosMotorista } = grupo;

  // Header
  doc.setFontSize(18);
  doc.text(`Agenda - ${motorista}`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Data: ${dataSelecionada.toLocaleDateString('pt-BR')}`, 20, 30);
  doc.text(`Total de passageiros: ${totalPassageirosMotorista}`, 20, 40);

  let yPos = 55;

  rotas.forEach((rota, rotaIndex) => {
    // Rota header
    doc.setFontSize(14);
    doc.text(`Rota: ${rota.nome}`, 20, yPos);
    yPos += 10;

    rota.grupos.forEach((grupoEscola) => {
      // Escola e turno
      doc.setFontSize(12);
      doc.text(`${grupoEscola.escola} - ${grupoEscola.turno}`, 25, yPos);
      yPos += 8;

      // Entrada
      if (grupoEscola.alunosEntrada.length > 0) {
        doc.setFontSize(10);
        doc.text("ENTRADA:", 30, yPos);
        yPos += 6;
        grupoEscola.alunosEntrada.forEach((aluno) => {
          const horario = aluno.horarioTrajeto ? ` - ${aluno.horarioTrajeto}` : "";
          doc.text(`  • ${aluno.nome}${horario}`, 30, yPos);
          yPos += 5;
        });
        yPos += 3;
      }

      // Saída
      if (grupoEscola.alunosSaida.length > 0) {
        doc.setFontSize(10);
        doc.text("SAÍDA:", 30, yPos);
        yPos += 6;
        grupoEscola.alunosSaida.forEach((aluno) => {
          const horario = aluno.horarioTrajeto ? ` - ${aluno.horarioTrajeto}` : "";
          doc.text(`  • ${aluno.nome}${horario}`, 30, yPos);
          yPos += 5;
        });
        yPos += 3;
      }

      yPos += 5;
    });

    yPos += 10;

    // Nova página se necessário
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });

  doc.save(`agenda-${motorista.replace(/\s+/g, '-')}-${dataSelecionada.toLocaleDateString('pt-BR')}.pdf`);
}

export function AgendaMotoristaGroup({
  grupo,
  isOpen,
  onToggle,
  rotasAbertas,
  onToggleRota,
  dataSelecionada,
}: AgendaMotoristaGroupProps) {
  return (
    <div className="border border-border/60 rounded-xl bg-card/50 overflow-hidden mb-4">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3">
            <Bus className="size-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{grupo.motorista}</div>
              <div className="text-xs text-muted-foreground">
                {grupo.rotas.length} rota(s) • {grupo.totalPassageirosMotorista} passageiro(s)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                exportarMotoristaPDF(grupo, dataSelecionada);
              }}
            >
              <Download className="size-3 mr-1" />
              PDF
            </Button>
            {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="border-t border-border/40">
          <div className="p-4 space-y-3">
            {grupo.rotas.map((rota) => (
              <div key={rota.id} className="border border-border/40 rounded-lg bg-background/50">
                <Collapsible open={rotasAbertas[rota.id] || false} onOpenChange={() => onToggleRota(rota.id)}>
                  <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <School className="size-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">{rota.nome}</span>
                      <Badge variant="outline" className="text-[10px] h-5">
                        {rota.totalPassageiros}
                      </Badge>
                    </div>
                    {(rotasAbertas[rota.id] || false) ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                  </CollapsibleTrigger>

                  <CollapsibleContent className="border-t border-border/30 px-3 py-2">
                    <div className="space-y-3">
                      {rota.grupos.map((grupoEscola, idx) => (
                        <div key={idx} className="bg-muted/30 rounded-lg p-2">
                          <div className="flex items-center gap-2 mb-2">
                            <School className="size-3 text-muted-foreground" />
                            <span className="text-xs font-medium">{grupoEscola.escola}</span>
                            <Badge variant="secondary" className="text-[10px] h-4">
                              {grupoEscola.turno}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] h-4">
                              {grupoEscola.totalAlunos}
                            </Badge>
                          </div>

                          {/* Entrada */}
                          {grupoEscola.alunosEntrada.length > 0 && (
                            <div className="mb-2">
                              <div className="text-[10px] font-semibold text-muted-foreground mb-1">ENTRADA</div>
                              <div className="space-y-1">
                                {grupoEscola.alunosEntrada.map((aluno) => (
                                  <div key={aluno.id} className="flex items-center gap-2 text-xs">
                                    <Avatar className="size-5">
                                      <AvatarImage src={aluno.foto_url} />
                                      <AvatarFallback className="text-[8px]">
                                        {getInitials(aluno.nome)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium truncate">{aluno.nome}</div>
                                      <div className="text-[9px] text-muted-foreground truncate">
                                        {obterNomeEscola(aluno)}
                                      </div>
                                    </div>
                                    {aluno.horarioTrajeto && (
                                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                                        <Clock className="size-2" />
                                        {aluno.horarioTrajeto}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Saída */}
                          {grupoEscola.alunosSaida.length > 0 && (
                            <div>
                              <div className="text-[10px] font-semibold text-muted-foreground mb-1">SAÍDA</div>
                              <div className="space-y-1">
                                {grupoEscola.alunosSaida.map((aluno) => (
                                  <div key={aluno.id} className="flex items-center gap-2 text-xs">
                                    <Avatar className="size-5">
                                      <AvatarImage src={aluno.foto_url} />
                                      <AvatarFallback className="text-[8px]">
                                        {getInitials(aluno.nome)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium truncate">{aluno.nome}</div>
                                      <div className="text-[9px] text-muted-foreground truncate">
                                        {obterNomeEscola(aluno)}
                                      </div>
                                    </div>
                                    {aluno.horarioTrajeto && (
                                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                                        <Clock className="size-2" />
                                        {aluno.horarioTrajeto}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {grupoEscola.alunosEntrada.length === 0 && grupoEscola.alunosSaida.length === 0 && (
                            <div className="text-[10px] text-muted-foreground italic">
                              Nenhum aluno agendado
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

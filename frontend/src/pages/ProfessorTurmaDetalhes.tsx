import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, BookOpen, CheckSquare, Calendar, Download, Plus, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  presente: boolean;
  frequencia: number;
}

interface RegistroFrequencia {
  data: string;
  presencas: { [alunoId: number]: boolean };
}

interface PlanoAula {
  data: string;
  conteudo: string;
  objetivos: string;
  recursos: string;
}

const ProfessorTurmaDetalhes = () => {
  const { turmaId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estado para controlar a frequência
  const [alunos] = useState<Aluno[]>([
    {
      id: 1,
      nome: "Ana Costa",
      matricula: "WEB2025001",
      email: "ana.costa@email.com",
      presente: false,
      frequencia: 95,
    },
    {
      id: 2,
      nome: "Carlos Oliveira",
      matricula: "WEB2025002",
      email: "carlos@email.com",
      presente: false,
      frequencia: 88,
    },
    {
      id: 3,
      nome: "Beatriz Santos",
      matricula: "WEB2025003",
      email: "beatriz@email.com",
      presente: false,
      frequencia: 92,
    },
    {
      id: 4,
      nome: "Diego Ferreira",
      matricula: "WEB2025004",
      email: "diego@email.com",
      presente: false,
      frequencia: 78,
    },
  ]);

  const [planoAula, setPlanoAula] = useState<PlanoAula>({
    data: new Date().toLocaleDateString('pt-BR'),
    conteudo: "Introdução a React Hooks\n- useState\n- useEffect\n- useContext",
    objetivos: "Ao final da aula, o aluno será capaz de:\n- Criar componentes funcionais com hooks\n- Gerenciar estado local\n- Entender o ciclo de vida dos componentes",
    recursos: "- Slides\n- Editor de código ao vivo\n- Exercícios práticos",
  });

  // Histórico de frequências (dados mock - virão da API)
  const [historicoFrequencias, setHistoricoFrequencias] = useState<RegistroFrequencia[]>([
    {
      data: "08/11/2024",
      presencas: { 1: true, 2: true, 3: false, 4: true }
    },
    {
      data: "07/11/2024",
      presencas: { 1: true, 2: true, 3: true, 4: false }
    },
    {
      data: "06/11/2024",
      presencas: { 1: true, 2: false, 3: true, 4: true }
    },
    {
      data: "05/11/2024",
      presencas: { 1: true, 2: true, 3: true, 4: true }
    },
    {
      data: "04/11/2024",
      presencas: { 1: true, 2: true, 3: true, 4: false }
    },
  ]);

  const [novaData, setNovaData] = useState("");
  const [modoEdicaoPlano, setModoEdicaoPlano] = useState(false);
  const [planoAulaTemp, setPlanoAulaTemp] = useState(planoAula);

  // Dados mock da turma
  const turmaInfo = {
    id: Number(turmaId),
    nome: "Desenvolvimento Web - Turma A",
    curso: "Desenvolvimento Web",
    horario: "Segunda a Sexta, 08:00 - 10:00",
    totalAlunos: alunos.length,
  };

  const handleToggleFrequenciaHistorico = (dataIndex: number, alunoId: number) => {
    setHistoricoFrequencias(prev => 
      prev.map((registro, idx) => {
        if (idx === dataIndex) {
          return {
            ...registro,
            presencas: {
              ...registro.presencas,
              [alunoId]: !registro.presencas[alunoId]
            }
          };
        }
        return registro;
      })
    );
  };

  const handleSalvarAlteracoesHistorico = () => {
    toast({
      title: "Alterações Salvas!",
      description: "As alterações no histórico de frequências foram salvas com sucesso",
    });
  };

  // Calcular total de aulas
  const totalAulas = historicoFrequencias.length;

  // Calcular presenças de cada aluno no período
  const calcularPresencasPeriodo = (alunoId: number) => {
    const presencas = historicoFrequencias.filter(
      registro => registro.presencas[alunoId] === true
    ).length;
    return presencas;
  };

  const handleEditarPlano = () => {
    setPlanoAulaTemp(planoAula);
    setModoEdicaoPlano(true);
  };

  const handleSalvarPlanoAula = () => {
    setPlanoAula(planoAulaTemp);
    setModoEdicaoPlano(false);
    toast({
      title: "Plano de Aula Salvo!",
      description: "Suas alterações foram salvas com sucesso",
    });
  };

  const handleCancelarEdicaoPlano = () => {
    setPlanoAulaTemp(planoAula);
    setModoEdicaoPlano(false);
  };

  const handleBaixarListaPDF = () => {
    // Simulação de download - depois será implementado com biblioteca de PDF
    toast({
      title: "Download Iniciado!",
      description: "A lista de alunos está sendo baixada em PDF",
    });
    
    // Aqui virá a implementação real com jsPDF ou similar
    // Por enquanto, apenas feedback visual
  };

  const handleAdicionarNovaData = () => {
    if (!novaData) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data",
        variant: "destructive",
      });
      return;
    }

    // Converter data de YYYY-MM-DD para DD/MM/YYYY
    const [ano, mes, dia] = novaData.split('-');
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Verificar se a data já existe
    const dataExiste = historicoFrequencias.some(reg => reg.data === dataFormatada);
    if (dataExiste) {
      toast({
        title: "Atenção",
        description: "Esta data já existe no histórico",
        variant: "destructive",
      });
      return;
    }

    // Criar novo registro com todos os alunos desmarcados
    const novoRegistro: RegistroFrequencia = {
      data: dataFormatada,
      presencas: alunos.reduce((acc, aluno) => ({
        ...acc,
        [aluno.id]: false
      }), {})
    };

    // Adicionar ao início da lista (mais recente primeiro)
    setHistoricoFrequencias(prev => [novoRegistro, ...prev]);
    
    // Limpar campo
    setNovaData("");
    
    toast({
      title: "Data Adicionada!",
      description: `Nova coluna criada para ${dataFormatada}`,
    });
  };

  const getFrequenciaColor = (frequencia: number) => {
    if (frequencia >= 90) return "text-green-600";
    if (frequencia >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getNomeAlunoColor = (frequencia: number) => {
    if (frequencia < 75) return "text-red-600 font-bold";
    return "text-gray-900";
  };

  // Verificar se a data já passou
  const isDataPassada = (dataStr: string) => {
    // Converter DD/MM/YYYY para objeto Date
    const [dia, mes, ano] = dataStr.split('/').map(Number);
    const dataAula = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
    
    return dataAula < hoje;
  };

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{turmaInfo.nome}</h1>
          <p className="text-gray-600">{turmaInfo.curso} • {turmaInfo.horario}</p>
        </div>
      </div>

      {/* Tabs para diferentes seções */}
      <Tabs defaultValue="alunos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alunos" className="gap-2">
            <Users className="h-4 w-4" />
            Alunos
          </TabsTrigger>
          <TabsTrigger value="frequencia" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            Frequência
          </TabsTrigger>
          <TabsTrigger value="plano" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Plano de Aula
          </TabsTrigger>
        </TabsList>

        {/* Tab de Alunos */}
        <TabsContent value="alunos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-3">
                <span>Lista de Alunos ({alunos.length})</span>
                <Button
                  onClick={handleBaixarListaPDF}
                  variant="default"
                  size="default"
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  <Download className="h-5 w-5" />
                  Baixar PDF
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alunos.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className={`font-semibold ${getNomeAlunoColor(aluno.frequencia)}`}>
                        {aluno.nome}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Matrícula: {aluno.matricula} • {aluno.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Frequência</p>
                        <p className={`font-bold ${getFrequenciaColor(aluno.frequencia)}`}>
                          {aluno.frequencia}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Frequência */}
        <TabsContent value="frequencia" className="space-y-4">
          {/* Histórico de Frequências do Período */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <div>
                    <div>Registro de Frequências</div>
                    <p className="text-sm text-gray-500 font-normal mt-1">
                      Total de {totalAulas} aulas registradas
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSalvarAlteracoesHistorico}
                  variant="default"
                  size="sm"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Adicionar Nova Data - Simplificado */}
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 flex-wrap">
                  <Label htmlFor="novaData" className="text-sm text-gray-700 font-semibold whitespace-nowrap">
                    Adicionar nova aula:
                  </Label>
                  <Input
                    id="novaData"
                    type="date"
                    value={novaData}
                    onChange={(e) => setNovaData(e.target.value)}
                    className="max-w-[180px]"
                  />
                  <Button
                    onClick={handleAdicionarNovaData}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </div>
              
              {/* Tabela de Histórico Detalhado - Editável */}
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                        <th className="text-left p-4 font-bold text-gray-800 border-b-2 border-primary border-r border-gray-300 sticky left-0 bg-gray-100 z-10 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Aluno
                          </div>
                        </th>
                        {historicoFrequencias.map((registro, index) => {
                          const dataPassada = isDataPassada(registro.data);
                          return (
                            <th
                              key={index}
                              className={`text-center p-4 font-bold border-b-2 border-gray-300 min-w-[110px] transition-colors ${
                                dataPassada 
                                  ? 'text-gray-400 bg-gray-100 border-l border-gray-200' 
                                  : 'text-gray-800 bg-white border-l-2 border-primary/30'
                              }`}
                            >
                              <div className="text-sm whitespace-nowrap flex flex-col items-center gap-1">
                                {dataPassada ? (
                                  <Calendar className="h-4 w-4 opacity-40 mb-1" />
                                ) : (
                                  <Calendar className="h-4 w-4 text-primary mb-1" />
                                )}
                                <span className={dataPassada ? 'line-through' : 'font-semibold'}>
                                  {registro.data}
                                </span>
                                {!dataPassada && (
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                    Ativa
                                  </span>
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {alunos.map((aluno, alunoIndex) => {
                        const presencas = calcularPresencasPeriodo(aluno.id);
                        const percentual = totalAulas > 0 ? Math.round((presencas / totalAulas) * 100) : 0;
                        return (
                          <tr
                            key={aluno.id}
                            className={alunoIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
                            <td className="p-4 border-b border-r-2 border-gray-300 sticky left-0 bg-inherit z-10">
                              <div className="space-y-2">
                                <div className={`font-bold text-sm ${getNomeAlunoColor(percentual)}`}>
                                  {aluno.nome}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-600">
                                    {presencas}/{totalAulas} aulas
                                  </span>
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    percentual >= 90 
                                      ? 'bg-green-100 text-green-700' 
                                      : percentual >= 75 
                                      ? 'bg-yellow-100 text-yellow-700' 
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {percentual}%
                                  </span>
                                </div>
                              </div>
                            </td>
                            {historicoFrequencias.map((registro, dataIndex) => {
                              const dataPassada = isDataPassada(registro.data);
                              const presente = registro.presencas[aluno.id] || false;
                              return (
                                <td
                                  key={dataIndex}
                                  className={`p-4 border-b text-center transition-all ${
                                    dataPassada 
                                      ? 'bg-gray-50/50 border-l border-gray-200' 
                                      : 'bg-white border-l-2 border-primary/10 hover:bg-blue-50/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-center">
                                    <div className={`relative group ${dataPassada ? 'opacity-60' : ''}`}>
                                      <Checkbox
                                        checked={presente}
                                        onCheckedChange={() => handleToggleFrequenciaHistorico(dataIndex, aluno.id)}
                                        className={`h-6 w-6 transition-all ${
                                          presente 
                                            ? 'data-[state=checked]:bg-green-500 data-[state=checked]:border-green-600' 
                                            : 'border-2 border-gray-300 hover:border-primary'
                                        }`}
                                      />
                                      {!dataPassada && (
                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                          {presente ? 'Presente' : 'Ausente'}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Plano de Aula */}
        <TabsContent value="plano" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Plano de Aula
                </div>
                {!modoEdicaoPlano ? (
                  <Button
                    onClick={handleEditarPlano}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCancelarEdicaoPlano}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSalvarPlanoAula}
                      variant="default"
                      size="sm"
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {modoEdicaoPlano ? (
                // Modo de Edição
                <>
                  <div className="space-y-2">
                    <Label htmlFor="conteudo">Conteúdo da Aula</Label>
                    <Textarea
                      id="conteudo"
                      value={planoAulaTemp.conteudo}
                      onChange={(e) => setPlanoAulaTemp({ ...planoAulaTemp, conteudo: e.target.value })}
                      rows={5}
                      placeholder="Descreva o conteúdo que será abordado..."
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objetivos">Objetivos de Aprendizagem</Label>
                    <Textarea
                      id="objetivos"
                      value={planoAulaTemp.objetivos}
                      onChange={(e) => setPlanoAulaTemp({ ...planoAulaTemp, objetivos: e.target.value })}
                      rows={4}
                      placeholder="Liste os objetivos de aprendizagem..."
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recursos">Recursos Necessários</Label>
                    <Textarea
                      id="recursos"
                      value={planoAulaTemp.recursos}
                      onChange={(e) => setPlanoAulaTemp({ ...planoAulaTemp, recursos: e.target.value })}
                      rows={3}
                      placeholder="Liste os recursos que serão utilizados..."
                      className="resize-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Modo de edição ativo - Clique em "Salvar" para confirmar as alterações
                    </p>
                  </div>
                </>
              ) : (
                // Modo de Visualização
                <>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        Conteúdo da Aula
                      </h4>
                      <div className="text-gray-900 whitespace-pre-wrap">
                        {planoAula.conteudo || (
                          <span className="text-gray-400 italic">Nenhum conteúdo cadastrado</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-primary" />
                        Objetivos de Aprendizagem
                      </h4>
                      <div className="text-gray-900 whitespace-pre-wrap">
                        {planoAula.objetivos || (
                          <span className="text-gray-400 italic">Nenhum objetivo cadastrado</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Recursos Necessários
                      </h4>
                      <div className="text-gray-900 whitespace-pre-wrap">
                        {planoAula.recursos || (
                          <span className="text-gray-400 italic">Nenhum recurso cadastrado</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Modo de visualização - Clique em "Editar" para fazer alterações
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessorTurmaDetalhes;


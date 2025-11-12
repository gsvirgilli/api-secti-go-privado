import { useState } from "react";
import { Calendar, Clock, Users, BookOpen, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Turma {
  id: number;
  nome: string;
  curso: string;
  horario: string;
  totalAlunos: number;
  alunosPresentes?: number;
}

interface AgendaItem {
  diaSemana: string;
  horario: string;
  turma: string;
  sala: string;
}

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  
  // Obter nome do professor (ou usar "Professor" como padrão)
  const nomeProfessor = user?.name || user?.nome || "Professor";

  // Dados mock - depois virão da API
  const agendaSemana = {
    "Segunda": [
      { horario: "08:00 - 10:00", turma: "Desenvolvimento Web - Turma A", sala: "Lab 1" },
      { horario: "14:00 - 16:00", turma: "Python Avançado - Turma B", sala: "Lab 2" },
    ],
    "Terça": [
      { horario: "19:00 - 21:00", turma: "Mobile - Turma C", sala: "Lab 3" },
    ],
    "Quarta": [
      { horario: "08:00 - 10:00", turma: "Desenvolvimento Web - Turma A", sala: "Lab 1" },
      { horario: "14:00 - 16:00", turma: "Python Avançado - Turma B", sala: "Lab 2" },
    ],
    "Quinta": [
      { horario: "19:00 - 21:00", turma: "Mobile - Turma C", sala: "Lab 3" },
    ],
    "Sexta": [],
  };

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

  const minhasTurmas: Turma[] = [
    {
      id: 1,
      nome: "Desenvolvimento Web - Turma A",
      curso: "Desenvolvimento Web",
      horario: "Segunda a Sexta, 08:00 - 10:00",
      totalAlunos: 25,
      alunosPresentes: 23,
    },
    {
      id: 2,
      nome: "Python Avançado - Turma B",
      curso: "Python Avançado",
      horario: "Segunda a Sexta, 14:00 - 16:00",
      totalAlunos: 20,
      alunosPresentes: 18,
    },
    {
      id: 3,
      nome: "Mobile - Turma C",
      curso: "Desenvolvimento Mobile",
      horario: "Segunda a Sexta, 19:00 - 21:00",
      totalAlunos: 22,
      alunosPresentes: 20,
    },
  ];

  const handleSelecionarTurma = (turma: Turma) => {
    setSelectedTurma(turma);
    // Navegar para página de detalhes da turma
    navigate(`/professor/turma/${turma.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {nomeProfessor}! 👋
        </h1>
        <p className="text-gray-600">Aqui estão suas turmas e sua agenda</p>
      </div>

      {/* Minhas Turmas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Minhas Turmas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {minhasTurmas.map((turma) => (
            <Card
              key={turma.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary"
              onClick={() => handleSelecionarTurma(turma)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {turma.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Curso</p>
                  <p className="font-medium text-gray-900">{turma.curso}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Horário</p>
                  <p className="font-medium text-gray-900">{turma.horario}</p>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Alunos</span>
                    <span className="font-bold text-primary">{turma.totalAlunos}</span>
                  </div>
                  {turma.alunosPresentes !== undefined && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">Presentes hoje</span>
                      <span className="font-bold text-green-600">{turma.alunosPresentes}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Gerenciar Turma
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Agenda da Semana */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Agenda da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {diasSemana.map((dia) => (
              <div key={dia} className="flex flex-col">
                {/* Cabeçalho do dia */}
                <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-3 rounded-t-lg text-center font-bold shadow-sm">
                  {dia}
                </div>
                
                {/* Container das aulas */}
                <div className="bg-white border-x border-b border-gray-200 rounded-b-lg p-3 min-h-[120px] space-y-2">
                  {agendaSemana[dia as keyof typeof agendaSemana].length > 0 ? (
                    agendaSemana[dia as keyof typeof agendaSemana].map((aula, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-gray-50 to-white p-3 rounded-lg border border-gray-200 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-1 text-primary text-xs font-bold mb-1.5">
                          <Clock className="h-3 w-3" />
                          {aula.horario}
                        </div>
                        <div className="text-xs font-semibold text-gray-800 mb-1 leading-tight">
                          {aula.turma}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {aula.sala}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-gray-300 text-2xl mb-1">📅</div>
                        <span className="text-gray-400 text-xs">Sem aulas</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ProfessorDashboard;


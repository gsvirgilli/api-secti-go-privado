import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertCircle, Plus, Save, Trash2, Calendar } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { AttendanceAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecord {
  id?: number;
  id_aluno: number;
  id_turma: number;
  data_chamada: string;
  status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';
  student?: { nome: string };
}

const Frequencia = () => {
  const { classes, students } = useAppData();
  const { toast } = useToast();

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtrar alunos da turma selecionada
  const classStudents = selectedClass
    ? students.filter(s => s.class === classes.find(c => c.id.toString() === selectedClass)?.name)
    : [];

  // Carregar presenças quando seleciona turma ou data
  const loadAttendances = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      const classId = parseInt(selectedClass);
      const response = await AttendanceAPI.list({
        id_turma: classId,
        data: selectedDate
      });

      // Inicializar com alunos da turma (todos os alunos devem ter registro)
      const attendanceMap = new Map();
      if (response.data?.data) {
        response.data.data.forEach((att: AttendanceRecord) => {
          attendanceMap.set(att.id_aluno, att);
        });
      }

      // Preencher com alunos que não têm registro
      const records = classStudents.map(student => {
        const existing = attendanceMap.get(student.id);
        if (existing) return existing;

        return {
          id_aluno: student.id,
          id_turma: classId,
          data_chamada: selectedDate,
          status: 'PRESENTE' as const
        };
      });

      setAttendances(records);
    } catch (error) {
      console.error('Erro ao carregar presenças:', error);
      // Inicializar com alunos e status padrão
      const records = classStudents.map(student => ({
        id_aluno: student.id,
        id_turma: parseInt(selectedClass),
        data_chamada: selectedDate,
        status: 'PRESENTE' as const
      }));
      setAttendances(records);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendances();
  }, [selectedClass, selectedDate]);

  const updateAttendanceStatus = (studentId: number, status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO') => {
    setAttendances(prev => prev.map(att =>
      att.id_aluno === studentId ? { ...att, status } : att
    ));
  };

  const saveAttendances = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);

      // Dividir em novo e atualizado
      const toCreate = attendances.filter(att => !att.id);
      const toUpdate = attendances.filter(att => att.id);

      // Criar novas presenças
      if (toCreate.length > 0) {
        await AttendanceAPI.bulkCreate(toCreate);
      }

      // Atualizar presenças existentes
      for (const att of toUpdate) {
        if (att.id) {
          await AttendanceAPI.update(att.id, {
            status: att.status
          });
        }
      }

      toast({
        title: "Sucesso",
        description: `${attendances.length} presenças registradas com sucesso!`,
      });

      // Recarregar
      loadAttendances();
    } catch (error: any) {
      console.error('Erro ao salvar presenças:', error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao salvar presenças",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendance = async (attendanceId?: number) => {
    if (!attendanceId) return;

    try {
      await AttendanceAPI.delete(attendanceId);
      toast({
        title: "Sucesso",
        description: "Presença removida com sucesso!",
      });
      loadAttendances();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao remover presença",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENTE':
        return 'bg-emerald-50 border-emerald-200';
      case 'AUSENTE':
        return 'bg-red-50 border-red-200';
      case 'JUSTIFICADO':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENTE':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle2 className="w-3 h-3 mr-1" />Presente</Badge>;
      case 'AUSENTE':
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" />Ausente</Badge>;
      case 'JUSTIFICADO':
        return <Badge className="bg-amber-500 hover:bg-amber-600"><AlertCircle className="w-3 h-3 mr-1" />Justificado</Badge>;
      default:
        return <Badge>N/A</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Controle de Frequência</h1>
        <p className="text-muted-foreground mt-2">Gerencie e registre a frequência dos alunos nas aulas</p>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5" />
            Seleção de Turma e Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Turma</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name} - {cls.course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data da Chamada</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listagem de Alunos */}
      {selectedClass && (
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>Alunos da Turma ({classStudents.length})</span>
              <Button
                onClick={saveAttendances}
                disabled={loading || attendances.length === 0}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Frequência
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : attendances.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum aluno nesta turma
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {attendances.map((att) => {
                  const student = students.find(s => s.id === att.id_aluno);
                  return (
                    <div
                      key={`${att.id_aluno}-${att.id}`}
                      className={`p-4 border rounded-lg ${getStatusColor(att.status)}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{student?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Matrícula: {student?.matricula || 'N/A'}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={att.status === 'PRESENTE' ? 'default' : 'outline'}
                              onClick={() => updateAttendanceStatus(att.id_aluno, 'PRESENTE')}
                              className="gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Presente
                            </Button>
                            <Button
                              size="sm"
                              variant={att.status === 'AUSENTE' ? 'destructive' : 'outline'}
                              onClick={() => updateAttendanceStatus(att.id_aluno, 'AUSENTE')}
                              className="gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Ausente
                            </Button>
                            <Button
                              size="sm"
                              variant={att.status === 'JUSTIFICADO' ? 'secondary' : 'outline'}
                              onClick={() => updateAttendanceStatus(att.id_aluno, 'JUSTIFICADO')}
                              className="gap-2"
                            >
                              <AlertCircle className="w-4 h-4" />
                              Justificado
                            </Button>
                          </div>

                          {att.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deleteAttendance(att.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-2">
                        {getStatusBadge(att.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      {selectedClass && attendances.length > 0 && (
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Presentes</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {attendances.filter(a => a.status === 'PRESENTE').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ausentes</p>
                <p className="text-2xl font-bold text-red-600">
                  {attendances.filter(a => a.status === 'AUSENTE').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Justificados</p>
                <p className="text-2xl font-bold text-amber-600">
                  {attendances.filter(a => a.status === 'JUSTIFICADO').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Frequencia;

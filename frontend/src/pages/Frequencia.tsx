import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertCircle, Save, Trash2, Calendar, Info } from "lucide-react";
import { useAppData } from "@/hooks/useAppData";
import { AttendanceAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecord {
  id?: number;
  id_aluno: number;
  id_turma: number;
  data_chamada: string;
  status: 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO';
  motivo_justificacao?: string;
  id_usuario?: number;
  student?: { nome: string };
  usuario?: { nome: string; email: string };
}

const Frequencia = () => {
  const { classes } = useAppData();
  const { toast } = useToast();

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [justificationReasons, setJustificationReasons] = useState<Record<number, string>>({});
  const [classStudents, setClassStudents] = useState<any[]>([]);

  // Carregar alunos da turma selecionada
  const loadClassStudents = async () => {
    if (!selectedClass) {
      setClassStudents([]);
      return;
    }

    try {
      const response = await AttendanceAPI.list({ id_turma: parseInt(selectedClass) });
      // Extrair alunos únicos da resposta
      const studentIds = new Set();
      const students: any[] = [];

      if (response.data?.data) {
        response.data.data.forEach((att: any) => {
          if (att.aluno && !studentIds.has(att.aluno.id)) {
            studentIds.add(att.aluno.id);
            students.push(att.aluno);
          }
        });
      }

      setClassStudents(students);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alunos da turma",
        variant: "destructive"
      });
    }
  };

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
          // Carregar motivo já registrado se houver
          if (att.motivo_justificacao) {
            setJustificationReasons(prev => ({
              ...prev,
              [att.id_aluno]: att.motivo_justificacao
            }));
          }
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
    loadClassStudents();
  }, [selectedClass]);

  // Carregar presenças quando muda a data
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
      const toCreate = attendances
        .filter(att => !att.id)
        .map(att => ({
          id_aluno: att.id_aluno,
          status: att.status,
          motivo_justificacao: att.status === 'JUSTIFICADO' ? justificationReasons[att.id_aluno] : undefined
        }));

      const toUpdate = attendances.filter(att => att.id);

      // Criar novas presenças (bulk)
      if (toCreate.length > 0) {
        await AttendanceAPI.bulkCreate({
          id_turma: parseInt(selectedClass),
          data_chamada: selectedDate,
          attendances: toCreate
        });
      }

      // Atualizar presenças existentes (individual)
      for (const att of toUpdate) {
        if (att.id) {
          await AttendanceAPI.update(att.id, {
            status: att.status,
            motivo_justificacao: att.status === 'JUSTIFICADO' ? justificationReasons[att.id_aluno] : undefined
          });
        }
      }

      toast({
        title: "Sucesso",
        description: `${attendances.length} presenças registradas com sucesso!`,
      });

      // Limpar justificações
      setJustificationReasons({});
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

      {/* Info Banner */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 flex gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <strong>Dica:</strong> Quando marcar como "Justificado", adicione o motivo da justificação. O sistema registrará automaticamente quem está registrando a frequência.
          </div>
        </CardContent>
      </Card>

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
              <div className="space-y-4 max-h-[700px] overflow-y-auto">
                {attendances.map((att) => {
                  const student = students.find(s => s.id === att.id_aluno);
                  return (
                    <div
                      key={`${att.id_aluno}-${att.id}`}
                      className={`p-4 border rounded-lg ${getStatusColor(att.status)}`}
                    >
                      <div className="space-y-3">
                        {/* Cabeçalho com dados do aluno */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{student?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Matrícula: {student?.matricula || 'N/A'}
                            </p>
                          </div>

                          {/* Badges de informação */}
                          <div className="flex gap-2 items-center flex-wrap justify-end">
                            {getStatusBadge(att.status)}
                            {att.usuario && (
                              <div className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium">
                                ✓ {att.usuario.nome}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Botões de status */}
                        <div className="flex gap-2 flex-wrap">
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

                          {att.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 ml-auto"
                              onClick={() => deleteAttendance(att.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {/* Campo de motivo de justificação */}
                        {att.status === 'JUSTIFICADO' && (
                          <div className="mt-3 pt-3 border-t">
                            <label className="text-sm font-medium block mb-2">
                              Motivo da Justificação *
                            </label>
                            <textarea
                              value={justificationReasons[att.id_aluno] || ''}
                              onChange={(e) => setJustificationReasons(prev => ({
                                ...prev,
                                [att.id_aluno]: e.target.value
                              }))}
                              placeholder="Descreva o motivo da justificação... (atestado, doença, atraso, etc)"
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                              rows={2}
                              maxLength={500}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {(justificationReasons[att.id_aluno] || '').length}/500 caracteres
                            </p>
                          </div>
                        )}

                        {/* Exibir motivo existente */}
                        {att.status === 'JUSTIFICADO' && att.motivo_justificacao && !justificationReasons[att.id_aluno] && (
                          <div className="mt-2 pt-2 border-t bg-yellow-50 p-3 rounded text-sm">
                            <p className="font-medium text-yellow-900 mb-1">Motivo registrado:</p>
                            <p className="text-yellow-800">{att.motivo_justificacao}</p>
                          </div>
                        )}
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

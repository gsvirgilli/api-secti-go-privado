import { useState, useEffect } from "react";
import { Calendar, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarAPI } from "@/lib/api";

interface Event {
  id: number;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim?: string;
  tipo: string;
  status: string;
  turma_id?: number;
  curso_id?: number;
}

const CalendarPage = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data_inicio: "",
    data_fim: "",
    tipo: "EVENTO",
    status: "PLANEJADO",
  });

  // Carregar eventos ao montar o componente
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await CalendarAPI.list();
      setEvents(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos",
        className: "bg-red-100 text-red-800 border-red-200",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Preparar dados, removendo campos vazios
      const dataToSend = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== "")
      ) as any;

      // Garantir que as datas são enviadas como YYYY-MM-DD sem conversão de timezone
      if (dataToSend.data_inicio) {
        dataToSend.data_inicio = String(dataToSend.data_inicio).split('T')[0];
      }
      if (dataToSend.data_fim) {
        dataToSend.data_fim = String(dataToSend.data_fim).split('T')[0];
      }

      if (selectedEvent) {
        // Editar evento existente
        await CalendarAPI.update(selectedEvent.id, dataToSend);
        toast({
          title: "Evento Atualizado!",
          description: "O evento foi atualizado com sucesso.",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        });
      } else {
        // Adicionar novo evento
        await CalendarAPI.create(dataToSend);
        toast({
          title: "Evento Criado!",
          description: "O evento foi adicionado ao calendário.",
          className: "bg-green-100 text-green-800 border-green-200",
        });
      }

      // Recarregar eventos
      await loadEvents();
    } catch (error: any) {
      console.error("Erro ao salvar evento:", error);
      toast({
        title: "Erro",
        description: error?.response?.data?.message || "Erro ao salvar evento",
        className: "bg-red-100 text-red-800 border-red-200",
      });
    }

    resetModal();
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      titulo: event.titulo,
      descricao: event.descricao,
      data_inicio: String(event.data_inicio).split('T')[0],
      data_fim: event.data_fim ? String(event.data_fim).split('T')[0] : "",
      tipo: event.tipo,
      status: event.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja deletar este evento?")) return;

    try {
      await CalendarAPI.delete(id);
      toast({
        title: "Evento Removido!",
        description: "O evento foi removido do calendário.",
        className: "bg-red-100 text-red-800 border-red-200",
      });
      await loadEvents();
    } catch (error: any) {
      console.error("Erro ao deletar evento:", error);
      toast({
        title: "Erro",
        description: error?.response?.data?.message || "Erro ao deletar evento",
        className: "bg-red-100 text-red-800 border-red-200",
      });
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setFormData({
      titulo: "",
      descricao: "",
      data_inicio: "",
      data_fim: "",
      tipo: "EVENTO",
      status: "PLANEJADO",
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case "INSCRICAO": return "bg-blue-100 text-blue-800 border-blue-200";
      case "AULA": return "bg-green-100 text-green-800 border-green-200";
      case "EVENTO": return "bg-purple-100 text-purple-800 border-purple-200";
      case "PROVA": return "bg-red-100 text-red-800 border-red-200";
      case "ENTREGA": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FERIADO": return "bg-pink-100 text-pink-800 border-pink-200";
      case "FORMATURAS": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "Invalid Date";

    let date: Date;

    if (typeof dateString === 'string') {
      // Se a string já contiver hora (ISO format), use diretamente
      if (dateString.includes('T')) {
        date = new Date(dateString);
      } else {
        // Se for apenas data (YYYY-MM-DD), adicione T00:00:00
        date = new Date(dateString + "T00:00:00");
      }
    } else {
      date = new Date(dateString);
    }

    // Validar se a data é válida
    if (isNaN(date.getTime())) {
      console.warn("Data inválida:", dateString);
      return "Invalid Date";
    }

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendário Acadêmico</h1>
          <p className="text-muted-foreground mt-1">Gerencie eventos e atividades acadêmicas</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetModal();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Adicionar Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? "Editar Evento" : "Adicionar Novo Evento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Evento</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Ex: Início das Aulas"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Evento</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INSCRICAO">Inscrição</SelectItem>
                      <SelectItem value="AULA">Aula</SelectItem>
                      <SelectItem value="EVENTO">Evento</SelectItem>
                      <SelectItem value="PROVA">Prova</SelectItem>
                      <SelectItem value="ENTREGA">Entrega</SelectItem>
                      <SelectItem value="FERIADO">Feriado</SelectItem>
                      <SelectItem value="FORMATURAS">Formaturas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descrição detalhada do evento"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data_inicio">Data Inicial</Label>
                  <Input
                    id="data_inicio"
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_fim">Data Final (opcional)</Label>
                  <Input
                    id="data_fim"
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData(prev => ({ ...prev, data_fim: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANEJADO">Planejado</SelectItem>
                    <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                    <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetModal}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedEvent ? "Atualizar" : "Criar"} Evento
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando eventos...</p>
        </div>
      ) : (
        <>
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{event.titulo}</CardTitle>
                      <Badge className={getEventTypeColor(event.tipo)}>
                        {event.tipo}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(event)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{event.descricao}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(event.data_inicio)}</span>
                    </div>

                    {event.data_fim && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        até {formatDate(event.data_fim)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {events.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando eventos ao seu calendário acadêmico.
                </p>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Evento
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarPage;

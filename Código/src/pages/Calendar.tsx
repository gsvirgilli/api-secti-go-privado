import { useState } from "react";
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  participants: string[];
}

const CalendarPage = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Início das Inscrições",
      description: "Abertura das inscrições para a Turma de Programação Web",
      date: "2024-09-15",
      time: "09:00",
      location: "Sala Principal",
      type: "Inscrição",
      participants: ["Todos os interessados"]
    },
    {
      id: 2,
      title: "Início das Aulas",
      description: "Início das aulas da Turma de Robótica Básica",
      date: "2024-09-22",
      time: "14:00",
      location: "Laboratório de Robótica",
      type: "Aula",
      participants: ["Turma de Robótica"]
    },
    {
      id: 3,
      title: "Formatura",
      description: "Cerimônia de formatura da Turma de Informática Avançada",
      date: "2024-09-30",
      time: "19:00",
      location: "Auditório Principal",
      type: "Evento",
      participants: ["Turma de Informática"]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "",
    participants: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEvent) {
      // Editar evento existente
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...formData, participants: formData.participants.split(',').map(p => p.trim()) }
          : event
      ));
      toast({
        title: "Evento Atualizado!",
        description: "O evento foi atualizado com sucesso.",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      });
    } else {
      // Adicionar novo evento
      const newEvent: Event = {
        id: Math.max(...events.map(e => e.id), 0) + 1,
        ...formData,
        participants: formData.participants.split(',').map(p => p.trim())
      };
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: "Evento Criado!",
        description: "O evento foi adicionado ao calendário.",
        className: "bg-green-100 text-green-800 border-green-200",
      });
    }
    
    setIsModalOpen(false);
    setSelectedEvent(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      type: "",
      participants: ""
    });
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      participants: event.participants.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast({
      title: "Evento Removido!",
      description: "O evento foi removido do calendário.",
      className: "bg-red-100 text-red-800 border-red-200",
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Inscrição": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Aula": return "bg-green-100 text-green-800 border-green-200";
      case "Evento": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                  <Label htmlFor="title">Título do Evento</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Início das Aulas"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Evento</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inscrição">Inscrição</SelectItem>
                      <SelectItem value="Aula">Aula</SelectItem>
                      <SelectItem value="Evento">Evento</SelectItem>
                      <SelectItem value="Reunião">Reunião</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição detalhada do evento"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: Sala Principal"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participants">Participantes</Label>
                <Input
                  id="participants"
                  value={formData.participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
                  placeholder="Ex: Turma A, Turma B (separados por vírgula)"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEvent(null);
                    setFormData({
                      title: "",
                      description: "",
                      date: "",
                      time: "",
                      location: "",
                      type: "",
                      participants: ""
                    });
                  }}
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge className={getEventTypeColor(event.type)}>
                    {event.type}
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
              <p className="text-sm text-muted-foreground">{event.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(event.date)} às {event.time}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{event.participants.join(', ')}</span>
                </div>
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
    </div>
  );
};

export default CalendarPage;

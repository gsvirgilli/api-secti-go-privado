import { useState } from "react";
import { DataBot } from "@/components/ui/DataBot";
import { Plus, Search, Eye, Edit, Trash2, UserPlus, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import InstructorDetailsModal from "@/components/modals/InstructorDetailsModal";
import InstructorFormModal from "@/components/modals/InstructorFormModal";
import AssignClassModal from "@/components/modals/AssignClassModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { useAppData } from "@/hooks/useAppData";
import { useToast } from "@/hooks/use-toast";
import type { Instructor } from "@/contexts/AppContext";

const Instructors = () => {
  const { instructors, updateInstructor, deleteInstructor } = useAppData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsModalOpen(true);
  };

  const handleEdit = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  const handleDelete = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsDeleteModalOpen(true);
  };

  const handleAssignClass = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsAssignModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInstructor) {
      deleteInstructor(selectedInstructor.id);
      toast({
        title: "INSTRUTOR EXCLUÍDO",
        description: `O instrutor ${selectedInstructor.name} foi excluído do sistema`,
        className: "bg-red-100 text-red-800 border-red-200",
      });
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
              <UserPlus className="h-8 w-8 text-primary" />
              Instrutores
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie os instrutores cadastrados no sistema</p>
          </div>
          <Button 
            onClick={() => {
              setFormMode("create");
              setSelectedInstructor(null);
              setIsFormModalOpen(true);
            }}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Instrutor
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-sm text-muted-foreground">Total de Instrutores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">4</p>
              <p className="text-sm text-muted-foreground">Instrutores Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">7</p>
              <p className="text-sm text-muted-foreground">Turmas Atribuídas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">95%</p>
              <p className="text-sm text-muted-foreground">Taxa de Ocupação</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar instrutores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <Card key={instructor.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {instructor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{instructor.name}</h3>
                      <p className="text-muted-foreground text-sm">{instructor.specialization}</p>
                    </div>
                  </div>
                  <Badge 
                    className={instructor.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}
                  >
                    {instructor.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>Experiência: {instructor.experience}</p>
                  <p>Turmas ativas: {instructor.classes.length}</p>
                  <p>Email: {instructor.email}</p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleViewDetails(instructor)}
                    variant="outline" 
                    size="sm"
                    className="flex-1 gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Ver
                  </Button>
                  <Button 
                    onClick={() => handleEdit(instructor)}
                    variant="outline" 
                    size="sm"
                    className="gap-1"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => handleAssignClass(instructor)}
                    variant="outline" 
                    size="sm"
                    className="gap-1"
                  >
                    <UserPlus className="h-3 w-3" />
                  </Button>
                  <Button 
                    onClick={() => handleDelete(instructor)}
                    variant="outline" 
                    size="sm"
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Especialização</TableHead>
                <TableHead>Experiência</TableHead>
                <TableHead>Turmas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell className="font-medium">{instructor.name}</TableCell>
                  <TableCell>{instructor.specialization}</TableCell>
                  <TableCell>{instructor.experience}</TableCell>
                  <TableCell>{instructor.classes.length}</TableCell>
                  <TableCell>
                    <Badge 
                      className={instructor.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}
                    >
                      {instructor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        onClick={() => handleViewDetails(instructor)}
                        variant="outline" 
                        size="sm"
                        className="gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver
                      </Button>
                      <Button 
                        onClick={() => handleEdit(instructor)}
                        variant="outline" 
                        size="sm"
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        onClick={() => handleAssignClass(instructor)}
                        variant="outline" 
                        size="sm"
                        className="gap-1"
                      >
                        <UserPlus className="h-3 w-3" />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(instructor)}
                        variant="outline" 
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <InstructorDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instructor={selectedInstructor}
      />

      <InstructorFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        instructorData={selectedInstructor}
        mode={formMode}
      />

      <AssignClassModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        instructorName={selectedInstructor?.name || ""}
        instructorId={selectedInstructor?.id}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="QUER MESMO EXCLUIR ESTE INSTRUTOR?"
        message="Esta ação não pode ser desfeita."
      />

      <DataBot />
    </div>
  );
};

export default Instructors;
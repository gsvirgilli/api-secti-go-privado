import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppData } from "@/hooks/useAppData";

interface AssignClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructorName: string;
  instructorId?: number;
}

const AssignClassModal = ({ isOpen, onClose, instructorName, instructorId }: AssignClassModalProps) => {
  const { toast } = useToast();
  const { classes, updateInstructor } = useAppData();
  const [selectedClass, setSelectedClass] = useState("");

  const handleAssign = () => {
    if (!selectedClass) {
      toast({
        title: "Seleção obrigatória",
        description: "Selecione uma turma para atribuir",
        variant: "destructive"
      });
      return;
    }

    const classData = classes.find(cls => cls.id.toString() === selectedClass);
    
    if (classData && instructorId) {
      // Atualizar a turma com o instrutor
      // Aqui você pode implementar a lógica para atribuir a turma ao instrutor
      toast({
        title: "TURMA ATRIBUÍDA",
        description: `A turma ${classData.name} foi atribuída ao instrutor ${instructorName}`,
        className: "bg-green-100 text-green-800 border-green-200",
      });
    }

    onClose();
    setSelectedClass("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-none">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-foreground">
            Atribuir Turma
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              Selecione uma turma para atribuir ao instrutor
            </p>
            <p className="font-semibold text-primary mt-1">{instructorName}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class">Turma Disponível</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma turma" />
              </SelectTrigger>
              <SelectContent>
                {classes
                  .filter(cls => cls.status === "Planejada" || cls.status === "Ativo")
                  .map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id.toString()}>
                      {classItem.name} - {classItem.course}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleAssign} className="bg-primary hover:bg-primary/90">
              Atribuir Turma
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignClassModal;
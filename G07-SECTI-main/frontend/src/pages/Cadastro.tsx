// src/pages/Cadastro.tsx
import { useEffect, useState } from "react";
import { GraduationCap, Users, UserCheck, BookOpen, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import StudentFormModal from "@/components/modals/StudentFormModal";
import ClassFormModal from "@/components/modals/ClassFormModal";
import InstructorFormModal from "@/components/modals/InstructorFormModal";
import CourseFormModal from "@/components/modals/CourseFormModal";
import CycleFormModal from "@/components/modals/CycleFormModal";

const Cadastro = () => {
  const { toast } = useToast();

  // Controle dos modais
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);

  // Teste de conexão com o backend
  useEffect(() => {
    const testarConexao = async () => {
      try {
        const resposta = await api.get("/ping");
        console.log("✅ Conexão com backend:", resposta.data);
      } catch (erro) {
        console.error("❌ Erro ao conectar com backend:", erro);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar com o servidor.",
          variant: "destructive",
        });
      }
    };
    testarConexao();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Sistema de Cadastro
          </h1>
        </div>

        {/* Botões de Cadastro */}
        <div className="space-y-6">
          <Button
            onClick={() => setIsStudentModalOpen(true)}
            className="w-full h-20 text-xl font-semibold bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground gap-4"
          >
            <GraduationCap className="h-8 w-8" />
            CADASTRAR ALUNO
          </Button>

          <Button
            onClick={() => setIsClassModalOpen(true)}
            className="w-full h-20 text-xl font-semibold bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground gap-4"
          >
            <Layers className="h-8 w-8" />
            CADASTRAR TURMA
          </Button>

          <Button
            onClick={() => setIsInstructorModalOpen(true)}
            className="w-full h-20 text-xl font-semibold bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground gap-4"
          >
            <UserCheck className="h-8 w-8" />
            CADASTRAR INSTRUTOR
          </Button>

          <Button
            onClick={() => setIsCourseModalOpen(true)}
            className="w-full h-20 text-xl font-semibold bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground gap-4"
          >
            <BookOpen className="h-8 w-8" />
            CADASTRAR CURSO
          </Button>

          <Button
            onClick={() => setIsCycleModalOpen(true)}
            className="w-full h-20 text-xl font-semibold bg-primary-dark hover:bg-primary-dark/90 text-primary-foreground gap-4"
          >
            <Clock className="h-8 w-8" />
            CADASTRAR CICLO
          </Button>
        </div>
      </div>

      {/* --- Modais de Cadastro --- */}
      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        mode="create"
        student={null}
      />

      <ClassFormModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        mode="create"
        classData={null}
      />

      <InstructorFormModal
        isOpen={isInstructorModalOpen}
        onClose={() => setIsInstructorModalOpen(false)}
        mode="create"
        instructor={null}
      />

      <CourseFormModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        mode="create"
        course={null}
      />

      <CycleFormModal
        isOpen={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
        mode="create"
        cycle={null}
      />
    </div>
  );
};

export default Cadastro;

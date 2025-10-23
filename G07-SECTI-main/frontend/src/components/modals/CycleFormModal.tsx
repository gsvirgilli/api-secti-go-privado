import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CycleFormModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState({ nome: "", descricao: "", inicio: "", fim: "", status: "Ativo" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Se o backend não tiver, vai retornar 404 — ver nota abaixo
      await api.post("/cycles", {
        nome: form.nome,
        descricao: form.descricao,
        data_inicio: form.inicio,
        data_fim: form.fim,
        status: form.status,
      });
      toast({ title: "Ciclo cadastrado com sucesso!" });
      onClose();
      navigate("/cycles"); // crie rota /cycles depois no frontend se necessário
    } catch (error) {
      toast({ title: "Erro ao cadastrar ciclo", variant: "destructive" });
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl bg-card border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Cadastrar Ciclo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Início</Label>
              <Input type="date" value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} />
            </div>
            <div>
              <Label>Data Fim</Label>
              <Input type="date" value={form.fim} onChange={(e) => setForm({ ...form, fim: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

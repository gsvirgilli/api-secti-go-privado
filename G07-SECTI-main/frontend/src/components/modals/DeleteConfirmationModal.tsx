import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: DeleteConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-none">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground mb-4 flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6">
          <p className="text-muted-foreground">{message}</p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-8"
            >
              CANCELAR
            </Button>
            <Button
              onClick={onConfirm}
              variant="destructive"
              className="px-8"
            >
              EXCLUIR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
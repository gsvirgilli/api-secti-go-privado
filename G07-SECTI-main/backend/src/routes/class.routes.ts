import { Router } from "express";
const router = Router();

// Exemplo de rota (teste)
router.get("/", (req, res) => {
  res.json({ message: "Rota de turmas funcionando!" });
});

export default router;

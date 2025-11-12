import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sobre from "@/pages/Sobre";

const HomeRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("@sukatech:token");
    
    if (token) {
      // Se estiver logado, redirecionar para o Dashboard
      navigate("/dashboard", { replace: true });
    }
    // Se não estiver logado, mostrar a página Sobre
  }, [navigate]);

  // Verificar novamente no render para evitar flash
  const token = localStorage.getItem("@sukatech:token");
  
  if (token) {
    // Se houver token, não renderizar nada (o navigate vai redirecionar)
    return null;
  }

  // Se não houver token, mostrar a página Sobre
  return <Sobre />;
};

export default HomeRedirect;


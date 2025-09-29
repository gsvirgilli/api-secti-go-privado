import { useState } from "react";
import { Bot, MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";

interface DataBotProps {
  pageContext?: string;
}

export const DataBot = ({ pageContext }: DataBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ type: "bot" | "user"; content: string }>>([
    {
      type: "bot",
      content: "Olá! Sou o DataBot, seu assistente inteligente de gestão educacional. Posso ajudar você a encontrar informações, gerar relatórios e navegar pelo sistema de forma mais rápida. Como posso ajudar?"
    }
  ]);

  const location = useLocation();

  const handleMessage = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { type: "user", content: userMessage }]);
    setInput('');

    // Simulate AI response with page-aware intelligence
    setTimeout(() => {
      const botResponse = generateContextualResponse(userMessage, location.pathname);
      setMessages(prev => [...prev, { type: "bot", content: botResponse }]);
    }, 1000);
  };

  const generateContextualResponse = (message: string, currentPath: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Advanced command recognition
    const commands = {
      search: ['buscar', 'encontrar', 'procurar', 'localizar', 'onde está', 'cadê'],
      add: ['adicionar', 'novo', 'cadastrar', 'criar', 'incluir', 'registrar'],
      edit: ['editar', 'modificar', 'alterar', 'atualizar', 'mudar'],
      delete: ['deletar', 'remover', 'excluir', 'apagar'],
      export: ['exportar', 'baixar', 'download', 'relatório', 'excel', 'pdf'],
      navigate: ['ir para', 'navegar', 'página', 'abrir', 'acessar'],
      stats: ['estatísticas', 'dados', 'números', 'métricas', 'total', 'quantos'],
      help: ['ajuda', 'como', 'tutorial', 'não sei', 'dúvida']
    };

    // Check for greetings
    if (['oi', 'olá', 'ola', 'hello', 'hi', 'bom dia', 'boa tarde', 'boa noite'].some(greeting => lowerMessage.includes(greeting))) {
      return `👋 Olá! Eu sou o DataBot, seu assistente inteligente de gestão educacional!

🤖 O que posso fazer por você:

📊 Análises e Estatísticas
- Mostro dados sobre alunos, cursos e turmas
- Gero relatórios personalizados
- Analiso tendências e performance

🔍 Busca Inteligente
- Encontro informações específicas rapidamente
- Ajudo a localizar alunos, cursos ou instrutores
- Sugiro filtros para buscas mais precisas

🧭 Navegação Assistida
- Direciono você para a seção certa
- Explico como usar cada funcionalidade
- Ofereço atalhos para tarefas comuns

💡 Dicas e Sugestões
- Dou orientações baseadas na página atual
- Sugiro ações mais eficientes
- Ajudo com dúvidas sobre o sistema

Digite naturalmente o que precisa, como:
"Buscar aluno João", "Estatísticas de cursos" ou "Como criar nova turma"

Como posso ajudar você hoje?`;
    }

    // Check for specific data requests
    if (commands.stats.some(cmd => lowerMessage.includes(cmd))) {
      if (lowerMessage.includes('aluno')) {
        return `📊 Estatísticas de Alunos:
Total de alunos: 5
Alunos ativos: 4
Taxa de atividade: 80%
Novos alunos este mês: 1`;
      }
      
      if (lowerMessage.includes('curso')) {
        return `📊 Estatísticas de Cursos:
Total de cursos: 6
Cursos ativos: 6
Média de alunos por curso: 3`;
      }

      return `📊 Visão Geral do Sistema:
Alunos: 5 (4 ativos)
Cursos: 6 disponíveis
Turmas: 4 em andamento
Taxa de ocupação: 80%`;
    }

    // Check for navigation requests
    if (commands.navigate.some(cmd => lowerMessage.includes(cmd))) {
      if (lowerMessage.includes('aluno')) return 'Redirecionando para a página de Alunos...';
      if (lowerMessage.includes('curso')) return 'Redirecionando para a página de Cursos...';
      if (lowerMessage.includes('turma')) return 'Redirecionando para a página de Turmas...';
      if (lowerMessage.includes('instrutor')) return 'Redirecionando para a página de Instrutores...';
      if (lowerMessage.includes('relatório')) return 'Redirecionando para a página de Relatórios...';
      if (lowerMessage.includes('dashboard') || lowerMessage.includes('início')) return 'Redirecionando para o Dashboard...';
      
      return `🧭 Onde você gostaria de ir?
- Dashboard (visão geral)
- Alunos (gestão de estudantes)  
- Cursos (administração de cursos)
- Turmas (organização de classes)
- Instrutores (corpo docente)
- Relatórios (análises e dados)`;
    }

    // Page-specific intelligent responses
    if (currentPath.includes('/alunos') || currentPath.includes('/students')) {
      if (commands.search.some(cmd => lowerMessage.includes(cmd))) {
        return `🔍 Busca Inteligente de Alunos:
Use a barra de busca no topo para encontrar por:
- Nome completo ou parcial
- Email ou telefone
- Curso matriculado
- Status (ativo/inativo)

Dica: Digite apenas parte do nome para busca rápida!`;
      }
      
      if (commands.add.some(cmd => lowerMessage.includes(cmd))) {
        return `➕ Cadastro Rápido de Aluno:
1. Clique em "Adicionar Aluno" (botão azul no canto superior)
2. Preencha os dados obrigatórios
3. Selecione o curso desejado
4. Defina o status inicial
5. Salve e pronto!

O sistema validará automaticamente email e telefone.`;
      }

      return `👥 Central de Alunos:
Aqui você pode gerenciar todos os estudantes do sistema.
Total atual: 5 alunos

O que você gostaria de fazer?
- Buscar um aluno específico
- Cadastrar novo aluno
- Ver estatísticas detalhadas
- Exportar lista de alunos`;
    }

    if (currentPath.includes('/cursos') || currentPath.includes('/courses')) {
      if (commands.add.some(cmd => lowerMessage.includes(cmd))) {
        return `📚 Criação de Novo Curso:
1. Clique em "Novo Curso"
2. Defina nome e descrição
3. Configure carga horária
4. Selecione categoria
5. Adicione pré-requisitos (se houver)

Após criar, você pode adicionar turmas e instrutores!`;
      }

      if (commands.search.some(cmd => lowerMessage.includes(cmd))) {
        return `🔍 Encontrar Cursos:
Use os filtros disponíveis:
- Por categoria (técnico, idiomas, etc.)
- Por duração
- Por nível (básico, intermediário, avançado)
- Por status (ativo/inativo)`;
      }

      return `📚 Gestão de Cursos:
Sistema com 6 cursos disponíveis.

Posso ajudar você a:
- Criar novos cursos
- Buscar cursos específicos
- Ver estatísticas de popularidade
- Gerenciar categorias`;
    }

    if (currentPath.includes('/turmas') || currentPath.includes('/classes')) {
      return `🎓 Gestão de Turmas:
4 turmas ativas no momento.

Funcionalidades disponíveis:
- Criar novas turmas
- Atribuir instrutores
- Matricular alunos
- Controlar frequência
- Acompanhar progresso`;
    }

    if (currentPath.includes('/instrutores') || currentPath.includes('/instructors')) {
      return `👨‍🏫 Gestão de Instrutores:
Sistema com 8 instrutores cadastrados.

Você pode:
- Cadastrar novos instrutores
- Gerenciar especializações
- Visualizar horários e disponibilidade
- Atribuir turmas`;
    }

    if (currentPath.includes('/relatorios') || currentPath.includes('/reports')) {
      if (commands.export.some(cmd => lowerMessage.includes(cmd))) {
        return `📊 Exportação de Relatórios:
Formatos disponíveis:
- PDF (relatórios formatados)
- Excel (planilhas de dados)
- CSV (dados para análise)

Use os filtros para personalizar o conteúdo antes de exportar.`;
      }

      return `📊 Central de Relatórios:
Gere análises personalizadas do seu sistema educacional.

Relatórios disponíveis:
- Performance de alunos
- Popularidade de cursos
- Eficiência de instrutores
- Métricas financeiras
- Tendências de matrícula`;
    }

    if (currentPath === '/' || currentPath.includes('/dashboard')) {
      return `🏠 Dashboard Principal:
Visão completa: 5 alunos em 6 cursos.

Os cards mostram:
- Métricas principais em tempo real
- Tendências de crescimento
- Alertas importantes
- Ações rápidas

Use o menu lateral para navegar entre as seções.`;
    }

    // General help and guidance
    if (commands.help.some(cmd => lowerMessage.includes(cmd))) {
      return `💡 Como posso ajudar você hoje?

Comandos que entendo:
- "Buscar aluno João" - encontra estudantes
- "Criar novo curso" - abre formulário de curso
- "Estatísticas de turmas" - mostra dados
- "Ir para relatórios" - navega para seção
- "Exportar dados" - gera relatórios

Digite naturalmente o que precisa!`;
    }

    return `🤖 DataBot Inteligente

Sou seu assistente especializado em gestão educacional.
Posso ajudar com:

📊 Análises: Gero insights sobre alunos, cursos e performance
🔍 Busca: Encontro informações específicas rapidamente  
📋 Relatórios: Crio análises personalizadas
🧭 Navegação: Direciono você para a seção certa
💡 Sugestões: Ofereço dicas baseadas no contexto atual

Digite sua pergunta ou comando!`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 relative group flex items-center justify-center"
        >
          <Bot className="h-7 w-7 text-white" />
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            DataBot - Seu navegador inteligente
          </div>
        </Button>
      ) : (
        <Card className="w-96 h-[500px] bg-white dark:bg-gray-900 shadow-2xl border-2 border-emerald-200 animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                <span>DataBot</span>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-80">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-emerald-600" />
                    </div>
                  )}
                  <div className={`p-3 rounded-lg max-w-xs whitespace-pre-line text-sm ${
                    message.type === 'user' 
                      ? 'bg-teal-600 text-white ml-auto' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    {message.content}
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-teal-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Digite sua pergunta ou comando..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleMessage();
                    }
                  }}
                  className="flex-1 min-h-[40px] max-h-20 text-sm"
                />
                <Button 
                  onClick={handleMessage}
                  disabled={!input.trim()}
                  size="sm"
                  className="self-end bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
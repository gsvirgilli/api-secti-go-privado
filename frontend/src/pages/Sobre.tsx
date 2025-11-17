import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GraduationCap, Users, BookOpen, Target, Heart, LogIn, FileText, MapPin, Clock, Phone, Recycle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CoursesAPI } from "@/lib/api";

interface Course {
  id: number;
  nome: string;
  descricao?: string;
  carga_horaria?: number;
  nivel?: string;
  status?: string;
}

const Sobre = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Carregar cursos da API pública
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const response = await CoursesAPI.listPublic();
        
        // Extrair dados da resposta
        let coursesData = [];
        if (response.data?.data?.data) {
          coursesData = response.data.data.data;
        } else if (response.data?.data) {
          coursesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          coursesData = response.data;
        }
        
        // Filtrar apenas cursos ativos
        const activeCourses = coursesData.filter((c: Course) => c.status === 'ATIVO');
        setCourses(activeCourses);
        console.log('✅ Cursos públicos carregados:', activeCourses);
      } catch (error) {
        console.error('Erro ao carregar cursos públicos:', error);
        // Em caso de erro, manter array vazio
        setCourses([]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header com Logo */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo_suckatech.png" 
                alt="SukaTech Logo" 
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-2xl font-bold text-foreground">SukaTech</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="gap-2"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Bem-vindo ao <span className="text-primary">SukaTech</span>
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Programa do Governo de Goiás que alia sustentabilidade e desenvolvimento social, 
            oferecendo cursos gratuitos de tecnologia e recondicionamento de equipamentos eletrônicos.
          </p>
          
          {/* Botões de Ação */}
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/inscricao")}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Inscrever-se no Processo Seletivo
            </Button>
          </div>
        </div>

        {/* Cards de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Cursos Gratuitos</h3>
              </div>
              <p className="text-muted-foreground">
                Cursos de informática básica, robótica e manutenção de computadores e celulares, 
                oferecidos gratuitamente para jovens a partir de 12 anos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Recycle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Recondicionamento</h3>
              </div>
              <p className="text-muted-foreground">
                Centro de Recondicionamento de Computadores (CRC) que recebe resíduos eletrônicos, 
                realiza reciclagem e recondicionamento, contribuindo com a preservação do meio ambiente.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Doação de Equipamentos</h3>
              </div>
              <p className="text-muted-foreground">
                Eletrônicos recondicionados são doados a entidades filantrópicas ou públicas, 
                promovendo inclusão digital e social.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seção Sobre o Programa */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-lg mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold text-foreground">Sobre o Programa</h3>
            </div>
            
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                O <strong className="text-foreground">SukaTech</strong> é um programa do 
                <strong className="text-foreground"> Governo de Goiás</strong>, por meio do Goiás Social, 
                e gerido pela <strong className="text-foreground">Secretaria de Estado de Ciência, Tecnologia e Inovação (Secti)</strong> 
                em parceria com a <strong className="text-foreground">Organização da Sociedade Civil (OSC) Programando o Futuro</strong>, 
                que tem em sua concepção ações que aliam sustentabilidade e desenvolvimento social.
              </p>
              
              <p>
                Por meio do programa, o governo do estado mantém um <strong className="text-foreground">Centro de Recondicionamento de Computadores (CRC)</strong> 
                que recebe resíduos eletrônicos e realiza a reciclagem e o recondicionamento, contribuindo com a preservação do meio ambiente. 
                Além disso, os eletrônicos recondicionados são doados a entidades filantrópicas ou públicas.
              </p>

              <p>
                O SukaTech ainda realiza a <strong className="text-foreground">capacitação gratuita de jovens e adultos na área de tecnologia</strong>. 
                Durante os cursos de informática básica, robótica, e manutenção de computadores e celulares, 
                os estudantes aprendem de maneira prática.
              </p>
            </div>
          </div>
        </div>

        {/* Seção Sobre os Cursos */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-foreground mb-4">Sobre os Cursos</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Os cursos são oferecidos gratuitamente na sede do SukaTech, em Goiânia, e no SukaTech Lab, em Senador Canedo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Cursos Disponíveis */}
            <Card className="border-2">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  Cursos Disponíveis
                </h4>
                
                {isLoadingCourses ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Carregando cursos...</p>
                  </div>
                ) : courses.length > 0 ? (
                  <>
                    <ul className="space-y-3 text-muted-foreground">
                      {courses.map((course) => (
                        <li key={course.id} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <div className="flex-1">
                            <strong className="text-foreground">{course.nome}</strong>
                            {course.descricao && (
                              <p className="text-sm mt-1">{course.descricao}</p>
                            )}
                            {course.carga_horaria && (
                              <p className="text-xs mt-1 text-muted-foreground/70">
                                Carga horária: {course.carga_horaria}h
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm">
                        <strong className="text-foreground">Total de cursos disponíveis:</strong> {courses.length}
                      </p>
                      <p className="text-sm mt-1">
                        <strong className="text-foreground">Idade mínima:</strong> 12 anos
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Nenhum curso disponível no momento.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Horários */}
            <Card className="border-2">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Horários dos Cursos
                </h4>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong className="text-foreground">Matutino:</strong> das 08h30 às 11h30
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong className="text-foreground">Vespertino:</strong> das 14h às 17h
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong className="text-foreground">Noturno:</strong> das 18h30 às 21h30
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <em>Horários podem variar dependendo da unidade</em>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Goiânia
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Escola do Futuro de Goiás José Luiz Bittencourt</strong>
                  </p>
                  <p className="text-sm">
                    Rua BF-25, esquina com Avenida JC-15, Bairro Floresta, Goiânia
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Senador Canedo
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Ganha Tempo – Vila Galvão</strong>
                  </p>
                  <p>
                    <strong className="text-foreground">Ganha Tempo – Jardim das Oliveiras</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seção Centro de Recondicionamento */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-lg mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Recycle className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold text-foreground">Centro de Recondicionamento de Computadores (CRC)</h3>
            </div>
            
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                O CRC recebe resíduos eletrônicos e realiza a reciclagem e o recondicionamento, 
                contribuindo com a preservação do meio ambiente.
              </p>

              <div>
                <h4 className="font-bold text-foreground mb-3">O que pode ser descartado?</h4>
                <p className="mb-3">
                  Poderão ser descartados notebooks, impressoras, eletrônicos de escritório, 
                  eletrônicos de pequeno porte, tablets e celulares, acessórios de informática, 
                  câmeras, cabos e carregadores, fones de ouvido, eletroportáteis, ferramentas elétricas e muitos outros.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-3">Destinação dos bens recondicionados:</h4>
                <p>
                  Todo material recolhido será encaminhado ao Centro de Recondicionamento de Computadores (CRC). 
                  O que não pode ser reaproveitado ou recondicionado terá sua destinação correta, por meio do envio a parceiros cadastrados. 
                  Os equipamentos que podem ser reaproveitados, como por exemplo os computadores, depois de recondicionados, 
                  poderão ser doados à população considerada em situação de vulnerabilidade, órgãos e escolas públicas estaduais, 
                  bibliotecas e instituições de iniciativas de inclusão digital e social.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Benefícios */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Por que escolher o SukaTech?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">100%</span>
              </div>
              <h4 className="font-bold text-foreground mb-2">Gratuito</h4>
              <p className="text-sm text-muted-foreground">
                Todos os cursos são totalmente gratuitos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">12+</span>
              </div>
              <h4 className="font-bold text-foreground mb-2">A partir de 12 anos</h4>
              <p className="text-sm text-muted-foreground">
                Jovens e adultos podem participar
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Flexibilidade</h4>
              <p className="text-sm text-muted-foreground">
                Turnos matutino, vespertino e noturno
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-bold text-foreground mb-2">Impacto Social</h4>
              <p className="text-sm text-muted-foreground">
                Contribua para um futuro mais sustentável
              </p>
            </div>
          </div>
        </div>

        {/* Contato */}
        <Card className="border-2 mb-16">
          <CardContent className="p-8">
            <div className="text-center">
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">Mais Informações</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Entre em contato conosco através do WhatsApp
              </p>
              <a 
                href="https://wa.me/556241419800" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
              >
                <Phone className="w-5 h-5" />
                (62) 4141-9800
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action Final */}
        <div className="bg-primary/10 rounded-2xl p-8 sm:p-12 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Pronto para começar sua jornada?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Inscreva-se no processo seletivo e faça parte desta transformação. 
            Cursos gratuitos de tecnologia para jovens a partir de 12 anos.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/inscricao")}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Inscrever-se Agora
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>
              <strong className="text-foreground">SukaTech</strong> - Programa do Governo de Goiás
            </p>
            <p className="text-sm mt-2">
              Secretaria de Estado de Ciência, Tecnologia e Inovação (Secti) em parceria com Programando o Futuro
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sobre;

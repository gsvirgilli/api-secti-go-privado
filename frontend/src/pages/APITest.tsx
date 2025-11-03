import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AuthAPI, 
  HealthAPI, 
  CoursesAPI, 
  StudentsAPI, 
  EnrollmentsAPI 
} from '@/lib/api';

export default function APITest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@teste.com');
  const [senha, setSenha] = useState('senha123');

  const runTest = async (testFn: () => Promise<any>, testName: string) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await testFn();
      setResult({
        success: true,
        test: testName,
        data: response.data
      });
    } catch (error: any) {
      setResult({
        success: false,
        test: testName,
        error: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🧪 Teste de Conexão API</h1>

      {/* Health Check */}
      <Card>
        <CardHeader>
          <CardTitle>1. Health Check</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => runTest(() => HealthAPI.check(), 'Health Check')}
            disabled={loading}
          >
            Testar Conexão
          </Button>
        </CardContent>
      </Card>

      {/* Login */}
      <Card>
        <CardHeader>
          <CardTitle>2. Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button 
            onClick={() => runTest(
              () => AuthAPI.login({ email, senha }),
              'Login'
            )}
            disabled={loading}
          >
            Fazer Login
          </Button>
        </CardContent>
      </Card>

      {/* Listar Cursos */}
      <Card>
        <CardHeader>
          <CardTitle>3. Listar Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => runTest(() => CoursesAPI.list(), 'Listar Cursos')}
            disabled={loading}
          >
            Carregar Cursos
          </Button>
        </CardContent>
      </Card>

      {/* Listar Alunos */}
      <Card>
        <CardHeader>
          <CardTitle>4. Listar Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => runTest(() => StudentsAPI.list(), 'Listar Alunos')}
            disabled={loading}
          >
            Carregar Alunos
          </Button>
        </CardContent>
      </Card>

      {/* Listar Matrículas */}
      <Card>
        <CardHeader>
          <CardTitle>5. Listar Matrículas</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => runTest(() => EnrollmentsAPI.list(), 'Listar Matrículas')}
            disabled={loading}
          >
            Carregar Matrículas
          </Button>
        </CardContent>
      </Card>

      {/* Resultado */}
      {result && (
        <Card className={result.success ? 'border-green-500' : 'border-red-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? '✅' : '❌'} Resultado: {result.test}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
              {JSON.stringify(result.success ? result.data : result.error, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-center">
          <p className="text-lg">⏳ Carregando...</p>
        </div>
      )}
    </div>
  );
}

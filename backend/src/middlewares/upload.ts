import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Criar diretório de uploads se não existir
const uploadsDir = path.join(process.cwd(), 'uploads', 'documentos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    // Gerar nome único: timestamp + nome original sanitizado
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const sanitizedName = file.originalname
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use PDF, imagens (JPG, PNG, GIF, WEBP) ou documentos (DOC, DOCX).'));
  }
};

// Configuração do multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por arquivo
  }
});

// Middleware para múltiplos arquivos de documentação
export const uploadDocuments = upload.fields([
  { name: 'rg_frente', maxCount: 1 },
  { name: 'rg_verso', maxCount: 1 },
  { name: 'cpf_aluno', maxCount: 1 },
  { name: 'comprovante_endereco', maxCount: 1 },
  { name: 'identidade_responsavel_frente', maxCount: 1 },
  { name: 'identidade_responsavel_verso', maxCount: 1 },
  { name: 'cpf_responsavel_file', maxCount: 1 },
  { name: 'comprovante_escolaridade', maxCount: 1 },
  { name: 'foto_3x4', maxCount: 1 }
]);


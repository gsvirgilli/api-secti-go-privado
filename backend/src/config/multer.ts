import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Criar pasta de uploads se não existir
const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp_fieldname_originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de arquivos (apenas imagens e PDFs)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas imagens (JPEG, PNG, GIF) e PDFs são aceitos.'));
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

// Campos de upload esperados
export const documentFields = [
  { name: 'rg_frente', maxCount: 1 },
  { name: 'rg_verso', maxCount: 1 },
  { name: 'cpf_aluno', maxCount: 1 },
  { name: 'comprovante_endereco', maxCount: 1 },
  { name: 'identidade_responsavel_frente', maxCount: 1 },
  { name: 'identidade_responsavel_verso', maxCount: 1 },
  { name: 'cpf_responsavel_doc', maxCount: 1 },
  { name: 'comprovante_escolaridade', maxCount: 1 },
  { name: 'foto_3x4', maxCount: 1 },
];

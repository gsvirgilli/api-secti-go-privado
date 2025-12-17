import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { UserController } from './user.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar multer para upload de avatares
const uploadsDir = path.join(__dirname, '../../../uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'unknown';
    const ext = path.extname(file.originalname);
    cb(null, `${userId}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

// Wrapper para tratamento de erros assíncronos
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const usersRouter = Router();
const controller = new UserController();

usersRouter.get('/me', isAuthenticated, asyncHandler((req, res) => controller.me(req, res)));
usersRouter.put('/:id', isAuthenticated, asyncHandler((req, res) => controller.updateProfile(req, res)));
usersRouter.put('/:id/avatar', isAuthenticated, (req, res, next) => {
  console.log('=== AVATAR ROUTE ===');
  console.log('User:', req.user);
  console.log('Params:', req.params);
  console.log('Headers:', req.headers);
  
  upload.single('avatar')(req, res, (err) => {
    console.log('After multer - File:', (req as any).file);
    console.log('After multer - Err:', err);
    
    if (err instanceof multer.MulterError) {
      console.error('Erro Multer:', err);
      return res.status(400).json({ message: `Erro no upload: ${err.message}` });
    } else if (err) {
      console.error('Erro no upload:', err);
      return res.status(400).json({ message: err.message || 'Erro no upload' });
    }
    console.log('Multer OK, chamando controller');
    next();
  });
}, asyncHandler((req, res) => {
  console.log('Entrando no controller, file:', (req as any).file);
  return controller.uploadAvatar(req, res);
}));

export default usersRouter;

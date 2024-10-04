import { Router } from 'express';
import {
    createUsuario,
    deleteUsuario,
    getUsuarioById,
    getUsuarios,
    updateUsuario
} from './users.controller';

const router = Router();

router.post('/', createUsuario);
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;

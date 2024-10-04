import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../users/users.model'; // Importa el modelo de usuario

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token de autenticación
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Contraseña incorrecta
 *       500:
 *         description: Error en el servidor
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario._id }, 'tu_secreto', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
export const logout = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout exitoso' });
};
/**
   * @swagger
   * components:
   *   schemas:
   *     LoginRequest:
   *       type: object
   *       properties:
   *         email:
   *           type: string
   *         password:
   *           type: string
   *       required:
   *         - email
   *         - password
   *     LoginResponse:
   *       type: object
   *       properties:
   *         token:
   *           type: string
   *       required:
   *         - token
   *     ErrorResponse:
   *       type: object
   *       properties:
   *         message:
   *           type: string
   *         status:
   *           type: number
   *       required:
   *         - message
   *         - status
   */
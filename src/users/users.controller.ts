import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Usuario from './users.model'; // Importa el modelo de usuario

// Crear un nuevo usuario
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telefono:
 *                 type: string
 *               rut:
 *                 type: string
 *               empresa:
 *                 type: string
 *               disciplina:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       500:
 *         description: Error en el servidor
 */
export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, telefono, rut, empresa, disciplina, perfil } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El campo nombre es requerido' });
    }
    if (!email) {
      return res.status(400).json({ error: 'El campo email es requerido' });
    }
    if (!password) {
      return res.status(400).json({ error: 'El campo password es requerido' });
    }
    if (!perfil) {
      return res.status(400).json({ error: 'El campo perfil es requerido' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUsuario = new Usuario({ nombre, email, password: hashedPassword, telefono, rut, empresa, disciplina, perfil });
    await newUsuario.save();
    res.status(201).json(newUsuario);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error en el servidor
 */
export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario not found' });
    }
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               telefono:
 *                 type: string
 *               rut:
 *                 type: string
 *               empresa:
 *                 type: string
 *               disciplina:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, contraseña, telefono, rut, empresa, disciplina } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, email, contraseña, telefono, rut, empresa, disciplina },
      { new: true }
    );
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario not found' });
    }
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario not found' });
    }
    res.status(200).json({ message: 'Usuario deleted' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

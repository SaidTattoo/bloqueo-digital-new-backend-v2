import { Request, Response } from 'express';
import EnergyOwner from '../EnergyOwner/energyOwner.model';
import Equipment from '../Equipment/equipment.model';
import Supervisor from '../Supervisor/supervisor.model';
import Usuario from '../users/users.model';
import Worker from '../Worker/worker.model';
import Activity from './activity.model';

// Crear una nueva actividad
/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Crear una nueva actividad
 *     tags: [Actividades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string 
 *               isBlocked:
 *                 type: boolean
 *               blockType:
 *                 type: string
 *               energyOwners:
 *                 type: array
 *                 items:
 *                   type: object
 *               equipments:
 *                 type: array
 *                 items:
 *                   type: object
 *               zeroEnergyValidation:
 *                 type: object
 *                 properties:
 *                   validatorName:
 *                     type: string
 *                   instrumentUsed:
 *                     type: string
 *                   energyValue:
 *                     type: string
 *     responses:
 *       201:
 *         description: Actividad creada
 *       500:
 *         description: Error en el servidor
 */
export const createActivity = async (req: Request, res: Response) => {
  try {
    const { name, description, isBlocked, blockType, energyOwners, equipments, zeroEnergyValidation } = req.body;

    // Crear y guardar los subdocumentos
    const energyOwnerDocs = await Promise.all(
      energyOwners.map(async (owner: any) => {
        const supervisorDocs = await Promise.all(
          owner.supervisors.map(async (supervisor: any) => {
            const workerDocs = await Worker.insertMany(supervisor.workers);
            const newSupervisor = new Supervisor({ ...supervisor, workers: workerDocs });
            await newSupervisor.save();
            return newSupervisor;
          })
        );
        const newEnergyOwner = new EnergyOwner({ ...owner, supervisors: supervisorDocs });
        await newEnergyOwner.save();
        return newEnergyOwner;
      })
    );

    // Crear y guardar los equipos
    const equipmentDocs = await Equipment.insertMany(equipments);

    // Crear y guardar la actividad
    const newActivity = new Activity({
      name,
      description,
      isBlocked,
      blockType,
      energyOwners: energyOwnerDocs,
      equipments: equipmentDocs,
      zeroEnergyValidation: zeroEnergyValidation || null, // Establecer en null si no se proporciona
    });
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Obtener todas las actividades
/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Obtener todas las actividades
 *     tags: [Actividades]
 *     responses:
 *       200:
 *         description: Lista de actividades
 */
export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate({
      path: 'energyOwners',
      populate: {
        path: 'supervisors',
        populate: {
          path: 'workers',
        },
      },
    }).populate('equipments');
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Obtener una actividad por ID
/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Obtener una actividad por ID
 *     tags: [Actividades]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Actividad encontrada
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error en el servidor
 */
export const getActivityById = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id).populate({
      path: 'energyOwners',
      populate: {
        path: 'supervisors',
        populate: {
          path: 'workers',
        },
      },
    }).populate('equipments');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Obtener un dueño de energía por ID dentro de una actividad
/**
 * @swagger
 * /activities/{activityId}/energyOwners/{energyOwnerId}:
 *   get:
 *     summary: Obtener un dueño de energía por ID dentro de una actividad
 *     tags: [Actividades]
 *     parameters:
 *       - name: activityId
 *         in: path
 *         required: true
 *         type: string
 *       - name: energyOwnerId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Dueño de energía encontrado
 *       404:
 *         description: Dueño de energía no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const getEnergyOwnerById = async (req: Request, res: Response) => {
  try {
    const { activityId, energyOwnerId } = req.params;

    const activity = await Activity.findById(activityId).populate({
      path: 'energyOwners',
      populate: {
        path: 'supervisors',
        populate: {
          path: 'workers',
        },
      },
    }).populate('equipments');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const energyOwner = activity.energyOwners.find((owner: any) => owner._id.toString() === energyOwnerId);

    if (!energyOwner) {
      return res.status(404).json({ message: 'EnergyOwner not found' });
    }

    res.status(200).json(energyOwner);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Actualizar el estado de bloqueo de un EnergyOwner
/**
 * @swagger
 * /activities/{activityId}/energyOwners/{energyOwnerId}:
 *   put:
 *     summary: Actualizar el estado de bloqueo de un EnergyOwner
 *     tags: [Actividades]
 *     parameters:
 *       - name: activityId
 *         in: path
 *         required: true
 *         type: string
 *       - name: energyOwnerId
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
 *               isBlocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Estado de bloqueo actualizado
 *       404:
 *         description: Actividad o dueño de energía no encontrado
 *       500:
 *         description: Error en el servidor
 */
export const updateEnergyOwnerBlockStatus = async (req: Request, res: Response) => {
  try {
    const { activityId, energyOwnerId } = req.params;
    const { isBlocked } = req.body;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' }); 
    }

    const user = await Usuario.findById(energyOwnerId);
    if (!user) {
      return res.status(405).json({ message: 'Usuario no encontrado' });
    }

    if (user.perfil !== 'duenoDeEnergia') {
      return res.status(403).json({ message: 'Usuario no tiene permiso para bloquear' });
    }

    //agregar  el usuario a energyOwners y isBlocked pasarlo a true
    activity.energyOwners.push(user);
    activity.isBlocked = true;
    await activity.save();

    res.status(200).json(activity);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};



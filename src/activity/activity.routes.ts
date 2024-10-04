import { Router } from 'express';
import {
    createActivity,

    getActivities,
    getActivityById,
    getEnergyOwnerById // Nueva función
    ,




    updateEnergyOwnerBlockStatus
} from './activity.controller';

const router = Router();

router.post('/', createActivity);
router.get('/', getActivities);
router.get('/:id', getActivityById);
/* router.put('/activities/:id', updateActivity);
router.delete('/activities/:id', deleteActivity); */
router.put('/:activityId/energyOwners/:energyOwnerId', updateEnergyOwnerBlockStatus); // Actualiza la ruta
router.get('/:activityId/energy-owners/:energyOwnerId', getEnergyOwnerById); // Nueva ruta

export default router;

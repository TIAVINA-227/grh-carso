// backend/src/jobs/congesCronJob.js
import cron from 'node-cron';
import { deleteExpiredConges } from '../services/congeService.js';

/**
 * Tâche CRON : suppression automatique des congés expirés
 * Exécution : Tous les jours à minuit
 */
export const startCongesCronJob = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('🕐 Exécution du nettoyage des congés expirés...');
    try {
      await deleteExpiredConges();
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage des congés:', error);
    }
  });
  
  console.log('✅ Tâche CRON des congés démarrée (exécution quotidienne à minuit)');
};
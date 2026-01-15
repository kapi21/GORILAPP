// Database backup and restore utilities
import { db } from './database';

/**
 * Export all database data to a JSON file
 * @returns {Promise<void>}
 */
export async function exportData() {
    try {
        const data = {
            version: 1,
            exportDate: new Date().toISOString(),
            workouts: await db.workouts.toArray(),
            exercises: await db.exercises.toArray(),
            sessions: await db.sessions.toArray(),
            sets: await db.sets.toArray(),
            notes: await db.notes.toArray()
        };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `gorilapp-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { success: true, message: 'Datos exportados correctamente' };
    } catch (error) {
        console.error('Error exporting data:', error);
        return { success: false, message: 'Error al exportar datos: ' + error.message };
    }
}

/**
 * Import data from a JSON file
 * @param {File} file - The JSON file to import
 * @param {boolean} clearExisting - Whether to clear existing data before import
 * @returns {Promise<Object>}
 */
export async function importData(file, clearExisting = false) {
    try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Validate data structure
        if (!data.workouts || !data.exercises || !data.sessions || !data.sets || !data.notes) {
            throw new Error('Archivo de backup inválido');
        }

        // Clear existing data if requested
        if (clearExisting) {
            await db.workouts.clear();
            await db.exercises.clear();
            await db.sessions.clear();
            await db.sets.clear();
            await db.notes.clear();
        }

        // Import data
        await db.workouts.bulkAdd(data.workouts);
        await db.exercises.bulkAdd(data.exercises);
        await db.sessions.bulkAdd(data.sessions);
        await db.sets.bulkAdd(data.sets);
        await db.notes.bulkAdd(data.notes);

        return {
            success: true,
            message: `Datos importados correctamente (${data.sessions.length} sesiones, ${data.sets.length} series)`
        };
    } catch (error) {
        console.error('Error importing data:', error);
        return { success: false, message: 'Error al importar datos: ' + error.message };
    }
}

/**
 * Clear all database data
 * @returns {Promise<Object>}
 */
export async function clearAllData() {
    try {
        await db.workouts.clear();
        await db.exercises.clear();
        await db.sessions.clear();
        await db.sets.clear();
        await db.notes.clear();

        return { success: true, message: 'Todos los datos han sido eliminados' };
    } catch (error) {
        console.error('Error clearing data:', error);
        return { success: false, message: 'Error al eliminar datos: ' + error.message };
    }
}

/**
 * Get database statistics
 * @returns {Promise<Object>}
 */
export async function getDatabaseStats() {
    try {
        const stats = {
            workouts: await db.workouts.count(),
            exercises: await db.exercises.count(),
            sessions: await db.sessions.count(),
            sets: await db.sets.count(),
            notes: await db.notes.count()
        };

        return stats;
    } catch (error) {
        console.error('Error getting stats:', error);
        return null;
    }
}

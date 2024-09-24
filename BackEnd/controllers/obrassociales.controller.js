import { pool } from '../db.js';

export const getObrasSociales = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM obrasociales WHERE estado = \'Habilitado\'');
        if (result.length === 0) {
            return res.status(404).json({ message: 'No hay obras sociales habilitadas' });
        } else {
            res.json(result);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

export const getObraSocialById = async (req, res) => {
    try {
        const { idObraSocial } = req.body;
        const [result] = await pool.query(
            'SELECT * FROM obrasociales WHERE idObraSocial = ? AND estado = \'Habilitado\'',
            [idObraSocial]
        );
        if (result.length === 0) {
            return res.status(404).json({ message: 'Obra social no encontrada o no habilitada' });
        } else {
            res.json(result[0]);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const createObraSocial = async (req, res) => {
    const { nombre } = req.body;
    const estado = 'Habilitado'; // Definir el estado directamente

    try {
        const [result] = await pool.query(
            'INSERT INTO obrasociales (nombre, estado) VALUES (?, ?)',
            [nombre, estado]
        );

        res.json({
            idObraSocial: result.insertId,
            nombre,
            estado
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const deleteObraSocial = async (req, res) => {
    try {
        const { idObraSocial } = req.params;
        const [result] = await pool.query(
            'UPDATE obrasociales SET estado = ? WHERE idObraSocial = ?',
            ['Deshabilitado', idObraSocial]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Obra social no encontrada' });
        }

        return res.sendStatus(204);  // Solo una respuesta
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const updateObraSocial = async (req, res) => {
    try {
        const { idObraSocial } = req.params; // Obtener el idObraSocial desde los parámetros de la URL
        const { nombre } = req.body; // Obtener el nuevo nombre desde el cuerpo de la solicitud

        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }

        await pool.query(
            'UPDATE obrasociales SET nombre = ? WHERE idObraSocial = ?',
            [nombre, idObraSocial]
        );

        res.json({ message: 'Obra social actualizada con éxito' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

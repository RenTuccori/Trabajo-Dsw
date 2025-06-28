import { pool } from '../db.js';

export const getInsurances = async (req, res) => {
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

export const getInsuranceById = async (req, res) => {
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


export const createInsurance = async (req, res) => {
    const { first_name } = req.body;
    const estado = 'Habilitado'; // Definir el estado directamente

    try {
        const [result] = await pool.query(
            'INSERT INTO obrasociales (first_name, estado) VALUES (?, ?)',
            [first_name, estado]
        );

        res.json({
            idObraSocial: result.insertId,
            first_name,
            estado
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const deleteInsurance = async (req, res) => {
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


export const updateInsurance = async (req, res) => {
    try {
        const { idObraSocial } = req.params; // Obtener el idObraSocial desde los parámetros de la URL
        const { first_name } = req.body; // Obtener el nuevo first_name desde el cuerpo de la solicitud

        if (!first_name) {
            return res.status(400).json({ message: 'El first_name es requerido' });
        }

        await pool.query(
            'UPDATE obrasociales SET first_name = ? WHERE idObraSocial = ?',
            [first_name, idObraSocial]
        );

        res.json({ message: 'Obra social actualizada con éxito' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

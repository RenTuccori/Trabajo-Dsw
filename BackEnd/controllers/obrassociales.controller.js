import { pool } from '../db.js';

export const getObrasSociales = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM obrasociales');
        if (result.length === 0) {
            return res.status(404).json({ message: 'No hay obras sociales' });
        } else {
            res.json(result);
        }
    } catch (error) {
        console.log(error);
    }
};

export const getObraSocialById = async (req, res) => {
    try {
        const [idObraSocial] = req.body;
        const [result] = await pool.query('SELECT * FROM obrasociales WHERE idObraSocial = ?', [
            [idObraSocial],
        ]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Obra social no encontrada' });
        } else {
            res.json(result[0]);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createObraSocial = async (req, res) => {
    const {
        nombre
    } = req.body;
    try {
        await pool.query(
            'INSERT INTO obrasociales (nombre) VALUES (?)',
            [
                nombre
            ]
        );
        res.json({
            nombre

        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
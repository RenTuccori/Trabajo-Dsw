import { pool } from '../db.js';

export const getAdmin = async (req, res) => {
  try {
    const {usuario,contra} = req.body;
    const [result] = await pool.query(`SELECT idAdmin FROM 
        admin ad
        WHERE ad.usuario = ? and ad.contra = ?`, 
      [
      usuario, contra,
    ]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
  
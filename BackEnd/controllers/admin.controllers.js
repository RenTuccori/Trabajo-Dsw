import { pool } from '../db.js';
import jwt from "jsonwebtoken";

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
      const token = jwt.sign({ idAdmin: result[0].idAdmin}, "CLAVE_SUPER_SEGURISIMA", { expiresIn: "5m" });
      console.log('Token generado:', token);
      res.json(token);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
  
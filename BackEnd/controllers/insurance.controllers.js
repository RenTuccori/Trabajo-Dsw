import { pool } from '../db.js';

export const getInsurances = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM insurance_companies WHERE status = 'Habilitado'"
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: 'No enabled insurance companies' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getInsuranceById = async (req, res) => {
  try {
    const { insuranceCompanyId } = req.body;
    const [result] = await pool.query(
      "SELECT * FROM insurance_companies WHERE idInsuranceCompany = ? AND status = 'Habilitado'",
      [insuranceCompanyId]
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: 'Insurance company not found or not enabled' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createInsurance = async (req, res) => {
  const { name } = req.body;
  const status = 'Habilitado'; // Define status directly

  try {
    const [result] = await pool.query(
      'INSERT INTO insurance_companies (name, status) VALUES (?, ?)',
      [name, status]
    );

    res.json({
      idInsuranceCompany: result.insertId,
      name: name,
      status: status,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteInsurance = async (req, res) => {
  try {
    const { insuranceCompanyId } = req.params;
    const [result] = await pool.query(
      'UPDATE insurance_companies SET status = ? WHERE idInsuranceCompany = ?',
      ['Deshabilitado', insuranceCompanyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Insurance company not found' });
    }

    return res.sendStatus(204); // Only one response
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateInsurance = async (req, res) => {
  try {
    const { insuranceCompanyId } = req.params; // Get insuranceCompanyId from URL parameters
    const { name } = req.body; // Get new name from request body

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    await pool.query(
      'UPDATE insurance_companies SET name = ? WHERE idInsuranceCompany = ?',
      [name, insuranceCompanyId]
    );

    res.json({ message: 'Insurance company updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

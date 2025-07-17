import { pool } from '../db.js';

export const getVenues = async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM sites WHERE status = 'Habilitado'"
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'No enabled venues' });
    } else {
      res.json(result);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getVenueById = async (req, res) => {
  try {
    const { venueId } = req.params;
    const [result] = await pool.query(
      "SELECT * FROM sites WHERE idSite = ? AND status = 'Habilitado'",
      [venueId]
    );
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: 'Venue not found or not enabled' });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createVenue = async (req, res) => {
  try {
    const { name, address } = req.body;
    const status = 'Habilitado';

    // Check if a venue with the same name and enabled status already exists
    const [existingVenue] = await pool.query(
      'SELECT * FROM sites WHERE name = ? AND status = ?',
      [name, status]
    );

    if (existingVenue.length > 0) {
      // If an enabled venue with the same name already exists
      return res
        .status(400)
        .json({ message: 'An enabled venue with this name already exists.' });
    }

    // Insert new venue with enabled status
    const [result] = await pool.query(
      'INSERT INTO sites (name, address, status) VALUES (?, ?, ?)',
      [name, address, status]
    );

    res.json({
      idSite: result.insertId,
      name: name,
      address,
      status: status,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateVenue = async (req, res) => {
  const { venueId } = req.params;
  const { name, address } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE sites SET name = ?, address = ? WHERE idSite = ?',
      [name, address, venueId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json({ venueId, name, address });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteVenue = async (req, res) => {
  try {
    const { venueId } = req.params;

    // Start a transaction to ensure consistency in updates
    await pool.query('START TRANSACTION');

    // Update venue status to "Deshabilitado"
    const [resultVenue] = await pool.query(
      'UPDATE sites SET status = "Deshabilitado" WHERE idSite = ?',
      [venueId]
    );

    // If venue not found, return error
    if (resultVenue.affectedRows === 0) {
      // If venue doesn't exist, rollback transaction
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Update status of combinations in sitedoctorspecialty table to "Deshabilitado"
    const [resultCombination] = await pool.query(
      'UPDATE sitedoctorspecialty SET status = "Deshabilitado" WHERE idSite = ?',
      [venueId]
    );

    // Commit transaction if everything went well
    await pool.query('COMMIT');

    // If transaction was successful, return 204 No Content
    return res.sendStatus(204); // No content to return, but operation was successful
  } catch (error) {
    // If an error occurs, rollback transaction
    await pool.query('ROLLBACK');
    return res.status(500).json({ message: error.message });
  }
};

import * as usersService from '../services/users.service.js';

export const getUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users loaded' });
    }
    res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByNationalIdBirthDate = async (req, res) => {
  try {
    const { nationalId, birthDate } = req.body;
    const result = await usersService.authenticatePatient(nationalId, birthDate);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.token);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByNationalId = async (req, res) => {
  try {
    const { nationalId } = req.body;
    const user = await usersService.findUserByNationalId(nationalId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await usersService.createNewUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { nationalId, ...updateData } = req.body;
    const updated = await usersService.updateExistingUser(nationalId, updateData);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleted = await usersService.deleteExistingUser(req.params.nationalId);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

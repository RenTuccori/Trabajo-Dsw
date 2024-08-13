export const getPacientes = async (req, res) => {
    try {
      const [result] = await pool.query('select usu.dni,usu.nombre,usu.apellido,obra.nombre from pacientes pac inner join usuarios usu on usu.dni = pac.dni inner join obrasociales obra on obra.idObraSocial = usu.idObraSocial');
      if (result.length === 0) {
        return res.status(404).json({ message: 'No hay pacientes' });
      } else {
        res.json(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
export const getPacienteByDni = async (req, res) => {
    try {
      const [dni] = req.body;
      const [result] = await pool.query('select usu.dni,usu.nombre,usu.apellido,obra.nombre from pacientes pac inner join usuarios usu on usu.dni = pac.dni inner join obrasociales obra on obra.idObraSocial = usu.idObraSocial where usu.dni = ?', [
        [dni],
      ]);
      if (result.length === 0) {
        return res.status(404).json({ message: 'Paciente no encontrado' });
      } else {
        res.json(result[0]);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

export const createPaciente = async (req, res) => {
    const {
      idPaciente,
      dni
    } = req.body;
    try {
      await pool.query(
        'INSERT INTO pacientes (idPaciente,dni) VALUES (?,?)',
        [
          idPaciente,
          dni
          ]
      );
      res.json({
        idPaciente,
        dni
        
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
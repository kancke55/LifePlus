// controllers/pacienteController.js
const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id AS usuario_id, u.nome, u.cpf, u.data_nascimento, p.historico_clinico
      FROM Usuario u
      JOIN Paciente p ON u.id = p.usuario_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT u.id AS usuario_id, u.nome, u.cpf, u.data_nascimento, p.historico_clinico
      FROM Usuario u
      JOIN Paciente p ON u.id = p.usuario_id
      WHERE u.id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Paciente não encontrado' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { historico_clinico } = req.body;

  if (historico_clinico == null) {
    return res.status(400).json({ error: 'historico_clinico é obrigatório' });
  }

  try {
    const [result] = await db.query(
      'UPDATE Paciente SET historico_clinico = ? WHERE usuario_id = ?',
      [historico_clinico, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    res.json({ message: 'Paciente atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar paciente', detalhes: err.message });
  }
};

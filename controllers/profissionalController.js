const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id AS usuario_id, u.nome, u.cpf, u.data_nascimento, p.especialidade, p.tipo
      FROM Usuario u
      JOIN ProfissionalSaude p ON u.id = p.usuario_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar profissionais' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT u.id AS usuario_id, u.nome, u.cpf, u.data_nascimento, p.especialidade, p.tipo
      FROM Usuario u
      JOIN ProfissionalSaude p ON u.id = p.usuario_id
      WHERE u.id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Profissional não encontrado' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar profissional' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { especialidade, tipo } = req.body;

  if (!especialidade || !tipo) {
    return res.status(400).json({ error: 'especialidade e tipo são obrigatórios' });
  }

  try {
    const [result] = await db.query(
      'UPDATE ProfissionalSaude SET especialidade = ?, tipo = ? WHERE usuario_id = ?',
      [especialidade, tipo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    res.json({ message: 'Profissional atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar profissional', detalhes: err.message });
  }
};
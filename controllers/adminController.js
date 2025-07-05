const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id AS usuario_id, u.nome, u.cpf, u.data_nascimento, a.admin_id
      FROM Usuario u
      JOIN Admin a ON u.id = a.usuario_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar admins' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT u.id AS usuario_id, u.nome, u.cpf, u.data_nascimento, a.admin_id
      FROM Usuario u
      JOIN Admin a ON u.id = a.usuario_id
      WHERE u.id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Admin não encontrado' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar admin' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { admin_id } = req.body;

  if (!admin_id) {
    return res.status(400).json({ error: 'admin_id é obrigatório' });
  }

  try {
    const [result] = await db.query(
      'UPDATE Admin SET admin_id = ? WHERE usuario_id = ?',
      [admin_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin não encontrado' });
    }

    res.json({ message: 'Admin atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar admin', detalhes: err.message });
  }
};
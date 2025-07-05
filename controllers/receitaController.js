const db = require('../db');

exports.create = async (req, res) => {
  const { paciente_id, profissional_id, conteudo } = req.body;

  if (!paciente_id || !profissional_id || !conteudo) {
    return res.status(400).json({ error: 'Paciente, profissional e conteúdo são obrigatórios' });
  }

  try {
    // Verifica se o paciente existe
    const [paciente] = await db.query('SELECT * FROM Paciente WHERE usuario_id = ?', [paciente_id]);
    if (paciente.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    // Verifica se o profissional existe
    const [profissional] = await db.query('SELECT * FROM ProfissionalSaude WHERE usuario_id = ?', [profissional_id]);
    if (profissional.length === 0) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    // Cria a receita
    const [result] = await db.query(
      `INSERT INTO Receita (paciente_id, profissional_id, conteudo)
       VALUES (?, ?, ?)`,
      [paciente_id, profissional_id, conteudo]
    );

    res.status(201).json({ message: 'Receita criada com sucesso', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar receita', detalhes: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const usuario = req.usuario;

  try {
    const [rows] = await db.query(`SELECT * FROM Receita WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Receita não encontrada' });
    }

    const receita = rows[0];

    res.json(receita);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar receita', detalhes: err.message });
  }
};

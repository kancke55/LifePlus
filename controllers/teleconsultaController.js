const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Teleconsulta');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar teleconsultas' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT * FROM Teleconsulta WHERE id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Teleconsulta não encontrada' });
    }

    const teleconsulta = rows[0];


    return res.json(teleconsulta);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar teleconsulta', detalhes: err.message });
  }
};

exports.create = async (req, res) => {
  const { paciente_id, profissional_id, data_hora, link_acesso } = req.body;

  // Verificações básicas
  if (!paciente_id || !profissional_id || !data_hora || !link_acesso) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    // Verifica se o paciente existe
    const [pacienteRows] = await db.query('SELECT * FROM Paciente WHERE usuario_id = ?', [paciente_id]);
    if (pacienteRows.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    // Verifica se o profissional existe
    const [profissionalRows] = await db.query('SELECT * FROM ProfissionalSaude WHERE usuario_id = ?', [profissional_id]);
    if (profissionalRows.length === 0) {
      return res.status(404).json({ error: 'Profissional de saúde não encontrado' });
    }

    // Cria a teleconsulta
    const [result] = await db.query(`
      INSERT INTO Teleconsulta (paciente_id, profissional_id, data_hora, link_acesso)
      VALUES (?, ?, ?, ?)
    `, [paciente_id, profissional_id, data_hora, link_acesso]);

    res.status(201).json({ message: 'Teleconsulta criada com sucesso', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar teleconsulta', detalhes: err.message });
  }
};

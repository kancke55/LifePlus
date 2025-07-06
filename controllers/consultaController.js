const db = require('../db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Consulta');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT * FROM Consulta WHERE id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Consulta não encontrada' });
    }

    const consulta = rows[0];

    return res.json(consulta);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar consulta', detalhes: err.message });
  }
};

exports.create = async (req, res) => {
  const { paciente_id, profissional_id, data_consulta, status } = req.body;

  // Verificação dos campos obrigatórios
  if (!paciente_id || !profissional_id || !data_consulta) {
    return res.status(400).json({ error: 'Paciente, profissional e data da consulta são obrigatórios' });
  }

  try {
    // Verifica se o paciente existe
    const [pacienteRows] = await db.query('SELECT * FROM Paciente WHERE usuario_id = ?', [paciente_id]);
    if (pacienteRows.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    // Verifica se o profissional existe
    const [profRows] = await db.query('SELECT * FROM ProfissionalSaude WHERE usuario_id = ?', [profissional_id]);
    if (profRows.length === 0) {
      return res.status(404).json({ error: 'Profissional de saúde não encontrado' });
    }

    // Cria a consulta
    const [result] = await db.query(`
      INSERT INTO Consulta (paciente_id, profissional_id, data_consulta, status)
      VALUES (?, ?, ?, ?)
    `, [
      paciente_id,
      profissional_id,
      data_consulta,
      status || 'Agendada'
    ]);

    res.status(201).json({ message: 'Consulta agendada com sucesso', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar consulta', detalhes: err.message });
  }
};
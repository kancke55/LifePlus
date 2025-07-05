const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAll = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      'SELECT id, nome, user, role, cpf, data_nascimento FROM Usuario'
    );
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários', detalhes: err.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT id, nome, user, role, cpf, data_nascimento FROM Usuario WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário', detalhes: err.message });
  }
};

exports.register = async (req, res) => {
  const { nome, user, role, senha, cpf, data_nascimento } = req.body;

  if (!nome || !user || !role || !senha || !cpf || !data_nascimento) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (!['paciente', 'profissional', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role inválido' });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);

    const [usuarioResult] = await db.query(
      `INSERT INTO Usuario (nome, user, role, senha, cpf, data_nascimento)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, user, role, hash, cpf, data_nascimento]
    );

    const usuario_id = usuarioResult.insertId;


    if (role === 'paciente') {
      await db.query('INSERT INTO Paciente (usuario_id, historico_clinico) VALUES (?, ?)', [usuario_id, '']);
    } else if (role === 'profissional') {
      await db.query('INSERT INTO ProfissionalSaude (usuario_id, especialidade, tipo) VALUES (?, ?, ?)', [usuario_id, '', '']);
    } else if (role === 'admin') {
      await db.query('INSERT INTO Admin (usuario_id, admin_id) VALUES (?, ?)', [usuario_id, usuario_id]); // admin_id = próprio ID
    }

    res.status(201).json({ message: 'Usuário registrado com sucesso', usuario_id });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário', detalhes: err.message });
  }
};


exports.login = async (req, res) => {
  const { user, senha } = req.body;

  if (!user || !senha) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM Usuario WHERE user = ?', [user]);
    const usuario = rows[0];

    if (!usuario) return res.status(401).json({ error: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign(
      { id: usuario.id, user: usuario.user, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, role: usuario.role, nome: usuario.nome });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login', detalhes: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o usuário existe
    const [usuarios] = await db.query('SELECT * FROM Usuario WHERE id = ?', [id]);
    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const role = usuarios[0].role;


    // Remove o usuário da tabela principal
    await db.query('DELETE FROM Usuario WHERE id = ?', [id]);

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário', detalhes: err.message });
  }
};

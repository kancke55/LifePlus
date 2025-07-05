exports.isAdmin = (req, res, next) => {
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores' });
  }
  next();
};

exports.isPaciente = (req, res, next) => {
  if (req.usuario.role !== 'paciente') {
    return res.status(403).json({ error: 'Acesso permitido apenas para pacientes' });
  }
  next();
};

exports.isProfissional = (req, res, next) => {
  if (req.usuario?.role === 'paciente') {
    return res.status(403).json({ error: 'Acesso permitido apenas para administradores e profissionais de saúde' });
  }
  next();
};

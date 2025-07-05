module.exports = () => {
  return (req, res, next) => {
    const usuario = req.usuario;
    const idRequisitado = Number(req.params.id);

    if (!usuario) return res.status(401).json({ error: 'Usuário não autenticado' });

    // Admin tem acesso liberado
    if (usuario.role === 'admin') return next();

    // Paciente só acessa a si mesmo
    if (usuario.role === 'paciente' && usuario.id === idRequisitado) return next();

    // Profissional pode acessar qualquer paciente e também seu próprio registro
    if (usuario.role === 'profissional') {
      // Se está acessando um paciente (idRequisitado) ou seu próprio ID, libera
      // Aqui vamos deixar passar, mas na rota precisa garantir que está acessando dados de paciente ou dele mesmo
      return next();
    }

    return res.status(403).json({ error: 'Acesso negado' });
  };
};
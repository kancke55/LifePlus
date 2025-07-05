module.exports = () => {
  return (req, res, next) => {
    const usuario = req.usuario;
    const id = Number(req.params.id);

    if (!usuario) return res.status(401).json({ error: 'Usuário não autenticado' });

    // Admin pode tudo
    if (usuario.role === 'admin') return next();

    // Pode acessar se for ele mesmo
    if (usuario.id === id) return next();

    return res.status(403).json({ error: 'Acesso negado: só é permitido acessar seu próprio registro.' });
  };
};
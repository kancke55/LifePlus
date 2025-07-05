const express = require('express');
const app = express();
const pacienteRoutes = require('./routes/pacienteRoutes');
const profissionalRoutes = require('./routes/profissionalRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const teleconsultaRoutes = require('./routes/teleconsultaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const receitaRoutes = require('./routes/receitaRoutes');

require('dotenv').config();

app.use(express.json());

app.use('/pacientes', pacienteRoutes);
app.use('/profissionais', profissionalRoutes);
app.use('/consultas', consultaRoutes);
app.use('/teleconsultas', teleconsultaRoutes);
app.use('/admins', adminRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/receitas', receitaRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
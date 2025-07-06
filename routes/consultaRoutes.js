const express = require('express');
const router = express.Router();
const controller = require('../controllers/consultaController');
const auth = require('../moddlewares/auth');
const role = require('../moddlewares/role');
const pacienteAuth = require('../moddlewares/pacienteAuth');

router.get('/', auth.verifyToken, role.isProfissional, controller.getAll);
router.get('/:id',  auth.verifyToken, pacienteAuth(), controller.getById);
router.post('/', auth.verifyToken, role.isPaciente, controller.create);

module.exports = router;

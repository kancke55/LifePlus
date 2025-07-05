const express = require('express');
const router = express.Router();
const controller = require('../controllers/receitaController');
const auth = require('../moddlewares/auth');
const role = require('../moddlewares/role');
const pacienteAuth = require('../moddlewares/pacienteAuth');

router.post('/' , auth.verifyToken, role.isProfissional, controller.create);
router.get('/:id' , auth.verifyToken, pacienteAuth(), controller.getById);

module.exports = router;

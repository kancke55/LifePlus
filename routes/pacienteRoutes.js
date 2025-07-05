// routes/pacienteRoutes.js
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const auth = require('../moddlewares/auth');
const role = require('../moddlewares/role');
const pacienteAuth = require('../moddlewares/pacienteAuth');

router.get('/', auth.verifyToken, role.isProfissional, pacienteController.getAll);
router.get('/:id', auth.verifyToken, pacienteAuth(), pacienteController.getById);
router.put('/:id', auth.verifyToken, role.isProfissional, pacienteController.update);

module.exports = router;
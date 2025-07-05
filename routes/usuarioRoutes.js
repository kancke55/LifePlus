const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');
const auth = require('../moddlewares/auth');
const role = require('../moddlewares/role');

router.get('/', auth.verifyToken, role.isAdmin, controller.getAll);
router.get('/:id', auth.verifyToken, role.isAdmin, controller.getById);
router.post('/register', auth.verifyToken, role.isAdmin, controller.register);
router.post('/login', controller.login);
router.delete('/:id', auth.verifyToken, role.isAdmin, controller.delete);

module.exports = router;

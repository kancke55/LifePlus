const express = require('express');
const router = express.Router();
const controller = require('../controllers/profissionalController');
const auth = require('../moddlewares/auth');

const profissionalAuth = require('../moddlewares/profissionalAuth');
const role = require('../moddlewares/role');

router.get('/', auth.verifyToken, role.isAdmin, controller.getAll);
router.get('/:id', auth.verifyToken, profissionalAuth(), controller.getById);
router.put('/:id', auth.verifyToken, role.isAdmin, controller.update);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const usuariosController = require('../controllers/usuariosController');

// router.get('/', usuariosController.getUsuarios);
// router.post('/', usuariosController.createUsuario);
// router.put('/:id', usuariosController.updateUsuario);
// router.delete('/:id', usuariosController.deleteUsuario);

// module.exports = router;
// Em 'src/routes/usuarios.js' (ou o arquivo correspondente)
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models/db');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  db.query('SELECT * FROM usuarios WHERE email_usuario = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = results[0];

    res.json({
      message: 'Login bem-sucedido',
      user: {
        id_usuario: user.id_usuario,
        nome_usuario: user.nome_usuario,
        email_usuario: user.email_usuario,
      },
    });
  });
});

module.exports = router;

const { Router } = require('express');
const router = Router();
const controller = require('../controllers/controller');

// Implementacija "poti" do posameznih spletnih strani

/*Login*/
router.get('/login', controller.login_get)
router.post('/login', controller.login_post)

/*Register*/
router.get('/register', controller.register_get)
router.post('/register', controller.register_post)

/*Profile*/
router.get('/profile', controller.profile_get)
router.post('/profile', controller.profile_post)


/*Logout*/
router.get('/logout', controller.logout_get)


module.exports = router;
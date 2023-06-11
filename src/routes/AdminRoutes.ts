import {AdminController} from '../controllers/AdminController'
import {Router} from "express"
import { body,query } from 'express-validator';

const adminRouter = Router();

const adminController = new AdminController();


adminRouter.post("/api/admin", [
body('id_usuario').notEmpty().isString().withMessage('O campo id_usuario é obrigatório!'),
body('nome').notEmpty().isString().withMessage('O campo nome é obrigatório!'),
body('nivel').notEmpty().isString().withMessage('O campo nivel é obrigatório!'),
body('endereco').notEmpty().isString().isEmail().withMessage('O campo endereco é obrigatório e deve ser um e-mail válido!')
,body('telefone').notEmpty().isString().isEmail().withMessage('O campo telefone é obrigatório e deve ser um e-mail válido!')
],
adminController.create);

adminRouter.get("/api/admins", adminController.findAll);

adminRouter.get("/api/admin/:id", [
    query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],adminController.findById);

export { adminRouter };
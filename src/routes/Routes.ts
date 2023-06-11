import {Request , Response, Router, ErrorRequestHandler, NextFunction} from 'express'
import axios,{AxiosRequestConfig} from 'axios'

import { body,query, validationResult } from 'express-validator';

const routes = Router();

import {UsuarioController} from '../controllers/UsuarioController'
import {DepositoController} from '../controllers/DepositoController'
import {LevantamentoController} from '../controllers/LevantamentoController';
import {TimesController} from '../controllers/TimesController'
import {ensuredAuthenticated} from 'src/middlewares/usuarioMiddleware';
import { generateRandomString } from 'src/utils/GerarChavesFortes';
import { adminRouter } from './AdminRoutes';




routes.get('/',async (request: Request, response: Response)=>{
    return response.status(200).json({
        message:"sucesso"
    })
});

routes.get('/teste',async (request: Request, response: Response)=>{
    return response.status(200).json({
        message:"sucesso Teste"
    })
});
routes.get('/gerarChave',async (request: Request, response: Response)=>{

    return response.status(200).json({
        status : 'OK Gerar string para SECRET_JWT',
        message: generateRandomString(32)
    })
});

//API Externa
const APIkey = String(process.env.EXTERNAL_API_KEY);
const API_PATH = String(process.env.API_MAIN_PATH);

routes.get('/api/paises',async (request: Request, response: Response)=>{
    try {
        const requestOptions: AxiosRequestConfig = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        };
    
        const result = await axios.get(`${API_PATH}/?action=get_countries&APIkey=${APIkey}`, requestOptions);
        const data = result.data;
        return response.status(200).json(data);
      } catch (error) {
        return response.status(500).json(error);
      }
    
});

routes.get('/api/pais/:id',[
  query('id').notEmpty().withMessage('O parametro id é obrigatório!')
],async (request: Request, response: Response)=>{
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
  }
    const ID = request.params.id.trim();
    try {
        const requestOptions: AxiosRequestConfig = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        };
    
        const result = await axios.get(`${API_PATH}/?action=get_leagues&country_id=${ID}&APIkey=${APIkey}`, requestOptions);
        const data = result.data;
        return response.status(200).json(data);
      } catch (error) {
        return response.status(500).json(error);
      }
  
});

routes.get('/api/ligas/pais/:id',[
  query('id').notEmpty().withMessage('O parametro id é obrigatório!')
],async (request: Request, response: Response)=>{
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
  }
    const ID = request.params.id.trim();
    try {
        const requestOptions: AxiosRequestConfig = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        };
    
        const result = await axios.get(`${API_PATH}/?action=get_leagues&country_id=${ID}&APIkey=${APIkey}`, requestOptions);
        const data = result.data;
        return response.status(200).json(data);
      } catch (error) {
        return response.status(500).json(error);
      }
});

routes.get('/api/ligas',async (request: Request, response: Response)=>{
    try {
        const requestOptions: AxiosRequestConfig = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        };
    
        const result = await axios.get(`${API_PATH}/?action=get_leagues&APIkey=${APIkey}`, requestOptions);
        const data = result.data;
        return response.status(200).json(data);
      } catch (error) {
        return response.status(500).json(error);
      }

});



routes.get('/api/jogos/:id/:data',[
  query('id').notEmpty().withMessage('O parametro id é obrigatório!'),
  query('data').notEmpty().withMessage('O parametro data é obrigatório!')
],async (request: Request, response: Response)=>{
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
  }
  const ID = request.params.id.trim();
  const DATA = request.params.data.trim();


  try {
      const requestOptions: AxiosRequestConfig = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      };
  
      const result = await axios.get(`${API_PATH}/?action=get_events&${DATA}&league_id=${ID}&APIkey=${APIkey}`, requestOptions);
      const data = result.data;
      return response.status(200).json(data);
    } catch (error) {
      return response.status(500).json(error);
    }
});



//------------------- API Interna

//USUARIO
routes.post('/api/usuario',[ //telefone, senha, moeda, email
    body('telefone').notEmpty().isString().withMessage('O campo telefone é obrigatório!'),
    body('senha').notEmpty().isString().withMessage('O campo senha é obrigatório!'),
    body('moeda').notEmpty().isString().withMessage('O campo moeda é obrigatório!'),
    body('email').notEmpty().isString().isEmail().withMessage('O campo email é obrigatório e deve ser um e-mail válido!')
],
 //ensuredAuthenticated(), 
new UsuarioController().create);
routes.get('/api/usuarios', new UsuarioController().findAll);
routes.get('/api/usuario/:id', 
[
    query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],
new UsuarioController().findById);
routes.put('/api/usuario/:senha', [
  query('senha').notEmpty().isString().withMessage('O parametro id é obrigatório!'),
],
ensuredAuthenticated , new UsuarioController().updateBySenha);


routes.delete('/api/usuario/:id', [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],new UsuarioController().deleteById);

routes.put('/api/usuario/:id', [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],
new UsuarioController().update);

// Redefinir a senha SMS
routes.post('/api/redefinir-senha/telefone', new UsuarioController().recuperarSenhaBySMS); //recebe o telefone e envia a sms e guarda o código na BD
routes.post('/api/redefinir-senha/codigo', new UsuarioController().verificarCodigoEnviado); //recebe o codigo e verifica ele
routes.post('/api/redefinir-senha/actualizar', new UsuarioController().redefinirSenhaSMS); //recebe o codigo e a nova senha para actualizar na BD
// Redefinir a senha por E-MAIL
routes.post('/api/redefinir-senha/email', new UsuarioController().recuperarSenhaByEMAIL); //recebe um email e envia um e-mail para ele
routes.get('/api/redefinir-senha/:token', new UsuarioController().verificarTokenByEMAIL); //verifica a autenticidade do token
routes.post('/api/redefinir-senha/actualizar', new UsuarioController().redefinirSenhaEmail); //actualiza a senha


//Login
routes.post('/api/login', new UsuarioController().login);

//Deposito
routes.post('/api/deposito', new DepositoController().create);
routes.get('/api/depositos', new DepositoController().findAll);
routes.get('/api/deposito/:id',[
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
], new DepositoController().findById);
routes.delete('/api/deposito/:id', [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],new DepositoController().deleteById);
routes.put('/api/deposito/:id', [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],new DepositoController().update);


//Levantamento
routes.post('/api/levantamento', new LevantamentoController().create);
routes.get('/api/levantamentos', new LevantamentoController().findAll);
routes.get('/api/levantamento/:id', [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],new LevantamentoController().findById);
routes.delete('/api/levantamento/:id', [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],new LevantamentoController().deleteById);
routes.put('/api/levantamento/:id', [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
  body('valor').notEmpty().isString().withMessage('O campo valor é obrigatório!'),
  body('idUsuario').notEmpty().isString().withMessage('O campo valor é obrigatório!'),
],new LevantamentoController().update);


//Times
routes.post('/api/times', new TimesController().create);
routes.get('/api/times', new TimesController().findAll);
routes.get('/api/times/:id', [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],
 new TimesController().findById);
routes.delete('/api/times/:id',  [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],new TimesController().deleteById);
routes.put('/api/times/:id',  [
  query('id').notEmpty().isInt().withMessage('O parametro id é obrigatório!'),
],new TimesController().update);

//Add ficheiros de rotas

routes.use(adminRouter);

// Rota padrão para lidar com rotas não existentes
routes.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error('Rota não encontrada');
  error.status = 404;
  next(error);
});

// Middleware de tratamento de erro
routes.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
  });
});

export { routes };
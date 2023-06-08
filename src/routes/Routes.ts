import {Request , Response, Router} from 'express'
import axios,{AxiosRequestConfig} from 'axios'

import { body,query } from 'express-validator';

const routes = Router();

import {UsuarioController} from '../controllers/UsuarioController'
import {DepositoController} from '../controllers/DepositoController'
import {LevantamentoController} from '../controllers/LevantamentoController';
import {TimesController} from '../controllers/TimesController'
import {ensuredAuthenticated} from 'src/middlewares/usuarioMiddleware';
import { generateRandomString } from 'src/utils/GerarChavesFortes';

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

routes.get('/api/pais/:id',async (request: Request, response: Response)=>{
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

routes.get('/api/ligas/pais/:id',async (request: Request, response: Response)=>{
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



routes.get('/api/jogos/:id/:data',async (request: Request, response: Response)=>{
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
<<<<<<< HEAD
routes.post('/api/usuario', new UsuarioController().create); //ensuredAuthenticated(), 
routes.get('/api/usuarios', new UsuarioController().findAll);
routes.get('/api/usuario/:id', new UsuarioController().findById);
routes.put('/api/usuario/:senha', ensuredAuthenticated, new UsuarioController().updateBySenha);
=======
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
routes.put('/api/usuario/:senha', ensuredAuthenticated , new UsuarioController().updateBySenha);
>>>>>>> main

routes.delete('/api/usuario/:id', new UsuarioController().deleteById);
routes.put('/api/usuario/:id', new UsuarioController().update);

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
routes.get('/api/deposito/:id', new DepositoController().findById);
routes.delete('/api/deposito/:id', new DepositoController().deleteById);
routes.put('/api/deposito/:id', new DepositoController().update);


//Levantamento
routes.post('/api/levantamento', new LevantamentoController().create);
routes.get('/api/levantamentos', new LevantamentoController().findAll);
routes.get('/api/levantamento/:id', new LevantamentoController().findById);
routes.delete('/api/levantamento/:id', new LevantamentoController().deleteById);
routes.put('/api/levantamento/:id', new LevantamentoController().update);

//Times
routes.post('/api/times', new TimesController().create);
routes.get('/api/times', new TimesController().findAll);
routes.get('/api/times/:id', new TimesController().findById);
routes.delete('/api/times/:id', new TimesController().deleteById);
routes.put('/api/times/:id', new TimesController().update);

export { routes };
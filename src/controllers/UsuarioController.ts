import {Request , Response, NextFunction} from 'express'
import { prismaClient } from '../database/prismaClient';
import { gerarToken, verificarToken } from 'src/utils/GerarToken';
import {compare, hash} from 'bcryptjs';
import { sign , verify} from "jsonwebtoken";
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import transporter from 'src/utils/GmailConnexion';

const client = twilio(
    String(process.env.TWILIO_ACCOUNT_SID), // SID da sua conta Twilio
    String(process.env.TWILIO_AUTH_TOKEN), // Token de autenticação da sua conta Twilio
);

export class UsuarioController{

    async create(request: Request, response: Response){
        const {
            telefone, senha, moeda, email
        } = request.body;
        
        try {
            /*const dados = await prismaClient.usuario.findFirstOrThrow({
                where:{
                    telefone : telefone.trim(),
                    email : email.trim()
                }
            })
            if (dados) {
                return response.status(400).json(new Error("BAD REQUEST : Invalid datas!").message);
            }*/
            const passwordHash = await hash(senha.trim(), 10);
            const service = await prismaClient.usuario.create({
                data:{
                    telefone : telefone.trim(),
                    email : email.trim(),
                    senha : passwordHash, 
                    moeda_padrao : moeda.trim()
                }
            })
            return response.status(201).json(service);
        } catch (error) {
            if(error instanceof Error){
                console.log(error)
                return response.status(500).json(error.message);
            }

        } finally{
            await prismaClient.$disconnect();          
        }     
    }

    async login(request: Request, response: Response){
    
        const {
            senha,telefone
        } = request.body;
        try {
            const dados = await prismaClient.usuario.findFirstOrThrow({
                where:{
                    telefone:telefone.trim()
                }
            })
            if (!dados) {
                return response.status(404).json(new Error("NOT FOUND : PHONE NUMBER!").message);
            }
            const passwordMatch = await compare(senha.trim(), String(dados.senha));
            
            if (!passwordMatch) {
                return response.status(400).json(new Error("BAD REQUEST : PASSWORD IS WRONG!").message);
            }
          
            const token = gerarToken(dados.id);

            return response.status(200).json({'JWToken': token });
        } catch (error) {
            return error;
        } finally{
            await prismaClient.$disconnect();
        }
        
    }

    async updateBySenha(request: Request, response: Response){
        const {
            senha, email 
        } = request.body;
        const id = Number(request.params.id.trim());
        try {
            
            let usuario = await prismaClient.usuario.findFirst({
                where:{ //verificar se existe um usuario com o este id
                    id
                }}
            );
            if(!usuario){
                return response.status(404).json(new Error("ERRO: NOT FOUND : Usuário!").message);
            }
            else{
                const passwordMatch = await compare(senha.trim(), String(usuario.senha));
            
                if (passwordMatch) {
                    return response.status(400).json(new Error("BAD REQUEST : PASSWORD IS THE SAME!").message);
                }
                const service = await prismaClient.usuario.update({
                    where:{
                        id
                    },
                    data:{
                        senha:String(senha).trim()
                    }
                })
                
                return response.status(200).json(service);
            }
        } catch (error) {
            if(error instanceof Error){
                return response.status(500).json(error.message);
            }
        } finally{
            await prismaClient.$disconnect();
                      
        }
            
    }

    async findAll(request: Request, response: Response){
        const usuario = await prismaClient.usuario.findMany();
        if(usuario instanceof Error){
            return response.status(500).json(usuario.message);
        }
        response.status(200).json(usuario);
    }

    async findById(request: Request, response: Response){
        const id = Number(request.params.id.trim())
        const usuario = await prismaClient.usuario.findFirst({
            where:{
                id
            }
        });
        if(usuario instanceof Error){
            return response.status(500).json(usuario.message);
        }
        response.status(200).json(usuario);
    }

    async deleteById(request: Request, response: Response){
        const id = Number (request.params.id);
        const usuario = await prismaClient.usuario.delete({
            where:{
                id
            }
        });
        try {
            return response.status(200).json(usuario);
        } catch (error) {
            if(error instanceof Error){
                return response.status(500).json(error.message);
            }
        }finally{
            await prismaClient.$disconnect();
                      
        }
    }

    async update(request: Request, response: Response){
        const {
            nome, pais, iban
        } = request.body;
        const id = Number(request.params.id.trim());
        try {
            let usuario = await prismaClient.usuario.findFirst({
                where:{ //verificar se existe um usuario com o este id
                    id
                }}
            );
            if(!usuario){
                return response.status(404).json(new Error("ERRO: NOT FOUND : Usuário!").message);
            }
            else{
                
                const service = await prismaClient.usuario.update({
                    where:{
                        id
                    },
                    data:{
                        nome:String(nome).trim(), 
                        pais:String(pais).trim(),
                        iban:String(iban).trim()
                    }
                })
                
                return response.status(200).json(service);
            }
        } catch (error) {
            if(error instanceof Error){
                return response.status(500).json(error.message);
            }
        } finally{
            await prismaClient.$disconnect();
                      
        }
            
    }

  // Rota para solicitar a recuperação de senha por SMS
  async recuperarSenhaBySMS (req: Request, res: Response){
    const { phoneNumber } = req.body;
  
    // Verificar se o número de telefone está registrado
    const user = await prismaClient.usuario.findFirst({ where: { telefone:phoneNumber.trim() } });
    if (!user) {
      return res.status(404).json({ message: 'Número de telefone não encontrado' });
    }
    console.log(user.toString())
    // Gerar código de verificação de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
  
    // Enviar o código de verificação via SMS
    client.messages
      .create({
        body: `Seu código de verificação: ${verificationCode}`,
        from: '+12543183081',
        to: phoneNumber,
      })
      .then(async (message) => {
        console.log('SMS enviado:', message.sid);
        const result = await prismaClient.usuario.update({ where: {id:user.id },data:{codigo_sms : String(verificationCode)} });
        res.status(200).json({ message: 'SMS enviado com sucesso' });
      })
      .catch((error) => {
        console.error('Erro ao enviar SMS:', error);
        res.status(500).json({ message: 'Erro ao enviar SMS' });
      });
  };

  // Rota para solicitar a recuperação de senha por e-mail
  async recuperarSenhaByEMAIL(req: Request, res: Response){
    const { email } = req.body;
  
    // Verificar se o e-mail está registrado
    const user = await prismaClient.usuario.findFirst({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'E-mail não encontrado' });
    }
  
    // Gerar token de redefinição de senha com expiração de 1 hora
    const token = sign({ userId: user.id },  String(process.env.SECRET_JWT), { expiresIn: '1h' });
  
    // Enviar e-mail com o link de redefinição de senha
    const resetLink = `https://seusite.com/redefinir-senha?token=${token}`;
    const mailOptions = {
      from: 'seuemail@dominio.com',
      to: email,
      subject: 'Redefinição de Senha',
      text: `Clique no link a seguir para redefinir sua senha: ${resetLink}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).json({ message: 'Erro ao enviar e-mail' });
      }
      console.log('E-mail enviado:', info.response);
      res.json({ message: 'E-mail enviado com sucesso' });
    });
  };


  private async atualizarSenhaByUser(id_usuario: number, novaSenha:string , novoCodigo?: string){
    try {
        const codigo = novoCodigo || '';
        // Atualizar a senha do usuário
        const hashedPassword = await hash(novaSenha, 10);
        await prismaClient.usuario.update({
            where: { id: id_usuario },
            data: { senha: hashedPassword, codigo_sms:codigo },
        });
        return 'Senha redefinida com sucesso';
    } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        return 'Erro ao redefinir a senha';
    }
    
  }

  // Rota para redefinir a senha após confirmação por e-mail
    async redefinirSenhaEmail (req: Request, res: Response){
        const novaSenha  = req.body.novaSenha;
        const token = req.params.token;
    
        try {
        // Verificar e decodificar o token
        const decodedToken = verify(token,  String(process.env.SECRET_JWT)) as { userId: number };
    
        // Verificar se o usuário existe
        const user = await prismaClient.usuario.findUnique({ where: { id: decodedToken.userId } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' });
        }
    
        const message = this.atualizarSenhaByUser(decodedToken.userId,novaSenha.trim() );
        res.status(200).json({ message: message });
        } catch (error) {
            console.error('Erro ao redefinir a senha:', error);
            res.status(500).json({ message: 'Erro ao redefinir a senha' });
        }
    };

  // Rota para redefinir a senha após confirmação por SMS
  async redefinirSenhaSMS (req: Request, res: Response){
    const { codigo, novaSenha } = req.body;
    try {
    // Verificar se o usuário existe
    const user = await prismaClient.usuario.findFirst({ where: { codigo_sms: codigo.trim() } });
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }
    const message = this.atualizarSenhaByUser(user.id,novaSenha.trim(),codigo.trim() );
    
    res.status(200).json({ message: message });
    } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        res.status(500).json({ message: 'Erro ao redefinir a senha' });
    }
};
  
}
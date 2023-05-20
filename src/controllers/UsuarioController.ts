import {Request , Response, NextFunction} from 'express'
import { prismaClient } from '../database/prismaClient';
import { gerarToken, verificarToken } from 'src/utils/GerarToken';
import {compare, hash} from 'bcryptjs';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

export class UsuarioController{

    async create(request: Request, response: Response){
        const {
            telefone, senha, moeda, email
        } = request.body;
        
        try {
            const dados = await prismaClient.usuario.findFirstOrThrow({
                where:{
                    telefone : telefone.trim(),
                    email : email.trim()
                }
            })
            if (!dados) {
                return response.status(400).json(new Error("BAD REQUEST : Invalid datas!").message);
            }
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

}
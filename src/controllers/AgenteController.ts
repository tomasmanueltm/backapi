import {Request , Response, NextFunction} from 'express'
import { prismaClient } from '../database/prismaClient';
import { gerarToken, verificarToken } from 'src/utils/GerarToken';
import {compare, hash} from 'bcryptjs';
import { sign , verify} from "jsonwebtoken";
import twilio from 'twilio';
import transporter from 'src/utils/GmailConnexion';
import { validationResult } from 'express-validator';

const API_DEFAULT_ROUTE = String(process.env.API_DEFAULT_ROUTE);

const client = twilio(
    String(process.env.TWILIO_ACCOUNT_SID), // SID da sua conta Twilio
    String(process.env.TWILIO_AUTH_TOKEN), // Token de autenticação da sua conta Twilio
);

export class UsuarioController{

    async create(request: Request, response: Response){
        const {
            nome,
            email,
            data_nasc,
            pais ,
            moeda ,
            telefone   ,
            endereco,
        } = request.body;
        
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }
            
            const service = await prismaClient.agente.create({
                data:{
                    nome : nome.trim(),
                    email: email.trim(),
                    data_nasc: data_nasc.trim(),
                    pais: pais.trim() ,
                    moeda: moeda.trim() ,
                    telefone: telefone.trim()   ,
                    endereco : endereco.trim(),
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

    async findAll(request: Request, response: Response){
        const agente = await prismaClient.agente.findMany();
        if(agente instanceof Error){
            return response.status(500).json(agente.message);
        }
        response.status(200).json(agente);
    }

    async findById(request: Request, response: Response){
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const id = Number(request.params.id.trim())
        const agente = await prismaClient.agente.findFirst({
            where:{
                id
            }
        });
        if(agente instanceof Error){
            return response.status(500).json(agente.message);
        }
        response.status(200).json(agente);
    }

  
}
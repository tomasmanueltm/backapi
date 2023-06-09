import {Request , Response, NextFunction} from 'express'
import { prismaClient } from '../database/prismaClient';
import { validationResult } from 'express-validator';

export class AgenteController{

    async create(request: Request, response: Response){
        const {
            nome,
            numero,
            email ,
            nivel ,
            iban   ,
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
                    endereco : endereco.trim(),
                    numero: numero.trim(),
                    nivel : nivel.trim(),
                    iban  : iban.trim() ,
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
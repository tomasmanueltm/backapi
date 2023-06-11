import {Request , Response, NextFunction} from 'express'
import { prismaClient } from '../database/prismaClient';
import { validationResult } from 'express-validator';

export class AdminController{

    async create(request: Request, response: Response){
        const {
            id_usuario,
            nome,
            nivel,
            endereco,
            telefone
        } = request.body;
        
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }
            
            const service = await prismaClient.admin.create({
                data:{
                    id_usuario: id_usuario.trim(),
                    nome: nome.trim(),
                    nivel: nivel.trim(),
                    endereco: endereco.trim(),
                    telefone: telefone.trim()
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
        const agente = await prismaClient.admin.findMany();
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
        const agente = await prismaClient.admin.findFirst({
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
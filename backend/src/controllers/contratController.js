// backend/src/controllers/contratController.js
import * as contratService from '../services/contratService.js';

export const createContrat = async (req, res) => { 
    try {
            const c = await contratService.createContrat(req.body);
            res.status(201).json(c);
        } catch(err){
            console.error(err);
            res.status(500).json({message:err.message});
        }};

export const getAllContrats = async (req, res) => { 
    try { 
        const list = await contratService.getAllContrats(); 
        res.json(list);
    } catch(err){
        console.error(err);
        res.status(500).json({message:err.message});
    }};

export const getContratById = async (req, res) => { 
    try { 
        const c = await contratService.getContratById(req.params.id); 
        if(!c) return res.status(404).json({message:'Contrat non trouvé'}); 
        res.json(c);
    } catch(err){
        console.error(err);
        res.status(500).json({message:err.message});
    }};

export const updateContrat = async (req, res) => { 
    try { 
        const c = await contratService.updateContrat(req.params.id, req.body); 
        res.json(c);
    } catch(err){
        console.error(err);
        res.status(500).json({message:err.message});
    }};

export const deleteContrat = async (req, res) => { 
    try{ 
        await contratService.deleteContrat(req.params.id);
        res.json({message:'Supprimé'});
    }catch(err){
        console.error(err);
        res.status(500).json({message:err.message});
    }};

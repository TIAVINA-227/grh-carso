import * as absenceService from '../services/absenceService.js';
export const createAbsence = async (req,res)=>{
    try{
        const a=await absenceService.createAbsence(req.body);
        res.status(201).json(a);
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};

export const getAllAbsences = async (req,res)=>{
    try{
        const l=await absenceService.getAllAbsences();
        res.json(l);
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};

export const getAbsenceById = async (req,res)=>{
    try{
        const a=await absenceService.getAbsenceById(req.params.id);
        if(!a) return res.status(404).json({message:'Absence non trouvée'});
        res.json(a);
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};

export const updateAbsence = async (req,res)=>{
    try{
        const a=await absenceService.updateAbsence(req.params.id, req.body);
        res.json(a);
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};

export const deleteAbsence = async (req,res)=>{
    try{
        await absenceService.deleteAbsence(req.params.id);
        res.json({message:'Supprimé'});
    }catch(e){
        console.error(e);
        res.status(500).json({message:e.message});
    }};

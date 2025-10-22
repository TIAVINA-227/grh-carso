import * as perfService from '../services/performanceService.js';
export const createPerformance = async (req,res)=>{try{const p=await perfService.createPerformance(req.body);res.status(201).json(p);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const getAllPerformances = async (req,res)=>{try{const l=await perfService.getAllPerformances();res.json(l);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const getPerformanceById = async (req,res)=>{try{const p=await perfService.getPerformanceById(req.params.id);if(!p)return res.status(404).json({message:'Non trouvé'});res.json(p);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const updatePerformance = async (req,res)=>{try{const p=await perfService.updatePerformance(req.params.id, req.body);res.json(p);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const deletePerformance = async (req,res)=>{try{await perfService.deletePerformance(req.params.id);res.json({message:'Supprimé'});}catch(e){console.error(e);res.status(500).json({message:e.message});}};

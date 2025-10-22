import * as paiementService from '../services/paiementService.js';
export const createPaiement = async (req,res)=>{try{const p=await paiementService.createPaiement(req.body);res.status(201).json(p);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const getAllPaiements = async (req,res)=>{try{const l=await paiementService.getAllPaiements();res.json(l);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const getPaiementById = async (req,res)=>{try{const p=await paiementService.getPaiementById(req.params.id);if(!p)return res.status(404).json({message:'Non trouvé'});res.json(p);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const updatePaiement = async (req,res)=>{try{const p=await paiementService.updatePaiement(req.params.id, req.body);res.json(p);}catch(e){console.error(e);res.status(500).json({message:e.message});}};
export const deletePaiement = async (req,res)=>{try{await paiementService.deletePaiement(req.params.id);res.json({message:'Supprimé'});}catch(e){console.error(e);res.status(500).json({message:e.message});}};

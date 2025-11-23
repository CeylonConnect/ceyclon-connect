import { Dispute } from "../models/disputeModel.js";

export const createDispute = async (req, res) => {
  try {
    const dispute = await Dispute.create(req.body);
    res.status(201).json(dispute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDisputeById = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ error: "Dispute not found" });
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.getAll(req.query);
    res.json(disputes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDispute = async (req, res) => {
  try {
    const dispute = await Dispute.update(req.params.id, req.body);
    res.json({
      message: "Message Update Successfully",
      dispute: dispute,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDispute = async (req, res) => {
  try {
    const dispute = await Dispute.delete(req.params.id);

    if (!dispute) {
      return res.status(404).json({ error: "Dispute not found" });
    }

    res.json({ message: "Dispute deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

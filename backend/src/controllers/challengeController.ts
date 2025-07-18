import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import Challenge from "../models/Challenege";

export const createChallenge = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { title, description, prize } = req.body;

    const challenge = await Challenge.create({
      title,
      description,
      prize,
      createdBy: req.userId,
    });
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: "Failed to create challenge" });
  }
};

export const getAllChallenges = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const allChallenges = await Challenge.find();
    res.status(200).json(allChallenges);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challenges" });
  }
};

export const getSingleChallenge = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const challenege = await Challenge.findById(req.params.id);
    res.status(200).json(challenege);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challenges" });
  }
};

import { Request, Response } from 'express';
import Claim from '../models/Claim';
import Item from '../models/Item';
import Notification from '../models/Notification';

export const createClaim = async (req: any, res: Response) => {
  const { item: itemId, description, proofImages } = req.body;

  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const claim = await Claim.create({
    item: itemId,
    claimer: req.user.id,
    description,
    proofImages,
  });

  // Notify the owner of the item
  await Notification.create({
    user: item.owner,
    title: 'New Claim Received',
    message: `Someone has filed a claim for your item: ${item.name}`,
    type: 'claim',
  });

  res.status(201).json(claim);
};

export const getClaims = async (req: any, res: Response) => {
  // Admins can see all claims, users see claims they've made or claims on their items
  let query: any = {};
  if (req.user.role !== 'admin') {
    // This is a bit simplified; real logic would involve finding items owned by user first
    query = { claimer: req.user.id };
  }

  const claims = await Claim.find(query)
    .populate('item', 'name type status')
    .populate('claimer', 'name email');
  res.json(claims);
};

export const getClaimById = async (req: any, res: Response) => {
  const claim = await Claim.findById(req.params.id)
    .populate('item')
    .populate('claimer', 'name email phone rollNumber');

  if (claim) {
    // Check authorization
    // @ts-ignore
    if (claim.claimer._id.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }
    res.json(claim);
  } else {
    res.status(404);
    throw new Error('Claim not found');
  }
};

export const updateClaimStatus = async (req: any, res: Response) => {
  const { status } = req.body;
  const claim = await Claim.findById(req.params.id).populate('item');

  if (claim) {
    if (req.user.role !== 'admin') {
      // In a real app, the item owner could also approve/reject
      res.status(401);
      throw new Error('Only admins can update claim status currently');
    }

    claim.status = status;
    await claim.save();

    // Notify the claimer
    await Notification.create({
      user: claim.claimer,
      title: 'Claim Status Updated',
      message: `Your claim for ${
        // @ts-ignore
        claim.item.name
      } has been ${status}`,
      type: 'claim',
    });

    // If approved, update item status
    if (status === 'approved') {
      // @ts-ignore
      await Item.findByIdAndUpdate(claim.item._id, { status: 'claimed' });
    }

    res.json(claim);
  } else {
    res.status(404);
    throw new Error('Claim not found');
  }
};

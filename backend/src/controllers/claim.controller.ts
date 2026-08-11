import { Response } from 'express';
import Claim from '../models/Claim';
import Item from '../models/Item';
import Notification from '../models/Notification';
import Message from '../models/Message';

export const createClaim = async (req: any, res: Response) => {
  try {
    const { item: itemId, description, proofImages } = req.body;

    if (!itemId || !description) {
      return res.status(400).json({ message: 'Please provide item ID and proof description' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const claim = await Claim.create({
      item: itemId,
      claimer: req.user.id,
      description,
      proofImages: Array.isArray(proofImages) ? proofImages : [],
    });

    // Notify the owner of the item
    await Notification.create({
      user: item.owner,
      title: 'New Ownership Claim Filed 🔍',
      message: `Someone has filed an ownership claim for your item "${item.name}". Admin review pending.`,
      type: 'claim',
    });

    return res.status(201).json(claim);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to submit claim' });
  }
};

export const getClaims = async (req: any, res: Response) => {
  try {
    const { status, itemId, claimerId, search } = req.query;
    let query: any = {};

    if (req.user.role !== 'admin') {
      query = { claimer: req.user.id };
    }

    if (status) query.status = status;
    if (itemId) query.item = itemId;
    if (claimerId && req.user.role === 'admin') query.claimer = claimerId;

    if (search && req.user.role === 'admin') {
      query.description = { $regex: String(search), $options: 'i' };
    }

    const claims = await Claim.find(query)
      .sort({ createdAt: -1 })
      .populate('item', 'name type category status location images owner')
      .populate('claimer', 'name email phone rollNumber');

    return res.json(claims);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch claims' });
  }
};

export const getClaimById = async (req: any, res: Response) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('item')
      .populate('claimer', 'name email phone rollNumber');

    if (claim) {
      if (
        (claim.claimer as any)._id.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(401).json({ message: 'Not authorized to view this claim' });
      }
      return res.json(claim);
    } else {
      return res.status(404).json({ message: 'Claim not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error fetching claim' });
  }
};

export const updateClaimStatus = async (req: any, res: Response) => {
  try {
    const { status, adminNotes } = req.body;
    const claim = await Claim.findById(req.params.id).populate('item');

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Only admins can update claim status' });
    }

    claim.status = status;
    await claim.save();

    const item = claim.item as any;

    // Notify the claimer
    await Notification.create({
      user: claim.claimer,
      title: `Claim ${status.toUpperCase()}!`,
      message: `Your claim for item "${item.name}" has been ${status}. ${adminNotes || ''}`,
      type: 'claim',
    });

    // If approved, update item status and create initial message room connection
    if (status === 'approved') {
      await Item.findByIdAndUpdate(item._id, { status: 'claimed' });

      // Create welcome system message for claimer & owner chat room
      await Message.create({
        sender: req.user.id,
        receiver: claim.claimer,
        item: item._id,
        content: `🎉 Claim approved by Admin! The claimer and owner can now securely coordinate returning the item "${item.name}".`,
      });
    }

    return res.json(claim);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to update claim status' });
  }
};

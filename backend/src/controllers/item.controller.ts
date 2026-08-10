import { Request, Response } from 'express';
import Item from '../models/Item';

export const createItem = async (req: any, res: Response) => {
  const {
    type,
    name,
    category,
    description,
    brand,
    color,
    date,
    time,
    location,
    images,
    reward,
    additionalNotes,
    currentHolder,
    canDeliver,
  } = req.body;

  const item = await Item.create({
    type,
    name,
    category,
    description,
    brand,
    color,
    date,
    time,
    location,
    images,
    owner: req.user.id,
    reward,
    additionalNotes,
    currentHolder,
    canDeliver,
  });

  if (item) {
    res.status(201).json(item);
  } else {
    res.status(400);
    throw new Error('Invalid item data');
  }
};

export const getItems = async (req: Request, res: Response) => {
  const { type, category, status, search } = req.query;

  const query: any = {};

  if (type) query.type = type;
  if (category) query.category = category;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  const items = await Item.find(query).sort({ createdAt: -1 }).populate('owner', 'name email');
  res.json(items);
};

export const getItemById = async (req: Request, res: Response) => {
  const item = await Item.findById(req.params.id).populate('owner', 'name email phone');

  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
};

export const updateItem = async (req: any, res: Response) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    if (item.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this item');
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
};

export const deleteItem = async (req: any, res: Response) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    if (item.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this item');
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
};

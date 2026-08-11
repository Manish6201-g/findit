import { Request, Response } from 'express';
import Item from '../models/Item';

export const createItem = async (req: any, res: Response) => {
  try {
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

    if (!type || !name || !category || !description || !location || !date) {
      return res.status(400).json({ message: 'Please fill in all required fields (type, name, category, description, location, date)' });
    }

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
      images: Array.isArray(images) ? images : [],
      owner: req.user.id,
      reward,
      additionalNotes,
      currentHolder,
      canDeliver,
    });

    return res.status(201).json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to create item' });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
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
    return res.json(items);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to fetch items' });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name email phone');

    if (item) {
      return res.json(item);
    } else {
      return res.status(404).json({ message: 'Item not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Error retrieving item details' });
  }
};

export const updateItem = async (req: any, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this item' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(updatedItem);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to update item' });
  }
};

export const deleteItem = async (req: any, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    return res.json({ message: 'Item removed successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Failed to delete item' });
  }
};

import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import Contact from '../../server/models/Contact';
import Employee from '../../server/models/Employee';
import GalleryItem from '../../server/models/GalleryItem';

const app = express();

app.use(cors());
app.use(express.json());

// Default data lists
const defaultEmployees = [
  {
    name: "Dr. Alok Sharma",
    role: "Managing Director",
    category: "director",
    photoUrl: "/assets/director.webp",
    email: "alok.sharma@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Over 15 years of leadership in educational administration and community operational development.",
    order: 1
  },
  {
    name: "Mrs. Chandni Chauhan",
    role: "Executive Secretary",
    category: "secretary",
    photoUrl: "/mrs.chandni chauhan.jpeg",
    email: "chandnichauhan443@gmail.com",
    phone: "0121-4108015",
    bio: "Dedicated to streamlining cross-functional workflows and maintaining robust administrative compliance.",
    order: 2
  }
];

const defaultGalleryItems = [
  {
    title: "Educational Support Distribution",
    description: "Providing learning materials and kits to children at community centers.",
    imageUrl: "/wall1.jpg"
  },
  {
    title: "Community Outreach",
    description: "Helping build robust community operations and supportive networks.",
    imageUrl: "/mrs.chandni chauhan.jpeg"
  }
];

// Mongoose connection pooling helper
let cachedConnection: any = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    throw new Error("MONGODB_URI environment variable is missing on Netlify Settings.");
  }

  mongoose.set('strictQuery', true);
  cachedConnection = await mongoose.connect(dbUri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log("New database connection established via serverless handler.");
  return cachedConnection;
};

// Seed database helper
const seedIfEmpty = async () => {
  try {
    const empCount = await Employee.countDocuments();
    if (empCount === 0) {
      await Employee.insertMany(defaultEmployees);
      console.log("Seeded default employees in MongoDB.");
    }
    const galCount = await GalleryItem.countDocuments();
    if (galCount === 0) {
      await GalleryItem.insertMany(defaultGalleryItems);
      console.log("Seeded default gallery items in MongoDB.");
    }
  } catch (err) {
    console.error("Failed to seed MongoDB:", err);
  }
};

// Middleware to establish database connection on every function invocation
app.use(async (req: Request, res: Response, next: express.NextFunction) => {
  try {
    await connectDB();
    await seedIfEmpty();
    next();
  } catch (err) {
    console.error("Database initialization error:", err);
    res.status(500).json({ error: "Failed to connect to Database", details: (err as Error).message });
  }
});

// Status Route
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    database: 'connected',
    message: 'Connected to MongoDB Atlas via Netlify Serverless Functions',
    timestamp: new Date()
  });
});

// Contacts Route (Submit Inquiry)
app.post('/api/contacts', async (req: Request, res: Response) => {
  const { name, email, contact, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }
  try {
    const newContact = new Contact({ name, email, contact, subject, message });
    const saved = await newContact.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process inquiry', details: (err as Error).message });
  }
});

// Contacts List (Admin View)
app.get('/api/contacts', async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: contacts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve inquiries', details: (err as Error).message });
  }
});

// Employees Routes
app.get('/api/employees', async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().sort({ order: 1 });
    return res.json({ success: true, data: employees });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve employees list', details: (err as Error).message });
  }
});

app.post('/api/employees', async (req: Request, res: Response) => {
  const { name, role, category, photoUrl, email, phone, bio } = req.body;
  if (!name || !role || !category) {
    return res.status(400).json({ error: 'Please provide all required fields: name, role, category' });
  }
  try {
    const count = await Employee.countDocuments();
    const newEmployee = new Employee({
      name, role, category, photoUrl, email, phone, bio, order: count + 1
    });
    const saved = await newEmployee.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add employee', details: (err as Error).message });
  }
});

app.delete('/api/employees/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Employee not found' });
    return res.json({ success: true, data: deleted });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete employee', details: (err as Error).message });
  }
});

// Gallery Routes
app.get('/api/gallery', async (req: Request, res: Response) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: items });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve gallery items', details: (err as Error).message });
  }
});

app.post('/api/gallery', async (req: Request, res: Response) => {
  const { title, description, imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'Please provide required field: imageUrl' });
  try {
    const newItem = new GalleryItem({ title, description, imageUrl });
    const saved = await newItem.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add gallery item', details: (err as Error).message });
  }
});

app.delete('/api/gallery/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await GalleryItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Gallery item not found' });
    return res.json({ success: true, data: deleted });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete gallery item', details: (err as Error).message });
  }
});

export const handler = serverless(app);

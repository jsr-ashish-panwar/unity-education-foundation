import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import Contact from './models/Contact';
import Employee from './models/Employee';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory mock storage for fallback
let isDbConnected = false;
const mockContacts: any[] = [];

// Default employee list
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
    name: "Mrs. Sunita Siwach",
    role: "Executive Secretary",
    category: "secretary",
    photoUrl: "/assets/secretary.webp",
    email: "sunita.siwach@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Dedicated to streamlining cross-functional workflows and maintaining robust administrative compliance.",
    order: 2
  },
  {
    name: "Rajesh Kumar",
    role: "Senior Operations Manager",
    category: "employee",
    photoUrl: "/assets/employee1.webp",
    email: "rajesh.k@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Manages day-to-day workflow tracking and administrative systems with extreme precision.",
    order: 3
  },
  {
    name: "Priyanka Chaudhary",
    role: "Data Analytics Head",
    category: "employee",
    photoUrl: "/assets/employee2.webp",
    email: "priyanka.c@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Specialist in large-scale database operations, verification procedures, and documentation structures.",
    order: 4
  },
  {
    name: "Amit Kasana",
    role: "Lead Field Monitoring Officer",
    category: "employee",
    photoUrl: "/assets/employee3.webp",
    email: "amit.k@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Coordinates field-level evaluation frameworks and regular compliance auditing audits.",
    order: 5
  },
  {
    name: "Komal Tyagi",
    role: "Reporting & Documentation Specialist",
    category: "employee",
    photoUrl: "/assets/employee4.webp",
    email: "komal.t@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Transforms complex operational data points into structured, highly-detailed reports.",
    order: 6
  },
  {
    name: "Rahul Verma",
    role: "Stakeholder Communications Coordinator",
    category: "employee",
    photoUrl: "/assets/employee5.webp",
    email: "rahul.v@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Ensures seamless queries resolution and prompt responses across all digital contact nodes.",
    order: 7
  },
  {
    name: "Neha Siddiqui",
    role: "Systems Administrator",
    category: "employee",
    photoUrl: "/assets/employee6.webp",
    email: "neha.s@unityeducation.org",
    phone: "+91 9557558628",
    bio: "Leverages modern tracking networks and system monitoring configurations.",
    order: 8
  }
];

// Initialize DB and populate defaults if DB is active
const initDB = async () => {
  isDbConnected = await connectDB();
  
  if (isDbConnected) {
    try {
      const count = await Employee.countDocuments();
      if (count === 0) {
        await Employee.insertMany(defaultEmployees);
        console.log('Seed: Default employees populated in MongoDB Atlas.');
      }
    } catch (err) {
      console.error('Error seeding default employees:', err);
    }
  }
};

// API routes
// 1. Health and Status Checks
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    database: isDbConnected ? 'connected' : 'mocked',
    message: isDbConnected 
      ? 'Connected to MongoDB Atlas' 
      : 'Running in Mock Mode. Set MONGODB_URI in server/.env to connect to your Atlas Database.',
    timestamp: new Date()
  });
});

// 2. Submit Contact Inquiry
app.post('/api/contacts', async (req: Request, res: Response) => {
  const { name, email, contact, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Please provide all required fields: name, email, subject, message' });
  }

  try {
    if (isDbConnected) {
      const newContact = new Contact({ name, email, contact, subject, message });
      const saved = await newContact.save();
      return res.status(201).json({ success: true, data: saved, message: 'Message saved to MongoDB Atlas' });
    } else {
      const newContactMock = {
        _id: 'mock_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        contact,
        subject,
        message,
        createdAt: new Date()
      };
      mockContacts.push(newContactMock);
      return res.status(201).json({ 
        success: true, 
        data: newContactMock, 
        message: 'Message saved successfully in Server Memory (MOCK Mode)' 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process inquiry', details: (error as Error).message });
  }
});

// 3. Get Contact Inquiries (for Admin Panel)
app.get('/api/contacts', async (req: Request, res: Response) => {
  try {
    if (isDbConnected) {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: contacts });
    } else {
      return res.json({ success: true, data: [...mockContacts].reverse() });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve inquiries', details: (error as Error).message });
  }
});

// 4. Get Employees
app.get('/api/employees', async (req: Request, res: Response) => {
  try {
    if (isDbConnected) {
      const employees = await Employee.find().sort({ order: 1 });
      return res.json({ success: true, data: employees });
    } else {
      return res.json({ success: true, data: defaultEmployees });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve employees list', details: (error as Error).message });
  }
});

// Start Express
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDB();
});

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
    name: "Mrs. Chandni Chauhan",
    role: "Executive Secretary",
    category: "secretary",
    photoUrl: "/mrs.chandni chauhan.jpeg",
    email: "chandnichauhan443@gmail.com",
    phone: "+91 8979288628",
    bio: "Dedicated to streamlining cross-functional workflows and maintaining robust administrative compliance.",
    order: 2
  }
];

// In-memory array for tracking changes in Mock Mode
let mockEmployees: any[] = [...defaultEmployees];

// Initialize DB and populate defaults if DB is active
const initDB = async () => {
  isDbConnected = await connectDB();
  
  if (isDbConnected) {
    try {
      const count = await Employee.countDocuments();
      if (count === 0) {
        await Employee.insertMany(defaultEmployees);
        console.log('Seed: Default employees populated in MongoDB Atlas.');
      } else if (count === 8) {
        console.log('Migration: Found 8 employees in Atlas (old seed). Deleting 6 staff members to match new requirements.');
        await Employee.deleteMany({ category: 'employee' });
      }

      // Check if Sunita Siwach exists and update to Chandni Chauhan
      const sunita = await Employee.findOne({ name: "Mrs. Sunita Siwach" });
      if (sunita) {
        console.log('Migration: Updating Mrs. Sunita Siwach to Mrs. Chandni Chauhan in MongoDB.');
        sunita.name = "Mrs. Chandni Chauhan";
        sunita.photoUrl = "/mrs.chandni chauhan.jpeg";
        sunita.email = "chandnichauhan443@gmail.com";
        sunita.phone = "+91 8979288628";
        await sunita.save();
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
      return res.json({ success: true, data: mockEmployees });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve employees list', details: (error as Error).message });
  }
});

// 5. Add Employee
app.post('/api/employees', async (req: Request, res: Response) => {
  const { name, role, category, photoUrl, email, phone, bio } = req.body;

  if (!name || !role || !category) {
    return res.status(400).json({ error: 'Please provide all required fields: name, role, category' });
  }

  try {
    if (isDbConnected) {
      const count = await Employee.countDocuments();
      const newEmployee = new Employee({
        name,
        role,
        category,
        photoUrl,
        email,
        phone,
        bio,
        order: count + 1
      });
      const saved = await newEmployee.save();
      return res.status(201).json({ success: true, data: saved, message: 'Employee saved to MongoDB Atlas' });
    } else {
      const newEmployeeMock = {
        _id: 'mock_emp_' + Math.random().toString(36).substr(2, 9),
        name,
        role,
        category,
        photoUrl,
        email,
        phone,
        bio,
        order: mockEmployees.length + 1
      };
      mockEmployees.push(newEmployeeMock);
      return res.status(201).json({ 
        success: true, 
        data: newEmployeeMock, 
        message: 'Employee saved successfully in Server Memory (MOCK Mode)' 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add employee', details: (error as Error).message });
  }
});

// 6. Delete Employee
app.delete('/api/employees/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (isDbConnected) {
      const deleted = await Employee.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      return res.json({ success: true, data: deleted, message: 'Employee deleted from MongoDB Atlas' });
    } else {
      const index = mockEmployees.findIndex(emp => emp._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Employee not found in Mock data' });
      }
      const deleted = mockEmployees.splice(index, 1)[0];
      return res.json({ success: true, data: deleted, message: 'Employee deleted from Server Memory (MOCK Mode)' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete employee', details: (error as Error).message });
  }
});

// Start Express
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDB();
});

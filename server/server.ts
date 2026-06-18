import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import Contact from './models/Contact';
import Employee from './models/Employee';
import GalleryItem from './models/GalleryItem';

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
    name: "Mr. Amjad Chauhan",
    role: "Managing Director",
    category: "director",
    photoUrl: "",
    email: "amjadchauhan2018@gmail.com",
    phone: "+91 9557558628",
    bio: "Over 9 years of leadership in educational administration and community operational development.",
    order: 1
  },
  {
    name: "Mrs. Chandni Chauhan",
    role: "Executive Secretary",
    category: "secretary",
    photoUrl: "",
    email: "chandnichauhan443@gmail.com",
    phone: "0121-4108015",
    bio: "Dedicated to streamlining cross-functional workflows and maintaining robust administrative compliance.",
    order: 2
  }
];

// Default gallery item list
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

// In-memory array for tracking changes in Mock Mode
let mockEmployees: any[] = [...defaultEmployees];
let mockGalleryItems: any[] = [...defaultGalleryItems];

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
        sunita.photoUrl = "";
        sunita.email = "";
        sunita.phone = "0121-4108015";
        await sunita.save();
      }

      // Update existing seeded leadership to have correct names, emails, phones, and clear photos
      const dirUpdate = await Employee.updateMany(
        { category: 'director' },
        { $set: { name: "Mr. Amjad Chauhan", email: "amjadchauhan2018@gmail.com", photoUrl: "", phone: "+91 9557558628", bio: "Over 9 years of leadership in educational administration and community operational development." } }
      );
      const secUpdate = await Employee.updateMany(
        { category: 'secretary' },
        { $set: { name: "Mrs. Chandni Chauhan", email: "chandnichauhan443@gmail.com", photoUrl: "", phone: "0121-4108015" } }
      );
      console.log(`Migration: Updated leadership names, phone numbers, and cleared photos/emails. Director matched ${dirUpdate.matchedCount}, modified ${dirUpdate.modifiedCount}; Secretary matched ${secUpdate.matchedCount}, modified ${secUpdate.modifiedCount}`);

      // Seeding Gallery Items
      const galleryCount = await GalleryItem.countDocuments();
      if (galleryCount === 0) {
        await GalleryItem.insertMany(defaultGalleryItems);
        console.log('Seed: Default gallery items populated in MongoDB Atlas.');
      }
    } catch (err) {
      console.error('Error seeding default employees/gallery:', err);
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

// 7. Get Gallery Items
app.get('/api/gallery', async (req: Request, res: Response) => {
  try {
    if (isDbConnected) {
      const items = await GalleryItem.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: items });
    } else {
      return res.json({ success: true, data: mockGalleryItems });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve gallery items', details: (error as Error).message });
  }
});

// 8. Add Gallery Item
app.post('/api/gallery', async (req: Request, res: Response) => {
  const { title, description, imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Please provide required field: imageUrl' });
  }

  try {
    if (isDbConnected) {
      const newItem = new GalleryItem({ title, description, imageUrl });
      const saved = await newItem.save();
      return res.status(201).json({ success: true, data: saved, message: 'Gallery item saved to MongoDB Atlas' });
    } else {
      const newItemMock = {
        _id: 'mock_gal_' + Math.random().toString(36).substr(2, 9),
        title: title || '',
        description: description || '',
        imageUrl,
        createdAt: new Date()
      };
      mockGalleryItems.unshift(newItemMock);
      return res.status(201).json({ 
        success: true, 
        data: newItemMock, 
        message: 'Gallery item saved successfully in Server Memory (MOCK Mode)' 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add gallery item', details: (error as Error).message });
  }
});

// 9. Delete Gallery Item
app.delete('/api/gallery/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (isDbConnected) {
      const deleted = await GalleryItem.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Gallery item not found' });
      }
      return res.json({ success: true, data: deleted, message: 'Gallery item deleted from MongoDB Atlas' });
    } else {
      const index = mockGalleryItems.findIndex(item => item._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Gallery item not found in Mock data' });
      }
      const deleted = mockGalleryItems.splice(index, 1)[0];
      return res.json({ success: true, data: deleted, message: 'Gallery item deleted from Server Memory (MOCK Mode)' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete gallery item', details: (error as Error).message });
  }
});
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDB();
});

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Staff from './src/models/staff.model.js';

dotenv.config();

const createLibraryUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const libraryUserExists = await Staff.findOne({ userName: 'library' });
    if (libraryUserExists) {
      console.log('Library user already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('library123', salt);

    const newLibraryUser = new Staff({
      name: 'Library Admin',
      userName: 'library',
      phoneNumber: '0000000000',
      role: 'library',
      password: hashedPassword,
    });

    await newLibraryUser.save();
    console.log('Library user created successfully! Username: library, Password: library123');
    process.exit(0);
  } catch (err) {
    console.error('Error creating library user:', err);
    process.exit(1);
  }
};

createLibraryUser();

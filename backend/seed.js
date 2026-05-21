const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gallery = require('./models/Gallery');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const sampleImages = [
  {
    title: 'Modern E-commerce Dashboard',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A sleek, modern dashboard design for an e-commerce platform with analytics and sales tracking.',
    category: 'Web Design'
  },
  {
    title: 'Fitness Tracking App',
    image_url: 'https://images.unsplash.com/photo-1526502619065-5c4d44eb7372?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Mobile application for tracking fitness goals, daily activities, and workout routines.',
    category: 'Mobile Apps'
  },
  {
    title: 'AI Image Generator',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A powerful web application that utilizes artificial intelligence to generate stunning images from text prompts.',
    category: 'AI Projects'
  },
  {
    title: 'Data Analysis Toolkit',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Python scripts and tools for processing, analyzing, and visualizing complex datasets.',
    category: 'Python Projects'
  },
  {
    title: 'Real Estate Landing Page',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'High-converting landing page designed for a luxury real estate agency.',
    category: 'Web Design'
  },
  {
    title: 'Food Delivery UI',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'User interface design for a modern, fast food delivery mobile application.',
    category: 'Mobile Apps'
  },
  {
    title: 'Chatbot Assistant',
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Intelligent AI chatbot designed for customer support and automated responses.',
    category: 'AI Projects'
  },
  {
    title: 'Web Scraper Engine',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Automated Python engine for extracting structured data from various websites.',
    category: 'Python Projects'
  }
];

const importData = async () => {
  try {
    await Gallery.deleteMany();
    await Gallery.insertMany(sampleImages);
    console.log('Data Imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();

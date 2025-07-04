import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './user.model.js';
import Campaign from './campaign.model.js';
import Notification from './notification.model.js';

dotenv.config();

const users = [
  { name: 'Amit Sharma', email: 'amit@example.com', passwordHash: 'test', role: 'admin', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Priya Singh', email: 'priya@example.com', passwordHash: 'test', role: 'owner', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Ravi Kumar', email: 'ravi@example.com', passwordHash: 'test', role: 'backer', avatar: 'https://randomuser.me/api/portraits/men/65.jpg' },
];

const campaigns = [
  { title: 'Empower Rural Education', description: 'Help build digital classrooms in remote villages.', goal: 50000, deadline: new Date(Date.now() + 1000*60*60*24*30), owner: null, fundsRaised: 32000 },
  { title: 'Clean Water for All', description: 'Fund wells and water filters for communities in need.', goal: 30000, deadline: new Date(Date.now() + 1000*60*60*24*20), owner: null, fundsRaised: 18000 },
  { title: 'Women in Tech Scholarships', description: 'Support scholarships for women entering STEM fields.', goal: 40000, deadline: new Date(Date.now() + 1000*60*60*24*40), owner: null, fundsRaised: 25000 },
];

const notifications = [
  { message: 'Your campaign "Empower Rural Education" reached 50% of its goal!', user: null, read: false, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256&facepad=2' },
  { message: 'You received a new contribution from Priya.', user: null, read: false, image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256&facepad=2' },
  { message: 'Campaign "Clean Water for All" is now trending!', user: null, read: false, image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&h=256&facepad=2' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crowdspark');
  await User.deleteMany({});
  await Campaign.deleteMany({});
  await Notification.deleteMany({});

  const createdUsers = await User.insertMany(users);
  campaigns[0].owner = createdUsers[1]._id;
  campaigns[1].owner = createdUsers[0]._id;
  campaigns[2].owner = createdUsers[2]._id;
  const createdCampaigns = await Campaign.insertMany(campaigns);
  notifications[0].user = createdUsers[1]._id;
  notifications[1].user = createdUsers[0]._id;
  notifications[2].user = createdUsers[2]._id;
  await Notification.insertMany(notifications);

  console.log('Database seeded!');
  process.exit();
}

seed(); 
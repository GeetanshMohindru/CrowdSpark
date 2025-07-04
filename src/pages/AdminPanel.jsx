import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { LucideUser, LucideFlag } from 'lucide-react';

const users = [
  { name: 'Amit Sharma', email: 'amit@example.com', role: 'admin' },
  { name: 'Priya Singh', email: 'priya@example.com', role: 'owner' },
  { name: 'Ravi Kumar', email: 'ravi@example.com', role: 'backer' },
];
const campaigns = [
  { title: 'Empower Rural Education', owner: 'Priya Singh', status: 'Active' },
  { title: 'Clean Water for All', owner: 'Amit Sharma', status: 'Completed' },
  { title: 'Women in Tech Scholarships', owner: 'Ravi Kumar', status: 'Active' },
];

export default function AdminPanel() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-background to-accent/30 p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary drop-shadow">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-12">
        <Card className="shadow-lg bg-white/90">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <LucideUser className="h-8 w-8 text-primary" />
            <CardTitle className="text-lg font-semibold">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 font-medium">{u.name}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2 capitalize">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card className="shadow-lg bg-white/90">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <LucideFlag className="h-8 w-8 text-accent" />
            <CardTitle className="text-lg font-semibold">Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs">
                  <th className="py-2">Title</th>
                  <th className="py-2">Owner</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 font-medium">{c.title}</td>
                    <td className="py-2">{c.owner}</td>
                    <td className="py-2">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
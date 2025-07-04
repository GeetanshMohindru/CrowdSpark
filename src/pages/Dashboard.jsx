import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { LucideTrendingUp, LucideUsers, LucideGift } from 'lucide-react';

const stats = [
  {
    icon: <LucideTrendingUp className="h-8 w-8 text-primary" />,
    label: 'Total Raised',
    value: '₹1,20,000',
    progress: 80,
  },
  {
    icon: <LucideUsers className="h-8 w-8 text-accent" />,
    label: 'Active Backers',
    value: '320',
    progress: 64,
  },
  {
    icon: <LucideGift className="h-8 w-8 text-yellow-400" />,
    label: 'Campaigns Funded',
    value: '27',
    progress: 90,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-accent/30 p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary drop-shadow">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
        {stats.map((s, i) => (
          <Card key={i} className="shadow-lg bg-white/90">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              {s.icon}
              <CardTitle className="text-lg font-semibold">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{s.value}</div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${s.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="w-full max-w-3xl">
        <Card className="shadow-xl bg-white/90">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              <li className="py-3 flex items-center justify-between">
                <span className="font-medium text-primary">Amit funded "Empower Rural Education"</span>
                <span className="text-xs text-gray-500">2 min ago</span>
              </li>
              <li className="py-3 flex items-center justify-between">
                <span className="font-medium text-accent">Priya started "Clean Water for All"</span>
                <span className="text-xs text-gray-500">10 min ago</span>
              </li>
              <li className="py-3 flex items-center justify-between">
                <span className="font-medium text-yellow-600">Ravi reached goal on "Women in Tech Scholarships"</span>
                <span className="text-xs text-gray-500">1 hr ago</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
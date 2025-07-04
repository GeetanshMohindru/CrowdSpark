import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { Button } from '../components/ui/button';
import { LucideSearch, LucideTrendingUp, LucideClock } from 'lucide-react';

const trending = [
  { title: 'Solar Village', desc: 'Bring solar power to rural homes.', goal: 20000, raised: 15000 },
  { title: 'Tech for Kids', desc: 'Fund laptops for underprivileged children.', goal: 30000, raised: 21000 },
];
const latest = [
  { title: 'Green City Parks', desc: 'Plant 1000 trees in city parks.', goal: 10000, raised: 4000 },
  { title: 'Disaster Relief', desc: 'Support families after floods.', goal: 25000, raised: 12000 },
];

export default function Discovery() {
  const [tab, setTab] = useState('trending');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = e => {
    e.preventDefault();
    setResults([
      { title: `Result for "${search}"`, desc: 'Sample search result.', goal: 5000, raised: 2000 },
    ]);
  };

  const campaigns = tab === 'trending' ? trending : tab === 'latest' ? latest : results;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-background to-accent/30 p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary drop-shadow">Discover Campaigns</h1>
      <Tabs value={tab} onValueChange={setTab} className="w-full max-w-5xl mb-8">
        <TabsList className="flex gap-4 mb-6">
          <TabsTrigger value="trending" className="flex items-center gap-2 px-4 py-2 rounded bg-white/80 shadow">
            <LucideTrendingUp className="h-5 w-5 text-primary" /> Trending
          </TabsTrigger>
          <TabsTrigger value="latest" className="flex items-center gap-2 px-4 py-2 rounded bg-white/80 shadow">
            <LucideClock className="h-5 w-5 text-accent" /> Latest
          </TabsTrigger>
          <form onSubmit={handleSearch} className="flex items-center gap-2 ml-auto">
            <input
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search campaigns..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button type="submit" variant="secondary"><LucideSearch className="h-4 w-4 mr-1" />Search</Button>
          </form>
        </TabsList>
        <TabsContent value={tab} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map((c, i) => (
            <Card key={i} className="bg-white/90 shadow-xl hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-700">{c.desc}</p>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(c.raised / c.goal) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Raised: ₹{c.raised.toLocaleString()}</span>
                  <span>Goal: ₹{c.goal.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Campaign</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
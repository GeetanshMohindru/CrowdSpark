import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LucideHeart, LucideMessageCircle, LucideSend, LucidePlus, LucideIndianRupee } from 'lucide-react';

const stories = [
  { name: 'Amit', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Priya', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Ravi', avatar: 'https://randomuser.me/api/portraits/men/65.jpg' },
  { name: 'Sara', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Alex', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
];

const feed = [
  {
    user: { name: 'Priya Singh', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    title: 'Empower Rural Education',
    desc: 'Help build digital classrooms in remote villages.',
    time: '2 min ago',
    likes: 120,
    comments: 8,
  },
  {
    user: { name: 'Amit Sharma', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    title: 'Clean Water for All',
    desc: 'Fund wells and water filters for communities in need.',
    time: '10 min ago',
    likes: 98,
    comments: 5,
  },
  {
    user: { name: 'Ravi Kumar', avatar: 'https://randomuser.me/api/portraits/men/65.jpg' },
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80',
    title: 'Women in Tech Scholarships',
    desc: 'Support scholarships for women entering STEM fields.',
    time: '1 hr ago',
    likes: 143,
    comments: 12,
  },
];

const defaultCommentAvatar = 'https://randomuser.me/api/portraits/men/1.jpg';

export default function Landing() {
  const [donateAmounts, setDonateAmounts] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  // Mock initial comments for demo
  React.useEffect(() => {
    setComments({
      0: ['Great initiative!', 'Love this!'],
      1: ['Amazing work!'],
      2: ['So inspiring!', 'Keep it up!']
    });
  }, []);

  const handleDonate = (idx) => {
    // For demo, just clear the input and show an alert
    setDonateAmounts({ ...donateAmounts, [idx]: '' });
    alert('Thank you for your donation!');
  };

  const handleAddComment = (idx) => {
    if (!newComments[idx]) return;
    setComments({
      ...comments,
      [idx]: [...(comments[idx] || []), newComments[idx]]
    });
    setNewComments({ ...newComments, [idx]: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/30 flex flex-col items-center px-0 py-0">
      {/* Stories Bar */}
      <div className="w-full flex gap-4 overflow-x-auto px-6 py-4 bg-white/80 sticky top-0 z-30 border-b border-gray-100">
        {stories.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <img src={s.avatar} alt={s.name} className="h-16 w-16 rounded-full border-4 border-primary object-cover shadow-md" />
            <span className="text-xs text-gray-700 font-medium mt-1">{s.name}</span>
          </div>
        ))}
      </div>
      {/* Feed */}
      <div className="w-full max-w-xl flex flex-col gap-8 py-10">
        {feed.map((post, i) => (
          <Card key={i} className="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden text-left">
            <CardHeader className="flex flex-row items-center gap-3 p-5 pb-2 bg-white">
              <img src={post.user.avatar} alt={post.user.name} className="h-12 w-12 rounded-full object-cover border border-gray-200" />
              <div className="flex-1">
                <CardTitle className="text-base font-bold mb-0 text-gray-900 text-left leading-tight">{post.user.name}</CardTitle>
                <span className="text-xs text-gray-400 text-left font-normal">{post.time}</span>
              </div>
            </CardHeader>
            <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-xl mx-auto" style={{maxHeight:'320px'}} />
            <CardContent className="p-5 pb-3">
              {/* Donation input/button */}
              <form className="flex gap-2 mb-4 items-center" onSubmit={e => { e.preventDefault(); handleDonate(i); }}>
                <input
                  type="number"
                  min="1"
                  className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-primary/30 text-sm bg-white placeholder:text-gray-400 transition"
                  placeholder="Donate amount"
                  value={donateAmounts[i] || ''}
                  onChange={e => setDonateAmounts({ ...donateAmounts, [i]: e.target.value })}
                />
                <Button size="sm" className="rounded-md px-4 py-2 font-semibold bg-primary/90 hover:bg-primary/100 transition" type="submit" disabled={!donateAmounts[i] || donateAmounts[i] <= 0}>
                  Donate
                </Button>
              </form>
              <div className="flex gap-6 mb-3 items-center">
                <button className="flex items-center gap-1 hover:text-primary transition-colors text-gray-500 text-lg"><LucideHeart className="inline h-5 w-5" /><span className="text-sm font-medium">{post.likes}</span></button>
                <button className="hover:text-primary transition-colors text-gray-500 text-lg"><LucideMessageCircle className="inline h-5 w-5" /></button>
                <button className="hover:text-primary transition-colors text-gray-500 text-lg"><LucideSend className="inline h-5 w-5" /></button>
              </div>
              <div className="text-lg font-bold mb-1 text-gray-900 text-left leading-tight">{post.title}</div>
              <div className="text-gray-700 text-base mb-3 text-left font-normal">{post.desc}</div>
              {/* Comments section */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="text-xs text-gray-400 mb-2 font-semibold tracking-wide">Comments</div>
                <div className="flex flex-col gap-2 mb-3">
                  {(comments[i] || []).map((cmt, idx) => (
                    <div key={idx} className="text-sm text-gray-800 bg-gray-50 rounded-md px-3 py-1 w-fit">{cmt}</div>
                  ))}
                </div>
                <form className="flex gap-2 items-center mt-1" onSubmit={e => { e.preventDefault(); handleAddComment(i); }}>
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-primary/20 bg-white shadow-sm placeholder:text-gray-400"
                    placeholder="Add a comment..."
                    value={newComments[i] || ''}
                    onChange={e => setNewComments({ ...newComments, [i]: e.target.value })}
                  />
                  <Button size="sm" className="rounded-md px-4 py-2 font-semibold bg-primary/90 hover:bg-primary/100 transition" type="submit" disabled={!newComments[i]}>Post</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Floating Action Button */}
      <Button className="fixed bottom-8 right-8 rounded-full h-16 w-16 flex items-center justify-center shadow-2xl bg-gradient-to-br from-primary to-accent text-white text-3xl p-0 hover:scale-110 transition-transform z-50">
        <LucidePlus className="h-8 w-8" />
      </Button>
    </div>
  );
} 
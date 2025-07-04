import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Toast } from '../components/ui/toast';
import { LucideBell } from 'lucide-react';
import axios from 'axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/notifications').then(res => {
      setNotifications(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-background to-accent/30 p-8">
      <h1 className="text-4xl font-bold mb-8 text-primary drop-shadow">Notifications</h1>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="shadow-lg bg-white/90 animate-pulse flex flex-row items-center gap-4 p-4">
              <div className="rounded-full bg-gray-200 h-12 w-12" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </Card>
          ))
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications yet.</div>
        ) : (
          notifications.map((n, i) => (
            <Card key={i} className="shadow-lg bg-white/90 flex flex-row items-center gap-4 p-4 hover:scale-105 transition-transform cursor-pointer" onClick={() => setToast(n.message)}>
              <img src={n.user?.avatar || n.avatar || 'https://ui-avatars.com/api/?name=User'} alt="avatar" className="rounded-full h-12 w-12 object-cover border-2 border-primary" />
              <div className="flex-1">
                <CardHeader className="p-0 pb-1 flex flex-row items-center gap-2">
                  <CardTitle className="text-base font-semibold flex-1">{n.message}</CardTitle>
                  {n.image && <img src={n.image} alt="notif" className="h-10 w-10 rounded object-cover ml-2" />}
                </CardHeader>
                <CardContent className="p-0 text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 
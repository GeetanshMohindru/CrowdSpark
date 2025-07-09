import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Toast } from '../components/ui/toast';
import { Bell, Check, CheckCheck, MessageCircle, DollarSign, Shield } from 'lucide-react';
import axios from 'axios';
import { io as socketIO } from 'socket.io-client';

export default function Notifications({ notifications: propNotifications }) {
  const [notifications, setNotifications] = useState(propNotifications || []);
  const [loading, setLoading] = useState(!propNotifications);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, funding, comments, admin
  const [socket, setSocket] = useState(null);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'funding':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-600" />;
      case 'admin':
      case 'campaign_approved':
      case 'campaign_rejected':
        return <Shield className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'funding':
        return 'border-l-green-500 bg-green-50';
      case 'comment':
        return 'border-l-blue-500 bg-blue-50';
      case 'campaign_approved':
        return 'border-l-green-500 bg-green-50';
      case 'campaign_rejected':
        return 'border-l-red-500 bg-red-50';
      case 'admin':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      setToast('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      // Assuming we have a user ID - in real app this would come from auth context
      const userId = 'demo-user-id'; // Replace with actual user ID
      await axios.patch(`/api/notifications/user/${userId}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setToast('All notifications marked as read');
    } catch (err) {
      setToast('Failed to mark all notifications as read');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'funding') return n.type === 'funding';
    if (filter === 'comments') return n.type === 'comment';
    if (filter === 'admin') return ['admin', 'campaign_approved', 'campaign_rejected'].includes(n.type);
    return true;
  });

  useEffect(() => {
    if (!propNotifications) {
      setLoading(true);
      axios.get('/api/notifications').then(res => {
        setNotifications(res.data);
        setLoading(false);
      }).catch(err => {
        console.error('Failed to fetch notifications:', err);
        setLoading(false);
      });
    }
  }, [propNotifications]);

  useEffect(() => {
    // Set up real-time socket connection
    const socketConnection = socketIO();
    setSocket(socketConnection);

    socketConnection.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    socketConnection.on('newNotification', ({ userId, message, type, campaignId }) => {
      // Add to notifications if it's for current user or a general notification
      const newNotification = {
        _id: Date.now().toString(),
        message,
        type,
        campaignId,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/30 p-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary drop-shadow">Notifications</h1>
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
            { key: 'funding', label: 'Funding', count: notifications.filter(n => n.type === 'funding').length },
            { key: 'comments', label: 'Comments', count: notifications.filter(n => n.type === 'comment').length },
            { key: 'admin', label: 'Admin', count: notifications.filter(n => ['admin', 'campaign_approved', 'campaign_rejected'].includes(n.type)).length }
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key)}
              className="relative"
            >
              {label}
              {count > 0 && (
                <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                  {count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredNotifications.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {filter === 'all' ? 'No notifications yet.' : `No ${filter} notifications.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((n) => (
              <Card 
                key={n._id} 
                className={`border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                  getNotificationColor(n.type)
                } ${n.read ? 'opacity-75' : 'shadow-lg'}`}
                onClick={() => !n.read && markAsRead(n._id)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                        {n.message}
                      </p>
                      {!n.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                      {n.type && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          n.type === 'funding' ? 'bg-green-100 text-green-800' :
                          n.type === 'comment' ? 'bg-blue-100 text-blue-800' :
                          n.type === 'campaign_approved' ? 'bg-green-100 text-green-800' :
                          n.type === 'campaign_rejected' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {n.type.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  {n.image && (
                    <img 
                      src={n.image} 
                      alt="notification" 
                      className="w-12 h-12 rounded object-cover flex-shrink-0" 
                    />
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Real-time status indicator */}
        <div className="fixed bottom-4 right-4">
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-lg border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">Live updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}


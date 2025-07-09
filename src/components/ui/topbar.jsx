import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Settings } from 'lucide-react';
import { Button } from './button';

export function Topbar({ unreadCount = 0 }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            CrowdSpark
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Link to="/notifications" className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </Link>
          
          {/* User Menu */}
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}


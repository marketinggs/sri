'use client';

import React from 'react';
import { Home, Users, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home
    },
    { 
      id: 'upload', 
      label: 'Upload Customers', 
      icon: Users
    },
    { 
      id: 'compose', 
      label: 'Compose Email', 
      icon: Mail
    },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full border-r transition-all duration-300 z-50 shadow-xl ${collapsed ? 'w-16' : 'w-64'}`} style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}>
      {/* Header */}
      <div className={`${collapsed ? 'p-3' : 'p-4'} border-b`} style={{ borderColor: '#374151' }}>
        {collapsed ? (
          <div className="flex flex-col items-center space-y-4">
            <img 
              src="https://d31bwppm8yl9g2.cloudfront.net/learner/GrowthSchoolNewLogo.svg" 
              alt="GrowthSchool Logo" 
              className="h-7 w-7 object-contain"
            />
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-all duration-200 text-slate-300 hover:text-white"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center flex-1">
              <img 
                src="https://cdn.prod.website-files.com/624194472db3153002097068/63f0e41889bce94302ee1dd4_Property%201%3DDark%20with%20Light%20Text.svg" 
                alt="GrowthSchool Logo" 
                className="h-8 object-contain"
              />
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-slate-300 hover:text-white shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`${collapsed ? 'mt-4 px-2' : 'mt-6 px-3'}`}>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center transition-all duration-200 group relative ${
                  collapsed 
                    ? 'px-2 py-3 rounded-lg justify-center' 
                    : 'px-4 py-3 rounded-lg'
                } ${
                  activeTab === item.id
                    ? 'bg-blue-500/10 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {/* Active indicator */}
                {activeTab === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-md"></div>
                )}
                
                <span className={`flex-shrink-0 transition-all duration-200 ${
                  collapsed ? 'mx-auto' : ''
                } ${
                  activeTab === item.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  <item.icon className="w-5 h-5" />
                </span>
                
                {!collapsed && (
                  <span className={`ml-3 font-medium transition-all duration-200 ${
                    activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 px-3">
        {!collapsed && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin</p>
                <p className="text-xs text-slate-400 truncate">Administrator</p>
              </div>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-semibold">A</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
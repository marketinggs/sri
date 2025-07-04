'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { fetchLists } from '../lib/utils';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle, 
  Upload, 
  Mail, 
  Activity,
  AlertCircle,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lists from API on component mount
  useEffect(() => {
    async function loadLists() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLists();
        setLists(data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error('Error loading lists:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLists();
  }, []);

  // Calculate statistics from real data - memoized to prevent hydration issues
  const stats = useMemo(() => {
    if (loading) {
      return [
        { title: 'Total Lists', value: '...', icon: FileText, color: 'text-blue-600' },
        { title: 'Total Customers', value: '...', icon: Users, color: 'text-slate-600' },
        { title: 'Active Lists', value: '...', icon: CheckCircle, color: 'text-green-600' },
        { title: 'Recent Lists', value: '...', icon: TrendingUp, color: 'text-purple-600' },
      ];
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return [
      { 
        title: 'Total Lists', 
        value: lists.length.toString(), 
        icon: FileText, 
        color: 'text-blue-600',
        change: '+12%',
        trend: 'up'
      },
      { 
        title: 'Total Customers', 
        value: lists.reduce((sum, list) => sum + list.count, 0).toLocaleString(), 
        icon: Users, 
        color: 'text-slate-600',
        change: '+8%',
        trend: 'up'
      },
      { 
        title: 'Active Lists', 
        value: lists.filter(list => list.count > 0).length.toString(), 
        icon: CheckCircle, 
        color: 'text-green-600',
        change: '+5%',
        trend: 'up'
      },
      { 
        title: 'Recent Lists', 
        value: lists.filter(list => {
          return new Date(list.created_at) > weekAgo;
        }).length.toString(), 
        icon: TrendingUp, 
        color: 'text-purple-600',
        change: '+15%',
        trend: 'up'
      },
    ];
  }, [lists, loading]);

  // Get recent activity from actual lists - memoized to prevent hydration issues
  const recentActivity = useMemo(() => {
    if (loading || lists.length === 0) return [];
    
    const sortedLists = [...lists].sort((a, b) => new Date(b.last_updated_at) - new Date(a.last_updated_at));
    
    return sortedLists.slice(0, 5).map((list) => ({
      id: list.id,
      name: list.name,
      time: new Date(list.last_updated_at).toLocaleString('en-US', { 
        timeZone: 'UTC',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: list.type,
      count: list.count
    }));
  }, [lists, loading]);

  // Get top performing lists
  const topLists = useMemo(() => {
    if (loading || lists.length === 0) return [];
    return [...lists].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [lists, loading]);

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your campaigns.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="slide-up">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 slide-up">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card-hover scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        {stat.change && (
                          <Badge variant="secondary" className="text-xs">
                            {stat.change}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 slide-up">
        {/* Lists Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Performing Lists
            </CardTitle>
            <CardDescription>
              Your most engaging customer lists by size
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : topLists.length > 0 ? (
              <div className="space-y-4">
                {topLists.map((list, index) => (
                  <div key={list.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{list.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {list.type.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{list.count.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">contacts</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No lists available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates to your lists
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.count.toLocaleString()} contacts
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="slide-up">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-6 justify-start gap-4 hover:bg-muted"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Upload New List</p>
                <p className="text-sm text-muted-foreground">
                  Add customers to your mailing lists
                </p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-6 justify-start gap-4 hover:bg-muted"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Compose Email</p>
                <p className="text-sm text-muted-foreground">
                  Create and send email campaigns
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
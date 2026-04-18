'use client';

import React, { useEffect, useState } from 'react';
import { supabase, Partner, Project, Activity, Task } from '@/lib/supabase';
import { useAuth } from '@/lib/supabase';

interface Stats {
  partnersCount: number;
  projectsCount: number;
  activitiesCount: number;
  tasksCount: number;
  tasksCompletedCount: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    partnersCount: 0,
    projectsCount: 0,
    activitiesCount: 0,
    tasksCount: 0,
    tasksCompletedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          { count: partnersCount },
          { count: projectsCount },
          { count: activitiesCount },
          { count: tasksCount },
          { count: tasksCompletedCount },
        ] = await Promise.all([
          supabase.from('partners').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('activities').select('*', { count: 'exact', head: true }),
          supabase.from('tasks').select('*', { count: 'exact', head: true }),
          supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'done'),
        ]);

        setStats({
          partnersCount: partnersCount || 0,
          projectsCount: projectsCount || 0,
          activitiesCount: activitiesCount || 0,
          tasksCount: tasksCount || 0,
          tasksCompletedCount: tasksCompletedCount || 0,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadStats();
    }
  }, [user]);

  const StatCard = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: number | string;
    icon: string;
  }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <span className="text-4xl opacity-20">{icon}</span>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-slate-600">
          iLEAD PM — Project Management for Catalyste+ Vietnam
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center text-slate-600">Loading statistics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Partners" value={stats.partnersCount} icon="🤝" />
          <StatCard label="Projects" value={stats.projectsCount} icon="📋" />
          <StatCard label="Activities" value={stats.activitiesCount} icon="🎯" />
          <StatCard label="Tasks" value={stats.tasksCount} icon="✓" />
          <StatCard label="Completed" value={stats.tasksCompletedCount} icon="✅" />
        </div>
      )}

      {/* Quick Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Connect to Supabase: Add .env.local with your credentials</li>
          <li>✓ Create Partners, Projects, Activities, and Tasks</li>
          <li>✓ Track progress with iLEAD Logic Model (S1-S7 stages)</li>
          <li>✓ Export data for reports and monitoring</li>
        </ul>
      </div>
    </div>
  );
}

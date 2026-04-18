'use client';

import React, { useEffect, useState } from 'react';
import { supabase, Activity, Project, STAGE_LABELS } from '@/lib/supabase';
import { ActivityModal } from '@/components/Activities/ActivityModal';
import { ActivityDeleteDialog } from '@/components/Activities/ActivityDeleteDialog';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<(Activity & { projectName?: string })[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [deleteActivity, setDeleteActivity] = useState<Activity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [projectsRes, activitiesRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      setProjects(projectsRes.data || []);
      
      const activitiesWithProjectNames = (activitiesRes.data || []).map((activity) => ({
        ...activity,
        projectName: projectsRes.data?.find((p) => p.id === activity.project_id)?.name || 'Unknown',
      }));
      setActivities(activitiesWithProjectNames);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleSaveActivity = (activity: Activity) => {
    const projectName = projects.find((p) => p.id === activity.project_id)?.name || 'Unknown';
    
    if (selectedActivity) {
      setActivities(activities.map((a) => (a.id === activity.id ? { ...activity, projectName } : a)));
    } else {
      setActivities([{ ...activity, projectName }, ...activities]);
    }
  };

  const handleDeleteClick = (activity: Activity) => {
    setDeleteActivity(activity);
  };

  const handleDeleteConfirmed = () => {
    if (deleteActivity) {
      setActivities(activities.filter((a) => a.id !== deleteActivity.id));
    }
  };

  let filteredActivities = activities.filter((activity) => {
    const matchesSearch = 
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (activity.projectName && activity.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStage = !filterStage || activity.stage === filterStage;
    
    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: string) => {
    const stages = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
    const index = stages.indexOf(stage);
    const colors = [
      'bg-purple-100 text-purple-700',
      'bg-blue-100 text-blue-700',
      'bg-cyan-100 text-cyan-700',
      'bg-teal-100 text-teal-700',
      'bg-green-100 text-green-700',
      'bg-emerald-100 text-emerald-700',
      'bg-lime-100 text-lime-700',
    ];
    return colors[index] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Activities</h1>
        <button
          onClick={handleAddActivity}
          disabled={projects.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={projects.length === 0 ? 'Create a project first' : ''}
        >
          + Add Activity
        </button>
      </div>

      {projects.length === 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
          👉 Create at least one project before adding activities.
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search activities by name or project..."
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Stages</option>
          {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'].map((stage) => (
            <option key={stage} value={stage}>
              {stage} - {STAGE_LABELS[stage]}
            </option>
          ))}
        </select>
      </div>

      {/* Activities List */}
      {loading ? (
        <p className="text-slate-600">Loading activities...</p>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-4">
            {searchQuery || filterStage ? 'No activities match your filters' : 'No activities yet'}
          </p>
          {!searchQuery && !filterStage && projects.length > 0 && (
            <button
              onClick={handleAddActivity}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create your first activity
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{activity.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStageColor(activity.stage)}`}>
                      {activity.stage} - {STAGE_LABELS[activity.stage]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Project: {activity.projectName}</p>
                  {activity.ball_owner && (
                    <p className="text-xs text-slate-500">Ball Owner: {activity.ball_owner}</p>
                  )}
                  {activity.next_action && (
                    <p className="text-xs text-slate-500 font-medium mt-1">Next: {activity.next_action}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditActivity(activity)}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(activity)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
        activity={selectedActivity}
        projects={projects}
      />

      <ActivityDeleteDialog
        isOpen={!!deleteActivity}
        onClose={() => setDeleteActivity(null)}
        onDeleted={handleDeleteConfirmed}
        activity={deleteActivity}
      />
    </div>
  );
}

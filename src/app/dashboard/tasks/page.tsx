'use client';

import React, { useEffect, useState } from 'react';
import { supabase, Task, Activity } from '@/lib/supabase';
import { TaskModal } from '@/components/Tasks/TaskModal';
import { TaskDeleteDialog } from '@/components/Tasks/TaskDeleteDialog';

export default function TasksPage() {
  const [tasks, setTasks] = useState<(Task & { activityName?: string })[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [activitiesRes, tasksRes] = await Promise.all([
        supabase.from('activities').select('*'),
        supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      setActivities(activitiesRes.data || []);
      
      const tasksWithActivityNames = (tasksRes.data || []).map((task) => ({
        ...task,
        activityName: activitiesRes.data?.find((a) => a.id === task.activity_id)?.name || 'Unknown',
      }));
      setTasks(tasksWithActivityNames);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    const activityName = activities.find((a) => a.id === task.activity_id)?.name || 'Unknown';
    
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...task, activityName } : t)));
    } else {
      setTasks([{ ...task, activityName }, ...tasks]);
    }
  };

  const handleDeleteClick = (task: Task) => {
    setDeleteTask(task);
  };

  const handleDeleteConfirmed = () => {
    if (deleteTask) {
      setTasks(tasks.filter((t) => t.id !== deleteTask.id));
    }
  };

  let filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.activityName && task.activityName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.assignee && task.assignee.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = !filterStatus || task.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-slate-100 text-slate-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'done':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
        <button
          onClick={handleAddTask}
          disabled={activities.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={activities.length === 0 ? 'Create an activity first' : ''}
        >
          + Add Task
        </button>
      </div>

      {activities.length === 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
          👉 Create at least one activity before adding tasks.
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by name, activity, or assignee..."
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Tasks List */}
      {loading ? (
        <p className="text-slate-600">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-4">
            {searchQuery || filterStatus ? 'No tasks match your filters' : 'No tasks yet'}
          </p>
          {!searchQuery && !filterStatus && activities.length > 0 && (
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create your first task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{task.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Activity: {task.activityName}</p>
                  {task.assignee && (
                    <p className="text-xs text-slate-500">Assignee: {task.assignee}</p>
                  )}
                  {task.due_date && (
                    <p className="text-xs text-slate-500">Due: {task.due_date}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task)}
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
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        activities={activities}
      />

      <TaskDeleteDialog
        isOpen={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onDeleted={handleDeleteConfirmed}
        task={deleteTask}
      />
    </div>
  );
}

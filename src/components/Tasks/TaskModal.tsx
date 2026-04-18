'use client';

import React, { useState, useEffect } from 'react';
import { supabase, Task, Activity } from '@/lib/supabase';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task | null;
  activities: Activity[];
}

export function TaskModal({ isOpen, onClose, onSave, task, activities }: TaskModalProps) {
  const [formData, setFormData] = useState({
    activity_id: '',
    name: '',
    status: 'todo' as Task['status'],
    assignee: '',
    due_date: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        activity_id: task.activity_id,
        name: task.name,
        status: task.status,
        assignee: task.assignee || '',
        due_date: task.due_date || '',
        notes: task.notes || '',
      });
    } else {
      setFormData({
        activity_id: activities[0]?.id || '',
        name: '',
        status: 'todo',
        assignee: '',
        due_date: '',
        notes: '',
      });
    }
    setError('');
  }, [task, isOpen, activities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError('Task name is required');
        setLoading(false);
        return;
      }

      if (!formData.activity_id) {
        setError('Please select an activity');
        setLoading(false);
        return;
      }

      let result;
      if (task) {
        result = await supabase
          .from('tasks')
          .update({
            activity_id: formData.activity_id,
            name: formData.name.trim(),
            status: formData.status,
            assignee: formData.assignee || null,
            due_date: formData.due_date || null,
            notes: formData.notes || null,
          })
          .eq('id', task.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('tasks')
          .insert({
            activity_id: formData.activity_id,
            name: formData.name.trim(),
            status: formData.status,
            assignee: formData.assignee || null,
            due_date: formData.due_date || null,
            notes: formData.notes || null,
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;
      if (result.data) onSave(result.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {task ? 'Edit Task' : 'Add Task'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Activity */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Activity *
            </label>
            <select
              value={formData.activity_id}
              onChange={(e) => setFormData({ ...formData, activity_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select an activity...</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Prepare training materials"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assignee
            </label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              placeholder="Person responsible"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Task details..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

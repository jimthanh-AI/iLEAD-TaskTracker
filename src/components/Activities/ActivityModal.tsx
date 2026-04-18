'use client';

import React, { useState, useEffect } from 'react';
import { supabase, Activity, Project, STAGE_LABELS } from '@/lib/supabase';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  activity?: Activity | null;
  projects: Project[];
}

const STAGES = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];

export function ActivityModal({ isOpen, onClose, onSave, activity, projects }: ActivityModalProps) {
  const [formData, setFormData] = useState({
    project_id: '',
    name: '',
    status: 'not_started' as Activity['status'],
    stage: 'S1' as const,
    ball_owner: '',
    ca: '',
    type: '',
    sub_code: '',
    next_action: '',
    start_date: '',
    end_date: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activity) {
      setFormData({
        project_id: activity.project_id,
        name: activity.name,
        status: activity.status,
        stage: activity.stage as any,
        ball_owner: activity.ball_owner || '',
        ca: activity.ca || '',
        type: activity.type || '',
        sub_code: activity.sub_code || '',
        next_action: activity.next_action || '',
        start_date: activity.start_date || '',
        end_date: activity.end_date || '',
        notes: activity.notes || '',
      });
    } else {
      setFormData({
        project_id: projects[0]?.id || '',
        name: '',
        status: 'not_started',
        stage: 'S1',
        ball_owner: '',
        ca: '',
        type: '',
        sub_code: '',
        next_action: '',
        start_date: '',
        end_date: '',
        notes: '',
      });
    }
    setError('');
  }, [activity, isOpen, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError('Activity name is required');
        setLoading(false);
        return;
      }

      if (!formData.project_id) {
        setError('Please select a project');
        setLoading(false);
        return;
      }

      let result;
      if (activity) {
        result = await supabase
          .from('activities')
          .update({
            project_id: formData.project_id,
            name: formData.name.trim(),
            status: formData.status,
            stage: formData.stage,
            ball_owner: formData.ball_owner || null,
            ca: formData.ca || null,
            type: formData.type || null,
            sub_code: formData.sub_code || null,
            next_action: formData.next_action || null,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            notes: formData.notes || null,
          })
          .eq('id', activity.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('activities')
          .insert({
            project_id: formData.project_id,
            name: formData.name.trim(),
            status: formData.status,
            stage: formData.stage,
            ball_owner: formData.ball_owner || null,
            ca: formData.ca || null,
            type: formData.type || null,
            sub_code: formData.sub_code || null,
            next_action: formData.next_action || null,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            notes: formData.notes || null,
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;
      if (result.data) onSave(result.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save activity');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="border-b border-slate-200 px-6 py-4 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">
            {activity ? 'Edit Activity' : 'Add Activity'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Project */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Project *
              </label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Select a project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Activity Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Workshop on ESG"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Stage (iLEAD Model)
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage} - {STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
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
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="not_completed">Not Completed</option>
              </select>
            </div>

            {/* Ball Owner */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ball Owner
              </label>
              <input
                type="text"
                value={formData.ball_owner}
                onChange={(e) => setFormData({ ...formData, ball_owner: e.target.value })}
                placeholder="Person responsible"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* CA */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                CA (Cooperating Agency)
              </label>
              <input
                type="text"
                value={formData.ca}
                onChange={(e) => setFormData({ ...formData, ca: e.target.value })}
                placeholder="Partner agency"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g., Training"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Sub Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sub Code
              </label>
              <input
                type="text"
                value={formData.sub_code}
                onChange={(e) => setFormData({ ...formData, sub_code: e.target.value })}
                placeholder="e.g., 1221.3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Next Action */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Next Action
              </label>
              <input
                type="text"
                value={formData.next_action}
                onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
                placeholder="What's next?"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Activity details..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
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
              {loading ? 'Saving...' : activity ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

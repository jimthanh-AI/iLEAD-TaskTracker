'use client';

import React, { useState, useEffect } from 'react';
import { supabase, Project, Partner } from '@/lib/supabase';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project?: Project | null;
  partners: Partner[];
}

export function ProjectModal({ isOpen, onClose, onSave, project, partners }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    partner_id: '',
    name: '',
    status: 'not_started' as const,
    sub_code: '',
    start_date: '',
    end_date: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        partner_id: project.partner_id,
        name: project.name,
        status: project.status,
        sub_code: project.sub_code || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        description: project.description || '',
      });
    } else {
      setFormData({
        partner_id: partners[0]?.id || '',
        name: '',
        status: 'not_started',
        sub_code: '',
        start_date: '',
        end_date: '',
        description: '',
      });
    }
    setError('');
  }, [project, isOpen, partners]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError('Project name is required');
        setLoading(false);
        return;
      }

      if (!formData.partner_id) {
        setError('Please select a partner');
        setLoading(false);
        return;
      }

      let result;
      if (project) {
        result = await supabase
          .from('projects')
          .update({
            partner_id: formData.partner_id,
            name: formData.name.trim(),
            status: formData.status,
            sub_code: formData.sub_code || null,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            description: formData.description || null,
          })
          .eq('id', project.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('projects')
          .insert({
            partner_id: formData.partner_id,
            name: formData.name.trim(),
            status: formData.status,
            sub_code: formData.sub_code || null,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            description: formData.description || null,
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;
      if (result.data) onSave(result.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="border-b border-slate-200 px-6 py-4 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-slate-900">
            {project ? 'Edit Project' : 'Add Project'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Partner */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Partner *
            </label>
            <select
              value={formData.partner_id}
              onChange={(e) => setFormData({ ...formData, partner_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select a partner...</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., RBP Training 2026"
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
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="not_completed">Not Completed</option>
            </select>
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Project details..."
              rows={3}
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
              {loading ? 'Saving...' : project ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

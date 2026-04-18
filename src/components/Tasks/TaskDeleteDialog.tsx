'use client';

import React, { useState } from 'react';
import { supabase, Task } from '@/lib/supabase';

interface TaskDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  task: Task | null;
}

export function TaskDeleteDialog({ isOpen, onClose, onDeleted, task }: TaskDeleteProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!task) return;
    setLoading(true);
    setError('');

    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (deleteError) throw deleteError;
      onDeleted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Delete Task</h2>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="text-slate-600">
            Are you sure you want to delete <strong>{task.name}</strong>?
          </p>

          <p className="text-sm text-slate-500">
            This action cannot be undone.
          </p>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

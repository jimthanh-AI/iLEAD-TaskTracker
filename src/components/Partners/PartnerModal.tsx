'use client';

import React, { useState, useEffect } from 'react';
import { supabase, Partner, COLORS } from '@/lib/supabase';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Partner) => void;
  partner?: Partner | null;
}

export function PartnerModal({ isOpen, onClose, onSave, partner }: PartnerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    color: COLORS[0],
    sector: '',
    region: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name,
        color: partner.color,
        sector: partner.sector || '',
        region: partner.region || '',
        notes: partner.notes || '',
      });
    } else {
      setFormData({
        name: '',
        color: COLORS[0],
        sector: '',
        region: '',
        notes: '',
      });
    }
    setError('');
  }, [partner, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        setError('Partner name is required');
        setLoading(false);
        return;
      }

      let result;
      if (partner) {
        // Update existing
        result = await supabase
          .from('partners')
          .update({
            name: formData.name.trim(),
            color: formData.color,
            sector: formData.sector || null,
            region: formData.region || null,
            notes: formData.notes || null,
          })
          .eq('id', partner.id)
          .select()
          .single();
      } else {
        // Create new
        result = await supabase
          .from('partners')
          .insert({
            name: formData.name.trim(),
            color: formData.color,
            sector: formData.sector || null,
            region: formData.region || null,
            notes: formData.notes || null,
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;
      if (result.data) onSave(result.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save partner');
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
            {partner ? 'Edit Partner' : 'Add Partner'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Partner Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Partner Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., VCCI Miền Trung"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Badge Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-full aspect-square rounded-lg border-2 transition-all ${
                    formData.color === color ? 'border-slate-900 scale-110' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sector
            </label>
            <input
              type="text"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              placeholder="e.g., Manufacturing"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Region
            </label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="e.g., Central Vietnam"
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
              placeholder="Additional notes..."
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
              {loading ? 'Saving...' : partner ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

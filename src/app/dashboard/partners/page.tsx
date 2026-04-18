'use client';

import React, { useEffect, useState } from 'react';
import { supabase, Partner } from '@/lib/supabase';
import { PartnerModal } from '@/components/Partners/PartnerModal';
import { PartnerDeleteDialog } from '@/components/Partners/PartnerDeleteDialog';

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [deletePartner, setDeletePartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPartners();
  }, []);

  async function loadPartners() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Failed to load partners:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddPartner = () => {
    setSelectedPartner(null);
    setIsModalOpen(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  const handleSavePartner = (partner: Partner) => {
    if (selectedPartner) {
      // Update
      setPartners(partners.map((p) => (p.id === partner.id ? partner : p)));
    } else {
      // Add new
      setPartners([partner, ...partners]);
    }
  };

  const handleDeleteClick = (partner: Partner) => {
    setDeletePartner(partner);
  };

  const handleDeleteConfirmed = () => {
    if (deletePartner) {
      setPartners(partners.filter((p) => p.id !== deletePartner.id));
    }
  };

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (partner.sector && partner.sector.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (partner.region && partner.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Partners</h1>
        <button
          onClick={handleAddPartner}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Partner
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search partners by name, sector, or region..."
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Partners Grid */}
      {loading ? (
        <p className="text-slate-600">Loading partners...</p>
      ) : filteredPartners.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-4">
            {searchQuery ? 'No partners match your search' : 'No partners yet'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleAddPartner}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create your first partner
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: partner.color }}
                  />
                  <h3 className="font-semibold text-slate-900">{partner.name}</h3>
                </div>
              </div>

              {partner.sector && (
                <p className="text-sm text-slate-600">Sector: {partner.sector}</p>
              )}
              {partner.region && (
                <p className="text-sm text-slate-600">Region: {partner.region}</p>
              )}
              {partner.notes && (
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{partner.notes}</p>
              )}

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleEditPartner(partner)}
                  className="flex-1 px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(partner)}
                  className="flex-1 px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <PartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePartner}
        partner={selectedPartner}
      />

      <PartnerDeleteDialog
        isOpen={!!deletePartner}
        onClose={() => setDeletePartner(null)}
        onDeleted={handleDeleteConfirmed}
        partner={deletePartner}
      />
    </div>
  );
}

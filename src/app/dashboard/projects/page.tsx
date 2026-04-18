'use client';

import React, { useEffect, useState } from 'react';
import { supabase, Project, Partner } from '@/lib/supabase';
import { ProjectModal } from '@/components/Projects/ProjectModal';
import { ProjectDeleteDialog } from '@/components/Projects/ProjectDeleteDialog';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<(Project & { partnerName?: string })[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [partnersRes, projectsRes] = await Promise.all([
        supabase.from('partners').select('*'),
        supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      setPartners(partnersRes.data || []);
      
      const projectsWithPartnerNames = (projectsRes.data || []).map((project) => ({
        ...project,
        partnerName: partnersRes.data?.find((p) => p.id === project.partner_id)?.name || 'Unknown',
      }));
      setProjects(projectsWithPartnerNames);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    const partnerName = partners.find((p) => p.id === project.partner_id)?.name || 'Unknown';
    
    if (selectedProject) {
      setProjects(projects.map((p) => (p.id === project.id ? { ...project, partnerName } : p)));
    } else {
      setProjects([{ ...project, partnerName }, ...projects]);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setDeleteProject(project);
  };

  const handleDeleteConfirmed = () => {
    if (deleteProject) {
      setProjects(projects.filter((p) => p.id !== deleteProject.id));
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.partnerName && project.partnerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-slate-100 text-slate-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'done':
        return 'bg-green-100 text-green-700';
      case 'not_completed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
        <button
          onClick={handleAddProject}
          disabled={partners.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={partners.length === 0 ? 'Create a partner first' : ''}
        >
          + Add Project
        </button>
      </div>

      {partners.length === 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
          👉 Create at least one partner before adding projects.
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects by name or partner..."
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Projects List */}
      {loading ? (
        <p className="text-slate-600">Loading projects...</p>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-4">
            {searchQuery ? 'No projects match your search' : 'No projects yet'}
          </p>
          {!searchQuery && partners.length > 0 && (
            <button
              onClick={handleAddProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{project.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Partner: {project.partnerName}</p>
                  {project.sub_code && (
                    <p className="text-xs text-slate-500">Code: {project.sub_code}</p>
                  )}
                  {project.start_date && project.end_date && (
                    <p className="text-xs text-slate-500">
                      {project.start_date} to {project.end_date}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project)}
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
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={selectedProject}
        partners={partners}
      />

      <ProjectDeleteDialog
        isOpen={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onDeleted={handleDeleteConfirmed}
        project={deleteProject}
      />
    </div>
  );
}

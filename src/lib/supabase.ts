import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database schema
export interface Partner {
  id: string;
  name: string;
  color: string;
  sector?: string;
  region?: string;
  notes?: string;
  created_at: string;
}

export interface Project {
  id: string;
  partner_id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'done' | 'not_completed';
  sub_code?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  pos: number;
  created_at: string;
}

export interface Activity {
  id: string;
  project_id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'done' | 'not_completed';
  stage: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7';
  ball_owner?: string;
  ca?: string;
  type?: string;
  sub_code?: string;
  next_action?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  pos: number;
  created_at: string;
}

export interface Task {
  id: string;
  activity_id: string;
  name: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee?: string;
  due_date?: string;
  notes?: string;
  pos: number;
  created_at: string;
}

export const STAGE_LABELS: Record<string, string> = {
  S1: 'Phát triển Partner',
  S2: 'Thiết kế AAF',
  S3: 'Tìm Advisor',
  S4: 'Virtual Assign.',
  S5: 'In-Country Prep',
  S6: 'In-Country Impl.',
  S7: 'Monitoring',
};

export const COLORS = [
  '#2563eb', '#7c3aed', '#16a34a', '#ea580c', '#dc2626',
  '#0891b2', '#d97706', '#db2777', '#059669', '#6366f1',
];

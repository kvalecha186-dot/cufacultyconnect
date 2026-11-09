import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/* ═════════════════════════════════════════════════════════════════════════════
   DATABASE DATA ACCESS LAYER (SUPABASE)
   ═════════════════════════════════════════════════════════════════════════════ */

export interface DbMentorshipRequest {
  id: string;
  student_id?: string;
  mentor_id?: string;
  topic: string;
  category: string;
  concern: string;
  mode: 'Online' | 'Offline';
  status: 'pending' | 'assigned' | 'accepted' | 'completed' | 'cancelled';
  preferred_date: string;
  preferred_time: string;
  duration?: string;
  meeting_link?: string;
  meeting_location?: string;
  created_at?: string;
  student_profile?: {
    full_name: string;
    uid_or_empid: string;
    section: string;
    course: string;
    semester: number;
    batch: number;
  };
}

// 1. Fetch live incoming requests
export async function getMentorshipRequests(): Promise<DbMentorshipRequest[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('mentorship_requests')
    .select(`
      *,
      student_profile:student_id (
        full_name,
        uid_or_empid,
        section,
        course,
        semester,
        batch
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching mentorship requests from Supabase:', error);
    return [];
  }
  return data || [];
}

// 2. Insert new student session request
export async function createMentorshipRequest(payload: {
  topic: string;
  category: string;
  concern?: string;
  mode: 'Online' | 'Offline';
  preferredDate: string;
  preferredTime: string;
}) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('mentorship_requests')
    .insert([
      {
        topic: payload.topic,
        category: payload.category,
        concern: payload.concern || payload.topic,
        mode: payload.mode,
        preferred_date: payload.preferredDate,
        preferred_time: payload.preferredTime,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting mentorship request:', error);
    return null;
  }
  return data;
}

// 3. Accept a pending request (Faculty)
export async function acceptMentorshipRequest(requestId: string) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('mentorship_requests')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', requestId);

  return !error;
}

// 4. Share meeting link (Faculty Google Meet / Zoom)
export async function shareMeetingLinkSupabase(requestId: string, link: string) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('mentorship_requests')
    .update({
      meeting_link: link,
      status: 'accepted',
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  return !error;
}

// 5. Mark session complete
export async function completeMentorshipRequest(requestId: string) {
  if (!supabase) return false;
  const { error } = await supabase
    .from('mentorship_requests')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', requestId);

  return !error;
}

// 6. Submit feedback & rating
export async function submitSessionFeedbackSupabase(payload: {
  requestId: string;
  rating: number;
  comment: string;
}) {
  if (!supabase) return false;
  const { error } = await supabase.from('session_feedback').insert([
    {
      request_id: payload.requestId,
      rating: payload.rating,
      comment: payload.comment,
    },
  ]);

  return !error;
}

// 7. Realtime subscription channel
export function subscribeToMentorshipChanges(onUpdate: () => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel('mentorship_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'mentorship_requests' },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

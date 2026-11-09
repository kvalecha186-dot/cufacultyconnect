import { useState, useRef, useEffect } from 'react';
import {
  Users, MessageSquare, Trophy, Send, Star,
  Clock, Award, CheckCircle2, Target,
  TrendingUp, Building2, Layers,
  HeartHandshake, Crown, ChevronLeft, BellRing,
} from 'lucide-react';
import { CURRENT_SENIOR, SECTION_STUDENTS } from '../../data/cuAcademicData';

export function SeniorBuddyView({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'freshers': return <MyFreshers />;
    case 'forum': return <DiscussionForum />;
    case 'requests': return <MentorshipRequests />;
    case 'broadcast': return <Opportunities />;
    case 'ratings': return <RatingsFeedback />;
    case 'rewards': return <RewardsLedger />;
    default: return <Overview />;
  }
}

/* ─── SHARED TYPES ─── */
type ChatMsg = { from: 'student' | 'senior'; text: string; time: string };
type FeedbackState = { asked: boolean; submitted: boolean; rating: number; comment: string };

interface FresherQuery {
  id: string;
  name: string;
  initials: string;
  uid: string;
  section: string;
  state: string;
  status: 'Active' | 'Needs Attention';
  lastChat: string;
  query: string;          // the initial question from student
  unread: boolean;
  chatHistory: ChatMsg[];
  feedback: FeedbackState;
}

const STATES = ['Bihar','Kerala','Rajasthan','Maharashtra','Punjab','Tamil Nadu','UP','Gujarat'];
const TIMES  = ['2m ago','10m ago','30m ago','1h ago','2h ago','3h ago'];
const QUERIES = [
  'How do I register for elective subjects on the CU portal?',
  'What is the process to apply for hostel room change?',
  'Can you explain how attendance grading works here?',
  'Which books should I refer for Data Structures in Sem 1?',
  'Is there any scholarship I can apply for as a fresher?',
  'How does the internal exam marking scheme work?',
  'Where can I find the lab schedule for this semester?',
  'What are the rules for library book borrowing?',
];

/* Section-aware fresher data */
const assignedFreshers: FresherQuery[] = SECTION_STUDENTS.filter(s =>
  CURRENT_SENIOR.assignedSections.includes(s.section)
).map((s, i) => ({
  ...s,
  status: i % 3 === 0 ? 'Needs Attention' as const : 'Active' as const,
  lastChat: TIMES[i % TIMES.length],
  state: STATES[i % STATES.length],
  query: QUERIES[i % QUERIES.length],
  unread: i < 2,
  chatHistory: [
    { from: 'student', text: QUERIES[i % QUERIES.length], time: TIMES[i % TIMES.length] },
  ],
  feedback: { asked: false, submitted: false, rating: 0, comment: '' },
}));


function Overview() {
  const sr = CURRENT_SENIOR;
  const activeCount = assignedFreshers.filter(f => f.status === 'Active').length;

  return (
    <div className="space-y-6">

      {/* ══ HERO — dark-navy → red gradient (matches Faculty View) ══ */}
      <div
        className="relative rounded-[24px] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d0a0a 50%, #E30613 100%)' }}
      >
        <div className="absolute -top-14 -right-14 w-56 h-56 bg-white/[0.05] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-white/[0.04] rounded-full pointer-events-none" />
        <div className="absolute top-8 right-52 w-20 h-20 bg-white/[0.05] rounded-full pointer-events-none" />

        <div className="relative p-7 lg:p-10 flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-[72px] h-[72px] rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center shadow-xl">
              <span className="text-white font-extrabold text-[24px]">{sr.initials}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#22C55E] rounded-full border-2 border-white" />
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <p className="text-white/50 text-[11px] font-semibold mb-0.5">👋 Welcome Back</p>
            <h1 className="text-white text-[24px] lg:text-[28px] font-extrabold tracking-tight leading-tight">
              {sr.name}!
            </h1>
            <p className="text-white/60 text-[12px] font-medium mt-0.5">
              {sr.uid} &bull; {sr.course} &bull; Semester {sr.semester} &bull; Block {sr.block}
            </p>
            <p className="text-white/35 text-[11px] italic mt-1.5">
              "Helping freshers navigate their university journey with confidence."
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { label: `Block ${sr.block}`,       icon: Building2       },
                { label: `Semester ${sr.semester}`, icon: Layers          },
                { label: 'Senior Peer Mentor',       icon: HeartHandshake  },
                { label: 'Gold Tier',                icon: Crown           },
              ].map((pill, i) => {
                const Icon = pill.icon;
                return (
                  <div key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[10px] font-bold"
                    style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}>
                    <Icon className="w-3 h-3" />{pill.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══ ANALYTICS CARDS ══ */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            icon: Users, v: `${assignedFreshers.length}`, l: 'Freshers Assigned',
            lines: [`${activeCount} active students`, 'Weekly engagement tracked'],
            insight: '↗ Weekly engagement on track',
            grad: 'linear-gradient(135deg, #0d0d1a 0%, #7a0000 60%, #E30613 100%)',
            glow: 'rgba(227,6,19,0.22)',
          },
          {
            icon: Star, v: '4.8', l: 'Student Satisfaction',
            lines: ['Out of 5.0 rating', '+0.3 monthly improvement'],
            insight: '⭐ Top 5% of all peer mentors',
            grad: 'linear-gradient(135deg, #0d0a1a 0%, #1e1060 55%, #4c30c4 100%)',
            glow: 'rgba(76,48,196,0.22)',
          },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="relative rounded-[18px] overflow-hidden p-4 flex flex-col gap-3"
              style={{ background: m.grad, boxShadow: `0 4px 24px ${m.glow}` }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-white text-[26px] font-extrabold leading-none">{m.v}</p>
                <p className="text-white/60 text-[11px] font-semibold mt-1">{m.l}</p>
              </div>
              <div className="space-y-0.5">
                {m.lines.map((ln, j) => (
                  <p key={j} className="text-white/45 text-[10px]">{ln}</p>
                ))}
              </div>
              <div className="mt-auto pt-2 border-t border-white/10">
                <p className="text-white/70 text-[10px] font-semibold">{m.insight}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══ FRESHER QUERY INBOX ══ */}
      <FresherQueryInbox />

    </div>
  );
}

/* ═══════════════════════════════════════════════════════ */
/*  FRESHER QUERY INBOX + CHAT (used in Overview)         */
/* ═══════════════════════════════════════════════════════ */
function FresherQueryInbox() {
  const [queries, setQueries] = useState<FresherQuery[]>(assignedFreshers);
  const [activeChat, setActiveChat] = useState<FresherQuery | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.chatHistory]);

  const unreadCount = queries.filter(q => q.unread).length;

  function openChat(q: FresherQuery) {
    setQueries(prev => prev.map(f => f.uid === q.uid ? { ...f, unread: false } : f));
    setActiveChat({ ...q, unread: false });
    setMsgInput('');
  }

  function sendMsg() {
    if (!msgInput.trim() || !activeChat) return;
    const newMsg: ChatMsg = { from: 'senior', text: msgInput.trim(), time: 'now' };
    const updated = { ...activeChat, chatHistory: [...activeChat.chatHistory, newMsg] };
    setActiveChat(updated);
    setQueries(prev => prev.map(f => f.uid === updated.uid ? updated : f));
    setMsgInput('');
  }

  function askFeedback() {
    if (!activeChat) return;
    const updated = { ...activeChat, feedback: { ...activeChat.feedback, asked: true } };
    // simulate student sending a feedback request message
    const sysMsg: ChatMsg = { from: 'senior', text: '⭐ Please rate this session — tap the stars below to share your feedback!', time: 'now' };
    updated.chatHistory = [...updated.chatHistory, sysMsg];
    setActiveChat(updated);
    setQueries(prev => prev.map(f => f.uid === updated.uid ? updated : f));
  }

  function submitFeedback(rating: number, comment: string) {
    if (!activeChat) return;
    const replyMsg: ChatMsg = { from: 'student', text: `Thanks for the help! I'd give this session ${rating} ⭐${comment ? ' — ' + comment : ''}`, time: 'now' };
    const updated: FresherQuery = {
      ...activeChat,
      chatHistory: [...activeChat.chatHistory, replyMsg],
      feedback: { asked: true, submitted: true, rating, comment },
    };
    setActiveChat(updated);
    setQueries(prev => prev.map(f => f.uid === updated.uid ? updated : f));
  }

  /* ── CHAT PANEL ── */
  if (activeChat) {
    const fb = activeChat.feedback;
    // locked = feedback asked but student hasn't submitted yet
    const locked = fb.asked && !fb.submitted;
    return (
      <div className="bg-white rounded-[18px] border border-[#F0F0F0] overflow-hidden flex flex-col" style={{ height: '540px' }}>

        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F0F0F0] bg-[#FAFAFA]">
          {/* Back button — hidden while locked, visible otherwise */}
          {!locked ? (
            <button onClick={() => setActiveChat(null)}
              className="w-7 h-7 rounded-lg bg-[#E30613]/8 hover:bg-[#E30613]/15 flex items-center justify-center transition-colors shrink-0">
              <ChevronLeft className="w-4 h-4 text-[#E30613]" />
            </button>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0" title="Locked until student submits feedback">
              🔒
            </div>
          )}
          <div className="w-9 h-9 rounded-full bg-[#E30613]/10 flex items-center justify-center shrink-0">
            <span className="text-[12px] font-bold text-[#E30613]">{activeChat.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#1a1a1a] truncate">{activeChat.name}</p>
            <p className="text-[10px] text-[#999]">{activeChat.uid} &bull; {activeChat.section}</p>
          </div>
          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${
            activeChat.status === 'Active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-amber-50 text-amber-600'
          }`}>{activeChat.status}</span>
          {!fb.asked && !fb.submitted && (
            <button onClick={askFeedback}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 text-[10px] font-bold rounded-[8px] transition-colors">
              <Star className="w-3 h-3" /> Ask Feedback
            </button>
          )}
          {locked && (
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full animate-pulse">
              Awaiting feedback…
            </span>
          )}
          {fb.submitted && (
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-3.5 h-3.5 ${s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-[#DDD]'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F9F9FB]">
          {activeChat.chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'senior' ? 'justify-end' : 'justify-start'}`}>
              {msg.from === 'student' && (
                <div className="w-6 h-6 rounded-full bg-[#E30613]/10 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                  <span className="text-[8px] font-bold text-[#E30613]">{activeChat.initials}</span>
                </div>
              )}
              <div className={`max-w-[72%] px-3.5 py-2.5 rounded-[14px] text-[12px] leading-relaxed ${
                msg.from === 'senior'
                  ? 'bg-[#E30613] text-white rounded-br-[4px]'
                  : 'bg-white text-[#1a1a1a] border border-[#F0F0F0] rounded-bl-[4px] shadow-sm'
              }`}>
                {msg.text}
                <p className={`text-[9px] mt-1 ${msg.from === 'senior' ? 'text-white/60' : 'text-[#BBB]'}`}>{msg.time}</p>
              </div>
            </div>
          ))}

          {/* Feedback widget — student-only, senior sees it as read-only/awaiting */}
          {fb.asked && !fb.submitted && (
            <div className="flex justify-start">
              <div className="bg-white border border-[#F0F0F0] shadow-sm rounded-[14px] rounded-bl-[4px] p-4 max-w-[80%] pointer-events-none select-none"
                style={{ opacity: 0.92 }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <p className="text-[11px] font-semibold text-[#999]">Waiting for student to rate…</p>
                </div>
                <div className="flex gap-1.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-6 h-6 text-[#DDD]" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {fb.submitted && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="text-[11px] font-semibold text-[#22C55E]">Session rated {fb.rating}/5 ⭐</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-[#F0F0F0] bg-white flex gap-2 items-end">
          <textarea
            value={msgInput}
            onChange={e => setMsgInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
            placeholder="Type your reply…"
            rows={1}
            className="flex-1 px-3.5 py-2.5 rounded-[12px] border border-[#E5E5E5] text-[12px] outline-none focus:border-[#E30613]/40 resize-none bg-[#FAFAFA]"
          />
          <button onClick={sendMsg}
            className="w-9 h-9 rounded-[10px] bg-[#E30613] hover:bg-[#c0000f] flex items-center justify-center transition-colors shrink-0">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    );
  }

  /* ── INBOX LIST ── */
  return (
    <div className="bg-white rounded-[18px] border border-[#F0F0F0] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
        <h3 className="text-[13px] font-bold text-[#1a1a1a] flex items-center gap-2">
          <BellRing className="w-4 h-4 text-[#E30613]" /> Fresher Queries
        </h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold text-white bg-[#E30613] px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
          <span className="text-[10px] font-bold text-[#999] bg-[#F5F5F5] px-2.5 py-1 rounded-full">
            {queries.length} total
          </span>
        </div>
      </div>

      {/* Query cards */}
      <div className="divide-y divide-[#F5F5F5]">
        {queries.map((q) => (
          <button
            key={q.uid}
            onClick={() => openChat(q)}
            className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-[#FAFAFA] transition-colors text-left group"
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#E30613]/10 flex items-center justify-center">
                <span className="text-[11px] font-bold text-[#E30613]">{q.initials}</span>
              </div>
              {q.unread && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#E30613] rounded-full border-2 border-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className={`text-[12px] truncate ${q.unread ? 'font-bold text-[#1a1a1a]' : 'font-semibold text-[#444]'}`}>
                  {q.name}
                </p>
                <span className="text-[9px] text-[#BBB] shrink-0">{q.section}</span>
              </div>
              <p className={`text-[11px] truncate leading-snug ${q.unread ? 'text-[#333]' : 'text-[#999]'}`}>
                {q.query}
              </p>
            </div>

            {/* Meta */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[9px] text-[#BBB] flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />{q.lastChat}
              </span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                q.status === 'Active' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-amber-50 text-amber-600'
              }`}>{q.status}</span>
              {q.feedback.submitted && (
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-2.5 h-2.5 ${s <= q.feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-[#DDD]'}`} />
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════ */
/*  MY FRESHERS TAB                                        */
/* ═══════════════════════════════════════════════════════ */
function MyFreshers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Needs Attention'>('All');

  const filtered = assignedFreshers.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.section.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || f.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search fresher by name or section…"
          className="flex-1 px-4 py-2.5 rounded-[12px] border border-[#E5E5E5] text-[13px] outline-none focus:border-[#E30613]/40 bg-white"
        />
        <div className="flex gap-2">
          {(['All','Active','Needs Attention'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-[10px] text-[11px] font-bold transition-all ${
                filter === f
                  ? 'bg-[#E30613] text-white'
                  : 'bg-white border border-[#E5E5E5] text-[#666] hover:border-[#E30613]/30'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[18px] border border-[#F0F0F0] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-[#1a1a1a] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E30613]" /> Assigned Freshers
          </h3>
          <span className="text-[10px] font-bold text-[#999]">{filtered.length} shown</span>
        </div>
        <div className="divide-y divide-[#F5F5F5]">
          {filtered.map((f, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-[#FAFAFA] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#E30613]/10 flex items-center justify-center shrink-0">
                <span className="text-[12px] font-bold text-[#E30613]">{f.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1a1a1a] truncate">{f.name}</p>
                <p className="text-[11px] text-[#999]">{f.uid} &bull; {f.section} &bull; {f.state}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  f.status === 'Active'
                    ? 'bg-[#22C55E]/10 text-[#22C55E]'
                    : 'bg-amber-50 text-amber-600'
                }`}>{f.status}</span>
                <span className="text-[10px] text-[#BBB] flex items-center gap-1">
                  <Clock className="w-3 h-3" />{f.lastChat}
                </span>
                <button className="w-7 h-7 rounded-lg bg-[#E30613]/8 hover:bg-[#E30613]/15 flex items-center justify-center transition-colors">
                  <MessageSquare className="w-3.5 h-3.5 text-[#E30613]" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-10 text-center text-[#BBB] text-[13px]">No freshers match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════ */
/*  DISCUSSION FORUM TAB                                   */
/* ═══════════════════════════════════════════════════════ */
function DiscussionForum() {
  const [newPost, setNewPost] = useState('');
  const posts = [
    { author: 'Aryan Sharma', section: 'CSE-A', time: '10m ago', text: 'Can someone explain how hostel mess timing works in semester 1?', replies: 3, likes: 7 },
    { author: 'Priya Nair',   section: 'CSE-B', time: '45m ago', text: 'Which books are recommended for Data Structures?', replies: 5, likes: 12 },
    { author: 'Rohit Kumar',  section: 'CSE-C', time: '2h ago',  text: 'Is attendance mandatory for all labs or just theory?', replies: 2, likes: 4 },
    { author: 'Sneha Gupta',  section: 'CSE-A', time: '5h ago',  text: 'Tips for first internal exam preparation?', replies: 8, likes: 19 },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[18px] border border-[#F0F0F0] p-4">
        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Post a tip, announcement, or answer for your freshers…"
          rows={3}
          className="w-full px-4 py-3 rounded-[12px] border border-[#E5E5E5] text-[13px] outline-none focus:border-[#E30613]/40 resize-none bg-[#FAFAFA]"
        />
        <div className="flex justify-end mt-3">
          <button onClick={() => setNewPost('')}
            className="flex items-center gap-2 px-4 py-2 bg-[#E30613] text-white text-[12px] font-bold rounded-[10px] hover:bg-[#c0000f] transition-colors">
            <Send className="w-3.5 h-3.5" /> Post to Forum
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {posts.map((p, i) => (
          <div key={i} className="bg-white rounded-[16px] border border-[#F0F0F0] p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#E30613]/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#E30613]">{p.author.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#1a1a1a]">{p.author}</p>
                <p className="text-[10px] text-[#999]">{p.section} &bull; {p.time}</p>
              </div>
            </div>
            <p className="text-[13px] text-[#333] leading-relaxed">{p.text}</p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F5F5F5]">
              <span className="text-[11px] text-[#999] flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />{p.replies} replies
              </span>
              <span className="text-[11px] text-[#999] flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />{p.likes} likes
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════ */
/*  MENTORSHIP REQUESTS TAB                               */
/* ═══════════════════════════════════════════════════════ */
function MentorshipRequests() {
  const requests = [
    { name: 'Kavya Reddy',    section: 'CSE-A', concern: 'Struggling with C programming assignments', time: '1h ago',  urgency: 'High'   },
    { name: 'Amit Joshi',     section: 'CSE-B', concern: 'Need guidance on CU portal registration',  time: '3h ago',  urgency: 'Medium' },
    { name: 'Divya Sharma',   section: 'CSE-C', concern: 'Hostel room change process unclear',       time: '5h ago',  urgency: 'Low'    },
    { name: 'Nikhil Verma',   section: 'CSE-A', concern: 'Fee payment deadline clarification needed',time: '1d ago',  urgency: 'High'   },
    { name: 'Pooja Mehta',    section: 'CSE-B', concern: 'Library access and book borrowing process',time: '2d ago',  urgency: 'Low'    },
  ];

  const urgencyStyle = (u: string) =>
    u === 'High'   ? 'bg-red-50 text-[#E30613]' :
    u === 'Medium' ? 'bg-amber-50 text-amber-600' :
                     'bg-green-50 text-green-600';

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending',   v: requests.length, color: '#E30613' },
          { label: 'Resolved this week', v: 12, color: '#22C55E' },
          { label: 'Avg Response',       v: '2.4h', color: '#7C3AED' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-[14px] border border-[#F0F0F0] p-4 text-center">
            <p className="text-[22px] font-extrabold" style={{ color: s.color }}>{s.v}</p>
            <p className="text-[11px] text-[#999] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-[18px] border border-[#F0F0F0] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5]">
          <h3 className="text-[13px] font-bold text-[#1a1a1a] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#E30613]" /> Open Requests
          </h3>
        </div>
        <div className="divide-y divide-[#F5F5F5]">
          {requests.map((r, i) => (
            <div key={i} className="p-4 flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-[#E30613]/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-bold text-[#E30613]">{r.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-semibold text-[#1a1a1a]">{r.name}</p>
                  <span className="text-[10px] text-[#999]">{r.section}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${urgencyStyle(r.urgency)}`}>{r.urgency}</span>
                </div>
                <p className="text-[12px] text-[#555] mt-1 leading-relaxed">{r.concern}</p>
                <p className="text-[10px] text-[#BBB] mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{r.time}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="px-3 py-1.5 bg-[#E30613] text-white text-[10px] font-bold rounded-[8px] hover:bg-[#c0000f] transition-colors">
                  Respond
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════ */
/*  OPPORTUNITIES / BROADCAST TAB                         */
/* ═══════════════════════════════════════════════════════ */
function Opportunities() {
  const [message, setMessage] = useState('');
  const broadcasts = [
    { title: 'Mid-Sem Exam Schedule Released', time: '2h ago', reach: assignedFreshers.length, type: 'Academic' },
    { title: 'Hackathon Registration Open — Team up!', time: '1d ago', reach: Math.floor(assignedFreshers.length * 0.8), type: 'Event' },
    { title: 'Library Extended Hours This Week', time: '2d ago', reach: assignedFreshers.length, type: 'Info' },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[18px] border border-[#F0F0F0] p-5">
        <h3 className="text-[13px] font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
          <Send className="w-4 h-4 text-[#E30613]" /> Broadcast to Freshers
        </h3>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Write an important update, opportunity, or announcement for your freshers…"
          rows={4}
          className="w-full px-4 py-3 rounded-[12px] border border-[#E5E5E5] text-[13px] outline-none focus:border-[#E30613]/40 resize-none bg-[#FAFAFA]"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-[11px] text-[#999]">Will reach <span className="font-bold text-[#1a1a1a]">{assignedFreshers.length} freshers</span></p>
          <button onClick={() => setMessage('')}
            className="flex items-center gap-2 px-4 py-2 bg-[#E30613] text-white text-[12px] font-bold rounded-[10px] hover:bg-[#c0000f] transition-colors">
            <Send className="w-3.5 h-3.5" /> Send Broadcast
          </button>
        </div>
      </div>
      <div className="bg-white rounded-[18px] border border-[#F0F0F0] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5]">
          <h3 className="text-[13px] font-bold text-[#1a1a1a]">Recent Broadcasts</h3>
        </div>
        <div className="divide-y divide-[#F5F5F5]">
          {broadcasts.map((b, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#1a1a1a]">{b.title}</p>
                <p className="text-[11px] text-[#999] mt-0.5 flex items-center gap-2">
                  <Clock className="w-3 h-3" />{b.time}
                  <span className="w-1 h-1 rounded-full bg-[#DDD] inline-block" />
                  {b.reach} recipients
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E30613]/8 text-[#E30613]">{b.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════ */
/*  RATINGS & FEEDBACK TAB                                */
/* ═══════════════════════════════════════════════════════ */
function RatingsFeedback() {
  const reviews = [
    { name: 'Aryan Sharma',  section: 'CSE-A', rating: 5, text: 'Always available and explains things clearly. Best senior buddy!', time: '3d ago' },
    { name: 'Priya Nair',    section: 'CSE-B', rating: 5, text: 'Helped me understand the campus in the first week. Very supportive.', time: '5d ago' },
    { name: 'Rohit Kumar',   section: 'CSE-C', rating: 4, text: 'Good guidance on academics and hostel. Response could be faster.', time: '1w ago' },
    { name: 'Sneha Gupta',   section: 'CSE-A', rating: 5, text: 'Made the transition so smooth. Thank you!', time: '1w ago' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Overall Rating', v: '4.8', sub: 'out of 5.0', color: '#D97706' },
          { label: 'Total Reviews',  v: '24',  sub: 'this semester', color: '#7C3AED' },
          { label: 'Mentor Rank',    v: '#4',  sub: 'in your block', color: '#E30613' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-[14px] border border-[#F0F0F0] p-4 text-center">
            <p className="text-[24px] font-extrabold" style={{ color: s.color }}>{s.v}</p>
            <p className="text-[10px] text-[#999] mt-0.5">{s.sub}</p>
            <p className="text-[11px] font-semibold text-[#555] mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-[18px] border border-[#F0F0F0] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5]">
          <h3 className="text-[13px] font-bold text-[#1a1a1a] flex items-center gap-2">
            <Star className="w-4 h-4 text-[#D97706]" /> Fresher Reviews
          </h3>
        </div>
        <div className="divide-y divide-[#F5F5F5]">
          {reviews.map((r, i) => (
            <div key={i} className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#E30613]/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#E30613]">{r.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-bold text-[#1a1a1a]">{r.name}</p>
                    <span className="text-[10px] text-[#999]">{r.section}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < r.rating ? 'text-[#D97706] fill-[#D97706]' : 'text-[#DDD]'}`} />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-[#BBB]">{r.time}</span>
              </div>
              <p className="text-[12px] text-[#555] leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════ */
/*  REWARDS LEDGER TAB                                    */
/* ═══════════════════════════════════════════════════════ */
function RewardsLedger() {
  const ledger = [
    { action: 'Resolved 5 queries this week',      points: 50,  date: 'Today',     icon: CheckCircle2, color: '#22C55E' },
    { action: 'Broadcast sent to all freshers',    points: 15,  date: 'Yesterday', icon: Send,         color: '#7C3AED' },
    { action: 'Top-rated mentor of the week',      points: 100, date: '3 days ago',icon: Trophy,       color: '#D97706' },
    { action: 'Forum post with 10+ engagements',   points: 20,  date: '5 days ago',icon: MessageSquare,color: '#0284C7' },
    { action: 'Session booking completed',         points: 35,  date: '1 week ago', icon: Award,       color: '#E30613' },
  ];

  return (
    <div className="space-y-5">
      <div
        className="relative rounded-[18px] overflow-hidden p-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1a1000 0%, #5c3a00 55%, #d97706 100%)' }}
      >
        <Trophy className="w-10 h-10 text-white/80 mx-auto mb-2" />
        <p className="text-white text-[40px] font-extrabold leading-none">650</p>
        <p className="text-white/60 text-[13px] mt-1">Total Reward Points</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
            <p className="text-white font-bold text-[16px]">Gold</p>
            <p className="text-white/50 text-[10px]">Current Tier</p>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <p className="text-white font-bold text-[16px]">#4</p>
            <p className="text-white/50 text-[10px]">Block Rank</p>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <p className="text-white font-bold text-[16px]">350</p>
            <p className="text-white/50 text-[10px]">to Platinum</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-[18px] border border-[#F0F0F0] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5]">
          <h3 className="text-[13px] font-bold text-[#1a1a1a] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#E30613]" /> Points History
          </h3>
        </div>
        <div className="divide-y divide-[#F5F5F5]">
          {ledger.map((l, i) => {
            const Icon = l.icon;
            return (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${l.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: l.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[#1a1a1a] truncate">{l.action}</p>
                  <p className="text-[10px] text-[#BBB] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{l.date}
                  </p>
                </div>
                <span className="text-[13px] font-extrabold shrink-0" style={{ color: l.color }}>
                  +{l.points} pts
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   StudySync Pro — app.js
   ===================================================== */

'use strict';

/* ═══════════════════════════════════════════
   GLOBAL STATE
   ═══════════════════════════════════════════ */
const state = {
  currentSection: 'home',
  profile: null,
  selectedColor: '#22d3ee',
  timer: {
    totalSeconds: 1500,
    remaining: 1500,
    interval: null,
    running: false,
    mode: 'Focus',
    sessions: 0,
    streak: 0,
    todayMins: 0,
    lastDate: null,
  },
  leaderboardFilter: 'weekly',
  currentChannel: '#general',
  inRoom: null,
  tasks: [],
  messages: { '#general': [], '#math': [], '#science': [], '#coding': [], '#motivation': [] },
};

/* ═══════════════════════════════════════════
   ADVERTISEMENT DATA
   ═══════════════════════════════════════════ */
const ADS = [
  { icon: '📚', title: 'Coursera Plus — 7 Days Free', desc: 'Access 7000+ courses. Start learning today!', url: '#' },
  { icon: '💼', title: 'Internshala Internships', desc: 'Find top internships for students near you.', url: '#' },
  { icon: '🤖', title: 'ChatGPT Plus for Students', desc: 'Get GPT-4 at 50% off with student email.', url: '#' },
  { icon: '📝', title: 'Notion for Education', desc: 'Free Notion Pro plan for students & teachers.', url: '#' },
  { icon: '🎓', title: 'NPTEL Courses — Free', desc: 'Government-certified free courses. Enroll now.', url: '#' },
  { icon: '⚡', title: 'Grammarly Premium', desc: 'Perfect your assignments with Grammarly AI.', url: '#' },
];

/* ═══════════════════════════════════════════
   LEADERBOARD DATA
   ═══════════════════════════════════════════ */
const LEADERBOARD_DATA = {
  weekly: [
    { name: 'Priya Sharma',    mins: 840, color: '#22d3ee' },
    { name: 'Rohan Mehta',     mins: 780, color: '#a855f7' },
    { name: 'Anjali Verma',    mins: 720, color: '#f59e0b' },
    { name: 'Karan Patel',     mins: 665, color: '#10b981' },
    { name: 'Neha Gupta',      mins: 620, color: '#ef4444' },
    { name: 'Vikram Singh',    mins: 590, color: '#3b82f6' },
    { name: 'Shreya Joshi',    mins: 540, color: '#ec4899' },
    { name: 'Amit Kumar',      mins: 490, color: '#f97316' },
    { name: 'Divya Nair',      mins: 430, color: '#6366f1' },
    { name: 'Rahul Tiwari',    mins: 375, color: '#14b8a6' },
  ],
  monthly: [
    { name: 'Rohan Mehta',     mins: 3200, color: '#a855f7' },
    { name: 'Priya Sharma',    mins: 3100, color: '#22d3ee' },
    { name: 'Vikram Singh',    mins: 2800, color: '#3b82f6' },
    { name: 'Anjali Verma',    mins: 2650, color: '#f59e0b' },
    { name: 'Karan Patel',     mins: 2400, color: '#10b981' },
    { name: 'Shreya Joshi',    mins: 2300, color: '#ec4899' },
    { name: 'Neha Gupta',      mins: 2100, color: '#ef4444' },
    { name: 'Amit Kumar',      mins: 1900, color: '#f97316' },
    { name: 'Rahul Tiwari',    mins: 1750, color: '#14b8a6' },
    { name: 'Divya Nair',      mins: 1600, color: '#6366f1' },
  ],
  alltime: [
    { name: 'Vikram Singh',    mins: 14800, color: '#3b82f6' },
    { name: 'Priya Sharma',    mins: 13900, color: '#22d3ee' },
    { name: 'Anjali Verma',    mins: 12500, color: '#f59e0b' },
    { name: 'Rohan Mehta',     mins: 11200, color: '#a855f7' },
    { name: 'Shruti Rao',      mins: 10800, color: '#ec4899' },
    { name: 'Karan Patel',     mins: 9900,  color: '#10b981' },
    { name: 'Divya Nair',      mins: 9400,  color: '#6366f1' },
    { name: 'Neha Gupta',      mins: 8600,  color: '#ef4444' },
    { name: 'Rahul Tiwari',    mins: 7800,  color: '#14b8a6' },
    { name: 'Amit Kumar',      mins: 7200,  color: '#f97316' },
  ],
};

/* ═══════════════════════════════════════════
   ROOM DATA
   ═══════════════════════════════════════════ */
const ROOMS = [
  { id: 1, name: 'JEE Advance 2026', topic: 'Physics & Maths', desc: 'Focused prep for JEE Advanced. No distractions.', members: 12, max: 20, active: true },
  { id: 2, name: 'Web Dev Bootcamp', topic: 'Coding', desc: 'MERN stack project help and code reviews.', members: 8,  max: 15, active: true },
  { id: 3, name: 'UPSC Daily Prep',  topic: 'Civil Services', desc: 'Daily current affairs & prelims discussion.', members: 25, max: 30, active: true },
  { id: 4, name: 'Data Science Hub', topic: 'ML & AI', desc: 'ML projects, paper discussion and mentorship.', members: 6,  max: 10, active: true },
  { id: 5, name: 'NEET Biology',     topic: 'Biology', desc: 'Chapter-wise revision and MCQ practice.', members: 18, max: 25, active: true },
  { id: 6, name: 'CAT Quant Masters', topic: 'Aptitude', desc: 'Speed maths and number theory tricks.', members: 9,  max: 20, active: false },
];
let filteredRooms = [...ROOMS];

/* ═══════════════════════════════════════════
   ONLINE USERS (Chat)
   ═══════════════════════════════════════════ */
const ONLINE_USERS = [
  { name: 'Priya S.',   color: '#22d3ee' },
  { name: 'Rohan M.',   color: '#a855f7' },
  { name: 'Anjali V.',  color: '#f59e0b' },
];
const PRESET_MESSAGES = {
  '#general': [
    { name: 'Priya S.',  color: '#22d3ee', text: 'Good morning everyone! Ready to grind? 💪', time: '9:02 AM' },
    { name: 'Rohan M.',  color: '#a855f7', text: 'Let\'s gooo! 3 hours deep work session starting now 🎯', time: '9:05 AM' },
    { name: 'Anjali V.', color: '#f59e0b', text: 'Just finished chapter 5 of Organic Chem. Feeling great!', time: '9:15 AM' },
  ],
  '#coding': [
    { name: 'Rohan M.', color: '#a855f7', text: 'Anyone have a good resource for system design?', time: '10:00 AM' },
    { name: 'Priya S.', color: '#22d3ee', text: 'Check out "Designing Data-Intensive Applications" — it\'s a gem 📖', time: '10:03 AM' },
  ],
  '#motivation': [
    { name: 'Anjali V.', color: '#f59e0b', text: '"Success is the sum of small efforts repeated day in and day out." 🌟', time: '8:45 AM' },
  ],
};

/* ═══════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════ */
function navigateTo(sectionId) {
  // Hide current
  const current = document.querySelector('.section.active');
  if (current) {
    current.classList.remove('active', 'visible');
  }

  // Show target
  const target = document.getElementById(sectionId);
  if (!target) return;
  target.classList.add('active');
  target.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      target.classList.add('visible');
    });
  });

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === sectionId);
  });

  // Close mobile menu
  closeMenu();
  state.currentSection = sectionId;

  // Lazy init sections
  if (sectionId === 'leaderboard') renderLeaderboard();
  if (sectionId === 'room')        renderRooms();
  if (sectionId === 'chat')        initChat();
  if (sectionId === 'premium')     renderPremiumAds();
}

/* Nav link click listeners */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.section);
  });
});

/* Hamburger toggle */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}

/* Navbar scroll effect */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});

/* ═══════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════ */
let toastTimer;
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

/* ═══════════════════════════════════════════
   PROFILE MODAL
   ═══════════════════════════════════════════ */
function openProfileModal() {
  document.getElementById('profileModal').classList.add('show');
  if (state.profile) showProfileView();
  else                showProfileSetup();
}
function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('show');
}

function showProfileSetup() {
  document.getElementById('profileSetup').style.display = '';
  document.getElementById('profileView').style.display  = 'none';
  document.getElementById('profileTitle').textContent    = 'Create Profile';
  document.getElementById('profileSubtitle').textContent = 'Set up your StudySync identity';
}
function showProfileView() {
  document.getElementById('profileSetup').style.display = 'none';
  document.getElementById('profileView').style.display  = '';
  document.getElementById('profileTitle').textContent    = state.profile.name;
  document.getElementById('profileSubtitle').textContent = 'StudySync Member';
  updateProfileView();
}
function editProfile() { showProfileSetup(); }

/* Color picker */
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
    dot.classList.add('selected');
    state.selectedColor = dot.dataset.color;
    document.getElementById('avatarPreview').style.background = state.selectedColor;
    if (document.getElementById('profileName').value) {
      document.getElementById('avatarPreview').textContent =
        document.getElementById('profileName').value.charAt(0).toUpperCase();
    }
  });
});
document.getElementById('profileName').addEventListener('input', e => {
  const v = e.target.value;
  const av = document.getElementById('avatarPreview');
  av.textContent = v ? v.charAt(0).toUpperCase() : '?';
  av.style.background = state.selectedColor;
});

function saveProfile() {
  const name = document.getElementById('profileName').value.trim();
  const goal = parseInt(document.getElementById('profileGoal').value) || 4;
  if (!name) { showToast('⚠️ Please enter your name'); return; }

  state.profile = {
    name,
    color: state.selectedColor,
    goalHrs: goal,
    sessions: state.timer.sessions,
    totalMins: state.timer.todayMins,
    streak: state.timer.streak,
  };
  showToast(`✅ Welcome, ${name}! Profile saved.`);
  showProfileView();
  // Update nav button
  document.getElementById('profileBtn').textContent = `👤 ${name.split(' ')[0]}`;
  // Possibly grant gold badge
  checkGoldBadge();
}

function updateProfileView() {
  if (!state.profile) return;
  const p = state.profile;
  const totalMins = state.timer.todayMins + (state.timer.sessions * 25);
  document.getElementById('pv-sessions').textContent = state.timer.sessions;
  document.getElementById('pv-hours').textContent    = fmtTime(totalMins * 60);
  document.getElementById('pv-streak').textContent   = state.timer.streak + '🔥';
  document.getElementById('pv-goal').textContent     = p.goalHrs + ' hrs';

  const pct = Math.min(100, ((totalMins / 60) / p.goalHrs) * 100);
  document.getElementById('goalBar').style.width = pct + '%';

  // Avatar
  document.getElementById('avatarPreview').textContent       = p.name.charAt(0).toUpperCase();
  document.getElementById('avatarPreview').style.background  = p.color;

  // Badges
  const br = document.getElementById('badgeRow');
  br.innerHTML = '';
  const totalHours = totalMins / 60;
  if (totalHours >= 10 || p.verified) {
    br.innerHTML += '<div class="badge-item">✅ Gold Verified</div>';
  }
  if (state.timer.streak >= 7) {
    br.innerHTML += '<div class="badge-item">🔥 7-Day Streak</div>';
  }
  if (state.timer.sessions >= 10) {
    br.innerHTML += '<div class="badge-item">⏱️ Focus Master</div>';
  }
}

function checkGoldBadge() {
  if (!state.profile) return;
  const totalMins = state.timer.todayMins + (state.timer.sessions * 25);
  if (totalMins / 60 >= 10 && !state.profile.verified) {
    state.profile.verified = true;
    showToast('🎉 Congrats! You earned the Gold Verified Badge! 🏅');
  }
}

/* ═══════════════════════════════════════════
   TIMER
   ═══════════════════════════════════════════ */
const CIRCUMFERENCE = 2 * Math.PI * 88; // r=88
const progressCircle = document.getElementById('timerProgress');
progressCircle.style.strokeDasharray  = CIRCUMFERENCE;
progressCircle.style.strokeDashoffset = 0;

function setMode(btn, mins, label) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  resetTimer(mins * 60, label);
}

function applyCustom() {
  let h = parseInt(document.getElementById('customHrs').value) || 0;
  let m = parseInt(document.getElementById('customMins').value) || 0;
  if (h > 999) { h = 999; document.getElementById('customHrs').value = h; }
  if (m > 59) { m = 59; document.getElementById('customMins').value = m; }
  const total = h * 3600 + m * 60;
  if (total < 60) { showToast('⚠️ Time must be at least 1 minute'); return; }
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  resetTimer(total, 'Manual');
}

function resetTimer(totalSecs, label) {
  pauseTimer();
  const t = totalSecs !== undefined ? totalSecs : state.timer.totalSeconds;
  const l = label    !== undefined ? label     : state.timer.mode;
  state.timer.totalSeconds = t;
  state.timer.remaining    = t;
  state.timer.mode         = l;
  state.timer.running      = false;
  document.getElementById('startPauseBtn').textContent = '▶ Start';
  
  const timeStr = fmtTime(t);
  const timeEl = document.getElementById('timerTime');
  timeEl.textContent = timeStr;
  timeEl.style.fontSize = timeStr.length >= 8 ? '2rem' : timeStr.length > 5 ? '2.4rem' : '3rem';
  
  document.getElementById('timerLabel').textContent    = l;
  setProgress(1);
  // stroke color by mode
  const colors = { Focus: '#22d3ee', 'Short Break': '#10b981', 'Long Break': '#a855f7', Custom: '#f59e0b' };
  progressCircle.style.stroke = colors[l] || '#22d3ee';
}

function toggleTimer() {
  if (state.timer.running) pauseTimer();
  else startTimer();
}

function startTimer() {
  if (state.timer.running) return;
  state.timer.running = true;
  document.getElementById('startPauseBtn').textContent = '⏸ Pause';
  state.timer.interval = setInterval(tickTimer, 1000);
}

function pauseTimer() {
  clearInterval(state.timer.interval);
  state.timer.interval = null;
  state.timer.running  = false;
  document.getElementById('startPauseBtn').textContent = '▶ Start';
}

function skipTimer() {
  pauseTimer();
  completeSession();
}

function tickTimer() {
  if (state.timer.remaining <= 0) {
    completeSession();
    return;
  }
  state.timer.remaining--;
  
  const timeStr = fmtTime(state.timer.remaining);
  const timeEl = document.getElementById('timerTime');
  timeEl.textContent = timeStr;
  timeEl.style.fontSize = timeStr.length >= 8 ? '2rem' : timeStr.length > 5 ? '2.4rem' : '3rem';
  
  setProgress(state.timer.remaining / state.timer.totalSeconds);
}

function setProgress(pct) {
  progressCircle.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct);
}

function completeSession() {
  pauseTimer();
  if (state.timer.mode === 'Focus' || state.timer.mode === 'Custom') {
    state.timer.sessions++;
    const minsStudied = Math.round(state.timer.totalSeconds / 60);
    state.timer.todayMins += minsStudied;

    // Streak logic (simple: count sessions)
    if (state.timer.sessions % 4 === 0) state.timer.streak++;

    updateTimerStats();
    updateUserInLeaderboard();
    checkGoldBadge();
    showToast(`🎉 Session complete! +${minsStudied} mins logged.`);
  }
  // Auto-advance
  resetTimer(1500, 'Focus');
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mins === '25');
  });
}

function updateTimerStats() {
  document.getElementById('sessionCount').textContent = state.timer.sessions;
  document.getElementById('streakCount').textContent  = state.timer.streak + '🔥';
  document.getElementById('totalMins').textContent    = state.timer.todayMins + 'm';
  if (state.profile) {
    state.profile.sessions  = state.timer.sessions;
    state.profile.totalMins = state.timer.todayMins;
    state.profile.streak    = state.timer.streak;
  }
}

function fmtTime(totalSecs) {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) {
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* Task list */
function addTask() {
  const input = document.getElementById('taskInput');
  const text  = input.value.trim();
  if (!text) return;
  const task = { id: Date.now(), text, done: false };
  state.tasks.push(task);
  input.value = '';
  renderTasks();
}
document.getElementById('taskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  state.tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    li.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})" />
      <span>${escHtml(task.text)}</span>
      <button class="task-del" onclick="deleteTask(${task.id})">✕</button>
    `;
    list.appendChild(li);
  });
}
function toggleTask(id) {
  const t = state.tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; renderTasks(); }
}
function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  renderTasks();
}

/* ═══════════════════════════════════════════
   STUDY ROOMS
   ═══════════════════════════════════════════ */
function renderRooms() {
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = '';
  filteredRooms.forEach(room => {
    const card = document.createElement('div');
    card.className = 'room-card';
    card.innerHTML = `
      <div class="room-card-top">
        <h4>${escHtml(room.name)}</h4>
        <span class="status-badge ${room.active ? 'green' : 'yellow'}">${room.active ? '● Live' : '◌ Idle'}</span>
      </div>
      <div class="room-topic">${escHtml(room.topic)}</div>
      <p class="room-desc">${escHtml(room.desc)}</p>
      <div class="room-footer">
        <span class="member-count">👥 ${room.members}/${room.max} members</span>
        <button class="btn btn-primary btn-sm" onclick="joinRoom(${room.id})">Join →</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterRooms() {
  const q = document.getElementById('roomSearch').value.toLowerCase();
  filteredRooms = ROOMS.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.topic.toLowerCase().includes(q) ||
    r.desc.toLowerCase().includes(q)
  );
  renderRooms();
}

function joinRoom(id) {
  const room = ROOMS.find(r => r.id === id);
  if (!room) return;
  if (!state.profile) {
    showToast('👤 Create a profile first to join a room!');
    openProfileModal();
    return;
  }
  state.inRoom = room;
  document.getElementById('activeRoomName').textContent  = room.name;
  document.getElementById('activeRoomTopic').textContent = room.topic;
  document.getElementById('activeRoomPanel').style.display = '';
  renderRoomMembers(room);
  showToast(`✅ Joined "${room.name}"`);
  document.getElementById('activeRoomPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function leaveRoom() {
  state.inRoom = null;
  document.getElementById('activeRoomPanel').style.display = 'none';
  showToast('👋 You left the room.');
}

const FAKE_MEMBERS = [
  { init: 'P', color: '#22d3ee' }, { init: 'R', color: '#a855f7' },
  { init: 'A', color: '#f59e0b' }, { init: 'K', color: '#10b981' },
  { init: 'S', color: '#3b82f6' },
];
function renderRoomMembers(room) {
  const wrap = document.getElementById('roomMembers');
  wrap.innerHTML = '';
  const count = Math.min(room.members, 5);
  for (let i = 0; i < count; i++) {
    const m = FAKE_MEMBERS[i % FAKE_MEMBERS.length];
    const av = document.createElement('div');
    av.className = 'member-avatar';
    av.style.background = m.color;
    av.style.color = '#050d1a';
    av.innerHTML = `${m.init}<span class="online-dot"></span>`;
    wrap.appendChild(av);
  }
  if (room.members > 5) {
    const more = document.createElement('div');
    more.className = 'member-avatar';
    more.style.background = 'rgba(255,255,255,0.08)';
    more.textContent = `+${room.members - 5}`;
    wrap.appendChild(more);
  }
  // Add user's own avatar if profile exists
  if (state.profile) {
    const av = document.createElement('div');
    av.className = 'member-avatar';
    av.style.background = state.profile.color;
    av.style.color = '#050d1a';
    av.innerHTML = `${state.profile.name.charAt(0).toUpperCase()}<span class="online-dot"></span>`;
    wrap.appendChild(av);
  }
}

function createRoom() {
  const name = prompt('Room name:');
  if (!name) return;
  const topic = prompt('Topic:') || 'General';
  const newRoom = { id: Date.now(), name, topic, desc: 'Your custom study room.', members: 1, max: 10, active: true };
  ROOMS.unshift(newRoom);
  filteredRooms = [...ROOMS];
  renderRooms();
  showToast(`✅ Room "${name}" created!`);
}

function setAmbient(btn, type) {
  document.querySelectorAll('.ambient-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (type === 'none') { showToast('🔇 Ambient sound off'); return; }
  showToast(`🎵 Playing ${type} sounds (simulated)`);
}

/* ═══════════════════════════════════════════
   LEADERBOARD
   ═══════════════════════════════════════════ */
function lbFilter(btn, filter) {
  document.querySelectorAll('.lb-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.leaderboardFilter = filter;
  renderLeaderboard();
}

function updateUserInLeaderboard() {
  if (!state.profile) return;
  const data = LEADERBOARD_DATA[state.leaderboardFilter];
  const totalMins = state.timer.todayMins;
  const existing = data.find(d => d.name === state.profile.name);
  if (existing) existing.mins += totalMins;
  else data.push({ name: state.profile.name, mins: totalMins, color: state.profile.color, isYou: true });
  data.sort((a, b) => b.mins - a.mins);
}

function renderLeaderboard() {
  const data = LEADERBOARD_DATA[state.leaderboardFilter];
  const maxMins = data[0].mins;

  // Mark user
  if (state.profile) {
    data.forEach(d => { d.isYou = d.name === state.profile.name; });
  }

  // Podium (top 3)
  const podiumEl = document.getElementById('lbPodium');
  const medals   = ['🥇', '🥈', '🥉'];
  podiumEl.innerHTML = '';
  data.slice(0, 3).forEach((p, i) => {
    const isVerified = p.mins / 60 >= 10;
    const div = document.createElement('div');
    div.className = `podium-card rank-${i + 1}`;
    div.innerHTML = `
      <div class="podium-medal">${medals[i]}</div>
      <div class="podium-avatar" style="background:${p.color};color:#050d1a">${p.name.charAt(0)}</div>
      <div class="podium-info">
        <div class="podium-name">${escHtml(p.name)} ${isVerified ? '<span class="gold-badge">✅</span>' : ''}</div>
        <div class="podium-mins">${fmtMins(p.mins)} studied</div>
      </div>
    `;
    podiumEl.appendChild(div);
  });

  // Full table
  const tableEl = document.getElementById('lbTable');
  tableEl.innerHTML = '';
  data.forEach((p, i) => {
    const pct = (p.mins / maxMins) * 100;
    const row = document.createElement('div');
    row.className = 'lb-row' + (p.isYou ? ' is-you' : '');
    row.innerHTML = `
      <div class="lb-rank">#${i + 1}</div>
      <div class="lb-av" style="background:${p.color};color:#050d1a">${p.name.charAt(0)}</div>
      <div class="lb-name">${escHtml(p.name)} ${p.isYou ? '<span style="font-size:0.72rem;color:var(--accent)">(You)</span>' : ''} ${p.mins/60>=10?'<span style="color:var(--gold);font-size:0.8rem">✅</span>':''}</div>
      <div class="lb-bar-wrap">
        <div class="lb-bar-bg"><div class="lb-bar-fill" style="width:0%" data-target="${pct}"></div></div>
        <span class="lb-mins">${fmtMins(p.mins)}</span>
      </div>
    `;
    tableEl.appendChild(row);
  });

  // Animate bars
  requestAnimationFrame(() => {
    document.querySelectorAll('.lb-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  });

  // Your rank banner
  if (state.profile) {
    const idx = data.findIndex(d => d.isYou);
    const banner = document.getElementById('yourRankBanner');
    if (idx >= 0) {
      banner.style.display = '';
      document.getElementById('yourRankNum').textContent  = `#${idx + 1}`;
      document.getElementById('yourRankName').textContent = state.profile.name;
    } else {
      banner.style.display = '';
      document.getElementById('yourRankNum').textContent  = '#—';
      document.getElementById('yourRankName').textContent = 'Start studying to rank!';
    }
  }
}

function fmtMins(mins) {
  if (mins >= 60) return `${Math.floor(mins/60)}h ${mins%60}m`;
  return `${mins}m`;
}

/* ═══════════════════════════════════════════
   CHAT
   ═══════════════════════════════════════════ */
function initChat() {
  // Load preset messages
  Object.keys(PRESET_MESSAGES).forEach(ch => {
    if (!state.messages[ch].length) {
      state.messages[ch] = [...PRESET_MESSAGES[ch]];
    }
  });
  renderMessages();
  renderOnlineUsers();
}

function switchChannel(el, channel) {
  document.querySelectorAll('.channel-item').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  state.currentChannel = channel;
  document.getElementById('currentChannel').textContent = channel;
  document.getElementById('msgInput').placeholder = `Message ${channel}...`;
  renderMessages();
}

function renderMessages() {
  const wrap = document.getElementById('messagesWrap');
  wrap.innerHTML = '';
  const msgs = state.messages[state.currentChannel] || [];
  msgs.forEach(m => {
    const isOwn = state.profile && m.name === state.profile.name;
    const group = document.createElement('div');
    group.className = 'msg-group' + (isOwn ? ' own' : '');
    group.innerHTML = `
      <div class="msg-avatar" style="background:${m.color};color:#050d1a">${m.name.charAt(0)}</div>
      <div class="msg-body">
        <div class="msg-meta">
          <span class="msg-name">${escHtml(m.name)}</span>
          <span class="msg-time">${m.time}</span>
        </div>
        <div class="msg-bubble">${escHtml(m.text)}</div>
      </div>
    `;
    wrap.appendChild(group);
  });
  wrap.scrollTop = wrap.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('msgInput');
  const text  = input.value.trim();
  if (!text) return;

  const name  = state.profile ? state.profile.name : 'Guest';
  const color = state.profile ? state.profile.color : '#22d3ee';
  const now   = new Date();
  const time  = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  state.messages[state.currentChannel].push({ name, color, text, time });
  input.value = '';
  renderMessages();
}

function renderOnlineUsers() {
  const list = document.getElementById('onlineList');
  list.innerHTML = '';
  ONLINE_USERS.forEach(u => {
    const div = document.createElement('div');
    div.className = 'online-user';
    div.innerHTML = `
      <div class="online-dot-small"></div>
      <div class="member-avatar" style="background:${u.color};color:#050d1a;width:28px;height:28px;font-size:0.7rem">${u.name.charAt(0)}</div>
      <span>${u.name}</span>
    `;
    list.appendChild(div);
  });
}

/* ═══════════════════════════════════════════
   PREMIUM
   ═══════════════════════════════════════════ */
function toggleBilling() {
  const yearly = document.getElementById('billingToggle').checked;
  document.querySelectorAll('.pricing-price').forEach(el => {
    el.childNodes[0].textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
  });
}

function purchasePlan(plan) {
  showToast(`🚀 ${plan} plan selected! Redirecting to payment... (demo)`);
  if (state.profile) {
    state.profile.verified = true;
    showToast('🎖️ Gold Verified Badge granted!');
  }
}

/* ═══════════════════════════════════════════
   ADVERTISEMENTS
   ═══════════════════════════════════════════ */
function buildAdCard(ad, dismissable = true) {
  const div = document.createElement('div');
  div.className = 'inline-ad';
  div.innerHTML = `
    <div class="ad-ico">${ad.icon}</div>
    <div class="ad-txt">
      <strong>${escHtml(ad.title)}</strong>
      <span>${escHtml(ad.desc)}</span>
    </div>
    ${dismissable ? '<button class="ad-dismiss" title="Dismiss">✕</button>' : ''}
  `;
  div.querySelector('.ad-ico').parentElement.addEventListener('click', () => { showToast('🔗 Opening... (demo)'); });
  if (dismissable) {
    div.querySelector('.ad-dismiss').addEventListener('click', e => {
      e.stopPropagation();
      div.style.opacity = '0';
      div.style.transform = 'translateY(-8px)';
      setTimeout(() => div.remove(), 300);
    });
  }
  return div;
}

function buildStripAd(ad) {
  const div = document.createElement('div');
  div.className = 'ad-strip-card';
  div.innerHTML = `
    <div class="ad-icon">${ad.icon}</div>
    <div>
      <div class="ad-label">Sponsored</div>
      <div class="ad-title">${escHtml(ad.title)}</div>
    </div>
  `;
  div.addEventListener('click', () => showToast('🔗 Opening ad... (demo)'));
  return div;
}

function renderHomeAds() {
  const strip = document.getElementById('adStrip');
  strip.innerHTML = '';
  ADS.slice(0, 4).forEach(ad => strip.appendChild(buildStripAd(ad)));
}

function renderTimerAd() {
  const cont = document.getElementById('timerAd');
  cont.innerHTML = '';
  const ad = ADS[Math.floor(Math.random() * ADS.length)];
  cont.appendChild(buildAdCard(ad));
}

function renderChatAd() {
  const cont = document.getElementById('chatAd');
  cont.innerHTML = '';
  ADS.slice(0, 3).forEach(ad => cont.appendChild(buildAdCard(ad)));
}

function renderPremiumAds() {
  const cont = document.getElementById('premiumAds');
  cont.innerHTML = '<div class="ad-card-label" style="text-align:center;margin-bottom:12px">Sponsored Content</div>';
  ADS.forEach(ad => cont.appendChild(buildAdCard(ad)));
}

/* ═══════════════════════════════════════════
   HERO SECTION → VISIBLE ANIMATION
   ═══════════════════════════════════════════ */
function activateHome() {
  const sec = document.getElementById('home');
  sec.classList.add('visible');
}

/* ═══════════════════════════════════════════
   UTILITY
   ═══════════════════════════════════════════ */
function escHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ═══════════════════════════════════════════
   INITIALISATION
   ═══════════════════════════════════════════ */
function init() {
  // Activate home with animation
  activateHome();

  // Render ads
  renderHomeAds();
  renderTimerAd();

  // Initial timer display
  const timeStr = fmtTime(state.timer.remaining);
  const timeEl = document.getElementById('timerTime');
  timeEl.textContent = timeStr;
  timeEl.style.fontSize = timeStr.length >= 8 ? '2rem' : timeStr.length > 5 ? '2.4rem' : '3rem';

  // Rotate timer ad every 30s
  setInterval(renderTimerAd, 30000);

  // Preset chat messages
  Object.keys(PRESET_MESSAGES).forEach(ch => {
    state.messages[ch] = [...PRESET_MESSAGES[ch]];
  });
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);

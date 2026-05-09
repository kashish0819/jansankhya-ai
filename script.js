// ============================================
//   JANSANKHYA AI — COMPLETE SCRIPT
//   Smart Census Platform 2027
// ============================================

// ==========================================
// 1. TAB SWITCHING
// ==========================================
function showPage(pageId, tab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  tab.classList.add('active');
}

// ==========================================
// 2. TOAST NOTIFICATION
// ==========================================
function showToast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color || '#138808';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ==========================================
// 3. FORMAT AADHAAR NUMBER
// ==========================================
function formatAadhaar(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 12);
  v = v.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
    [a, b, c].filter(Boolean).join('-')
  );
  input.value = v;
}

// ==========================================
// 4. LIVE CLOCK
// ==========================================
function updateClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleString('en-IN', {
    day:'2-digit', month:'short', year:'numeric',
    hour:'2-digit', minute:'2-digit', second:'2-digit'
  });
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================
// 5. SYNC TIMER COUNTDOWN
// ==========================================
let syncSeconds = 8040;
function updateSyncTimer() {
  const el = document.getElementById('syncTimer');
  if (!el) return;
  const h = String(Math.floor(syncSeconds / 3600)).padStart(2,'0');
  const m = String(Math.floor((syncSeconds % 3600) / 60)).padStart(2,'0');
  const s = String(syncSeconds % 60).padStart(2,'0');
  el.textContent = `${h}:${m}:${s}`;
  if (syncSeconds > 0) syncSeconds--;
}
setInterval(updateSyncTimer, 1000);

function runSync() {
  showToast('🔄 AI Sync Engine started! Merging changes to Master DB...');
  syncSeconds = 8040;
  setTimeout(() => showToast('✅ Sync complete! Records merged to Master DB.'), 2500);
}

// ==========================================
// 6. NET POPULATION — LIVE UPDATE
// ==========================================
let births = 1243;
let deaths = 892;
const BASE_POP = 1420000000;

function updateNetPop(birthDelta, deathDelta) {
  births += (birthDelta || 0);
  deaths += (deathDelta || 0);
  const net = births - deaths;
  const current = BASE_POP + net;

  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  set('birthCount',        `+${births.toLocaleString('en-IN')}`);
  set('deathCount',        `−${deaths.toLocaleString('en-IN')}`);
  set('netGrowth',         `+${net.toLocaleString('en-IN')}`);
  set('currentPop',        current.toLocaleString('en-IN'));
  set('netPopDisplay',     current.toLocaleString('en-IN'));
  set('totalBirthsDisplay', births.toLocaleString('en-IN'));
  set('totalDeathsDisplay', deaths.toLocaleString('en-IN'));
}

// Simulate live births/deaths
setInterval(() => updateNetPop(Math.floor(Math.random()*3), Math.floor(Math.random()*2)), 4000);

// ==========================================
// 7. RENDER STATE PROGRESS BARS
// ==========================================
function renderStateProgress() {
  const el = document.getElementById('stateProgressList');
  if (!el) return;
  el.innerHTML = stateProgress.map(s => `
    <div class="progress-item">
      <div class="progress-label">
        <span>${s.state}</span>
        <span style="color:${s.color};font-weight:700">${s.percent}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:0%;background:${s.color}" data-w="${s.percent}%"></div>
      </div>
    </div>
  `).join('');
  setTimeout(() => {
    el.querySelectorAll('.progress-fill').forEach(b => b.style.width = b.dataset.w);
  }, 200);
}

// ==========================================
// 8. RENDER CHANGE SUMMARY
// ==========================================
function renderChangeSummary() {
  const el = document.getElementById('changeSummary');
  if (!el) return;
  const items = [
    { icon:'👶', label:'New Births Reported',    val:'1,243', cls:'badge-green'  },
    { icon:'📋', label:'Deaths Recorded',         val:'892',   cls:'badge-red'    },
    { icon:'🔵', label:'Address / Migrations',    val:'1,289', cls:'badge-blue'   },
    { icon:'⏳', label:'Pending AI Verification', val:'423',   cls:'badge-orange' },
    { icon:'✅', label:'Approved and Synced',      val:'3,261', cls:'badge-green'  },
    { icon:'❌', label:'Rejected by AI',           val:'123',   cls:'badge-red'    },
  ];
  el.innerHTML = items.map(i => `
    <div class="change-row">
      <span style="font-size:13px">${i.icon} ${i.label}</span>
      <span class="badge ${i.cls}">${i.val}</span>
    </div>
  `).join('');
}

// ==========================================
// 9. RENDER CHANGELOG STATS
// ==========================================
function renderChangelogStats() {
  const el = document.getElementById('changelogStats');
  if (!el) return;
  const stats = [
    { icon:'👶', val:'1,243', label:'BIRTHS',     color:'#4ADE80' },
    { icon:'📋', val:'892',   label:'DEATHS',     color:'#FCA5A5' },
    { icon:'🔵', val:'1,289', label:'MIGRATIONS', color:'#93C5FD' },
    { icon:'⏳', val:'423',   label:'PENDING',    color:'#FF8C35' },
    { icon:'❌', val:'123',   label:'REJECTED',   color:'#FCA5A5' },
  ];
  el.innerHTML = stats.map(s => `
    <div class="cl-stat">
      <div class="cl-stat-icon">${s.icon}</div>
      <div class="cl-stat-val" style="color:${s.color}">${s.val}</div>
      <div class="cl-stat-label">${s.label}</div>
    </div>
  `).join('');
}

// ==========================================
// 10. RENDER MASTER DATABASE TABLE
// ==========================================
function renderMasterDB(data) {
  const tbody = document.getElementById('masterTableBody');
  const count = document.getElementById('masterCount');
  if (!tbody) return;
  tbody.innerHTML = data.map(c => `
    <tr>
      <td style="font-family:'Syne',sans-serif;font-size:11px;color:rgba(255,255,255,.4)">${c.id}</td>
      <td style="font-weight:600">${c.name}</td>
      <td style="font-size:12px;color:rgba(255,255,255,.5)">${c.aadhaar}</td>
      <td>${c.gender}</td>
      <td>${c.state}</td>
      <td>${c.district}</td>
      <td style="font-size:12px">${c.dob}</td>
      <td><span class="badge ${c.status==='Alive'?'badge-green':'badge-red'}">${c.status}</span></td>
    </tr>
  `).join('');
  if (count) count.textContent = `Showing ${data.length} of 1,42,00,00,000 records`;
}

function filterMasterDB() {
  const search = (document.getElementById('masterSearch')?.value || '').toLowerCase();
  const state  = document.getElementById('stateFilter')?.value  || '';
  const status = document.getElementById('statusFilter')?.value || '';
  const filtered = masterDB.filter(c =>
    (!search || c.name.toLowerCase().includes(search) || c.aadhaar.includes(search) || c.id.toLowerCase().includes(search)) &&
    (!state  || c.state  === state)  &&
    (!status || c.status === status)
  );
  renderMasterDB(filtered);
}

// ==========================================
// 11. RENDER CHANGE LOG TABLE
// ==========================================
function renderChangeLog(data) {
  const tbody = document.getElementById('changelogTableBody');
  if (!tbody) return;
  const typeClass = { Birth:'badge-green', Death:'badge-red', Migration:'badge-blue', Address:'badge-orange' };
  tbody.innerHTML = data.map((c, i) => `
    <tr>
      <td style="font-family:'Syne',sans-serif;font-size:11px;color:rgba(255,255,255,.4)">${c.changeId}</td>
      <td><span class="badge ${typeClass[c.type]||'badge-blue'}">${c.type}</span></td>
      <td style="font-size:12px;font-weight:500;max-width:120px">${c.citizen}</td>
      <td style="font-size:11px;color:rgba(255,255,255,.45);max-width:160px">${c.details}</td>
      <td style="font-size:11px">${c.reportedBy}</td>
      <td style="font-size:11px">${c.date}</td>
      <td><span class="badge ${c.status==='Approved'?'badge-green':c.status==='Rejected'?'badge-red':'badge-orange'}">${c.status}</span></td>
      <td>
        <div class="action-btns">
          ${c.status==='Pending'
            ? `<button class="btn btn-green sm" onclick="approveChange(${i})">✓</button>
               <button class="btn btn-red sm" onclick="rejectChange(${i})">✕</button>`
            : `<span style="font-size:11px;color:rgba(255,255,255,.3)">—</span>`}
        </div>
      </td>
    </tr>
  `).join('');
}

// ==========================================
// 12. LIVE GRAPH — CANVAS
// ==========================================
function drawGraph() {
  const canvas = document.getElementById('lineGraph');
  if (!canvas) return;
  const W = canvas.parentElement.offsetWidth || 400;
  const H = 200;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,W,H);

  const PL=10, PR=20, PT=16, PB=28;
  const cW = W-PL-PR, cH = H-PT-PB;
  const max = 1500, pts = graphData.labels.length;

  // Grid
  for(let i=0; i<=5; i++) {
    const y = PT + (cH/5)*i;
    ctx.beginPath(); ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1;
    ctx.moveTo(PL,y); ctx.lineTo(W-PR,y); ctx.stroke();
  }

  // X Labels
  ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='10px DM Sans,sans-serif'; ctx.textAlign='center';
  graphData.labels.forEach((l,i) => ctx.fillText(l, PL+(cW/(pts-1))*i, H-6));

  // Draw line helper
  function line(arr, stroke, fill) {
    const co = arr.map((v,i) => ({ x: PL+(cW/(pts-1))*i, y: PT+cH-(v/max)*cH }));
    ctx.beginPath(); ctx.moveTo(co[0].x, PT+cH);
    co.forEach(p => ctx.lineTo(p.x,p.y));
    ctx.lineTo(co[co.length-1].x, PT+cH); ctx.closePath();
    ctx.fillStyle=fill; ctx.fill();
    ctx.beginPath(); ctx.moveTo(co[0].x,co[0].y);
    co.forEach(p => ctx.lineTo(p.x,p.y));
    ctx.strokeStyle=stroke; ctx.lineWidth=2.5; ctx.lineJoin='round'; ctx.stroke();
    co.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2);
      ctx.fillStyle=stroke; ctx.fill();
      ctx.strokeStyle='#06061A'; ctx.lineWidth=2; ctx.stroke();
    });
  }

  line(graphData.births,'#4ADE80','rgba(74,222,128,0.07)');
  line(graphData.deaths,'#FCA5A5','rgba(252,165,165,0.07)');
  line(graphData.net,   '#FFD700','rgba(255,215,0,0.07)');
}

// ==========================================
// 13. AADHAAR SCAN
// ==========================================
function simulateScan() {
  const input = document.getElementById('aadhaarInput');
  if (!input.value) input.value = '7845-2391-6023';
  const found = masterDB.find(c => c.aadhaar === input.value) || masterDB[1];

  const initials = found.name.split(' ').map(n=>n[0]).join('').substring(0,2);
  document.getElementById('resultCard').innerHTML = `
    <div class="result-header">
      <div class="result-avatar">${initials}</div>
      <div>
        <div class="result-name">${found.name}</div>
        <div class="result-id">${found.id} &nbsp;|&nbsp; <span class="badge ${found.status==='Alive'?'badge-green':'badge-red'}">${found.status}</span></div>
      </div>
    </div>
    <div class="result-grid">
      <div class="result-item"><label>Aadhaar</label><span>${found.aadhaar}</span></div>
      <div class="result-item"><label>Date of Birth</label><span>${found.dob}</span></div>
      <div class="result-item"><label>Gender</label><span>${found.gender}</span></div>
      <div class="result-item"><label>State</label><span>${found.state}</span></div>
      <div class="result-item"><label>District</label><span>${found.district}</span></div>
      <div class="result-item"><label>Last Updated</label><span>${found.lastUpdated}</span></div>
      <div class="result-item result-full"><label>Address</label><span>${found.address}</span></div>
    </div>
    <div style="display:flex;gap:10px;margin-top:14px">
      <button class="btn btn-green" onclick="showToast('✅ Enumeration confirmed and saved to Master DB!')">✅ Confirm and Save</button>
      <button class="btn btn-outline" onclick="goToReportChange('${found.name}','${found.aadhaar}','${found.state}','${found.district}')">✏️ Report Change</button>
    </div>
  `;
  const res = document.getElementById('scanResult');
  res.style.display = 'block';
  res.scrollIntoView({ behavior:'smooth', block:'nearest' });
}
function goToReportChange(name, aadhaar, state, district) {

  // Switch page
  showPage('addrecord', document.querySelectorAll('.tab')[5]);

  // Auto fill fields
  document.getElementById('fullName').value = name;
  document.getElementById('aadhaarField').value = aadhaar;
  document.getElementById('state').value = state;
  document.getElementById('district').value = district;

  showToast('✏️ Data auto-filled. Edit and submit.');
}

// ==========================================
// 14. NEWBORN REGISTRATION
// ==========================================
function registerNewborn() {
  const isOrphan = document.getElementById('isOrphan').value;

  const gender   = document.getElementById('babyGender').value;
  const dob      = document.getElementById('babyDOB').value;
  const place    = document.getElementById('birthPlace').value;
  const hospital = document.getElementById('hospitalName').value;
  const name = document.getElementById('babyName').value || "Unnamed Baby";

  let mother = document.getElementById('motherAadhaar').value;
  let father = document.getElementById('fatherAadhaar').value;
  let state  = document.getElementById('babyState').value;
  let district = document.getElementById('babyDistrict').value;

  // If orphan → ignore parents
  if (isOrphan === 'yes') {
    mother = 'Not Available';
    father = 'Not Available';
  }

  // Generate temp ID
  const rand = Math.floor(Math.random() * 90000) + 10000;
  const tempId = `TEMP-${rand}`;

  const resultDiv = document.getElementById('newbornResult');
  resultDiv.style.display = 'block';

  resultDiv.innerHTML = `
    <div class="temp-id-card">
      <div class="temp-id-title">✅ TEMP ID GENERATED</div>
      <div class="temp-id-value">${tempId}</div>

      <div class="temp-id-grid">
        <div class="temp-id-item"><label>Gender</label><span>${gender}</span></div>
        <div class="temp-id-item"><label>DOB</label><span>${dob}</span></div>
        <div class="temp-id-item"><label>Birth Place</label><span>${place}</span></div>
        <div class="temp-id-item"><label>Location</label><span>${hospital}</span></div>
        <div class="temp-id-item"><label>Mother</label><span>${mother}</span></div>
        <div class="temp-id-item"><label>Father</label><span>${father}</span></div>

        <div class="temp-id-item" style="grid-column:1/-1">
          <label>Status</label>
          <span class="badge badge-yellow">
            ${isOrphan === 'yes' ? 'Orphan Record' : 'Pending Aadhaar'}
          </span>
        </div>
      </div>
    </div>
  `;

  showToast("👶 Newborn Registered Successfully!");
  if (typeof saveNewbornToDB === 'function') {
    saveNewbornToDB({
      name: document.getElementById('babyName')?.value,
      gender: document.getElementById('babyGender')?.value,
      dob: document.getElementById('babyDOB')?.value,
      hospital: document.getElementById('hospitalName')?.value,
      motherAadhaar: document.getElementById('motherAadhaar')?.value,
      fatherAadhaar: document.getElementById('fatherAadhaar')?.value,
      state: document.getElementById('babyState')?.value,
      district: document.getElementById('babyDistrict')?.value,
    });
  }
}

function clearNewborn() {
  ['babyGender','babyDOB','birthPlace','hospitalName','motherAadhaar','fatherAadhaar','babyState','babyDistrict']
    .forEach(id => { const el=document.getElementById(id); if(el) el.tagName==='SELECT'?el.selectedIndex=0:el.value=''; });
  const r = document.getElementById('newbornResult');
  if(r) r.style.display='none';
}

// ==========================================
// 15. ADD RECORD FORM
// ==========================================
function submitChange() {
  // Read all fields with proper IDs — no more blank details or missing names
  const changeType = document.getElementById('changeType')?.value || 'Unknown';
  const aadhaar    = document.getElementById('aadhaarField')?.value || '';
  const fullName   = document.getElementById('fullName')?.value || '';
  const gender     = document.getElementById('fieldGender')?.value || '';
  const dob        = document.getElementById('fieldDOB')?.value || '';
  const state      = document.getElementById('state')?.value || '';
  const district   = document.getElementById('district')?.value || '';
  const address    = document.getElementById('fieldAddress')?.value || '';
  const notes      = document.querySelector('#addrecord [placeholder="Any additional observations..."]')?.value || '';

  // Validate — need at least a name
  if (!fullName.trim()) {
    showToast('❌ Please enter Full Name', '#991B1B');  
    return;
  }

  // Get enumerator name from session
  let reportedBy = 'Enumerator';
  try {
    const u = JSON.parse(sessionStorage.getItem('js_user') || '{}');
    if (u.name) reportedBy = u.name;
  } catch(e) {}

  // Build a clean details string so the verification queue shows real info
  const detailsParts = [];
  if (address)  detailsParts.push('Address: ' + address);
  if (state)    detailsParts.push('State: ' + state);
  if (district) detailsParts.push('District: ' + district);
  if (notes)    detailsParts.push('Notes: ' + notes);
  const detailsStr = detailsParts.join(' | ') || notes || 'Field report submitted';

  // Build citizen label — use name first, then aadhaar
  const citizenLabel = fullName + (aadhaar ? ' — ' + aadhaar : '');

  // Build change record (all fields kept so approval copies them to DB1 correctly)
  const changeData = {
    type:       changeType,
    citizen:    citizenLabel,
    citizenId:  aadhaar,
    name:       fullName,
    aadhaar:    aadhaar || 'Pending',
    gender:     gender  || 'Unknown',
    dob:        dob     || 'Unknown',
    state:      state   || 'Unknown',
    district:   district|| 'Unknown',
    address:    address,
    details:    detailsStr,
    notes:      notes,
    reportedBy: reportedBy,
    date:       new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}),
    status:     'Pending',
  };

  // Add to local changeLogDB immediately so UI updates — include rawData so approval works
  const newChange = {
    changeId:   'CHG-' + Date.now(),
    ...changeData,
    rawData:    changeData,
  };
  changeLogDB.unshift(newChange);
  renderChangeLog(changeLogDB);

  // Save to Firebase DB2 (Change Log)
  if (typeof saveChangeToDB === 'function') {
    saveChangeToDB(changeData);
  } else {
    showToast('📤 Change submitted to Change Log!');
  }

  // Clear form
  clearAddForm();
}
function clearAddForm() {
  document.querySelectorAll('#addrecord input, #addrecord select')
    .forEach(el => el.tagName==='SELECT'?el.selectedIndex=0:el.value='');
}
// ==========================================
// 15. ADD RECORD FORM
// ==========================================
function toggleNewCitizen() {
  const val = document.getElementById('hasAadhaar').value;
  const tempBox = document.getElementById('tempIdBox');
  const aadhaarField = document.getElementById('newAadhaar');

  if (val === 'no') {
    tempBox.style.display = 'block';
    aadhaarField.disabled = true;

    const tempId = "TEMP-" + Math.floor(Math.random() * 100000);
    document.getElementById('tempIdField').value = tempId;

  } else {
    tempBox.style.display = 'none';
    aadhaarField.disabled = false;
  }
}

function addCitizen() {
  const name      = document.getElementById('newName')?.value?.trim() || '';
  const hasAad    = document.getElementById('hasAadhaar')?.value || 'yes';
  const aadhaar   = document.getElementById('newAadhaar')?.value?.trim() || '';
  const tempId    = document.getElementById('tempIdField')?.value?.trim() || '';
  const gender    = document.getElementById('newGender')?.value?.trim() || 'gender';
  const dob       = document.getElementById('newDOB')?.value?.trim() || 'dob';
  const state     = document.getElementById('newState')?.value?.trim() || '';
  const district  = document.getElementById('newDistrict')?.value?.trim() || '';
  const regType   = document.getElementById('registrationType')?.value || 'regular';


  if (!name) {
    showToast("❌ Name required", "#991B1B");
    return;
  }

  // Get enumerator name
  let reportedBy = 'Enumerator';
  try {
    const u = JSON.parse(sessionStorage.getItem('js_user') || '{}');
    if (u.name) reportedBy = u.name;
  } catch(e) {}

  const finalAadhaar = (hasAad === 'no') ? (tempId || 'Pending') : (aadhaar || 'Pending');

  // Build details string
  const detailsParts = [];
  if (state)    detailsParts.push('State: ' + state);
  if (district) detailsParts.push('District: ' + district);
  if (regType === 'immigration') detailsParts.push('Type: Immigration');
  const detailsStr = detailsParts.join(' | ') || 'New citizen enrolment';

  // Build change record — goes to verification queue (DB2)
  const changeData = {
    type:       'Birth',
    citizen:    name + ' — ' + finalAadhaar,
    citizenId:  finalAadhaar,
    name:       name,
    aadhaar:    finalAadhaar,
    gender:     gender,
    dob:        dob,
    state:      state    || 'Unknown',
    district:   district || 'Unknown',
    address:    '',
    details:    detailsStr,
    notes:      'New citizen enrolment from New Entry form',
    reportedBy: reportedBy,
    date:       new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}),
    status:     'Pending',
  };

  // Add to local changeLogDB so it appears in verification queue immediately
  const newChange = {
    changeId:   'CHG-' + Date.now(),
    ...changeData,
    rawData:    changeData,
  };
  changeLogDB.unshift(newChange);
  renderChangeLog(changeLogDB);

  // Save to Firebase DB2 (Change Log) — NOT directly to DB1
  if (typeof saveChangeToDB === 'function') {
    saveChangeToDB(changeData);
  }

  showToast("✅ New citizen sent to Verification Queue!");

  // Clear the New Citizen form
    ['newName','newAadhaar','newState','newDistrict','tempIdField','newGender','newDOB']

    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}
function handleDocChange() {
  const type = document.getElementById('docType').value;
  const field = document.getElementById('aadhaarField');

  if (type === 'aadhaar') {
    field.placeholder = "XXXX-XXXX-XXXX";
  }
  else if (type === 'digilocker') {
    field.placeholder = "DigiLocker ID";
  }
  else if (type === 'birth') {
    field.placeholder = "Birth Certificate ID";
  }
  else if (type === 'temp') {
    field.placeholder = "TEMP-2026-XXXXX";
  }
}
// ==========================================
// 16. GEMINI SECURITY SCANNER
// ==========================================
let pendingAction = null;

async function approveChange(i) {
  pendingAction = { index:i, action:'approve' };
  await runSecurityCheck(changeLogDB[i]);
}

async function rejectChange(i) {
  pendingAction = { index:i, action:'reject' };
  await runSecurityCheck(changeLogDB[i]);
}

async function runSecurityCheck(record) {
  const overlay  = document.getElementById('securityOverlay');
  const loading  = document.getElementById('securityLoading');
  const result   = document.getElementById('securityResult');
  const iconEl   = document.getElementById('securityIcon');

  overlay.classList.add('open');
  loading.style.display = 'flex';
  result.style.display  = 'none';
  iconEl.textContent    = '🔐';

  const prompt = `You are a security AI for India Census 2027 system called JanSankhya AI.

Analyze this census change record for risk:

Change ID   : ${record.changeId}
Change Type : ${record.type}
Citizen     : ${record.citizen}
Details     : ${record.details}
Reported By : ${record.reportedBy}
Date        : ${record.date}

Respond in EXACTLY this format:
RISK_LEVEL: [LOW or MEDIUM or HIGH]
ANALYSIS: [2-3 sentences on why this is that risk level and what looks genuine or suspicious]
RECOMMENDATION: [One clear sentence on what the enumerator should do]`;

  try {
    const res = await fetch(GEMINI_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        contents:[{role:'user',parts:[{text:prompt}]}],
        generationConfig:{temperature:0.3, maxOutputTokens:300}
      })
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const risk     = (text.match(/RISK_LEVEL:\s*(LOW|MEDIUM|HIGH)/i)?.[1] || 'MEDIUM').toUpperCase();
    const analysis = text.match(/ANALYSIS:\s*([\s\S]*?)(?:RECOMMENDATION:|$)/i)?.[1]?.trim() || text;
    const reco     = text.match(/RECOMMENDATION:\s*([\s\S]*?)$/i)?.[1]?.trim() || '';

    loading.style.display = 'none';
    result.style.display  = 'block';

    const riskBadge = document.getElementById('riskBadge');
    const emoji = risk==='LOW'?'🟢':risk==='HIGH'?'🔴':'🟡';
    riskBadge.className   = `risk-badge risk-${risk.toLowerCase()}`;
    riskBadge.textContent = `${emoji} ${risk} RISK`;

    document.getElementById('securityAnalysis').innerHTML =
      `<strong>Analysis:</strong><br>${analysis}<br><br><strong>Recommendation:</strong><br>${reco}`;

    iconEl.textContent = risk==='HIGH'?'⚠️':risk==='LOW'?'✅':'⚡';

    const action = pendingAction?.action;
    document.getElementById('securityActions').innerHTML = risk==='HIGH'
      ? `<button class="btn btn-outline" onclick="closeSecurityModal()" style="flex:1">Cancel</button>
         <button class="btn btn-red" onclick="confirmAction()" style="flex:1">Proceed Anyway</button>`
      : `<button class="btn btn-outline" onclick="closeSecurityModal()">Cancel</button>
         <button class="btn ${action==='approve'?'btn-green':'btn-red'}" onclick="confirmAction()">
           ${action==='approve'?'✓ Confirm Approve':'✕ Confirm Reject'}
         </button>`;

  } catch(err) {
    loading.style.display = 'none';
    result.style.display  = 'block';
    document.getElementById('riskBadge').className   = 'risk-badge risk-medium';
    document.getElementById('riskBadge').textContent = '⚡ MANUAL REVIEW NEEDED';
    document.getElementById('securityAnalysis').textContent = 'Could not connect to Gemini AI. Please review this record manually.';
    document.getElementById('securityActions').innerHTML =
      `<button class="btn btn-outline" onclick="closeSecurityModal()" style="flex:1">Cancel</button>
       <button class="btn btn-primary" onclick="confirmAction()" style="flex:1">Proceed Manually</button>`;
  }
}

function confirmAction() {
  if (!pendingAction) return;
  const {index, action} = pendingAction;
  if (action==='approve') {
    changeLogDB[index].status = 'Approved';
    updateNetPop(changeLogDB[index].type==='Birth'?1:0, changeLogDB[index].type==='Death'?1:0);
    showToast('✅ Change approved after Gemini security check!');
  } else {
    changeLogDB[index].status = 'Rejected';
    showToast('❌ Change rejected after Gemini security check.', '#991B1B');
  }
  renderChangeLog(changeLogDB);
  closeSecurityModal();
  pendingAction = null;
}

function closeSecurityModal() {
  document.getElementById('securityOverlay').classList.remove('open');
  pendingAction = null;
}

// ==========================================
// 17. GEMINI CHAT ASSISTANT
// ==========================================
let chatOpen = false;
let chatHistory = [];

const SYSTEM_PROMPT = `You are JanSankhya AI Assistant — a helpful assistant built into India's Census 2027 platform called JanSankhya AI.

You help census enumerators with:
- How to register newborns without Aadhaar (link using parent Aadhaar, generate temp ID)
- Document requirements for births, deaths, migrations, address changes
- How the dual database system works (Database 1 = Master Registry of all verified citizens, Database 2 = Change Log of pending updates)
- How the AI sync engine merges changes from Database 2 to Database 1 every day
- Aadhaar scanning and auto-fill process for enumerators
- How to handle edge cases like home births, homeless people, elderly with no Aadhaar
- Census 2027 rules and procedures
- Gemini AI security check process for approving or rejecting changes

Always answer in simple, friendly language. Keep answers short and helpful. Use emojis to be friendly. You are talking to field enumerators who may not be very technical.`;

function toggleChat() {
  chatOpen = !chatOpen;
  const win  = document.getElementById('chatWindow');
  const icon = document.getElementById('chatFabIcon');
  if (chatOpen) {
    win.classList.add('open');
    icon.textContent = '✕';
    setTimeout(() => scrollChatBottom(), 100);
  } else {
    win.classList.remove('open');
    icon.textContent = '💬';
  }
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  await processChat(msg);
}

async function askQuick(q) {
  const quick = document.getElementById('chatQuick');
  if (quick) quick.style.display = 'none';
  await processChat(q);
}

async function processChat(userMsg) {
  appendMsg('user', userMsg);
  scrollChatBottom();

  const btn = document.getElementById('chatSendBtn');
  if (btn) btn.disabled = true;
  const typingId = showTyping();

  try {
    // Check API key exists
    if (typeof GEMINI_API_KEY === 'undefined' || !GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Please check database.js');
    }

    // Use gemini-1.5-flash which is more stable for chat
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: SYSTEM_PROMPT + '\n\nUser asks: ' + userMsg }]
          }
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
      })
    });

    const data = await res.json();
    removeTyping(typingId);

    // Handle error response from Gemini
    if (data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(data.error.message || 'API error');
    }

    // Check if response was blocked
    if (data?.candidates?.[0]?.finishReason === 'SAFETY') {
      appendMsg('ai', '⚠️ Sorry, I cannot answer that question. Please ask something else about the census system.');
      if (btn) btn.disabled = false;
      scrollChatBottom();
      return;
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error('Empty response from Gemini:', data);
      throw new Error('Empty response. Try rephrasing your question.');
    }

    appendMsg('ai', reply);

  } catch(err) {
    removeTyping(typingId);
    console.error('Chat error:', err);
    appendMsg('ai', '⚠️ Sorry, I could not connect. Error: ' + err.message + '<br><br>Please check your internet and try again.');
  }

  if (btn) btn.disabled = false;
  scrollChatBottom();
}

function appendMsg(role, text) {
  const container = document.getElementById('chatMessages');
  const time = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
  const formatted = text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<div class="msg-bubble">${formatted}</div><div class="msg-time">${time}</div>`;
  container.appendChild(div);
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chat-msg ai'; div.id = id;
  div.innerHTML = `<div class="typing-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  container.appendChild(div);
  scrollChatBottom();
  return id;
}

function removeTyping(id) { const el=document.getElementById(id); if(el) el.remove(); }
function scrollChatBottom() { const c=document.getElementById('chatMessages'); if(c) c.scrollTop=c.scrollHeight; }

// ==========================================
// 18. INITIALISE ON LOAD
// ==========================================
window.addEventListener('load', () => {
  renderStateProgress();
  renderChangeSummary();
  renderChangelogStats();
  renderMasterDB(masterDB);
  renderChangeLog(changeLogDB);
  updateNetPop(0,0);
  setTimeout(drawGraph, 400);
  window.addEventListener('resize', drawGraph);

  // Fade in
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 80);
});
// TOGGLE PARENTS SECTION
function toggleParents() {
  const isOrphan = document.getElementById('isOrphan').value;
  const section = document.getElementById('parentsSection');

  if (isOrphan === 'yes') {
    section.style.display = 'none';
  } else {
    section.style.display = 'block';
  }
}
// ============================================
//   NEW ADDITIONS — all original code above unchanged
// ============================================

// HANDLE CHANGE TYPE — show death certificate fields when Death selected
function handleChangeType() {
  const type = document.getElementById('changeType').value;
  const deathSection = document.getElementById('deathCertSection');
  if (deathSection) {
    deathSection.style.display = (type === 'death') ? 'block' : 'none';
  }
}

// THEME TOGGLE — dark / light
function toggleTheme() {
  const html  = document.documentElement;
  const icon  = document.getElementById('themeIcon');
  const label = document.getElementById('themeLabel');
  const isDark = html.getAttribute('data-theme') === 'dark';
  if (isDark) {
    html.setAttribute('data-theme', 'light');
    if (icon)  icon.textContent  = '🌙';
    if (label) label.textContent = 'Dark';
    localStorage.setItem('js_theme', 'light');
    showToast('☀️ Light mode enabled!', '#14326B');
  } else {
    html.setAttribute('data-theme', 'dark');
    if (icon)  icon.textContent  = '☀️';
    if (label) label.textContent = 'Light';
    localStorage.setItem('js_theme', 'dark');
    showToast('🌙 Dark mode enabled!', '#333');
  }
  setTimeout(drawGraph, 150);
}

// Load saved theme on startup
(function() {
  const saved = localStorage.getItem('js_theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    const icon  = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    if (icon)  icon.textContent  = '🌙';
    if (label) label.textContent = 'Dark';
  }
})();

// HERO BLOCK CLOCK
function updateHeroClock() {
  const now = new Date();
  const c = document.getElementById('heroClock');
  const d = document.getElementById('heroDate');
  if (c) c.textContent = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + ' IST';
  if (d) d.textContent = now.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
}
setInterval(updateHeroClock, 1000);
updateHeroClock();

// SESSION — load user info from login
(function() {
  try {
    const user = JSON.parse(sessionStorage.getItem('js_user') || '{}');
    const n = document.getElementById('dynUserName');
    const z = document.getElementById('dynUserZone');
    const a = document.getElementById('dynAvatar');
    if (n && user.name)   n.textContent = user.name;
    if (z && user.zone)   z.textContent = user.zone;
    if (a && user.avatar) a.textContent = user.avatar;
  } catch(e) {}
})();

// LOGOUT
function logout() {
  sessionStorage.removeItem('js_user');
  window.location.href = 'login.html';
}

// ============================================
//   NEW ADDITIONS — original code above unchanged
// ============================================

// HERO CLOCK
function updateHeroClock() {
  const now = new Date();
  const c = document.getElementById('heroClock');
  const d = document.getElementById('heroDate');
  if (c) c.textContent = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + ' IST';
  if (d) d.textContent = now.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
}
setInterval(updateHeroClock, 1000);
updateHeroClock();

// AVATAR DROPDOWN — Google style
function toggleAvatarMenu() {
  const menu = document.getElementById('avatarMenu');
  if (menu) menu.classList.toggle('open');
}
document.addEventListener('click', function(e) {
  const wrap = document.getElementById('avatarWrap');
  const menu = document.getElementById('avatarMenu');
  if (wrap && menu && !wrap.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// SESSION — load user info from login page
(function loadSession() {
  try {
    const user = JSON.parse(sessionStorage.getItem('js_user') || '{}');
    const n  = document.getElementById('dynUserName');
    const z  = document.getElementById('dynUserZone');
    const a  = document.getElementById('dynAvatar');
    const mn = document.getElementById('avatarMenuName');
    const mr = document.getElementById('avatarMenuRole');
    const mz = document.getElementById('avatarMenuZone');
    if (n && user.name)   n.textContent  = user.name;
    if (z && user.zone)   z.textContent  = user.zone;
    if (a && user.avatar) a.textContent  = user.avatar;
    if (mn && user.name)  mn.textContent = user.name;
    if (mr && user.role)  mr.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    if (mz && user.zone)  mz.textContent = user.zone;
  } catch(e) {}
})();

// LOGOUT
function logout() {
  sessionStorage.removeItem('js_user');
  window.location.href = 'login.html';
}

// IMMIGRATION TOGGLE
function toggleImmigration() {
  const type   = document.getElementById('registrationType')?.value;
  const fields = document.getElementById('immigrationFields');
  if (fields) fields.style.display = (type === 'immigration') ? 'block' : 'none';
}

// ============================================
//   GOI BAR AVATAR DROPDOWN
// ============================================
function toggleAvatarMenu() {
  const menu = document.getElementById('avatarMenu');
  if (menu) menu.classList.toggle('open');
}
document.addEventListener('click', function(e) {
  const wrap = document.getElementById('avatarWrap');
  const menu = document.getElementById('avatarMenu');
  if (wrap && menu && !wrap.contains(e.target)) menu.classList.remove('open');
});

// SESSION — load user info
(function loadSession() {
  try {
    const user = JSON.parse(sessionStorage.getItem('js_user') || '{}');
    const n  = document.getElementById('dynUserName');
    const z  = document.getElementById('dynUserZone');
    const a  = document.getElementById('dynAvatar');
    const mn = document.getElementById('avatarMenuName');
    const mr = document.getElementById('avatarMenuRole');
    const mz = document.getElementById('avatarMenuZone');
    if (n && user.name)   n.textContent  = user.name;
    if (z && user.zone)   z.textContent  = user.zone;
    if (a && user.avatar) a.textContent  = user.avatar;
    if (mn && user.name)  mn.textContent = user.name;
    if (mr && user.role)  mr.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    if (mz && user.zone)  mz.textContent = user.zone;
  } catch(e) {}
})();

function logout() {
  sessionStorage.removeItem('js_user');
  window.location.href = 'login.html';
}

// Hero clock
function updateHeroClock() {
  const now = new Date();
  const c = document.getElementById('heroClock');
  const d = document.getElementById('heroDate');
  if (c) c.textContent = now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + ' IST';
  if (d) d.textContent = now.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
}
setInterval(updateHeroClock, 1000);
updateHeroClock();

// Immigration toggle
function toggleImmigration() {
  const t = document.getElementById('registrationType')?.value;
  const f = document.getElementById('immigrationFields');
  if (f) f.style.display = (t === 'immigration') ? 'block' : 'none';
}
// ============================================
//   AADHAAR CAMERA SCANNER — FIXED VERSION
//   Gemini Vision API correct format
// ============================================
let cameraStream = null;

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal:'environment' }, width:{ideal:1280}, height:{ideal:720} }
    });
    cameraStream = stream;
    document.getElementById('cameraFeed').srcObject = stream;
    document.getElementById('scannerIdle').style.display   = 'none';
    document.getElementById('scannerCamera').style.display = 'block';
  } catch(err) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStream = stream;
      document.getElementById('cameraFeed').srcObject = stream;
      document.getElementById('scannerIdle').style.display   = 'none';
      document.getElementById('scannerCamera').style.display = 'block';
    } catch(e) {
      showToast('❌ Camera not accessible. Upload an image instead.', '#991B1B');
    }
  }
}

function stopCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  document.getElementById('scannerCamera').style.display = 'none';
  document.getElementById('scannerIdle').style.display   = 'block';
}

function captureFromCamera() {
  const video  = document.getElementById('cameraFeed');
  const canvas = document.createElement('canvas');
  canvas.width  = video.videoWidth  || 1280;
  canvas.height = video.videoHeight || 720;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const base64 = canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
  stopCamera();
  processAadhaarImage(base64);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  // Compress image if too large
  const img = new Image();
  const reader = new FileReader();
  reader.onload = e => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Max 1200px width for Gemini
      const maxW = 1200;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
      processAadhaarImage(base64);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function processAadhaarImage(base64Image) {
  // Show captured state
  document.getElementById('scannerIdle').style.display     = 'none';
  document.getElementById('scannerCamera').style.display   = 'none';
  document.getElementById('scannerCaptured').style.display = 'block';
  document.getElementById('capturedImg').src = 'data:image/jpeg;base64,' + base64Image;
  document.getElementById('scannerAnalyzing').style.display = 'flex';
  document.getElementById('scanResult').style.display        = 'none';
  document.getElementById('scanError').style.display         = 'none';
  document.getElementById('scanResultWaiting').style.display = 'none';

  const prompt = `Look at this Aadhaar card image carefully. Extract all text you can see and return ONLY a JSON object like this (no markdown, no extra text):
{"name":"full name in English","aadhaar_number":"XXXX XXXX XXXX","dob":"DD/MM/YYYY","gender":"Male or Female","address":"full address","district":"district name","state":"state name","pincode":"pincode","confidence":"HIGH"}
If any field is unclear write empty string. Extract exactly what is printed on the card.`;

  try {
    // Correct Gemini 1.5 Flash Vision API format
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 800
      }
    };

    const response = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    });

    const data = await response.json();

    // Check for API error
    if (data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(data.error.message || 'Gemini API error');
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Gemini raw response:', rawText);

    // Clean and parse JSON
    const cleaned = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response: ' + rawText);

    const extracted = JSON.parse(jsonMatch[0]);
    console.log('Extracted data:', extracted);
    showScannedData(extracted);

  } catch(err) {
    console.error('Aadhaar scan error:', err);
    document.getElementById('scannerAnalyzing').style.display = 'none';
    document.getElementById('scanError').style.display = 'block';
    showToast('❌ Could not read card: ' + err.message, '#991B1B');
  }
}

function showScannedData(data) {
  document.getElementById('scannerAnalyzing').style.display = 'none';
  document.getElementById('scanResult').style.display = 'block';

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('extractedName',     data.name);
  set('extractedAadhaar',  data.aadhaar_number);
  set('extractedDOB',      data.dob);
  set('extractedGender',   data.gender);
  set('extractedAddress',  data.address);
  set('extractedDistrict', data.district);
  set('extractedState',    data.state);

  const confMap = { HIGH:95, MEDIUM:68, LOW:35 };
  const pct = confMap[(data.confidence||'MEDIUM').toUpperCase()] || 68;
  const bar = document.getElementById('confidenceBar');
  const lbl = document.getElementById('confidenceLabel');
  if (bar) {
    bar.style.background = pct > 80
      ? 'linear-gradient(90deg,#4ADE80,#22c55e)'
      : pct > 50
      ? 'linear-gradient(90deg,#FFD700,#f59e0b)'
      : 'linear-gradient(90deg,#FCA5A5,#ef4444)';
    setTimeout(() => bar.style.width = pct + '%', 100);
  }
  if (lbl) lbl.textContent = `${(data.confidence||'MEDIUM').toUpperCase()} confidence (${pct}%)`;
  showToast('✅ Aadhaar card successfully read by Gemini AI!');
}

async function confirmAndSaveToRegistry() {
  const name     = document.getElementById('extractedName')?.value?.trim();
  const aadhaar  = document.getElementById('extractedAadhaar')?.value?.trim();
  const dob      = document.getElementById('extractedDOB')?.value?.trim();
  const gender   = document.getElementById('extractedGender')?.value?.trim();
  const address  = document.getElementById('extractedAddress')?.value?.trim();
  const district = document.getElementById('extractedDistrict')?.value?.trim();
  const state    = document.getElementById('extractedState')?.value?.trim();

  if (!name)    { showToast('❌ Name is required!', '#991B1B'); return; }
  if (!aadhaar) { showToast('❌ Aadhaar number is required!', '#991B1B'); return; }

  const formattedAadhaar = aadhaar.replace(/\s+/g, '-').substring(0, 14);
  const newCitizen = {
    id: 'CIT-SCAN-' + Date.now(),
    name, aadhaar: formattedAadhaar, dob, gender,
    state, district, address,
    status: 'Alive',
    source: 'Aadhaar Scanner — Gemini Vision AI',
    lastUpdated: new Date().toLocaleDateString('en-IN', {month:'short', year:'numeric'})
  };

  // Save to Firebase DB1
  if (typeof saveCitizenToDB === 'function') {
    await saveCitizenToDB(newCitizen);
  }

  // Also update local masterDB for immediate display
  masterDB.unshift(newCitizen);
  showToast('✅ Citizen saved to Population Registry!');

  setTimeout(() => {
    resetScanner();
    const tab = document.querySelectorAll('.tab')[2];
    if (tab) { showPage('masterdb', tab); renderMasterDB(masterDB); }
  }, 1500);
}

function resetScanner() {
  ['scannerCaptured','scannerCamera','scanResult','scanError']
    .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  const idle = document.getElementById('scannerIdle');
  if (idle) idle.style.display = 'block';
  const wait = document.getElementById('scanResultWaiting');
  if (wait) wait.style.display = 'flex';
  const fi = document.getElementById('aadhaarFileInput');
  if (fi) fi.value = '';
  if (cameraStream) stopCamera();
}
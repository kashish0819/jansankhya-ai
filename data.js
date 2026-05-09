// ============================================
//   JANSANKHYA AI — DATABASE FILE
//   ⚠️ REPLACE YOUR API KEY BELOW!
// ============================================

const GEMINI_API_KEY = "AIzaSyAHhtSDVd0UUcFHUDBSS80tuZvX2bl4dZk"; // ✅ Your new key

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;


// ==========================================
// DATABASE 1 — MASTER CITIZEN REGISTRY
// ==========================================
const masterDB = [
  { id:"CIT-2026-GJ-001", name:"Vedanshi Desai",       aadhaar:"2341-8923-4521", dob:"15 Mar 2005", gender:"Female", state:"Gujarat",        district:"Surat",     address:"12, Rose Society, Adajan, Surat - 395009",          status:"Alive",    lastUpdated:"Jan 2026" },
  { id:"CIT-2026-MH-002", name:"Rajesh Kumar Sharma",  aadhaar:"7845-2391-6023", dob:"12 Mar 1985", gender:"Male",   state:"Maharashtra",    district:"Pune",      address:"45-B, Shivaji Nagar, Near Bus Stand, Pune - 411005", status:"Alive",    lastUpdated:"Jan 2026" },
  { id:"CIT-2026-GJ-003", name:"Priya Patel",           aadhaar:"1234-5678-9012", dob:"22 Jul 1990", gender:"Female", state:"Gujarat",        district:"Ahmedabad", address:"7, Navrangpura, Ahmedabad - 380009",                 status:"Alive",    lastUpdated:"Feb 2026" },
  { id:"CIT-2026-UP-004", name:"Amit Singh",            aadhaar:"9876-5432-1098", dob:"05 Jan 1978", gender:"Male",   state:"Uttar Pradesh",  district:"Lucknow",   address:"23, Hazratganj, Lucknow - 226001",                   status:"Alive",    lastUpdated:"Mar 2026" },
  { id:"CIT-2026-BR-005", name:"Sunita Devi",           aadhaar:"4567-8901-2345", dob:"18 Sep 1945", gender:"Female", state:"Bihar",          district:"Patna",     address:"88, Gandhi Maidan, Patna - 800001",                  status:"Deceased", lastUpdated:"Apr 2026" },
  { id:"CIT-2026-MP-006", name:"Mohan Yadav",           aadhaar:"3210-9876-5432", dob:"30 Dec 1992", gender:"Male",   state:"Madhya Pradesh", district:"Bhopal",    address:"56, MP Nagar, Bhopal - 462011",                      status:"Alive",    lastUpdated:"Feb 2026" },
  { id:"CIT-2026-KL-007", name:"Kavitha Nair",          aadhaar:"6543-2109-8765", dob:"08 Apr 1988", gender:"Female", state:"Kerala",         district:"Kochi",     address:"34, Marine Drive, Kochi - 682031",                   status:"Alive",    lastUpdated:"Mar 2026" },
  { id:"CIT-2026-RJ-008", name:"Ramesh Choudhary",      aadhaar:"8765-4321-0987", dob:"14 Feb 1970", gender:"Male",   state:"Rajasthan",      district:"Jaipur",    address:"22, C-Scheme, Jaipur - 302001",                      status:"Alive",    lastUpdated:"Feb 2026" },
  { id:"CIT-2026-TN-009", name:"Meena Krishnan",        aadhaar:"5432-1098-7654", dob:"03 Nov 1995", gender:"Female", state:"Tamil Nadu",     district:"Chennai",   address:"9, Anna Nagar, Chennai - 600040",                    status:"Alive",    lastUpdated:"Mar 2026" },
  { id:"CIT-2026-WB-010", name:"Subroto Banerjee",      aadhaar:"2109-8765-4321", dob:"21 Aug 1960", gender:"Male",   state:"West Bengal",    district:"Kolkata",   address:"14, Park Street, Kolkata - 700016",                  status:"Alive",    lastUpdated:"Jan 2026" },
];

// ==========================================
// DATABASE 2 — CHANGE LOG
// ==========================================
let changeLogDB = [
  { changeId:"CHG-2026-001", type:"Birth",     citizen:"New Citizen",                  details:"Baby girl born — linked to parent Aadhaar 7845-2391-6023",        reportedBy:"Civil Hospital Surat",  date:"10 Apr 2026", status:"Approved" },
  { changeId:"CHG-2026-002", type:"Death",     citizen:"Sunita Devi — CIT-BR-005",     details:"Death certificate DC-2026-0489 verified by district office",       reportedBy:"District Office Patna", date:"09 Apr 2026", status:"Approved" },
  { changeId:"CHG-2026-003", type:"Migration", citizen:"Amit Singh — CIT-UP-004",      details:"Moved from Lucknow to Mumbai for employment",                       reportedBy:"Enumerator #2847",      date:"08 Apr 2026", status:"Pending"  },
  { changeId:"CHG-2026-004", type:"Address",   citizen:"Priya Patel — CIT-GJ-003",     details:"New address updated via DigiLocker verification",                   reportedBy:"DigiLocker API",        date:"07 Apr 2026", status:"Approved" },
  { changeId:"CHG-2026-005", type:"Birth",     citizen:"New Citizen",                  details:"Twin babies born — linked to parent Aadhaar 1234-5678-9012",       reportedBy:"PHC Surat",             date:"06 Apr 2026", status:"Pending"  },
  { changeId:"CHG-2026-006", type:"Migration", citizen:"Mohan Yadav — CIT-MP-006",     details:"Moved from Bhopal to Bengaluru for job",                            reportedBy:"Enumerator #1923",      date:"05 Apr 2026", status:"Pending"  },
  { changeId:"CHG-2026-007", type:"Death",     citizen:"Ramesh Choudhary — CIT-RJ-008",details:"Death reported by family — certificate pending",                   reportedBy:"Enumerator #3341",      date:"04 Apr 2026", status:"Pending"  },
];

// ==========================================
// STATE PROGRESS DATA
// ==========================================
const stateProgress = [
  { state:"Kerala",        percent:71, color:"#FFD700" },
  { state:"Gujarat",       percent:67, color:"#FF6B00" },
  { state:"Maharashtra",   percent:54, color:"#FF8C35" },
  { state:"Rajasthan",     percent:41, color:"#4ADE80" },
  { state:"Uttar Pradesh", percent:29, color:"#93C5FD" },
  { state:"Bihar",         percent:18, color:"#F472B6" },
];

// ==========================================
// GRAPH DATA — 7 DAYS
// ==========================================
const graphData = {
  labels: ['6 Apr','7 Apr','8 Apr','9 Apr','10 Apr','11 Apr','12 Apr'],
  births: [1180, 1250, 1190, 1320, 1100, 1280, 1243],
  deaths: [820,  870,  790,  910,  850,  900,  892],
  net:    [360,  380,  400,  410,  250,  380,  351],
};
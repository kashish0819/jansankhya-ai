// ============================================
//   JANSANKHYA AI — FIREBASE BACKEND
//   Two Database System:
//   DB1 = "citizens"   → Population Registry (verified)
//   DB2 = "changes"    → Change Log (pending)
//       + "newborns"   → Newborn registrations (pending)
//
//   HOW IT WORKS:
//   Enumerator submits → goes to DB2 (Pending)
//   Gemini AI checks → Enumerator approves
//   Approved → automatically moves to DB1
//   Rejected → stays in DB2, never enters DB1
// ============================================

const firebaseConfig = {
  apiKey:            "AIzaSyA_mUlLp5mFllOLo9CJ0oziOCRjMmHlG3w",
  authDomain:        "jansankhya-ai.firebaseapp.com",
  projectId:         "jansankhya-ai",
  storageBucket:     "jansankhya-ai.firebasestorage.app",
  messagingSenderId: "593869273171",
  appId:             "1:593869273171:web:72467519f7ab2d7e5eaea6",
  measurementId:     "G-9L2D4KT9Z9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("🔥 Firebase Connected — JanSankhya AI");
console.log("📦 DB1: citizens (Population Registry)");
console.log("📦 DB2: changes (Change Log) + newborns");

// ============================================
//   SEED DEMO DATA
//   Open console → type seedInitialData() → Enter
// ============================================
async function seedInitialData() {
  console.log("🌱 Seeding demo data to both databases...");
  try {
    // Clear old data first to avoid duplicates
    const oldCitizens = await db.collection("citizens").get();
    for (const d of oldCitizens.docs) await d.ref.delete();

    const oldChanges = await db.collection("changes").get();
    for (const d of oldChanges.docs) await d.ref.delete();

    // Seed DB1 — Population Registry
    for (const c of masterDB) {
      await db.collection("citizens").add({
        ...c,
        source:    "Initial Seed",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("✅ DB1 — Citizen:", c.name);
    }

    // Seed DB2 — Change Log
    for (const ch of changeLogDB) {
      await db.collection("changes").add({
        ...ch,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("✅ DB2 — Change:", ch.changeId);
    }

    console.log("🎉 Both databases seeded successfully!");
    showToast("✅ Both databases seeded to Firebase!");
  } catch(err) {
    console.error("❌ Seed error:", err.message);
    showToast("❌ Seed failed — check console", "#991B1B");
  }
}

// ============================================
//   DB2 — SUBMIT CHANGE (Field Report)
//   Called when enumerator submits a change
//   Always goes to Change Log first — NEVER to DB1
// ============================================
async function saveChangeToDB(data) {
  try {
    const changeId = "CHG-" + Date.now();
    const ref = await db.collection("changes").add({
      changeId,
      type:       data.type       || "Unknown",
      citizen:    data.citizen    || data.citizenId || "Unknown",
      details:    data.notes      || data.details   || "",
      reportedBy: data.reportedBy || "Enumerator",
      date:       new Date().toLocaleDateString("en-IN", {day:"2-digit", month:"short", year:"numeric"}),
      status:     "Pending",
      source:     "Field Report",
      rawData:    data,
      createdAt:  firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("📋 DB2 — Change submitted:", changeId);
    showToast("✅ Submitted to Change Log (DB2) — awaiting Gemini AI verification!");
    return ref.id;
  } catch(err) {
    console.error("❌ Submit error:", err.message);
    showToast("❌ Could not submit change", "#991B1B");
    return null;
  }
}

// ============================================
//   DB2 → DB1 — APPROVE CHANGE
//   Called from confirmAction() in script.js
//   when enumerator clicks Approve after Gemini check
// ============================================
async function approveChangeInFirebase(changeRecord) {
  if (!changeRecord) return;

  try {
    // Find the Firestore document for this change
    let firestoreId = changeRecord.firestoreId;

    // If no firestoreId — search by changeId
    if (!firestoreId && changeRecord.changeId) {
      const snap = await db.collection("changes")
        .where("changeId", "==", changeRecord.changeId).get();
      if (!snap.empty) firestoreId = snap.docs[0].id;
    }

    // Step 1 — Mark as Approved in DB2
    if (firestoreId) {
      await db.collection("changes").doc(firestoreId).update({
        status:     "Approved",
        approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
        approvedBy: sessionStorage.getItem("js_user")
          ? JSON.parse(sessionStorage.getItem("js_user")).name : "System"
      });
      console.log("✅ DB2 — Change marked Approved");
    }

    // Step 2 — Move data to DB1 based on change type
    const type = (changeRecord.type || "").toLowerCase();

        if (type === "birth" || type === "new birth") {
      // Add new citizen to Population Registry
      const newId = "CIT-" + new Date().getFullYear() + "-FB-" + Date.now().toString().slice(-6);

      // If this change came from Newborn Registration, fetch newborn data
      let newbornData = null;
      if (changeRecord.newbornRef) {
        try {
          const nbDoc = await db.collection("newborns").doc(changeRecord.newbornRef).get();
          if (nbDoc.exists) newbornData = nbDoc.data();
        } catch(e) { console.warn("Could not fetch newborn:", e.message); }
      }

      // Decide which Aadhaar to show:
      // 1. If newborn → mother's Aadhaar > father's Aadhaar > tempId (orphan)
      // 2. Else → use rawData.aadhaar
      let aadhaarToUse = "Pending";
      if (newbornData) {
        if (newbornData.motherAadhaar && newbornData.motherAadhaar !== "Not Available" && newbornData.motherAadhaar.trim() !== "") {
          aadhaarToUse = newbornData.motherAadhaar;
        } else if (newbornData.fatherAadhaar && newbornData.fatherAadhaar !== "Not Available" && newbornData.fatherAadhaar.trim() !== "") {
          aadhaarToUse = newbornData.fatherAadhaar;
        } else if (newbornData.tempId) {
          aadhaarToUse = newbornData.tempId;
        }
      } else {
        aadhaarToUse = changeRecord.rawData?.aadhaar || "Pending";
      }

      await db.collection("citizens").add({
        id:          newId,
        name:        (newbornData?.name) || changeRecord.citizen || "New Citizen",
        aadhaar:     aadhaarToUse,
        dob:         (newbornData?.dob)      || changeRecord.rawData?.dob     || "Unknown",
        gender:      (newbornData?.gender)   || changeRecord.rawData?.gender  || "Unknown",
        state:       (newbornData?.state)    || changeRecord.rawData?.state   || "Unknown",
        district:    (newbornData?.district) || changeRecord.rawData?.district|| "Unknown",
        address:     (newbornData?.hospital) || changeRecord.details          || "",
        status:      "Alive",
        source:      newbornData ? "Approved Newborn Registration" : "Approved from Change Log",
        changeLogRef: firestoreId || "",
        lastUpdated: new Date().toLocaleDateString("en-IN", {month:"short", year:"numeric"}),
        createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt:   firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("✅ DB1 — New citizen added from Change Log:", newId);
    }

    else if (type === "death") {
      // Find citizen by name and mark as Deceased in DB1
      const citizenName = changeRecord.citizen.split(" — ")[0].trim();
      const snap = await db.collection("citizens")
        .where("name", "==", citizenName).get();
      if (!snap.empty) {
        for (const d of snap.docs) {
          await d.ref.update({
            status:    "Deceased",
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          console.log("✅ DB1 — Citizen marked Deceased:", citizenName);
        }
      }
    }

    else if (type === "migration" || type === "address" || type === "address change / migration") {
      // Update address in DB1
      const citizenName = changeRecord.citizen.split(" — ")[0].trim();
      const snap = await db.collection("citizens")
        .where("name", "==", citizenName).get();
      if (!snap.empty) {
        for (const d of snap.docs) {
          await d.ref.update({
            address:   changeRecord.details || "",
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          console.log("✅ DB1 — Address updated for:", citizenName);
        }
      }
    }

    console.log("🔄 Approved change successfully moved from DB2 → DB1");
    return true;

  } catch(err) {
    console.error("❌ Approve error:", err.message);
    return false;
  }
}

// ============================================
//   DB2 — REJECT CHANGE
//   Stays in DB2 as Rejected — never goes to DB1
// ============================================
async function rejectChangeInFirebase(changeRecord) {
  if (!changeRecord) return;
  try {
    let firestoreId = changeRecord.firestoreId;
    if (!firestoreId && changeRecord.changeId) {
      const snap = await db.collection("changes")
        .where("changeId", "==", changeRecord.changeId).get();
      if (!snap.empty) firestoreId = snap.docs[0].id;
    }
    if (firestoreId) {
      await db.collection("changes").doc(firestoreId).update({
        status:     "Rejected",
        rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
        rejectedBy: sessionStorage.getItem("js_user")
          ? JSON.parse(sessionStorage.getItem("js_user")).name : "System"
      });
      console.log("❌ DB2 — Change marked Rejected (stays in DB2, not in DB1)");
    }
  } catch(err) {
    console.error("❌ Reject error:", err.message);
  }
}

// ============================================
//   DB2 — SAVE NEWBORN
//   Newborn goes to DB2 first
//   Only moves to DB1 after verification
// ============================================
async function saveNewbornToDB(data) {
  try {
    const tempId = "TEMP-" + new Date().getFullYear() + "-" + Date.now().toString().slice(-6);

    // Save to newborns collection (part of DB2)
    const nbRef = await db.collection("newborns").add({
      ...data,
      tempId,
      status:    "Pending Aadhaar Enrollment",
      source:    "Birth Registration",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Also log in changes collection for verification queue
    await db.collection("changes").add({
      changeId:   "CHG-NB-" + Date.now(),
      type:       "Birth",
      citizen:    data.name || "Newborn Baby",
      details:    `Born at ${data.hospital || "Unknown location"} | TempID: ${tempId}`,
      reportedBy: sessionStorage.getItem("js_user")
        ? JSON.parse(sessionStorage.getItem("js_user")).name : "Enumerator",
      date:       new Date().toLocaleDateString("en-IN", {day:"2-digit", month:"short", year:"numeric"}),
      status:     "Pending",
      source:     "Birth Registration",
      newbornRef: nbRef.id,
      createdAt:  firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("✅ DB2 — Newborn registered:", tempId);
    showToast("✅ Newborn saved to DB2 — pending verification before entering Population Registry");
    return nbRef.id;
  } catch(err) {
    console.error("❌ Newborn error:", err.message);
    showToast("❌ Could not save newborn", "#991B1B");
    return null;
  }
}

// ============================================
//   DB1 — SAVE NEW CITIZEN DIRECTLY
//   Used from New Citizen tab for direct entry
// ============================================
async function saveCitizenToDB(data) {
  try {
    const newId = "CIT-" + new Date().getFullYear() + "-FB-" + Date.now().toString().slice(-6);
    const ref = await db.collection("citizens").add({
      id:          newId,
      name:        data.name     || "",
      aadhaar:     data.aadhaar  || "Pending",
      dob:         data.dob      || "",
      gender:      data.gender   || "",
      state:       data.state    || "",
      district:    data.district || "",
      address:     data.address  || "",
      status:      "Alive",
      source:      "Direct Enumerator Entry",
      lastUpdated: new Date().toLocaleDateString("en-IN", {month:"short", year:"numeric"}),
      createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:   firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("✅ DB1 — Citizen saved directly:", ref.id);
    showToast("✅ Citizen added to Population Registry (DB1)!");
    return ref.id;
  } catch(err) {
    console.error("❌ Save citizen error:", err.message);
    showToast("❌ Could not save citizen", "#991B1B");
    return null;
  }
}

// ============================================
//   REAL TIME LISTENERS
//   Tables update automatically when Firebase changes
// ============================================

function listenToCitizens() {
  db.collection("citizens")
    .orderBy("createdAt", "desc")
    .onSnapshot(snap => {
      const list = [];
      snap.forEach(d => list.push({ firestoreId: d.id, ...d.data() }));
      if (typeof renderMasterDB === "function") renderMasterDB(list);
      const el = document.getElementById("masterCount");
      if (el) el.textContent = `Showing ${list.length} verified citizens — Population Registry (Firebase Live)`;
      console.log(`🔄 DB1 updated: ${list.length} citizens`);
    }, err => console.error("DB1 listener error:", err.message));
}

function listenToChanges() {
  db.collection("changes")
    .orderBy("createdAt", "desc")
    .onSnapshot(snap => {
      const list = [];
      snap.forEach(d => list.push({ firestoreId: d.id, ...d.data() }));
      // Update in-memory changeLogDB so existing script.js functions still work
      changeLogDB.length = 0;
      list.forEach(item => changeLogDB.push(item));
      if (typeof renderChangeLog === "function") renderChangeLog(list);
      const pending = list.filter(c => c.status === "Pending").length;
      console.log(`🔄 DB2 updated: ${list.length} changes (${pending} pending)`);
    }, err => console.error("DB2 listener error:", err.message));
}

// ============================================
//   PATCH confirmAction in script.js
//   This intercepts approve/reject and saves to Firebase
// ============================================
window.addEventListener("load", () => {
  setTimeout(() => {
    // Patch the existing confirmAction function to also save to Firebase
    const originalConfirmAction = window.confirmAction;
    window.confirmAction = async function() {
      if (!pendingAction) return;
      const { index, action } = pendingAction;
      const record = changeLogDB[index];

      // Call original function first (updates local UI)
      originalConfirmAction();

      // Then save to Firebase
      if (action === "approve") {
        console.log("🔄 Syncing approval to Firebase...");
        await approveChangeInFirebase(record);
      } else {
        console.log("🔄 Syncing rejection to Firebase...");
        await rejectChangeInFirebase(record);
      }
    };

    // Start real-time listeners
    listenToCitizens();
    listenToChanges();
    console.log("🚀 Firebase real-time listeners active!");
    console.log("📡 Population Registry and Change Log are now live!");
  }, 2000);
});

// Make all functions globally available
window.seedInitialData        = seedInitialData;
window.saveChangeToDB         = saveChangeToDB;
window.saveNewbornToDB        = saveNewbornToDB;
window.saveCitizenToDB        = saveCitizenToDB;
window.approveChangeInFirebase = approveChangeInFirebase;
window.rejectChangeInFirebase  = rejectChangeInFirebase; 
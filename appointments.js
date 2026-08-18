const apptState = {
  currentStep: 1,
  specialty: null,
  doctor: null,
  date: null,
  time: null,
  visitType: "in-clinic",
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
};

function getAvailableDates(year, month) {
  const available = new Set();
  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date >= today && date.getDay() !== 5 && Math.random() > 0.3) {
      available.add(d);
    }
  }
  let added = 0;
  for (let d = 1; d <= daysInMonth && added < 5; d++) {
    const date = new Date(year, month, d);
    if (date >= today && date.getDay() !== 5 && date.getDay() !== 6) {
      available.add(d);
      added++;
    }
  }
  return available;
}

function goToStep(step) {
  if (step < 1 || step > 4) return;
  if (step === 2 && !apptState.specialty) return;
  if (step === 3 && !apptState.doctor) return;
  if (step === 4 && (!apptState.date || !apptState.time)) return;

  const prevStep = apptState.currentStep;
  apptState.currentStep = step;
  history.pushState({ step: step }, "", "#step" + step);
  document.querySelectorAll(".step-panel").forEach((p, i) => {
    p.classList.remove("active");
    if (i + 1 === step) p.classList.add("active");
  });
  document.querySelectorAll(".step-node").forEach((node, i) => {
    node.classList.remove("active", "done");
    if (i + 1 === step) node.classList.add("active");
    if (i + 1 < step) node.classList.add("done");
    const inner = node.querySelector(".step-circle-inner");
    if (i + 1 < step) {
      inner.innerHTML = '<i class="bi bi-check2-lg"></i>';
    } else {
      const icons = [
        "bi-grid-3x3-gap-fill",
        "bi-person-badge",
        "bi-calendar3",
        "bi-check2-circle",
      ];
      inner.innerHTML = `<i class="bi ${icons[i]}"></i>`;
    }
  });

  document.querySelectorAll(".step-connector").forEach((conn, i) => {
    conn.classList.toggle("active", i + 1 < step);
  });

  if (step === 2) populateStep2();
  if (step === 3) populateStep3();
  if (step === 4) populateStep4();
  const section = document.querySelector(".appt-section");
  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
}
function selectSpecialty(card) {
  document
    .querySelectorAll(".specialty-card")
    .forEach((c) => c.classList.remove("selected"));
  card.classList.add("selected");
  apptState.specialty = card.dataset.specialty;

  const btn = document.getElementById("nextToStep2");
  if (btn) btn.disabled = false;
}
function populateStep2() {
  const label = document.getElementById("chosenSpecLabel");
  if (label) label.textContent = apptState.specialty || "—";
  document.querySelectorAll(".dr-spec").forEach((el) => {
    el.textContent = (apptState.specialty || "") + " Specialist";
  });
  document
    .querySelectorAll(".doctor-row")
    .forEach((r) => r.classList.remove("selected", "hidden"));
  document.getElementById("nextToStep3").disabled = !apptState.doctor;
}

function selectDoctor(row) {
  document
    .querySelectorAll(".doctor-row")
    .forEach((r) => r.classList.remove("selected"));
  row.classList.add("selected");
  const clone = row.querySelector(".dr-name").cloneNode(true);
  clone.querySelector("i")?.remove();
  apptState.doctor = clone.textContent.trim();

  document.getElementById("nextToStep3").disabled = false;
}

function filterDoctors(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll(".doctor-row").forEach((row) => {
    const name = row.dataset.name || "";
    row.classList.toggle("hidden", q.length > 0 && !name.includes(q));
  });
}

function filterByGender(val) {
  document.querySelectorAll(".doctor-row").forEach((row) => {
    if (!val) {
      row.classList.remove("hidden");
      return;
    }
    row.classList.toggle("hidden", row.dataset.gender !== val);
  });
}

function filterByRating(val) {
  document.querySelectorAll(".doctor-row").forEach((row) => {
    if (!val) {
      row.classList.remove("hidden");
      return;
    }
    const rating = parseInt(row.dataset.rating, 10);
    row.classList.toggle("hidden", rating < parseInt(val, 10));
  });
}
function populateStep3() {
  renderCalendar();
}

function renderCalendar() {
  const { calYear, calMonth } = apptState;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.getElementById("calMonthLabel").textContent =
    `${monthNames[calMonth]} ${calYear}`;

  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const available = getAvailableDates(calYear, calMonth);
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("button");
    empty.className = "cal-cell empty";
    empty.disabled = true;
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const btn = document.createElement("button");
    btn.textContent = d;
    btn.className = "cal-cell";

    const thisDate = new Date(calYear, calMonth, d);

    if (thisDate < today) {
      btn.classList.add("past");
      btn.disabled = true;
    } else if (available.has(d)) {
      btn.classList.add("available");
      if (
        apptState.date &&
        apptState.calYear === calYear &&
        apptState.calMonth === calMonth
      ) {
        const selDay = new Date(apptState.date).getDate();
        if (selDay === d) btn.classList.add("selected");
      }
      btn.onclick = () => selectDate(btn, d, calYear, calMonth);
    } else {
      btn.classList.add("past");
      btn.disabled = true;
    }

    grid.appendChild(btn);
  }
}

function changeMonth(dir) {
  apptState.calMonth += dir;
  if (apptState.calMonth > 11) {
    apptState.calMonth = 0;
    apptState.calYear++;
  }
  if (apptState.calMonth < 0) {
    apptState.calMonth = 11;
    apptState.calYear--;
  }
  renderCalendar();
}

function selectDate(btn, day, year, month) {
  document
    .querySelectorAll(".cal-cell")
    .forEach((c) => c.classList.remove("selected"));
  btn.classList.add("selected");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date(year, month, day);

  apptState.date = d.toISOString();
  const dateStr = `${days[d.getDay()]}, ${day} ${months[month]} ${year}`;
  apptState.dateDisplay = dateStr;

  document.getElementById("timeslotDateLabel").textContent = dateStr;
  apptState.time = null;
  document
    .querySelectorAll(".time-slot")
    .forEach((s) => s.classList.remove("selected-slot"));
  document.getElementById("nextToStep4").disabled = true;
}

function selectSlot(btn) {
  document
    .querySelectorAll(".time-slot")
    .forEach((s) => s.classList.remove("selected-slot"));
  btn.classList.add("selected-slot");
  apptState.time = btn.dataset.time;

  const btn4 = document.getElementById("nextToStep4");
  if (btn4 && apptState.date) btn4.disabled = false;
}
function populateStep4() {
  document.getElementById("sumSpecialty").textContent =
    apptState.specialty || "—";
  document.getElementById("sumDoctor").textContent = apptState.doctor || "—";
  document.getElementById("sumDate").textContent = apptState.dateDisplay || "—";
  document.getElementById("sumTime").textContent = apptState.time || "—";

  const vtMap = {
    "in-clinic": "In-Clinic Visit",
    video: "Video Consultation",
    home: "Home Visit",
  };
  const checkedVT = document.querySelector('input[name="visitType"]:checked');
  document.getElementById("sumVisitType").textContent =
    vtMap[checkedVT ? checkedVT.value : "in-clinic"];
}
function submitAppointment() {
  const first = document.getElementById("patFirstName")?.value.trim();
  const last = document.getElementById("patLastName")?.value.trim();
  const email = document.getElementById("patEmail")?.value.trim();
  const phone = document.getElementById("patPhone")?.value.trim();
  const agreed = document.getElementById("agreeCheck")?.checked;

  if (!first || !last) {
    showInlineError("Please enter your full name.");
    return;
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    showInlineError("Please enter a valid email.");
    return;
  }
  if (!phone) {
    showInlineError("Please enter your phone number.");
    return;
  }
  if (!agreed) {
    showInlineError("Please agree to the Terms & Conditions.");
    return;
  }
  const checkedVT = document.querySelector('input[name="visitType"]:checked');
  if (checkedVT) apptState.visitType = checkedVT.value;
  document.querySelector(".step-content-area").style.display = "none";
  document.querySelector(".steps-wrapper").style.display = "none";

  document.getElementById("succDoctor").textContent = apptState.doctor || "—";
  document.getElementById("succDate").textContent =
    apptState.dateDisplay || "—";
  document.getElementById("succTime").textContent = apptState.time || "—";

  document.getElementById("successOverlay").style.display = "block";
  document
    .getElementById("successOverlay")
    .scrollIntoView({ behavior: "smooth", block: "center" });
}

function showInlineError(msg) {
  const existing = document.getElementById("apptErrorToast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "apptErrorToast";
  toast.style.cssText = `
        position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
        background: #e53e3e; color: #fff; padding: 14px 24px; border-radius: 12px;
        font-size: 14px; font-weight: 600; z-index: 9999;
        box-shadow: 0 8px 24px rgba(229,62,62,0.35);
        display: flex; align-items: center; gap: 10px;
        animation: slideUp 0.3s ease;
    `;
  toast.innerHTML = `<i class="bi bi-exclamation-circle-fill" style="font-size:17px;"></i> ${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
function resetAll() {
  apptState.currentStep = 1;
  apptState.specialty = null;
  apptState.doctor = null;
  apptState.date = null;
  apptState.time = null;
  apptState.visitType = "in-clinic";
  apptState.calYear = new Date().getFullYear();
  apptState.calMonth = new Date().getMonth();

  document
    .querySelectorAll(".specialty-card")
    .forEach((c) => c.classList.remove("selected"));
  document
    .querySelectorAll(".doctor-row")
    .forEach((r) => r.classList.remove("selected", "hidden"));
  document
    .querySelectorAll(".time-slot")
    .forEach((s) => s.classList.remove("selected-slot"));
  document.getElementById("nextToStep2").disabled = true;
  document.getElementById("nextToStep3").disabled = true;
  document.getElementById("nextToStep4").disabled = true;
  document.getElementById("timeslotDateLabel").textContent =
    "Select a date first";

  document.getElementById("successOverlay").style.display = "none";
  document.querySelector(".step-content-area").style.display = "block";
  document.querySelector(".steps-wrapper").style.display = "flex";

  goToStep(1);
}
document.addEventListener("DOMContentLoaded", function () {
  history.replaceState({ step: 1 }, "", "#step1");
  window.addEventListener("popstate", (e) => goToStep(e.state?.step || 1));
  document.querySelectorAll('input[name="visitType"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      apptState.visitType = this.value;
      const vtMap = {
        "in-clinic": "In-Clinic Visit",
        video: "Video Consultation",
        home: "Home Visit",
      };
      const el = document.getElementById("sumVisitType");
      if (el) el.textContent = vtMap[this.value];
    });
  });
  const style = document.createElement("style");
  style.textContent = `@keyframes slideUp { from { opacity:0; transform:translate(-50%,20px); } to { opacity:1; transform:translate(-50%,0); } }`;
  document.head.appendChild(style);
});

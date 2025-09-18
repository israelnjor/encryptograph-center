// --- Admin login helpers (added at top) ---
const ADMINS = ["israel","margaret","emefa","vincent","saidat","richard","afia","Isaac"];
const PASSWORD = "123";
let currentAdmin = sessionStorage.getItem('currentAdmin') || null;

function login() {
  const user = (document.getElementById("loginUser").value || "").trim().toLowerCase();
  const pass = (document.getElementById("loginPass").value || "").trim();
  const err = document.getElementById("loginError");

  if (ADMINS.includes(user) && pass === PASSWORD) {
    currentAdmin = user;
    sessionStorage.setItem('currentAdmin', currentAdmin);

    // show main panel, hide login
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainPanel").style.display = "block";

    if (err) err.style.display = "none";

    // fetch notifications now that we're logged in
    fetchNotifications();
  } else {
    if (err) err.style.display = "block";
  }
}

// if already logged in (page reload), show main panel and fetch
if (currentAdmin) {
  document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById("loginScreen");
    const mainPanel = document.getElementById("mainPanel");
    if (loginScreen && mainPanel) {
      loginScreen.style.display = "none";
      mainPanel.style.display = "block";
    }
    fetchNotifications();
  });
}

// --- API base URL (your original line) ---
const API_URL = "https://encryptograph-center-3kwc.onrender.com/api/notifications";

// Fetch all notifications (modified to filter + show admin)
async function fetchNotifications() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const container = document.getElementById("notifications");
    container.innerHTML = "";

    // read selected admin filter (default 'all')
    const filter = (document.getElementById("adminFilter")?.value || "all").toLowerCase();

    data.forEach(n => {
      const nAdmin = (n.admin || "Israel").toLowerCase();
      if (filter !== "all" && nAdmin !== filter) return;

      const div = document.createElement("div");
      div.className = `notification ${n.type}`;
      const time = new Date(n.createdAt).toLocaleString();

      div.innerHTML = `<div class="content">
        <b>[${n.type}]</b> ${n.message}
        <span class="timestamp">${time} | by <i>${n.admin || "Israel"}</i></span>
      </div>`;

      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.onclick = () => deleteNotification(n._id);

      div.appendChild(btn);
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    alert("Could not fetch notifications.");
  }
}

// Add a new notification (only body line changed)
async function addNotification() {
  const message = document.getElementById("messageInput").value.trim();
  const type = document.getElementById("typeSelect").value.toLowerCase();

  if (!message) return alert("Enter a message");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, type, admin: currentAdmin || "Israel" })
    });

    if (!res.ok) throw new Error(await res.text());

    document.getElementById("messageInput").value = "";
    fetchNotifications();
  } catch (err) {
    console.error("Could not add notification:", err);
    alert("Failed to add notification");
  }
}

// Delete notification (unchanged)
async function deleteNotification(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete notification");
    fetchNotifications();
  } catch (err) {
    console.error("Could not delete notification:", err);
    alert("Failed to delete notification");
  }
}

// Hook filter dropdown to re-fetch
document.addEventListener('DOMContentLoaded', () => {
  const adminFilter = document.getElementById('adminFilter');
  if (adminFilter) {
    adminFilter.addEventListener('change', fetchNotifications);
  }
});

// Remove original unconditional fetch; only fetch if already logged in
if (currentAdmin) fetchNotifications();

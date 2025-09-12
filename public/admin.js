const API_URL = "https://encryptograph-center-3kwc.onrender.com/api/notifications";

// Fetch all notifications
async function fetchNotifications() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const container = document.getElementById("notifications");
        container.innerHTML = "";

        data.forEach(n => {
            const div = document.createElement("div");
            div.className = `notification ${n.type}`;
            const time = new Date(n.createdAt).toLocaleString();
            div.innerHTML = `<b>[${n.type}]</b> ${n.message} <span class="timestamp">${time}</span>`;

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

// Add a new notification
async function addNotification() {
    const message = document.getElementById("messageInput").value.trim();
    const type = document.getElementById("typeSelect").value.toLowerCase();

    if (!message) return alert("Enter a message");

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, type })
        });

        if (!res.ok) throw new Error(await res.text());

        document.getElementById("messageInput").value = "";
        fetchNotifications();
    } catch (err) {
        console.error("Could not add notification:", err);
        alert("Failed to add notification");
    }
}

// Delete notification
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

// Initial fetch
fetchNotifications();

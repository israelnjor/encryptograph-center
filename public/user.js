<<<<<<< HEAD
// Replace with your server's local IP and port
const API_URL = "/api/notifications"; // ✅ relative path, no localhost needed

// Fetch and display notifications for users
async function fetchNotifications() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const container = document.getElementById("notifications");
        container.innerHTML = ""; // Clear previous notifications

        data.forEach(n => {
            const div = document.createElement("div");
            div.className = `notification ${n.type}`; // color based on type
            const time = new Date(n.createdAt).toLocaleString();
            div.innerHTML = `<b>[${n.type}]</b> ${n.message} <span class="timestamp">${time}</span>`;
            container.appendChild(div);
        });

        // Auto-scroll to the newest notification
        if (container.lastChild) {
            container.lastChild.scrollIntoView({ behavior: "smooth" });
        }

    } catch (err) {
        console.error("Error fetching notifications:", err);
    }
}

// Initial fetch + refresh every 5 seconds
fetchNotifications();
setInterval(fetchNotifications, 5000);
=======
// Replace with your server's local IP and port
const API_URL = "/api/notifications"; // relative path works locally & on Render

// Fetch and display notifications for users
async function fetchNotifications() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const container = document.getElementById("notifications");
        container.innerHTML = ""; // Clear previous notifications

        data.forEach(n => {
            const div = document.createElement("div");
            div.className = `notification ${n.type}`; // color based on type
            const time = new Date(n.createdAt).toLocaleString();
            div.innerHTML = `<b>[${n.type}]</b> ${n.message} <span class="timestamp">${time}</span>`;
            container.appendChild(div);
        });

        // Auto-scroll to the newest notification
        if (container.lastChild) {
            container.lastChild.scrollIntoView({ behavior: "smooth" });
        }

    } catch (err) {
        console.error("Error fetching notifications:", err);
    }
}

// Initial fetch + refresh every 5 seconds
fetchNotifications();
setInterval(fetchNotifications, 5000);

>>>>>>> c4a521f8a7838fa60013add81a949d7d740d3b0e

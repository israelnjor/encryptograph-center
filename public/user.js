const API_URL = "https://encryptograph-center-3kwc.onrender.com/api/notifications";

// Fetch and display notifications for users
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
            container.appendChild(div);
        });

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

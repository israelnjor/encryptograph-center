const API_URL = "https://encryptograph-center-3kwc.onrender.com/api/notifications";

// Track read notifications locally (by ID)
let readNotifications = new Set(JSON.parse(localStorage.getItem("readNotifs")) || []);

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

            // Check if already read
            const isRead = readNotifications.has(n._id);

            div.innerHTML = `
              <div>
                <b>[${n.type}]</b> ${n.message}
                <span class="timestamp">${time}</span>
                ${n.admin ? `<div class="sender">👤 ${n.admin}</div>` : ""}
              </div>
              <div>
                ${isRead ? `<span style="color:gray; font-size:0.9em;">✔ Read</span>` 
                         : `<button class="mark-read" data-id="${n._id}">Mark as Read</button>`}
              </div>
            `;

            container.appendChild(div);
        });

        // Attach event listeners to "Mark as Read"
        document.querySelectorAll(".mark-read").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                readNotifications.add(id);
                localStorage.setItem("readNotifs", JSON.stringify([...readNotifications]));
                fetchNotifications(); // refresh UI
            });
        });

    } catch (err) {
        console.error("Error fetching notifications:", err);
    }
}

// Initial fetch + refresh every 5 seconds
fetchNotifications();
setInterval(fetchNotifications, 5000);

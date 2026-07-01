// =======================================
// THOR DISPLAY CMS
// Announcements Manager
// =======================================

let selectedAnnouncementId = null;

// ----------------------------
// Initialize Page
// ----------------------------

async function initAnnouncementsPage() {

    document
        .getElementById("newAnnouncement")
        .onclick = showNewAnnouncement;

    document
        .getElementById("saveAnnouncement")
        .onclick = saveAnnouncement;

    document
        .getElementById("deleteAnnouncement")
        .onclick = deleteAnnouncement;

    document
        .getElementById("cancelEdit")
        .onclick = closeEditor;

    closeEditor();

    await loadAnnouncements();

}

// ----------------------------
// Load announcements
// ----------------------------

async function loadAnnouncements() {

    const list = document.getElementById("announcementList");

    list.innerHTML = "Loading...";

    const { data, error } = await supabaseClient

        .from("announcements")

        .select("*")

        .order("sort_order", { ascending: true });

    if (error) {

        list.innerHTML = error.message;

        return;

    }

    list.innerHTML = "";

    data.forEach(item => {

        const card = document.createElement("div");

        card.className = "announcement-item";

        card.innerHTML = `

<h3>${item.title || "Untitled"}</h3>

<p>${item.message}</p>

<small>

${item.enabled ? "🟢 Enabled" : "⚪ Disabled"}

</small>

`;

        card.onclick = () => {

            document.querySelectorAll(".announcement-item")
                .forEach(i => i.classList.remove("active"));

            card.classList.add("active");

            editAnnouncement(item);

        };

        list.appendChild(card);

    });

}

// ----------------------------
// Open New Editor
// ----------------------------

function showNewAnnouncement() {

    selectedAnnouncementId = null;

    document.getElementById("announcementWelcome").style.display = "none";

    document.getElementById("announcementEditor").style.display = "block";

    document.getElementById("editorTitle").innerText =
        "New Announcement";

    document.getElementById("announcementTitle").value = "";

    document.getElementById("announcementMessage").value = "";

    document.getElementById("announcementEnabled").checked = true;

    document.getElementById("announcementStatus").innerHTML = "";

}

// ----------------------------
// Edit Existing
// ----------------------------

function editAnnouncement(item) {

    selectedAnnouncementId = item.id;

    document.getElementById("announcementWelcome").style.display = "none";

    document.getElementById("announcementEditor").style.display = "block";

    document.getElementById("editorTitle").innerText =
        "Edit Announcement";

    document.getElementById("announcementTitle").value =
        item.title || "";

    document.getElementById("announcementMessage").value =
        item.message || "";

    document.getElementById("announcementEnabled").checked =
        item.enabled;

}

// ----------------------------
// Close Editor
// ----------------------------

function closeEditor() {

    selectedAnnouncementId = null;

    document.getElementById("announcementWelcome").style.display = "block";

    document.getElementById("announcementEditor").style.display = "none";

    document.querySelectorAll(".announcement-item")
        .forEach(i => i.classList.remove("active"));

}

// ----------------------------
// Save
// ----------------------------

async function saveAnnouncement() {

    const title =
        document.getElementById("announcementTitle").value.trim();

    const message =
        document.getElementById("announcementMessage").value.trim();

    const enabled =
        document.getElementById("announcementEnabled").checked;

    const status =
        document.getElementById("announcementStatus");

    if (message === "") {

        status.innerHTML = "Please enter a message.";

        return;

    }

    status.innerHTML = "Saving...";

    let result;

    if (selectedAnnouncementId) {

        result = await supabaseClient

            .from("announcements")

            .update({

                title,

                message,

                enabled

            })

            .eq("id", selectedAnnouncementId);

    } else {

        const { data } = await supabaseClient

            .from("announcements")

            .select("sort_order")

            .order("sort_order", { ascending: false })

            .limit(1);

        let nextOrder = 1;

        if (data.length) {

            nextOrder = data[0].sort_order + 1;

        }

        result = await supabaseClient

            .from("announcements")

            .insert({

                title,

                message,

                enabled,

                sort_order: nextOrder

            });

    }

    if (result.error) {

        status.innerHTML = result.error.message;

        return;

    }

    status.innerHTML = "✅ Saved";

    await loadAnnouncements();

    closeEditor();

}

// ----------------------------
// Delete
// ----------------------------

async function deleteAnnouncement() {

    if (!selectedAnnouncementId) return;

    if (!confirm("Delete this announcement?")) return;

    const { error } = await supabaseClient

        .from("announcements")

        .delete()

        .eq("id", selectedAnnouncementId);

    if (error) {

        alert(error.message);

        return;

    }

    await loadAnnouncements();

    closeEditor();

}

// =======================================
// THOR DISPLAY CMS
// Announcements Manager
// =======================================

let selectedAnnouncementId = null;

async function initAnnouncementsPage() {

    document
        .getElementById("newAnnouncement")
        .addEventListener("click", newAnnouncement);

    document
        .getElementById("saveAnnouncement")
        .addEventListener("click", saveAnnouncement);

    document
        .getElementById("deleteAnnouncement")
        .addEventListener("click", deleteAnnouncement);

    document
        .getElementById("cancelEdit")
        .addEventListener("click", newAnnouncement);

    await loadAnnouncements();

}

async function loadAnnouncements() {

    const list =
        document.getElementById("announcementList");

    list.innerHTML = "Loading...";

    const { data, error } = await supabaseClient

        .from("announcements")

        .select("*")

        .order("sort_order", {
            ascending: true
        });

    if (error) {

        list.innerHTML = error.message;

        return;

    }

    list.innerHTML = "";

    data.forEach(item => {

        const div = document.createElement("div");

        div.className = "announcement-item";

        div.innerHTML = `

<h3>${item.title || "Untitled"}</h3>

<p>${item.message}</p>

<small>

${item.enabled ? "🟢 Enabled" : "⚪ Disabled"}

</small>

`;

        div.onclick = () => editAnnouncement(item);

        list.appendChild(div);

    });

}

function editAnnouncement(item) {

    selectedAnnouncementId = item.id;

    document.getElementById("editorTitle").textContent =
        "Edit Announcement";

    document.getElementById("announcementTitle").value =
        item.title || "";

    document.getElementById("announcementMessage").value =
        item.message || "";

    document.getElementById("announcementEnabled").checked =
        item.enabled;

}

function newAnnouncement() {

    selectedAnnouncementId = null;

    document.getElementById("editorTitle").textContent =
        "New Announcement";

    document.getElementById("announcementTitle").value = "";

    document.getElementById("announcementMessage").value = "";

    document.getElementById("announcementEnabled").checked = true;

    document.getElementById("announcementStatus").textContent = "";

}

async function saveAnnouncement() {

    const title =
        document.getElementById("announcementTitle").value.trim();

    const message =
        document.getElementById("announcementMessage").value.trim();

    const enabled =
        document.getElementById("announcementEnabled").checked;

    const status =
        document.getElementById("announcementStatus");

    if (!message) {

        status.textContent =
            "Please enter a message.";

        return;

    }

    status.textContent = "Saving...";

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

            .order("sort_order", {
                ascending: false
            })

            .limit(1);

        let order = 1;

        if (data.length)
            order = data[0].sort_order + 1;

        result = await supabaseClient

            .from("announcements")

            .insert({

                title,

                message,

                enabled,

                sort_order: order

            });

    }

    if (result.error) {

        status.textContent =
            result.error.message;

        return;

    }

    status.textContent =
        "✅ Saved";

    await loadAnnouncements();

    newAnnouncement();

}

async function deleteAnnouncement() {

    if (!selectedAnnouncementId)
        return;

    if (!confirm("Delete this announcement?"))
        return;

    const { error } = await supabaseClient

        .from("announcements")

        .delete()

        .eq("id", selectedAnnouncementId);

    if (error) {

        alert(error.message);

        return;

    }

    newAnnouncement();

    loadAnnouncements();

}

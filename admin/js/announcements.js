// =======================================
// THOR DISPLAY CMS
// Announcements Manager
// =======================================

async function initAnnouncementsPage() {

    const list = document.getElementById("announcementList");
    const input = document.getElementById("newAnnouncement");
    const addBtn = document.getElementById("addAnnouncement");

    if (!list) return;

    async function loadAnnouncements() {

        const { data, error } = await supabaseClient
            .from("announcements")
            .select("*")
            .order("sort_order");

        if (error) {

            list.innerHTML = error.message;

            return;

        }

        list.innerHTML = "";

        data.forEach(item => {

            const row = document.createElement("div");

            row.className = "announcementRow";

            row.innerHTML = `
                <input
                    type="text"
                    value="${item.message}"
                    id="msg-${item.id}">

                <button onclick="saveAnnouncement(${item.id})">
                    💾 Save
                </button>

                <button onclick="deleteAnnouncement(${item.id})">
                    🗑 Delete
                </button>
            `;

            list.appendChild(row);

        });

    }

    addBtn.onclick = async () => {

        const text = input.value.trim();

        if (text === "") return;

        const { error } = await supabaseClient

            .from("announcements")

            .insert({

                message: text,

                enabled: true,

                sort_order: Date.now()

            });

        if (error) {

            alert(error.message);

            return;

        }

        input.value = "";

        loadAnnouncements();

    };

    window.saveAnnouncement = async function(id) {

        const value =
            document.getElementById("msg-" + id).value;

        await supabaseClient

            .from("announcements")

            .update({

                message: value

            })

            .eq("id", id);

        loadAnnouncements();

    };

    window.deleteAnnouncement = async function(id) {

        if (!confirm("Delete this announcement?"))
            return;

        await supabaseClient

            .from("announcements")

            .delete()

            .eq("id", id);

        loadAnnouncements();

    };

    loadAnnouncements();

}

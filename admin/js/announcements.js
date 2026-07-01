// ======================================
// THOR DISPLAY CMS
// Announcements Manager
// ======================================

async function initAnnouncementsPage() {

    const list = document.getElementById("announcementList");

    if (!list) return;

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

    let html = "";

    data.forEach(item => {

        html += `

<div class="card">

<h3>${item.title || "Untitled"}</h3>

<p>${item.message}</p>

<p>

Status:
${item.enabled ? "✅ Enabled" : "❌ Disabled"}

</p>

</div>

`;

    });

    list.innerHTML = html;

}

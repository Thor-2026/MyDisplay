// =======================================
// THOR DISPLAY CMS
// Schedule Manager
// =======================================

function initSchedulePage() {

    const fileInput = document.getElementById("scheduleFile");

    if (!fileInput) return;

    const preview = document.getElementById("preview");
    const uploadBtn = document.getElementById("uploadBtn");
    const status = document.getElementById("status");
    const currentSchedule = document.getElementById("currentSchedule");

    // Show current schedule

    const imageUrl = supabaseClient.storage
        .from("display")
        .getPublicUrl("schedule/current.png")
        .data.publicUrl;

    currentSchedule.src =
        imageUrl + "?t=" + Date.now();

    let selectedFile = null;

    // Preview image

    fileInput.addEventListener("change", () => {

        selectedFile = fileInput.files[0];

        if (!selectedFile) return;

        preview.src =
            URL.createObjectURL(selectedFile);

        preview.style.display = "block";

    });

    // Upload

    uploadBtn.addEventListener("click", async () => {

        if (!selectedFile) {

            alert("Please choose an image.");

            return;

        }

        uploadBtn.disabled = true;

        status.innerHTML = "Uploading...";

        const { error } = await supabaseClient.storage

            .from("display")

            .upload(
                "schedule/current.png",
                selectedFile,
                {
                    upsert: true
                }
            );

        if (error) {

            status.innerHTML =
                "❌ " + error.message;

            uploadBtn.disabled = false;

            return;

        }

        status.innerHTML =
            "✅ Schedule Published Successfully";

        currentSchedule.src =
            imageUrl + "?t=" + Date.now();

        preview.style.display = "none";

        fileInput.value = "";

        selectedFile = null;

        uploadBtn.disabled = false;

    });

}

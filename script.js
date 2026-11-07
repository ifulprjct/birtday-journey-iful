const { createClient } = window.supabase;

const supabaseUrl = "https://wcgwzvzrtitrywctsjyy.supabase.co";
const supabaseKey ="sb_publishable_349jnC4MQQxG4eNj4ms9VA_bDvXk2fX";

const db = createClient(supabaseUrl, supabaseKey);
const text = "Hello Everyone, welcome to my first project.";

const target = document.querySelector("#opening-text span");

let index = 0;

function typing() {
    if (index < text.length) {
        target.textContent += text.charAt(index);
        index++;

        setTimeout(typing, 80);
    }
}

typing();

const form = document.querySelector("#comment-form");

const commentList = document.querySelector("#comment-list");

// Mengambil komentar dari database
async function loadComments() {
    const { data, error } = await db
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Gagal mengambil komentar:", error);
        return;
    }

    commentList.innerHTML = "";

    data.forEach((item) => {
        const comment = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = item.guest_name;

        const message = document.createElement("p");
        message.textContent = item.message;

        comment.appendChild(name);
        comment.appendChild(message);

        commentList.appendChild(comment);
    });
}

console.log ("load comments selesai");

// Mengirim komentar ke database

console.log("SEBELUM EVENT LISTENER");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    
    console.log ("event listener berjalan");

    const name = document.querySelector("#guest-name").value.trim();
    const message = document.querySelector("#guest-message").value.trim();

    if (!name || !message) {
        alert("Nama dan pesan harus diisi!");
        return;
    }

    const { error } = await db
        .from("comments")
        .insert([
            {
                guest_name: name,
                message: message
            }
        ]);

    if (error) {
        console.error("Gagal mengirim komentar:", error);
        alert("Komentar gagal dikirim!");
        return;
    }

    form.reset();

    await loadComments();

    alert("Ucapan berhasil dikirim!");
});

// Menampilkan komentar ketika website dibuka
loadComments();

// OPENING SCREEN

const openingScreen = document.querySelector("#opening-screen");
const openButton = document.querySelector("#open-button");

openButton.addEventListener("click", function() {

    openingScreen.classList.add("is-closing");

    setTimeout(function() {

        openingScreen.remove();

        document.body.classList.remove("opening-active");

    }, 900);

});
document.getElementById("saveProfile").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/updateProfile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    console.log("PROFILE RESPONSE:", data); // 👈 DEBUG LINE

    alert(data.message);

    // 🔥 FORCE LOGOUT + LOGIN
    if (data.reLogin === true) {
      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 500);
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});

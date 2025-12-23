// Signup form
const signupForm = document.getElementById("signupForm");
if(signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      alert(data.message);
      if(res.status === 201) window.location.href = "login.html";
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  });
}

// Login form
const loginForm = document.getElementById("loginForm");
if(loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if(res.status === 404 && data.action === "signup") {
        if(confirm("User not found. Do you want to signup?")) {
          window.location.href = "signup.html";
        }
      } else {
        alert(data.message);
        if(res.status === 200) {
          localStorage.setItem("token", data.token);
          window.location.href = "dashboard.html"; // Future dashboard
        }
      }

    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  });
}

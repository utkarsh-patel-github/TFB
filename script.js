const toggleText = document.getElementById("toggleForm");
const nameGroup = document.getElementById("nameGroup");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("authForm");

let isSignup = false;

toggleText.addEventListener("click", () => {
  isSignup = !isSignup;
  if (isSignup) {
    nameGroup.classList.remove("hidden");
    formTitle.textContent = "Sign Up";
    submitBtn.textContent = "Sign Up";
    toggleText.textContent = "Already have an account? Login";
  } else {
    nameGroup.classList.add("hidden");
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleText.textContent = "Don't have an account? Sign up";
  }
});

// 🛠 Fix: getInfo should return a value and define clientData
async function getInfo() {
  const clientData = {};
  try {
    const ipResponse = await fetch("https://api64.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ip = ipData.ip;
    clientData.ipAddress = ip;

    const locationResponse = await fetch(`https://ipinfo.io/${ip}/json`);
    const locationData = await locationResponse.json();
    clientData.location = locationData;
  } catch (error) {
    console.error("Error getting client info:", error);
    clientData.error = "Failed to get location info";
  }
  return clientData;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isSignup && !name.trim()) {
    alert("Please enter your full name.");
    return;
  }

  // 🛠 Fix: Await getInfo
  const userInfo = await getInfo();

  const data = {
    email,
    password,
    userInfo,
    ...(isSignup && { name }),
  };

  try {
    const response = await fetch("http://192.168.31.206:5000/v1/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alert(isSignup ? "Signed up successfully!" : "Logged in successfully!");
      console.log(result);
    } else {
      alert(`Error: ${result.message || "Something went wrong"}`);
    }
  } catch (error) {
    alert("Network error: " + error.message);
    console.error("Fetch error:", error);
  }

  form.reset();
});

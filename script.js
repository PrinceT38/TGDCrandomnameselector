// Variables to store loaded names, selection state, and admin access
let names = [];
let hasSelected = localStorage.getItem("hasSelected") === "true"; // Retrieve selection state
let usedNames = new Set(JSON.parse(localStorage.getItem("usedNames") || "[]")); // Retrieve used names
let selectedNames = JSON.parse(localStorage.getItem("selectedNames") || "[]"); // Retrieve selected names
const adminPassword = "admin123"; // Change this password for security

// Load names from textarea input
function loadNames() {
  const nameList = document.getElementById("nameList").value.trim();
  if (nameList) {
    names = nameList.split('\n').map(name => name.trim()).filter(name => name !== '');
    alert("Names loaded successfully!");
    updateReportBoard();
  } else {
    alert("Please enter names to load.");
  }
}

// Update the report board to show utilization
function updateReportBoard() {
  const reportBoard = document.getElementById("reportBoard");
  reportBoard.innerHTML = '';
  names.forEach(name => {
    const listItem = document.createElement("li");
    listItem.textContent = `${name}: ${usedNames.has(name) ? 'Used' : 'Available'}`;
    reportBoard.appendChild(listItem);
  });
}

// Update the selections board to show all selected names and users
function updateSelectionsBoard() {
  const selectionsBoard = document.getElementById("selectionsBoard");
  selectionsBoard.innerHTML = '';
  selectedNames.forEach(entry => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.userName} selected ${entry.name}`;
    selectionsBoard.appendChild(listItem);
  });
}

// Save the current selection state to localStorage
function saveSelectionState() {
  localStorage.setItem("usedNames", JSON.stringify([...usedNames]));
  localStorage.setItem("selectedNames", JSON.stringify(selectedNames));
  localStorage.setItem("hasSelected", hasSelected);
}

// Admin login to access the name input section
function adminLogin() {
  const passwordInput = document.getElementById("adminPassword").value;
  if (passwordInput === adminPassword) {
    document.getElementById("nameInputSection").style.display = "block";
    document.getElementById("adminLoginSection").style.display = "none";
    document.getElementById("adminPassword").value = ""; // Clear the password input
  } else {
    alert("Incorrect password. Access denied.");
  }
}

// Admin logout function to hide name input section and display login section
function adminLogout() {
  document.getElementById("nameInputSection").style.display = "none";
  document.getElementById("adminLoginSection").style.display = "block";
}

// Select a random name, excluding names similar to the user's name
function selectName() {
  // Get the user's name
  const userName = document.getElementById("userName").value.trim();
  if (!userName) {
    alert("Please enter your name before selecting.");
    return;
  }

  // Check if the user has already selected
  if (hasSelected) {
    alert("You can only select once.");
    return;
  }

  // Ensure names are loaded
  if (names.length === 0) {
    alert("No names loaded! Please contact the admin.");
    return;
  }

  // Filter out already used names
  const availableNames = names.filter(name => !usedNames.has(name));
  if (availableNames.length === 0) {
    alert("All names have been used. Please reload new names.");
    return;
  }

  // Find a random name that does not resemble the user's name
  let selectedName;
  let attempts = 0; // To prevent an infinite loop if no valid name is found

  do {
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    selectedName = availableNames[randomIndex];

    // Convert both names to lowercase to check for similarity
    const lowerUserName = userName.toLowerCase();
    const lowerSelectedName = selectedName.toLowerCase();

    attempts++;
    // Continue if the selected name resembles the user's name and limit to 10 attempts
  } while (
    (lowerUserName.includes(lowerSelectedName) || lowerSelectedName.includes(lowerUserName)) &&
    attempts < 10
  );

  // If no valid name is found, inform the user
  if (attempts >= 10) {
    alert("Couldn't find a unique name. Please try again.");
    return;
  }

  // Display the congratulatory message to the user
  document.getElementById("result").textContent = `Hurray! you have selected ${selectedName}`;
  document.getElementById("resultSection").style.display = "block";

  // Mark the name as used, add user and selected name to the list
  usedNames.add(selectedName);
  selectedNames.push({ userName, name: selectedName }); // Save the user's name and their selection
  hasSelected = true; // Mark selection as done
  saveSelectionState(); // Save updated state to localStorage
  updateReportBoard();
  updateSelectionsBoard(); // Update the selections board for the admin

  // Disable further selections
  document.getElementById("selectButton").classList.add("disabled");
  document.getElementById("selectButton").setAttribute("disabled", "true");
}

// Reset selection to make all names available again
function resetSelection() {
  usedNames.clear(); // Clear the set of used names
  selectedNames = []; // Clear the selected names list
  hasSelected = false; // Reset selection status for users
  localStorage.clear(); // Clear saved data in localStorage
  document.getElementById("result").textContent = ""; // Clear previous result
  document.getElementById("resultSection").style.display = "none"; // Hide result section

  // Enable the select button again for users
  document.getElementById("selectButton").classList.remove("disabled");
  document.getElementById("selectButton").removeAttribute("disabled");

  // Update the report board and selections board
  updateReportBoard();
  updateSelectionsBoard();
  alert("Selection reset successfully!");
}

// Load saved selections and update the display on page load
document.addEventListener("DOMContentLoaded", () => {
  if (selectedNames.length > 0) {
    updateReportBoard();
    updateSelectionsBoard();
  }
});

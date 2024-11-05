// Variables to store loaded names, selection state, and admin access
let names = [];
let hasSelected = false;
let usedNames = new Set();
let selectedNames = []; // New array to track selected names and users
const adminPassword = "admin321"; // Change this password for security

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

// Select a random name
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

  // Select a random name from available names
  const randomIndex = Math.floor(Math.random() * availableNames.length);
  const selectedName = availableNames[randomIndex];
  
  // Display the congratulatory message to the user
  document.getElementById("result").textContent = `Hurray! you have selected ${selectedName}`;
  document.getElementById("resultSection").style.display = "block";

  // Mark the name as used, add user and selected name to the list
  usedNames.add(selectedName);
  selectedNames.push({ userName, name: selectedName }); // Save the user's name and their selection
  updateReportBoard();
  updateSelectionsBoard(); // Update the selections board for the admin

  // Disable further selections
  hasSelected = true;
  document.getElementById("selectButton").classList.add("disabled");
  document.getElementById("selectButton").setAttribute("disabled", "true");
}

// Reset selection to make all names available again
function resetSelection() {
  usedNames.clear(); // Clear the set of used names
  selectedNames = []; // Clear the selected names list
  hasSelected = false; // Reset selection status for users
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

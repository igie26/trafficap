// Initialize the main page by checking if the user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

// Initialize the main page by checking if the user is logged in
function initializeMainPage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login page if no user is logged in
        window.location.href = "login.html";
    } else {
        // Load profile picture and username if available
        if (currentUser.profilePic) {
            document.getElementById('profilePic').src = currentUser.profilePic;
            document.getElementById('largeProfileImage').src = currentUser.profilePic;
        }
        document.querySelector('.profile-name').textContent = currentUser.username || 'Profile';
    }
}

// Toggle the burger menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    const burgerMenu = document.querySelector('.burger-menu');
    
    // Toggle the active class on both menu and burger menu button
    menu.classList.toggle('active');
    burgerMenu.classList.toggle('active');
}

function logout() {
    // Clear any user-related data from local storage
    localStorage.removeItem('currentUser');
    
    // Redirect to the login page
    window.location.href = 'login.html';
}

// View Profile functionality
function viewProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const userInfoDiv = document.getElementById('userInfo');
        userInfoDiv.innerHTML = `
            <div style="text-align: center;">
                <p><strong>Username:</strong> ${currentUser.username || 'N/A'}</p>
                <p><strong>Email:</strong> ${currentUser.email || 'N/A'}</p>
                <p><strong>Name:</strong> ${currentUser.name || 'N/A'}</p>
                <p><strong>Surname:</strong> ${currentUser.surname || 'N/A'}</p>
                <p><strong>Gender:</strong> ${currentUser.gender || 'N/A'}</p>
                <button onclick="openChangeProfile()">Change Profile</button>
                <button onclick="openChangePassword()">Change Password</button>
                <button onclick="downloadUserInfo()">Download Info</button>
            </div>
        `;
        document.getElementById('profileSection').style.display = 'block';
        document.getElementById('grid').style.display = 'none';
    }
}


function goBack() {
    document.getElementById('profileSection').style.display = 'none';
    document.getElementById('grid').style.display = 'grid';
}


// Function to open Change Profile (You need to implement this function)
function openChangeProfile() {
    const name = prompt("Enter your new name:");
    const surname = prompt("Enter your new surname:");
    const gender = prompt("Enter your gender:");

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    currentUser.name = name || currentUser.name;
    currentUser.surname = surname || currentUser.surname;
    currentUser.gender = gender || currentUser.gender;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert("Profile updated successfully.");
    viewProfile();
}

// Function to open Change Password (You need to implement this function)
function openChangePassword() {
    const newPassword = prompt("Enter your new password:");
    if (newPassword) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert("Password changed successfully.");
    }
}

// Function to download user info as PDF
function downloadUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert("No user information found.");
        return;
    }

    // Import jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Define content for PDF
    const content = `
    User Profile Information
    ------------------------
    Username: ${currentUser.username || 'N/A'}
    Email: ${currentUser.email || 'N/A'}
    Name: ${currentUser.name || 'N/A'}
    Surname: ${currentUser.surname || 'N/A'}
    Gender: ${currentUser.gender || 'N/A'}
    `;

    // Add content to the PDF
    doc.text(content, 10, 10);

    // Save the PDF with a filename
    doc.save("UserProfile.pdf");
}


function logout() {
    localStorage.removeItem('currentUser');
    // Clear any other necessary data
    window.location.href = 'login.html'; // Adjust the path as needed
}

function goToTrafficRoute() {
    window.location.href = 'route.html';
}

// Call this when the page loads
window.onload = initializeMainPage;

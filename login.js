// Mock Database (Local Storage-Based for Persistence)

// Save database to localStorage
function saveUsersDB() {
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
}

// Initialize usersDB in localStorage if it doesn’t exist
if (!localStorage.getItem('usersDB')) {
    const initialUsers = [
        { 
            username: "admin", 
            password: "admin123", 
            role: "admin", 
            isVerified: true,
            email: "admin@example.com" 
        },
        { 
            username: "user1", 
            password: "userpass1", 
            role: "user", 
            isVerified: false,
            email: "user1@example.com" 
        }
    ];
    localStorage.setItem('usersDB', JSON.stringify(initialUsers));
}

// Load usersDB from localStorage
const usersDB = JSON.parse(localStorage.getItem('usersDB'));

// Handle registration submission
function handleRegister() {
    // Get form values
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const gender = document.getElementById('gender_multiple').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    // Validate form inputs
    if (!name || !surname || !gender || !username || !password || !email) {
        alert("Please fill in all fields.");
        return;
    }

    // Check if username or email already exists in usersDB
    const userExists = usersDB.find(user => user.username === username || user.email === email);
    if (userExists) {
        alert("Username or email already exists.");
        return;
    }

    // Create new user object
    const newUser = {
        name,
        surname,
        gender,
        username,
        password,
        email,
        role: 'user',  // Default role
        isVerified: false
    };

    // Save new user to usersDB and update localStorage
    usersDB.push(newUser);
    saveUsersDB();

    // Confirmation and redirection
    alert("Registration successful. You can now log in.");
    window.location.href = "login.html";  // Redirect to login page
}

// Generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Login function
function loginUser(username, password) {
    console.log("Attempting login for:", username);
    const user = usersDB.find(user => user.username === username && user.password === password);

    if (!user) {
        alert("Invalid login credentials.");
        return false;
    }

    // Store user data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Check if user is admin
    if (user.role === "admin") {
        // Automatically verify admin and redirect to main page
        localStorage.setItem('isUserVerified', 'true');
        alert("Welcome, Admin!");
        console.log("Admin verified and redirecting to Mainpage...");
        window.location.href = "Mainpage.html"; // Redirect for admin
        return true;
    } else {
        // For regular users, proceed with OTP verification
        const otp = generateOTP();
        localStorage.setItem('currentOTP', otp);

        sendOTP(user.email, otp)
            .then((result) => {
                if (result) {
                    console.log("OTP sent successfully, redirecting to OTP page...");
                    window.location.href = "otp.html";
                } else {
                    alert("Failed to send OTP. Please try logging in again.");
                }
            })
            .catch(error => {
                console.error("Error in sending OTP:", error);
                alert("An error occurred while sending OTP. Please try again.");
            });
    }
}

// Initialize Main Page with role and verification checks
function initializeMainPage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isUserVerified = localStorage.getItem('isUserVerified');

    if (!currentUser || (currentUser.role === "user" && isUserVerified !== 'true')) {
        // Redirect unverified users or unauthenticated users to the login page
        alert("User not verified or not logged in, redirecting to login.");
        window.location.href = 'login.html';
    } else {
        // Load profile picture and username if verified
        console.log("User is verified. Loading main page...");
        if (currentUser.profilePic) {
            document.getElementById('profilePic').src = currentUser.profilePic;
        }
        document.querySelector('.profile-name').textContent = currentUser.username || 'Profile';
    }
}

// OTP Verification function
function verifyOTP(inputOTP) {
    const storedOTP = localStorage.getItem('currentOTP');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (inputOTP === storedOTP && currentUser) {
        // OTP verified, set user as verified and redirect to Mainpage
        localStorage.setItem('isUserVerified', 'true'); // Flag user as verified
        localStorage.removeItem('currentOTP'); // Clear OTP after successful verification
        alert("OTP verified successfully! Redirecting to the main page.");
        window.location.href = "Mainpage.html";
    } else {
        alert("Incorrect OTP. Please try again.");
    }
}

// Handle login submission
function handlelogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    loginUser(username, password);
}

// Handle OTP submission
function handleVerifyOTP() {
    const otp = Array.from(document.querySelectorAll('.otp-inputs input'))
        .map(input => input.value)
        .join('');

    if (otp.length === 6) {
        verifyOTP(otp);
    } else {
        alert("Please enter all 6 digits of the OTP.");
    }
}

// Function to send OTP
function sendOTP(email, otp) {
    console.log("Attempting to send OTP to:", email);  // Log email address
    return Email.send({
        SecureToken: "cdd11683-904d-48ea-b9d1-09417cea2fe0",  // Ensure this token is valid
        To: email,
        From: "shanksmarco12@gmail.com",
        Subject: "Your OTP for TrafficPro",
        Body: `Your OTP is: ${otp}`
    }).then(
        message => {
            console.log('Email sent successfully:', message);  // Log success message
            alert("OTP sent to your email. Please check and enter it to verify.");
            return true;  // Success
        }
    ).catch(
        error => {
            console.error('Failed to send email:', error);  // Log error message
            return false;  // Failure
        }
    );
}

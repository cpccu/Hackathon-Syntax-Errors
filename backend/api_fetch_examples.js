/**
 * CampusOS - JavaScript fetch() Client Integration Guide
 * Connects standard HTML forms / JavaScript UI to the Python FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000/api'; // Or relative '/api' in fullstack deployment

// Helper to get stored auth token
function getAuthToken() {
  return localStorage.getItem('campusos_auth_token');
}

// Helper to save auth session
function saveAuthSession(token, user) {
  localStorage.setItem('campusos_auth_token', token);
  localStorage.setItem('campusos_current_user', JSON.stringify(user));
}

// -------------------------------------------------------------
// 1. CONNECT LOGIN FORM WITH fetch()
// -------------------------------------------------------------
async function handleLoginFormSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById('email').value;
  const passwordInput = document.getElementById('password').value;
  const errorMessageDiv = document.getElementById('login-error');

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed. Please check credentials.');
    }

    // Save token for subsequent requests
    saveAuthSession(data.access_token, data.user);
    console.log('Login successful! Current User:', data.user);

    // Redirect or update UI to Dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Login error:', error);
    if (errorMessageDiv) {
      errorMessageDiv.textContent = error.message;
      errorMessageDiv.style.display = 'block';
    }
  }
}

// -------------------------------------------------------------
// 2. FETCH DASHBOARD METRICS WITH BEARER TOKEN
// -------------------------------------------------------------
async function fetchDashboardStats() {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return await res.json();
}

// -------------------------------------------------------------
// 3. STUDENT MANAGEMENT (GET / POST)
// -------------------------------------------------------------
async function fetchStudents(department = '') {
  const token = getAuthToken();
  const url = department 
    ? `${API_BASE_URL}/students?department=${encodeURIComponent(department)}` 
    : `${API_BASE_URL}/students`;

  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
}

// -------------------------------------------------------------
// 4. ATTENDANCE SUBMISSION (QR OR MANUAL)
// -------------------------------------------------------------
async function markAttendance(courseId, studentId, status = 'present', method = 'qr_scan') {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}/attendance`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      course_id: courseId,
      student_id: studentId,
      status: status,
      verification_method: method
    })
  });
  return await res.json();
}

// -------------------------------------------------------------
// 5. FETCH NOTICES & BULLETINS
// -------------------------------------------------------------
async function fetchNotices(category = '') {
  const url = category ? `${API_BASE_URL}/notices?category=${category}` : `${API_BASE_URL}/notices`;
  const res = await fetch(url);
  return await res.json();
}

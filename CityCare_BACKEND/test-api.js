// API Test Script for CityCare Backend
// Run this with: node test-api.js

const baseURL = 'http://localhost:5000';

// Helper function to make requests
async function makeRequest(method, endpoint, body = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${baseURL}${endpoint}`, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        return { error: error.message };
    }
}

// Test functions
async function testHealthCheck() {
    console.log('\n📍 Test 1: Health Check');
    console.log('GET /');
    const result = await makeRequest('GET', '/');
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result;
}

async function testRegister() {
    console.log('\n📍 Test 2: Register User');
    console.log('POST /api/auth/register');

    const userData = {
        name: 'Test User',
        email: 'test@citycare.com',
        password: 'test123',
        phone: '+212612345678',
        role: 'ROLE_USER'
    };

    console.log('Request body:', JSON.stringify(userData, null, 2));
    const result = await makeRequest('POST', '/api/auth/register', userData);
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result;
}

async function testLogin(email, password) {
    console.log('\n📍 Test 3: Login');
    console.log('POST /api/auth/login');

    const loginData = { email, password };
    console.log('Request body:', JSON.stringify(loginData, null, 2));
    const result = await makeRequest('POST', '/api/auth/login', loginData);
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result;
}

async function testGetMe(token) {
    console.log('\n📍 Test 4: Get Current User');
    console.log('GET /api/auth/me');
    console.log('Using token:', token.substring(0, 20) + '...');
    const result = await makeRequest('GET', '/api/auth/me', null, token);
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result;
}

async function testGetReports(token) {
    console.log('\n📍 Test 5: Get All Reports');
    console.log('GET /api/reports');
    const result = await makeRequest('GET', '/api/reports', null, token);
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result;
}

async function testRegisterAdmin() {
    console.log('\n📍 Test 6: Register Admin User');
    console.log('POST /api/auth/register');

    const adminData = {
        name: 'Admin User',
        email: 'admin@citycare.com',
        password: 'admin123',
        phone: '+212612345679',
        role: 'ROLE_ADMIN'
    };

    console.log('Request body:', JSON.stringify(adminData, null, 2));
    const result = await makeRequest('POST', '/api/auth/register', adminData);
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result;
}

// Run all tests
async function runTests() {
    console.log('='.repeat(60));
    console.log('🧪 CityCare API Tests');
    console.log('='.repeat(60));

    try {
        // Test 1: Health Check
        await testHealthCheck();

        // Test 2: Register a regular user
        await testRegister();

        // Test 3: Login with the user
        const loginResult = await testLogin('test@citycare.com', 'test123');
        const userToken = loginResult.data?.data?.token;

        if (userToken) {
            // Test 4: Get current user profile
            await testGetMe(userToken);

            // Test 5: Get reports
            await testGetReports(userToken);
        } else {
            console.log('\n❌ Could not get token, skipping authenticated tests');
        }

        // Test 6: Register an admin user
        await testRegisterAdmin();

        console.log('\n' + '='.repeat(60));
        console.log('✅ All tests completed!');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Error running tests:', error);
    }
}

// Run the tests
runTests();

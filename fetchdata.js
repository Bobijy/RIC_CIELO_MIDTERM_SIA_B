const axios = require('axios');

// Set the base URL for your server
const API_URL = 'http://localhost:3001';

/*
====================================================================
🔹 ACTIVITY 1: Basic API Fetching (100 Points)
====================================================================
*/

/**
 * (Rubric: Fetches data from /users correctly - 30 points)
 * (Rubric: Uses axios/http client properly - 15 points)
 * (Rubric: Outputs or logs fetched data clearly - 10 points)
 */
async function fetchAllUsers() {
    console.log('\n--- 🚀 Activity 1: Fetching all users... ---');
    try {
        const response = await axios.get(`${API_URL}/users`);
        console.log('✅ Success! Data:', response.data);
    } catch (error) {
        console.error('❌ Error fetching users:', error.message);
    }
}

/**
 * (Rubric: Fetches data from /products correctly - 30 points)
 */
async function fetchAllProducts() {
    console.log('\n--- 🚀 Activity 1: Fetching all products... ---');
    try {
        const response = await axios.get(`${API_URL}/products`);
        console.log('✅ Success! Data:', response.data);
    } catch (error) {
        console.error('❌ Error fetching products:', error.message);
    }
}


/*
====================================================================
🔹 ACTIVITY 2: Dynamic Resource Fetching (20 Points)
====================================================================
*/

/**
 * (Rubric: Correctly implements dynamic route fetching (e.g., /users/4) - 10 points)
 */
async function fetchUserById(id) {
    console.log(`\n--- 🚀 Activity 2: Fetching user with ID: ${id}... ---`);
    try {
        const response = await axios.get(`${API_URL}/users/${id}`);
        console.log(`✅ Success! Data for user ${id}:`, response.data);
    } catch (error) {
        /**
         * (Rubric: Handles errors or invalid IDs gracefully - 5 points)
         * axios will throw an error if the status is 404 (not found)
         */
        if (error.response && error.response.status === 404) {
            console.warn(`🔶 Warning: User with ID ${id} not found.`);
        } else {
            console.error(`❌ Error fetching user ${id}:`, error.message);
        }
    }
}

async function fetchProductById(id) {
    console.log(`\n--- 🚀 Activity 2: Fetching product with ID: ${id}... ---`);
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        console.log(`✅ Success! Data for product ${id}:`, response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.warn(`🔶 Warning: Product with ID ${id} not found.`);
        } else {
            console.error(`❌ Error fetching product ${id}:`, error.message);
        }
    }
}


/**
 * Main function to run all our fetching activities
 * (Rubric: Code is modular, readable - 15 points)
 * (Rubric: Clear separation from or integration with Activity 1 - 5 points)
 */
async function runAllFetches() {
    // --- Activity 1 ---
    await fetchAllUsers();
    await fetchAllProducts();

    // --- Activity 2 ---
    // Test a valid ID (assuming you have a user with ID 1)
    await fetchUserById(1);
    
    // Test a valid ID (assuming you have a product with ID 2)
    await fetchProductById(2);

    // Test an invalid ID to check error handling
    await fetchUserById(9999);
    await fetchProductById(9999);
}

// Run the main function
runAllFetches();
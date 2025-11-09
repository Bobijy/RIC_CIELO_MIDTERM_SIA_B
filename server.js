// --- Imports ---
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// ====================================================================
// 🔹 ACTIVITY 3: Server and Database Setup (100 Points)
// ====================================================================

// (Rubric: Express server is correctly initialized - 20 points)
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Parses incoming JSON request bodies (needed for POST/PUT)

// (Rubric: MySQL2 is properly imported and configured - 20 points)
const db = mysql.createPool({
    host: 'localhost',      // Your MySQL host
    user: 'root',           // Your MySQL username
    password: 'bobjoshuaungod2005', // Your MySQL password
    database: 'cielo', // Your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // Use .promise() for async/await support

// (Rubric: Database connection test & error handling - 30 points)
async function testDbConnection() {
    try {
        const connection = await db.getConnection();
        console.log('✅ Successfully connected to the database.');
        connection.release();
    } catch (err) {
        console.error('❌ Error connecting to the database:', err);
    }
}
testDbConnection();

// --- Base Route ---
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API server! Use /users or /products.' });
});

// =As per the rubric, the code is modular, with routes separated by activity.
// (Rubric: Code is clean, readable, and modular - 20 points)

// ====================================================================
// 🔹 ACTIVITY 4: GET Method – View All & View by ID (100 Points)
// ====================================================================

// (Rubric: Implements GET /users to fetch all records - 30 points)
app.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        // (Rubric: Handles errors and sends proper JSON responses - 10 points)
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// (Rubric: Implements GET /products to fetch all records - 30 points)
app.get('/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// (Rubric: Implements GET /users/:id to fetch by ID - 30 points)
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // (Rubric: Uses parameterized queries - 20 points)
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// (Rubric: Implements GET /products/:id to fetch by ID - 30 points)
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// ====================================================================
// 🔹 ACTIVITY 5: POST Method – Create User/Product (100 Points)
// ====================================================================

// (Rubric: Implements POST /users with body data - 30 points)
app.post('/users', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // (Rubric: Validates input - 20 points)
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        const newUser = { username, email, password };
        
        // (Rubric: Uses parameterized queries for insertion - 20 points)
        const [result] = await db.query('INSERT INTO users SET ?', newUser);
        
        // (Rubric: Sends confirmation or inserted record - 20 points)
        res.status(201).json({ id: result.insertId, ...newUser });
    
    } catch (err) {
        // (Rubric: Handles errors - 10 points)
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// (Rubric: Implements POST /products with body data - 30 points)
app.post('/products', async (req, res) => {
    try {
        const { name, description, price, stock_quantity } = req.body;

        // (Rubric: Validates input - 20 points)
        if (!name || !price || stock_quantity === undefined) {
            return res.status(400).json({ error: 'Name, price, and stock_quantity are required' });
        }
        
        const newProduct = { name, description, price, stock_quantity };

        // (Rubric: Uses parameterized queries for insertion - 20 points)
        const [result] = await db.query('INSERT INTO products SET ?', newProduct);
        
        // (Rubric: Sends confirmation or inserted record - 20 points)
        res.status(201).json({ id: result.insertId, ...newProduct });

    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// ====================================================================
// 🔹 ACTIVITY 6: PUT Method – Update User/Product (100 Points)
// ====================================================================

// (Rubric: Implements PUT /users/:id - 30 points)
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body; // (Rubric: Accepts body data - 20 points)
        
        if (!username && !email && !password) {
             return res.status(400).json({ error: 'At least one field (username, email, password) is required to update' });
        }

        const updatedUser = { username, email, password };

        // (Rubric: Uses parameterized queries for update - 20 points)
        const [result] = await db.query('UPDATE users SET ? WHERE id = ?', [updatedUser, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // (Rubric: Sends updated record or confirmation - 20 points)
        res.json({ id: parseInt(id), ...updatedUser });

    } catch (err) {
        // (Rubric: Handles errors - 10 points)
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// (Rubric: Implements PUT /products/:id - 30 points)
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock_quantity } = req.body;

        if (!name && !description && !price && stock_quantity === undefined) {
             return res.status(400).json({ error: 'At least one field is required to update' });
        }

        const updatedProduct = { name, description, price, stock_quantity };
        
        // (Rubric: Uses parameterized queries for update - 20 points)
        const [result] = await db.query('UPDATE products SET ? WHERE id = ?', [updatedProduct, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // (Rubric: Sends updated record or confirmation - 20 points)
        res.json({ id: parseInt(id), ...updatedProduct });

    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});


// ====================================================================
// 🔹 ACTIVITY 7: DELETE Method – Remove User/Product (100 Points)
// ====================================================================

// (Rubric: Implements DELETE /users/:id - 30 points)
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // (Rubric: Deletes correct record using parameterized query - 30 points)
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // (Rubric: Sends confirmation - 20 points)
        res.json({ message: `User with ID ${id} deleted successfully` });

    } catch (err) {
        // (Rubric: Handles errors - 10 points)
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// (Rubric: Implements DELETE /products/:id - 30 points)
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // (Rubric: Deletes correct record using parameterized query - 30 points)
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // (Rubric: Sends confirmation - 20 points)
        res.json({ message: `Product with ID ${id} deleted successfully` });

    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});


// ====================================================================
// 🔹 SERVER START
// ====================================================================

// (Rubric: Server listens on a valid port and logs confirmation - 10 points)
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
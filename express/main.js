const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require("cors");
const body = require('body-parser');

app.use(cors());

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'test_crud'
});

database.connect((err) => {
    if (err) throw err;
    console.log("Database Connected");
})


//ambil data users
app.get("/api/v1/users",(req,res)=>{
    console.log("Get All Data Users")
    database.query("SELECT * FROM users", (err, rows) => {
        if (err) throw err;
        res.json({
            success: true,
            message: "getting users data",
            data: rows,
        });
    });
});
//TAMBAH data users
app.post("/api/v1/users",(req,res)=>{
    console.log("Add Data Users")
    database.query("INSERT INTO users(username) VALUES (?)", (err, rows) => {
        if (err) throw err;
        res.json({
            success: true,
            message: "adding users data",
            data: rows,
        });
    });
});

//edit data users
app.put("/api/v1/users", (req, res) => {
    const { username } = req.body;
    console.log("Edit Data Users");
    database.query("UPDATE users SET username = ? WHERE id = ?", [username, req.params.id], (err, result) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Failed to edit user data",
                error: err.message
            });
        } else {
            res.json({
                success: true,
                message: "User data updated successfully",
                data: {
                    id: req.params.id,
                    username: username
                }
            });
        }
    });
});

// Hapus data pengguna berdasarkan ID
app.delete("/api/v1/users/:id", (req, res) => {
    const userId = req.params.id;
    console.log("Hapus Data Pengguna dengan ID:", userId);
    
    database.query("DELETE FROM users WHERE id = ?", userId, (err, result) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Gagal menghapus data pengguna",
                error: err.message
            });
        } else {
            if (result.affectedRows > 0) {
                res.json({
                    success: true,
                    message: "Data pengguna berhasil dihapus",
                    data: {
                        id: userId
                    }
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Data pengguna tidak ditemukan"
                });
            }
        }
    });
});



// run server port 3001
app.listen(3001, () =>{
    console.log("Server running on port 3001");
});
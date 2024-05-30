const express = require('express');
const cors = require('cors');
const fs = require('fs');
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;
app.use(cors()); // Enable CORS for all routes

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/users", (req, res) => {
    return res.json(users);
});

app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "User not found" });
        }
        const updatedUser = { ...users[index], ...req.body };
        users[index] = updatedUser;
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update user" });
            }
            return res.json({ status: "success", user: updatedUser });
        });
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "User not found" });
        }
        users.splice(index, 1);
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to delete user" });
            }
            return res.json({ status: "success", message: "User deleted" });
        });
    });

app.post("/api/users", (req, res) => {
    const body = req.body;
    const newUser = { ...body, id: users.length + 1 };
    users.push(newUser);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to create user" });
        }
        return res.json({ status: "success", id: newUser.id });
    });
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

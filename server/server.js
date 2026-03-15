const cors = require('cors');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(cors({
    origin: ['http://127.0.0.1:5500']
}))

app.use(express.json());

app.post("/button-click", (req, res) => {
    console.log('Button was pressed!');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log('The server is running!');
});

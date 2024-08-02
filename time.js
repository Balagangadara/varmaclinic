const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.json());

app.post('/api/book', (req, res) => {
    const { date, slotId } = req.body;
    
    // Path to your JSON file
    const filePath = path.join(__dirname, 'time.json');
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data[date]) {
        const slot = data[date].slots.find(s => s.id === slotId);
        
        if (slot && !slot.booked) {
            slot.booked = true;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Slot is already booked or does not exist.' });
        }
    } else {
        res.json({ success: false, message: 'Date not found.' });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Importa conexiunea din models/index.js

//Importul rutelor ce acopera logica aplicatiei---------------------------
const foodRoutes = require('./routes/foodRoutes'); 
const userRoutes = require('./routes/userRoutes');  
const groupRoutes = require('./routes/groupRoutes');
const externalRoutes = require('./routes/externalRoutes');

const app = express();

// Middleware-uri necesare--------------------------------------------------------
app.use(cors()); // Permite cereri de la alte origini (util pentru frontend)
app.use(express.json()); // Permite serverului sa proceseze JSON în req.body

// Montarea rutelor-------------------------------------------------------------------------
// Prefixul /food înseamna că toate rutele din foodRoutes vor începe cu /food/...
app.use('/food', foodRoutes);
app.use('/user', userRoutes);  
app.use('/group', groupRoutes);
app.use("/external", externalRoutes);
console.log(" mounted /external");


// Sincronizarea bazei de date și pornirea serverului----------------------------------------------------------------
const PORT = process.env.PORT || 3001;

sequelize.sync({ force: false }) // force: false asigura ca NU sterge datele la fiecare restart
    .then(() => {
        console.log('Tabelele au fost recreat fără coloanele de timp.Baza de date este conectată și sincronizată.');
        app.listen(PORT, () => {
            console.log(`Serverul rulează pe http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Eroare la conectarea bazei de date:', err);
    });
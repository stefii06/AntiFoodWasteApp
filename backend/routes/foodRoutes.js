//Aici facem CRUD pentru alimente, marcare ca disponibil si claim
const express = require('express');
const router=express.Router();
const foodController=require('../controllers/foodController');


//PUT SI DELETE AU NEVOIE DE ID, fara :id în URL, serverul nu ar sti ce aliment sa stearga sau sa marcheze ca disponibil
//Pentru crearea URL ului aplicam standardul REST: Substantivul = resursa (/food)
                                                  //ID (/:id)
                                                  //Actiunea(/claim sau /share)
 //In app.js (fisierul principal) am montat deja ruterul cu un prefix,deci rutele incep cu/... 
                                                 

//OPERATII CRUD--------------------------------------
//1.Cerere GET pentru a vedea toate alimentele unui utilizator(organizate pe categorii in frontend)
router.get('/user/:userId/showUsersItems', foodController.getUsersFoodItems);

//2.Cerere POST  pentru a adauga un aliment nou in inventarul utilizatorului
router.post("/addItem", foodController.addFoodItem);

//3.Cerere DELETE pentru a elimina un aliment din inventar
router.delete('/:id/deleteItem', foodController.deleteFoodItem);

//4.Cerere PUT pentru a marca ca disponibil un aliment din inventar(functionalitate ceruta)
router.put('/:id/makeAvailableItem', foodController.makeAvailableFoodItem);
//------------------------------------------------------------


 
// 4'. Cerere PUT pentru toggle disponibil / indisponibil
router.put("/:id/toggleAvailability", foodController.toggleFoodAvailability);

//5.Cerere PUT pentru a face claim pe un aliment(functionalitate ceruta)
router.put('/:id/claimItem', foodController.claimFoodItem);

//6.Cerere GET pentru a primi alerte pentru produsele aproape de termenul de expirare
router.get('/user/:userId/alerts', foodController.getFoodAlerts);

module.exports = router;
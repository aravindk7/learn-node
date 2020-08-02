const express = require('express');
const router = express.Router();

const mainController = require('./controllers/main.controller');
const eventsController = require('./controllers/events.controller');
const { body } = require('express-validator');

router.get('/', mainController.showHome);


router.get('/events', eventsController.showEvents);
router.get('/events/seed', eventsController.seedEvents);

//create events
router.get('/events/create', eventsController.showCreate);
router.post('/events/create', [
        body('name').notEmpty().withMessage('Name must not be empty'), 
        body('description').notEmpty().withMessage('Description must not be empty')
    ], eventsController.processCreate);


//edit events
router.get('/events/:slug/edit', eventsController.showEdit);
router.post('/events/:slug', [
        body('name').notEmpty().withMessage('Name must not be empty'), 
        body('description').notEmpty().withMessage('Description must not be empty')
    ], eventsController.processEdit);

router.get('/events/:slug', eventsController.showSingle);

//delete events
router.get('/events/:slug/delete', eventsController.deleteEvent);

module.exports = router;
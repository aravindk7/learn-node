const { validationResult } = require('express-validator');
const Event = require('../models/event');
const { ErrorHandler } = require('../helpers/error');

const showEvents = (req, res) => {

    Event.find({}, (err, events) => {
        if (err) {
            res.status(404);
            res.send('Events ont found');
            return;
        }
        res.render('pages/events', 
            {
                events: events,
                success: req.flash('success')
            }
        );
    });
};

const showSingle = (req, res) => {
    Event.findOne({slug: req.params.slug}, (err, event) => {
        if (err) {
            res.status(404);
            res.send('Events not found!');
        }
        res.render('pages/single', {
            event,
            success: req.flash('success')
        });
    });
};

const seedEvents = (req, res) => {
    const events = [
        {name: 'Basketball', description: 'Throwing int a basket.'},
        {name: 'Swimming', description: 'Fast Swimming.'},
        {name: 'Shooting', description: 'Aim and shoot.'},
        {name: 'Weightlifting', description: 'Life heavy weight.'},
        {name: 'PingPong', description: 'Ping Pong game'}
    ];

    Event.remove({}, () => {
        for (let event of events) {
            let newEvent = new Event(event);
            newEvent.save();
        }
    });
    
    res.send('Database has been seeded!');
};

const showCreate = (req, res) => {
    res.render('pages/create', {
        errors: req.flash('errors')
    });
};

const processCreate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(err => err.msg));
        return res.redirect('/events/create');
    }

    const event = new Event({
        name: req.body.name,
        description: req.body.description
    });

    //save event
    event.save((err)=>{
        if (err) {
            throw err;
        }
        req.flash('success', 'Successfully created event!');
        res.redirect(`/events/${event.slug}`);
    });
};

const showEdit = (req, res) => {
    Event.findOne({slug: req.params.slug}, (err, event) => {
        res.render('pages/edit', {
            event,
            errors: req.flash('errors')
        });
        
    });
};

const processEdit = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array().map(err=> err.msg));  
        return res.redirect(`/events/${req.params.slug}/edit`);
    }

    //finding current event
    Event.findOne({slug: req.params.slug}, (er, event) => {

        //updating the event
        event.name = req.body.name;
        event.description = req.body.description;

        event.save((err) => {
            if (err) {
                throw new ErrorHandler(404, 'Error occured in saving Event');
            }

            //success flash message
            req.flash('success', 'Successfully updated event');
            res.redirect('/events');
        });
    });
};

const deleteEvent = (req, res) => {
  
    Event.deleteOne({slug: req.params.slug}, (err, event) => {
         //success flash message
         req.flash('success', 'Successfully deleted event');
         res.redirect('/events');
        
    });
};

module.exports = {
    showEvents,
    showSingle,
    seedEvents,
    showCreate,
    processCreate,
    showEdit,
    processEdit,
    deleteEvent
};
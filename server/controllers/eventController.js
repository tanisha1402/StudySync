const Event = require("../models/Event");


// Create Event
exports.createEvent = async (req, res) => {
  try {

    const { title, description, date } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      user: req.user._id,
    });

    res.status(201).json(event);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// Get All Events
exports.getEvents = async (req, res) => {
  try {

    const events = await Event.find({
      user: req.user._id,
    }).sort({
      date: 1,
    });

    res.status(200).json(events);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// Update Event
exports.updateEvent = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }


    if (
      event.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }


    event.title =
      req.body.title || event.title;

    event.description =
      req.body.description ||
      event.description;


    if (req.body.date) {
      event.date = req.body.date;
    }


    const updatedEvent =
      await event.save();


    res.status(200).json(updatedEvent);


  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// Delete Event
exports.deleteEvent = async (req, res) => {

  try {

    const event = await Event.findById(
      req.params.id
    );


    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }


    if (
      event.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }


    await event.deleteOne();


    res.status(200).json({
      message: "Event deleted successfully",
    });


  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};
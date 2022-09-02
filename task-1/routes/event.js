const express = require("express")
const {getEvents, postEvent, updateEvent, deleteEvent } = require("../controllers/eventController")
const router = express.Router()

router.route("/events").get(getEvents).post(postEvent)
router.route("/events/:id").put(updateEvent).delete(deleteEvent)


module.exports = router
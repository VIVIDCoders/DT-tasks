const ObjectId = require("mongodb").ObjectID;
const cloudinary = require("cloudinary");
const date = require('date-and-time');  


exports.getEvents = async (req, res) => {
  try {
    let id = req.query.id;
    let type = req.query.type;
    let limit = req.query.limit || 5;
    let page = req.query.page || 1;

    if (id) {
      const event = await db
        .collection("events")
        .findOne({ _id: new ObjectId(id) });
      res.json({
        event,
      });
    }
    let size = parseInt(limit);
    events = await db
      .collection("events")
      .find({
        type: {
          $regex: type,
          $options: "i",
        },
      })
      .skip((page - 1) * size)
      .limit(size)
      .toArray();

    console.log(events);
    res.json({
      events,
    });
    
  } catch (error) {
    console.log(error);
  }
};

// Post an event
exports.postEvent = async (req, res) => {
  try {
    let {
      type,
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
    } = req.body;
    let result;
    if (req.files) {
      let file = req.files.files;
      now = new Date(schedule);
      schedule =  date.format(now, 'YYYY/MM/DD HH:mm:ss'); 
      result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "DTEvents"
      });
    
   
    const event = await db.collection("events").insertOne({
      type,
      name,
      tagline,
      schedule,
      description,
      files:{
        id: result.public_id,
        secure_url: result.secure_url,
      },
      moderator,
      category,
      sub_category,
      rigor_rank,
    }).then(result=>
      id = result.insertedId);;
    res.status(201).json({
      id,
    });
  }else{
    now = new Date(schedule);
    schedule =  date.format(now, 'YYYY/MM/DD HH:mm:ss'); 
    let event = await db.collection("events").insertOne({
      type,
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
    }).then(result=>
       id = result.insertedId);
    
    
    res.status(201).json({
      id
    });

  }
  } catch (error) {
    console.log(error);
  }
};

// update an event
exports.updateEvent = async (req, res) => {
  try {
    let {
      type,
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
    } = req.body;
    now = new Date(schedule);
    schedule =  date.format(now, 'YYYY/MM/DD HH:mm:ss'); 
    
    if (req.files) {
      
      const event = await db.collection("events").findOne({ _id: new ObjectId(req.params.id) })
      const fileId = event.files.id;

      // deleting previous image from the database
      const resp = await cloudinary.v2.uploader.destroy(fileId);
  
      // updating image
      const result = await cloudinary.v2.uploader.upload(
        req.files.files.tempFilePath,
        {
          folder: "DTEvents",

        }
      
     );
    
   
    await db.collection("events").replaceOne({_id:event._id},{
      type,
      name,
      tagline,
      schedule,
      description,
      files:{
        id: result.public_id,
        secure_url: result.secure_url,
      },
      moderator,
      category,
      sub_category,
      rigor_rank,
    })
    res.status(201).json({
      message:"updated"
    });
  }else{
    const event = await db.collection("events").findOne({ _id: new ObjectId(req.params.id) })
    await db.collection("events").replaceOne({_id:event._id},{
      type,
      name,
      tagline,
      schedule,
      description,
      moderator,
      category,
      sub_category,
      rigor_rank,
    })
    
    
    res.status(201).json({
      message:"updated"
    });

  }
  } catch (error) {
    console.log(error);
  }
};

// Delete route
exports.deleteEvent = async (req, res) => {
  const event = await db.collection("events").findOne({ _id: new ObjectId(req.params.id) })
  if(event.files){

    const fileId = event.files.id;
    // deleting previous image from the database
    const resp = await cloudinary.v2.uploader.destroy(fileId);
  }

  await db.collection("events").deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).json({
    success: true,
    
  });
};
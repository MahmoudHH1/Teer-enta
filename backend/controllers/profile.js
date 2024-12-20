const User = require("../models/Users/User");
const Activity = require("../models/Activity/Activity");
const Tourist = require("../models/Users/Tourist");
const userModel = require("../models/Users/userModels");
const mongoose = require("mongoose");
const { uploadSingleFile } = require("../middlewares/imageUploader");
const errorHandler = require("../Util/ErrorHandler/errorSender");
const upload = require("multer")();

// Define the middleware to create or update the Profile based on userRole
exports.createProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const profileData = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const Model = userModel[user.userRole];
    const updatedProfile = await Model.findOneAndUpdate(
      { _id: userId },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );

    if (!user.hasProfile) {
      user.hasProfile = true;
      await user.save();
    }
    res
      .status(200)
      .json({ message: "user created successfully", updatedProfile });
  } catch (err) {
    errorHandler.SendError(res, err);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    return res.status(200).json(user);
  } catch (err) {
    errorHandler.SendError(res, err);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.params.id;
    const profileData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const Model = userModel[user.userRole];

    const updatedProfile = await Model.findOneAndUpdate(
      { _id: userId },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );

    if (!user.hasProfile) {
      user.hasProfile = true;
      await user.save();
    }
    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedProfile });
  } catch (err) {
    errorHandler.SendError(res, err);
  }
};

exports.uploadPicture = async (req, res, next) => {
  console.log("Uploading picture");
  try {
    const userRole = req.user.role; // Assuming req.user contains the authenticated user info
    let fieldName;

    // Determine the field name based on user role
    if (userRole === "Advertiser" || userRole === "Seller") {
      fieldName = "logoUrl"; // Field name for Advertiser and Seller
    } else if (userRole === "TourGuide") {
      fieldName = "photoUrl"; // Field name for TourGuide
    } else {
      return res
        .status(403)
        .json({
          message: "Forbidden: User role not supported for file upload.",
        });
    }

    // Upload the file and get the file URL
    upload.single(fieldName);
    const fileUrl = await uploadSingleFile(fieldName, req, res);
    req.fileUrl = fileUrl; // Store the file URL in the request object for further use
    console.log("File URL is", fileUrl);

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // If error occurs during the upload, send the error response
    if (err.status) {
      return res
        .status(err.status)
        .json({ message: err.message, error: err.error });
    } else {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }
};

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const { newAddress } = req.body;

    if (!newAddress || typeof newAddress !== 'string') {
      return res.status(400).json({ message: 'Invalid address provided.' });
    }
    const updatedTourist = await Tourist.findByIdAndUpdate(
        userId,
        { $push: { addresses: newAddress } },
        { new: true }
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    res.status(200).json({ message: 'Address added successfully.', tourist: updatedTourist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding address', error: err.message });
  }
};

exports.getAllAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }
    res.status(200).json({ addresses: tourist.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching addresses', error: err.message });
  }
};


exports.manageFieldNames = async (req, res, next) => {
  try {
    console.log("Here", req.fileUrl);
    const userRole = req.user.role;
    if (userRole === "Advertiser" || userRole === "Seller") {
      req.body.logoUrl = req.fileUrl;
    } else if (userRole === "TourGuide") {
      req.body.photoUrl = req.fileUrl;
    }
    next();
  } catch (err) {
    errorHandler.SendError(res, err);
  }
};

exports.getSavedActivities = async (req, res) => {
  try {
    const userId = req.user._id;

    const tourist = await Tourist.findById(userId).populate({
      path: 'savedActivities',
      model: 'Activity',
      match: { isActive: true },
      populate: {
        path: 'category',
        model: 'ActivityCategory'
      }
    });

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    res.status(200).json({ savedActivities: tourist.savedActivities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching saved activities', error: err.message });
  }
};
exports.addSavedActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // Assuming the activity ID is sent in the request body

    // Check if the tourist exists
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found.' });
    }

    // Check if the activity exists
    const activity = await Activity.findOne({ _id: id, isActive: true });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found or inactive.' });
    }

    // Check if the activity is already saved
    if (tourist.savedActivities.includes(id)) {
      return res.status(400).json({ message: 'Activity already saved.' });
    }

    // Add the activity to the savedActivities list
    tourist.savedActivities.push(id);
    await tourist.save();

    res.status(200).json({ message: 'Activity saved successfully.', savedActivities: tourist.savedActivities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving activity', error: err.message });
  }
};
exports.removeSavedActivity = async (req, res) => {
    try {
        const userId = req.user._id;
        const  id = req.params.id ; // Assuming the activity ID is sent in the request body

        // Check if the tourist exists
        const tourist = await Tourist.findById(userId);
        if (!tourist) {
        return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Check if the activity exists
        const activity = await Activity.findOne({ _id: id, isActive: true });
        if (!activity) {
        return res.status(404).json({ message: 'Activity not found or inactive.' });
        }

        // Check if the activity is saved
        if (!tourist.savedActivities.includes(id)) {
        return res.status(400).json({ message: 'Activity not saved.' });
        }
        // Remove the activity from the savedActivities list
        tourist.savedActivities = tourist.savedActivities.filter(savedActivity => savedActivity.toString() !== id);
        await tourist.save();

        res.status(200).json({ message: 'Activity removed successfully.', savedActivities: tourist.savedActivities });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error removing activity', error: err.message });
    }
}


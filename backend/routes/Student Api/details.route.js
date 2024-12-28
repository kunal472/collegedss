const express = require("express");
const router = express.Router();
const { getDetails, addDetails, updateDetails, deleteDetails, getCount, addOrUpdateSemesterData, fetchSemesterData, calculateCGPA} = require("../../controllers/Student/details.controller.js");
const upload = require("../../middlewares/multer.middleware.js")

router.post("/getDetails", getDetails);

router.post("/addDetails", upload.single("profile"), addDetails);

router.put("/updateDetails/:id", upload.single("profile"), updateDetails);

router.delete("/deleteDetails/:id", deleteDetails);

router.get("/count", getCount);

router.post("/semester", addOrUpdateSemesterData);

router.get("/semester/:enrollmentNo", fetchSemesterData);

router.get("/cgpa/:enrollmentNo", calculateCGPA);

module.exports = router;

const express = require("express");
const {  predictCgpa  } = require("../../controllers/Other/cgpa.conntroller");
const router = express.Router();

router.post("/predictCgpa", predictCgpa);

module.exports = router;

const studentDetails = require("../../models/Students/details.model.js")

const getDetails = async (req, res) => {
    try {
        let user = await studentDetails.find(req.body);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "No Student Found" });
        }
        const data = {
            success: true,
            message: "Student Details Found!",
            user,
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const addDetails = async (req, res) => {
    try {
        let user = await studentDetails.findOne({
            enrollmentNo: req.body.enrollmentNo,
        });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Student With This Enrollment Already Exists",
            });
        }
        user = await studentDetails.create({ ...req.body, profile: req.file.filename });
        const data = {
            success: true,
            message: "Student Details Added!",
            user,
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const updateDetails = async (req, res) => {
    try {
        let user;
        if (req.file) {
            user = await studentDetails.findByIdAndUpdate(req.params.id, { ...req.body, profile: req.file.filename });
        } else {
            user = await studentDetails.findByIdAndUpdate(req.params.id, req.body);
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Student Found",
            });
        }
        const data = {
            success: true,
            message: "Updated Successfull!",
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteDetails = async (req, res) => {
  const { enrollmentNo } = req.body;

  try {
    const user = await studentDetails.findOneAndDelete({ enrollmentNo }); 
      if (!user) {
      return res.status(404).json({
        success: false,
        message: "No Student Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted Successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCount = async (req, res) => {
    try {
        let user = await studentDetails.count(req.body);
        const data = {
            success: true,
            message: "Count Successfull!",
            user,
        };
        res.json(data);
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Internal Server Error", error });
    }
}

const addOrUpdateSemesterData = async (req, res) => {
  const { enrollmentNo, semesterDetails } = req.body;

  try {
    const student = await studentDetails.findOne({ enrollmentNo });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the semester already exists
    const existingSemester = student.semesterDetails.find(
      (sem) => sem.semesterNumber === semesterDetails.semesterNumber
    );

    if (existingSemester) {
      // Update existing semester SGPA
      existingSemester.sgpa = semesterDetails.sgpa;
    } else {
      // Add new semester data
      student.semesterDetails.push(semesterDetails);
    }

    await student.save();
    res.status(200).json({ message: "Semester data added/updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const fetchSemesterData = async (req, res) => {
  const { enrollmentNo } = req.params;

  try {
    const student = await studentDetails.findOne({ enrollmentNo });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ semesterDetails: student.semesterDetails });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const calculateCGPA = async (req, res) => {
  const { enrollmentNo } = req.params;

  try {
    const student = await studentDetails.findOne({ enrollmentNo });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { semesterDetails } = student;

    let totalSgpa = 0;
    semesterDetails.forEach((sem) => {
      totalSgpa += sem.sgpa;
    });

    const CGPA = semesterDetails.length > 0 ? totalSgpa / semesterDetails.length : 0;

    res.status(200).json({ CGPA: CGPA.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { getDetails, addDetails, updateDetails, deleteDetails, getCount, addOrUpdateSemesterData, fetchSemesterData, calculateCGPA,}
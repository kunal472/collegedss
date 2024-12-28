const { exec } = require('child_process');
const path = require('path');
const StudentDetail = require('../../models/Students/details.model');

exports.predictCgpa = async (req, res) => {
  try {
    const { enrollmentNo } = req.body;

    // Find the student details by enrollment number
    const student = await StudentDetail.findOne({ enrollmentNo });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get all the semester details for prediction
    const semesters = student.semesterDetails;

    // Prepare the features (SGPA of all semesters)
    const features = semesters.map(s => s.sgpa);

    // Log the features and path for debugging
    console.log("Features for CGPA prediction:", features);

    const scriptPath = path.join(__dirname, '../../python/predict_cgpa.py'); // Correct path
    console.log("Script path: ", scriptPath);

    // Call the Python script to predict CGPA
    exec(`python "${scriptPath}" "${JSON.stringify(features)}"`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error executing Python script:', err); // Log the actual error
        return res.status(500).json({ message: 'Error predicting CGPA', error: stderr });
      }

      // The stdout will contain the predicted CGPA
      return res.json({ cgpa: parseFloat(stdout) });
    });

  } catch (error) {
    console.error('Error in CGPA prediction:', error);
    return res.status(500).json({ message: 'Error in predicting CGPA', error: error.message });
  }
};

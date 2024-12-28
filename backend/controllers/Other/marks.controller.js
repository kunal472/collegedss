const mongoose = require("mongoose");
const Marks = require("../../models/Other/marks.model");
const Subject = mongoose.model("Subject");  // Assuming you have a Subject model.

const getMarks = async (req, res) => {
    try {
        // Populate the subject details in the query result
        const marks = await Marks.find(req.body).populate("subject");
        if (!marks || marks.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Marks Not Available" });
        }

        const data = {
            success: true,
            message: "All Marks Loaded!",
            marks,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const addMarks = async (req, res) => {
    let { enrollmentNo, subject, internal, external } = req.body;

    try {
        // Validate the existence of the referenced subject
        const existingSubject = await Subject.findById(subject);
        if (!existingSubject) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Subject ID" });
        }

        // Check if marks for the student in the same subject already exist
        let existingMarks = await Marks.findOne({ enrollmentNo, subject });

        if (existingMarks) {
            // Update the internal and external marks if they exist
            if (internal !== undefined) {
                existingMarks.internal = internal;
            }
            if (external !== undefined) {
                existingMarks.external = external;
            }
            await existingMarks.save();

            return res.json({
                success: true,
                message: "Marks Updated Successfully!",
            });
        }

        // Create a new Marks entry
        const newMarks = new Marks({
            enrollmentNo,
            subject,
            internal,
            external
        });

        await newMarks.save();
        res.json({ success: true, message: "Marks Added Successfully!" });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteMarks = async (req, res) => {
    try {
        // Find the mark entry by its ID and delete
        let mark = await Marks.findByIdAndDelete(req.params.id);
        if (!mark) {
            return res
                .status(400)
                .json({ success: false, message: "No Marks Data Exists!" });
        }
        const data = {
            success: true,
            message: "Marks Deleted!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getMarks, addMarks, deleteMarks };

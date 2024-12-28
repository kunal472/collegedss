import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import Heading from "../../components/Heading";
import { baseApiURL } from "../../baseUrl";

const Marks = () => {
  const userData = useSelector((state) => state.userData);
  const [internal, setInternal] = useState(null);
  const [external, setExternal] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [predictedCgpa, setPredictedCgpa] = useState(null);
  const [cgpaPredictionLoading, setCgpaPredictionLoading] = useState(false);

  useEffect(() => {
    const headers = { "Content-Type": "application/json" };

    // Fetch marks data
    axios
      .post(
        `${baseApiURL()}/marks/getMarks`,
        { enrollmentNo: userData.enrollmentNo },
        { headers }
      )
      .then((response) => {
        console.log("Marks API Response:", response.data);
        if (response.data.success && response.data.marks.length > 0) {
          const markData = response.data.marks[0];
          setInternal(markData.internal); // Single value for internal marks
          setExternal(markData.external); // Single value for external marks
          setSubjects([markData.subject]); // Array of subject(s)
        } else {
          console.warn("No marks data found:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching marks data:", error);
        toast.error("Error fetching marks data.");
      });

    // Fetch semester details
    axios
      .get(`${baseApiURL()}/student/details/semester/${userData.enrollmentNo}/`)
      .then((response) => {
        console.log("Semester API Response:", response.data);
        if (response.data.semesterDetails) {
          setSemesters(response.data.semesterDetails);
        } else {
          console.warn("No semester details available.");
        }
      })
      .catch((error) => {
        console.error("Error fetching semester details:", error);
        toast.error("Error fetching semester details.");
      });
  }, [userData.enrollmentNo]);

  const predictCgpa = () => {
    setCgpaPredictionLoading(true);

    axios
      .post(`${baseApiURL()}/cgpa/predictCgpa`, {
        enrollmentNo: userData.enrollmentNo,
      })
      .then((response) => {
        setCgpaPredictionLoading(false);
        setPredictedCgpa(response.data.cgpa);
      })
      .catch((error) => {
        setCgpaPredictionLoading(false);
        console.error("Error predicting CGPA:", error);
        toast.error("Error predicting CGPA.");
      });
  };

  // SGPA chart data
  const sgpaData = semesters.map((sem) => sem.sgpa || 0);

  const chartData = {
    labels: semesters.map((_, index) => `Sem ${index + 1}`),
    datasets: [
      {
        label: "SGPA",
        data: sgpaData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y1: {
        type: "linear",
        position: "left",
        ticks: {
          beginAtZero: true,
          max: 10,
        },
      },
    },
  };

  return (
    <div className="w-full mx-auto mt-10 flex flex-col items-center mb-10">
      <Heading title={`Marks of Semester ${userData.semester}`} />
      <div className="mt-10 w-full flex flex-wrap gap-10 justify-center">
        {internal !== null && external !== null && subjects.length > 0 ? (
          <div className="w-1/3 shadow-md p-4">
            <p className="border-b-2 border-red-500 text-2xl font-semibold pb-2">
              Marks Overview
            </p>
            <div className="mt-5">
              {subjects.map((subject, index) => (
                <div key={index} className="flex flex-col text-lg mt-2">
                  <p className="font-bold">
                    {subject.name} ({subject.code})
                  </p>
                  <p>Internal: {internal}/40</p>
                  <p>External: {external}/60</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No Marks Available At The Moment!</p>
        )}
      </div>

      {semesters.length > 0 && (
        <div className="mt-10 w-full flex justify-center">
          <div className="w-full max-w-4xl">
            <p className="text-2xl font-semibold mb-4">SGPA Chart</p>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      <div className="mt-10 w-full flex justify-center">
        <div className="w-1/2 shadow-md p-4">
          <p className="border-b-2 border-red-500 text-2xl font-semibold pb-2">
            CGPA Prediction
          </p>
          <div className="mt-5">
            {cgpaPredictionLoading ? (
              <p>Predicting CGPA...</p>
            ) : predictedCgpa ? (
              <p>Predicted CGPA: {predictedCgpa.toFixed(2)}</p>
            ) : (
              <button
                onClick={predictCgpa}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Predict CGPA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marks;

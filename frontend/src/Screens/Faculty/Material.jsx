import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import Heading from "../../components/Heading";

const Material = () => {
  const { fullname = "" } = useSelector((state) => state.userData); // Default to an empty string
  const [subject, setSubject] = useState([]);
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState({
    title: "",
    subject: "",
    faculty: fullname.split(" ")[0] + " " + (fullname.split(" ")[2] || ""),
  });

  useEffect(() => {
    toast.loading("Loading Subjects...");
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setSubject(response.data.subject || []);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.message);
      });
  }, []);

  const addMaterialHandler = () => {
    if (!selected.title || !selected.subject || !file) {
      toast.error("Please fill in all fields and upload a file.");
      return;
    }

    toast.loading("Adding Material...");
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("title", selected.title);
    formData.append("subject", selected.subject);
    formData.append("faculty", selected.faculty);
    formData.append("type", "material");
    formData.append("material", file);

    axios
      .post(`${baseApiURL()}/material/addMaterial`, formData, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setSelected({
            title: "",
            subject: "",
            faculty: fullname.split(" ")[0] + " " + (fullname.split(" ")[2] || ""),
          });
          setFile(null);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || error.message);
      });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Upload Material" />
      </div>
      <div className="w-full flex justify-evenly items-center mt-12">
        <div className="w-1/2 flex flex-col justify-center items-center">
          <div className="w-[80%] mt-2">
            <label htmlFor="title">Material Title</label>
            <input
              type="text"
              id="title"
              className="bg-blue-50 py-2 px-4 w-full mt-1"
              value={selected.title}
              onChange={(e) => setSelected({ ...selected, title: e.target.value })}
            />
          </div>
          <div className="w-[80%] mt-2">
            <label htmlFor="subject">Material Subject</label>
            <select
              value={selected.subject}
              name="subject"
              id="subject"
              onChange={(e) => setSelected({ ...selected, subject: e.target.value })}
              className="px-2 bg-blue-50 py-3 rounded-sm text-base accent-blue-700 mt-1 w-full"
            >
              <option value="">-- Select Subject --</option>
              {subject.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          {!file && (
            <label
              htmlFor="upload"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
            >
              Upload Material
              <FiUpload className="ml-2" />
            </label>
          )}
          {file && (
            <p
              className="px-2 border-2 border-blue-500 py-2 rounded text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
              onClick={() => setFile(null)}
            >
              Remove Selected Material
              <AiOutlineClose className="ml-2" />
            </p>
          )}
          <input
            type="file"
            name="upload"
            id="upload"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            className="bg-blue-500 text-white mt-8 px-4 py-2 rounded-sm"
            onClick={addMaterialHandler}
          >
            Add Material
          </button>
        </div>
      </div>
    </div>
  );
};

export default Material;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { setUserData } from "../../redux/actions";
import { baseApiURL } from "../../baseUrl";

const Profile = () => {
  const [showPass, setShowPass] = useState(false);
  const [data, setData] = useState(null);
  const [password, setPassword] = useState({ new: "", current: "" });
  const router = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if navigation state is valid
    if (!router.state?.type || !router.state?.loginid) {
      toast.error("Invalid navigation state.");
      return;
    }

    const headers = { "Content-Type": "application/json" };
    
    // Fetch user details from the API
    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { employeeId: router.state.loginid },
        { headers }
      )
      .then((response) => {
        console.log("API response:", response.data); // Log for debugging

        // Validate response structure
        if (response.data.success && Array.isArray(response.data.user) && response.data.user.length > 0) {
          setData(response.data.user); // Update state with user data
          const user = response.data.user[0];
          dispatch(
            setUserData({
              fullname: `${user.firstName || ""} ${user.middleName || ""} ${user.lastName || ""}`,
              employeeId: user.employeeId || "",
            })
          );
        } else {
          toast.error("No user data available.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error); // Log for debugging
        toast.error("Error fetching user details.");
      });
  }, [router.state, dispatch]);

  // Handle password verification and update
  const checkPasswordHandler = (e) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };

    axios
      .post(
        `${baseApiURL()}/faculty/auth/login`,
        { loginid: router.state.loginid, password: password.current },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          changePasswordHandler(response.data.id);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Current password verification failed:", error); // Log for debugging
        toast.error("Current password verification failed.");
      });
  };

  const changePasswordHandler = (id) => {
    const headers = { "Content-Type": "application/json" };
    axios
      .put(
        `${baseApiURL()}/faculty/auth/update/${id}`,
        { loginid: router.state.loginid, password: password.new },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Password updated successfully.");
          setPassword({ new: "", current: "" });
        } else {
          toast.error("Failed to update password.");
        }
      })
      .catch((error) => {
        console.error("Password update error:", error); // Log for debugging
        toast.error("Password update error.");
      });
  };

  return (
    <div className="w-full mx-auto my-8 flex justify-between items-start">
      {data && data.length > 0 ? (
        <>
          <div>
            <p className="text-2xl font-semibold">
              Hello {data[0]?.firstName || "User"} {data[0]?.middleName || ""} {data[0]?.lastName || ""} 👋
            </p>
            <div className="mt-3">
              <p className="text-lg font-normal mb-2">Employee Id: {data[0]?.employeeId}</p>
              <p className="text-lg font-normal mb-2">Post: {data[0]?.post}</p>
              <p className="text-lg font-normal mb-2">Email Id: {data[0]?.email}</p>
              <p className="text-lg font-normal mb-2">Phone Number: {data[0]?.phoneNumber}</p>
              <p className="text-lg font-normal mb-2">Department: {data[0]?.department}</p>
            </div>
            <button
              className={`${
                showPass ? "bg-red-100 text-red-600" : "bg-blue-600 text-white"
              } px-3 py-1 rounded mt-4`}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Change Password" : "Close Change Password"}
            </button>
            {showPass && (
              <form
                className="mt-4 border-t-2 border-blue-500 flex flex-col justify-center items-start"
                onSubmit={checkPasswordHandler}
              >
                <input
                  type="password"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="Current Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <input
                  type="password"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                  placeholder="New Password"
                  className="px-3 py-1 border-2 border-blue-500 outline-none rounded mt-4"
                />
                <button
                  className="mt-4 hover:border-b-2 hover:border-blue-500"
                  type="submit"
                >
                  Change Password
                </button>
              </form>
            )}
          </div>
          <img
            src={`${process.env.REACT_APP_MEDIA_LINK}/${data[0]?.profile}`}
            alt="faculty profile"
            className="h-[200px] w-[200px] object-cover rounded-lg shadow-md"
          />
        </>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default Profile;

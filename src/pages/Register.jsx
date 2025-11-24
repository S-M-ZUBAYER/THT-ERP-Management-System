// import React, { useState, useCallback } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { BsEyeFill } from "react-icons/bs";
// import { RiEyeCloseLine } from "react-icons/ri";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import { toast } from "react-hot-toast";
// import AddFile from "../assets/WebsiteImages/AddFile.jpg";
// import registerLogo from "../assets/WebsiteImages/register-logo.jpg";

// const Register = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);

//   // form states
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     country: "",
//     language: "",
//     designation: "",
//     department: "",
//     image: "",
//     role: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({
//     match: "",
//     length: "",
//     file: "",
//     role: "",
//   });

//   // upload handler
//   const handleFileUpload = useCallback(async (acceptedFiles) => {
//     const apiKey = import.meta.env.VITE_IMG_BB_API_KEY;
//     const uploadData = new FormData();
//     uploadData.append("image", acceptedFiles[0]);

//     try {
//       setIsUploading(true);
//       const response = await axios.post(
//         `https://api.imgbb.com/1/upload?key=${apiKey}`,
//         uploadData
//       );
//       const imageUrl = response.data.data.display_url;

//       setFormData((prev) => ({ ...prev, image: imageUrl }));
//       toast.success("✅ Image uploaded successfully!");
//     } catch (error) {
//       console.error(error);
//       toast.error("❌ Image upload failed!");
//     } finally {
//       setIsUploading(false);
//     }
//   }, []);

//   const onDrop = useCallback(
//     (acceptedFiles) => {
//       if (acceptedFiles.length === 0) {
//         setErrors((prev) => ({ ...prev, file: "Please select a file." }));
//       } else if (
//         acceptedFiles[0].type !== "image/jpeg" &&
//         acceptedFiles[0].type !== "image/png"
//       ) {
//         setErrors((prev) => ({
//           ...prev,
//           file: "Please select a JPG or PNG image.",
//         }));
//       } else {
//         setErrors((prev) => ({ ...prev, file: "" }));
//         handleFileUpload(acceptedFiles);
//       }
//     },
//     [handleFileUpload]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: "image/jpeg, image/png",
//   });

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   // submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const {
//       name,
//       email,
//       password,
//       confirmPassword,
//       phone,
//       country,
//       language,
//       designation,
//       department,
//       image,
//       role,
//     } = formData;

//     if (
//       !name ||
//       !email ||
//       !password ||
//       !confirmPassword ||
//       !phone ||
//       !country ||
//       !language ||
//       !designation ||
//       !department ||
//       !role
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     if (password.length < 8) {
//       setErrors((prev) => ({
//         ...prev,
//         length: "Password must be at least 8 characters",
//       }));
//       return;
//     }

//     if (password !== confirmPassword) {
//       setErrors((prev) => ({ ...prev, match: "Passwords do not match" }));
//       return;
//     }

//     setErrors({ match: "", length: "", file: "" });
//     setLoading(true);

//     try {
//       // ✅ Step 1: Check existing email
//       const checkRes = await fetch(
//         "https://grozziieget.zjweiting.com:8033/tht/check-user",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         }
//       );

//       const checkData = await checkRes.json();
//       if (checkData.exists) {
//         toast.error("This email already has an account");
//         setLoading(false);
//         return;
//       }

//       // ✅ Step 2: Register in local THT system
//       const res = await fetch("http://localhost:2000/tht/users/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           image,
//           phone,
//           country,
//           language,
//           email,
//           password,
//           designation,
//           department,
//           isAdmin: "false",
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         toast.error("Failed to register user in THT system");
//         setLoading(false);
//         return;
//       }

//       // ✅ Step 3: Register in Export Import System
//       try {
//         await axios.post(
//           "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/users/signup",
//           {
//             userName: name,
//             userEmail: email,
//             password: password,
//             role: role,
//           }
//         );
//         toast.success("Export/Import system account created");
//       } catch (error) {
//         console.warn("Export Import API failed:", error);
//         toast.error("Export/Import registration failed");
//       }

//       // ✅ Step 4: Register in Wowomart System
//       try {
//         const payload = {
//           name: name,
//           email: email,
//           password: password,
//           phone: phone,
//         };

//         await fetch(
//           "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/register",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           }
//         );

//         toast.success("Wowomart system account created");
//       } catch (error) {
//         console.warn("Wowomart API failed:", error);
//         toast.error("Wowomart registration failed");
//       }

//       // ✅ Step 5: Save locally and navigate
//       localStorage.setItem("user", JSON.stringify(formData));
//       toast.success("Registration successful!");
//       navigate("/logIn");
//     } catch (err) {
//       console.error(err);
//       toast.error("An error occurred during registration");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="md:flex shadow-lg justify-around items-center w-full md:mx-20 sm:px-5 px-3 lg:mx-20 my-20 rounded-lg">
//       <div className="bg-white text-gray-800 flex justify-center items-center w-full md:w-3/4 lg:w-3/4">
//         <div className="w-full my-12">
//           <h2 className="text-2xl mb-6 text-[#004368] font-semibold">
//             Create an account
//           </h2>

//           <form onSubmit={handleSubmit}>
//             {/* Email */}
//             <input
//               className="w-full pl-2 bg-white text-gray-800"
//               placeholder="Email"
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <hr className="border-slate-400 mb-6 my-1" />

//             {/* Password */}
//             <div className="relative my-2">
//               <div className="flex items-center">
//                 <input
//                   className="w-full pl-2 bg-white text-gray-800"
//                   placeholder="Password"
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-0 pr-2"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <BsEyeFill className="text-slate-500" />
//                   ) : (
//                     <RiEyeCloseLine className="text-slate-500" />
//                   )}
//                 </button>
//               </div>
//               <hr className="border-slate-400 mb-6 my-1" />
//               <p className="text-xs text-red-600 ml-2 text-start">
//                 {errors.length}
//               </p>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative my-2">
//               <div className="flex items-center">
//                 <input
//                   className="w-full pl-2 bg-white text-gray-800"
//                   placeholder="Confirm Password"
//                   type={showConfirmPassword ? "text" : "password"}
//                   id="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-0 pr-2"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? (
//                     <BsEyeFill className="text-slate-500" />
//                   ) : (
//                     <RiEyeCloseLine className="text-slate-500" />
//                   )}
//                 </button>
//               </div>
//               <hr className="border-slate-400 mb-6 my-1" />
//               <p className="text-xs text-red-600 ml-2 text-start">
//                 {errors.match}
//               </p>
//             </div>

//             {/* Name */}
//             <input
//               className="w-full pl-2 bg-white text-gray-800"
//               placeholder="Full Name"
//               type="text"
//               id="name"
//               value={formData.name}
//               onChange={handleChange}
//             />
//             <hr className="border-slate-400 mb-6 my-1" />

//             {/* Role */}
//             <div className="mb-6 relative group">
//               <label className="text-lg font-semibold" htmlFor="role">
//                 Role
//               </label>

//               <select
//                 id="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800
//                cursor-pointer relative"
//               >
//                 <option value="">Select your role</option>
//                 <option value="Product Manager">Product Manager</option>
//                 <option value="Commercial Manager">Commercial Manager</option>
//                 <option value="Finance">Finance</option>
//               </select>

//               {/* Tooltip */}
//               <div
//                 className="absolute top-full left-0 mt-1 w-72 p-2 bg-black text-white text-sm rounded-md
//                opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg z-20"
//               >
//                 If you are in account department, please select according to
//                 your role to use the export-import management system. Otherwise
//                 you can select any one.
//               </div>

//               {errors.role && (
//                 <p className="text-red-600 font-semibold my-1">{errors.role}</p>
//               )}
//             </div>

//             {/* Phone */}
//             <input
//               className="w-full pl-2 bg-white text-gray-800"
//               placeholder="Phone Number"
//               type="text"
//               id="phone"
//               value={formData.phone}
//               onChange={handleChange}
//             />
//             <hr className="border-slate-400 mb-6 my-1" />

//             {/* Designation */}
//             <input
//               className="w-full pl-2 bg-white text-gray-800"
//               placeholder="Designation"
//               type="text"
//               id="designation"
//               value={formData.designation}
//               onChange={handleChange}
//             />
//             <hr className="border-slate-400 mb-6 my-1" />

//             {/* Department */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Department
//               </label>
//               <select
//                 id="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-800"
//               >
//                 <option value="">Select Department</option>
//                 <option value="Customer Service Officer">
//                   Customer Service Officer
//                 </option>
//                 <option value="Sales">Sales</option>
//                 <option value="Research & Development">
//                   Research & Development
//                 </option>
//                 <option value="Accounts">Accounts</option>
//               </select>
//             </div>

//             {/* Country */}
//             <input
//               className="w-full pl-2 bg-white text-gray-800"
//               placeholder="Country"
//               type="text"
//               id="country"
//               value={formData.country}
//               onChange={handleChange}
//             />
//             <hr className="border-slate-400 mb-6 my-1" />

//             {/* Language */}
//             <input
//               className="w-full pl-2 bg-white text-gray-800"
//               placeholder="Native Language"
//               type="text"
//               id="language"
//               value={formData.language}
//               onChange={handleChange}
//             />
//             <hr className="border-slate-400 mb-6" />

//             {/* Image Upload */}
//             <div {...getRootProps()} className="mb-10 cursor-pointer">
//               <input {...getInputProps()} />
//               {isUploading ? (
//                 <div className="w-full h-10 flex items-center justify-center pl-2 shadow-lg rounded-md border text-slate-400">
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-gray-500"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                     ></path>
//                   </svg>
//                   Uploading...
//                 </div>
//               ) : isDragActive ? (
//                 <p className="text-lg font-medium text-gray-500">
//                   Drop the files here ...
//                 </p>
//               ) : (
//                 <div className="w-full h-10 flex items-center pl-2 shadow-lg rounded-md border text-slate-400">
//                   <img className="w-6 h-6" src={AddFile} alt="Add File" />
//                   <span className="ml-3">Add Image</span>
//                 </div>
//               )}
//             </div>
//             {errors.file && (
//               <p className="mt-2 text-sm text-red-500">{errors.file}</p>
//             )}

//             {/* Submit */}
//             <button
//               className="bg-[#004368] text-white w-full py-2 text-xl font-semibold rounded-md"
//               type="submit"
//               disabled={loading}
//             >
//               {!loading ? "Register" : "Loading..."}
//             </button>
//           </form>

//           <div className="text-sm my-3">
//             Already have an account?{" "}
//             <Link className="font-semibold text-[#65ABFF]" to="/logIn">
//               Sign In
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Right Image */}
//       <div className="hidden w-full lg:flex items-center justify-center">
//         <img className="h-3/4 w-2/3" src={registerLogo} alt="Register" />
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";
import { RiEyeCloseLine } from "react-icons/ri";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import AddFile from "../assets/WebsiteImages/AddFile.jpg";
import registerLogo from "../assets/WebsiteImages/register-logo.jpg";
import { format } from "date-fns";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "",
    language: "",
    designation: "",
    department: "",
    image: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    match: "",
    length: "",
    file: "",
    role: "",
  });

  // File upload
  const handleFileUpload = useCallback(async (acceptedFiles) => {
    const apiKey = import.meta.env.VITE_IMG_BB_API_KEY;
    const uploadData = new FormData();
    uploadData.append("image", acceptedFiles[0]);

    try {
      setIsUploading(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        uploadData
      );
      const imageUrl = response.data.data.display_url;
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      toast.success("✅ Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Image upload failed!");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        setErrors((prev) => ({ ...prev, file: "Please select a file." }));
      } else if (
        acceptedFiles[0].type !== "image/jpeg" &&
        acceptedFiles[0].type !== "image/png"
      ) {
        setErrors((prev) => ({
          ...prev,
          file: "Please select a JPG or PNG image.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, file: "" }));
        handleFileUpload(acceptedFiles);
      }
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      country,
      language,
      designation,
      department,
      image,
      role,
    } = formData;

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !country ||
      !language ||
      !designation ||
      !department ||
      !role
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        length: "Password must be at least 8 characters",
      }));
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, match: "Passwords do not match" }));
      return;
    }

    setErrors({ match: "", length: "", file: "" });
    setLoading(true);

    try {
      // ✅ 1️⃣ Check existing email
      const checkRes = await fetch(
        "https://grozziieget.zjweiting.com:8033/tht/check-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const checkData = await checkRes.json();
      if (checkData.exists) {
        toast.error("This email already has an account");
        setLoading(false);
        return;
      }

      // ✅ 2️⃣ Register in local THT system
      const res = await fetch("http://localhost:2000/tht/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image,
          phone,
          country,
          language,
          email,
          password,
          designation,
          department,
          isAdmin: "false",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to register user in THT system");
        setLoading(false);
        return;
      }

      // ✅ 3️⃣ Export/Import System
      try {
        await axios.post(
          "https://grozziieget.zjweiting.com:3091/web-api-tht-1/api/dev/users/signup",
          {
            userName: name,
            userEmail: email,
            password: password,
            role: role,
          }
        );
        toast.success("Export/Import system account created");
      } catch (error) {
        console.warn("Export Import API failed:", error);
        toast.error("Export/Import registration failed");
      }

      // ✅ 4️⃣ Wowomart System
      try {
        const payload = {
          name: name,
          email: email,
          password: password,
          phone: phone,
        };
        await fetch(
          "https://grozziie.zjweiting.com:57683/tht/wowomart/api/shopify/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        toast.success("Wowomart system account created");
      } catch (error) {
        console.warn("Wowomart API failed:", error);
        toast.error("Wowomart registration failed");
      }

      // ✅ 5️⃣ NEW: Employee API (4th additional)
      try {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("email", email);
        fd.append("password", password);
        fd.append("phone", phone);
        fd.append("designation", designation);
        fd.append("role", "User");
        fd.append("joiningDate", format(new Date(), "yyyy-MM-dd"));
        console.log(name, email, password, phone, designation, "User", image);

        // if (image) fd.append("image", image);
        await axios.post(
          "https://grozziie.zjweiting.com:57683/tht/taskManagement/api/user/register",
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        toast.success("Employee record added successfully");
      } catch (error) {
        console.error("Employee registration failed:", error);
        toast.error("Employee registration failed");
      }

      // ✅ Save locally
      localStorage.setItem("user", JSON.stringify(formData));
      toast.success("Registration completed!");
      navigate("/logIn");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:flex shadow-lg justify-around items-center w-full md:mx-20 sm:px-5 px-3 lg:mx-20 my-20 rounded-lg">
      <div className="bg-white text-gray-800 flex justify-center items-center w-full md:w-3/4 lg:w-3/4">
        <div className="w-full my-12">
          <h2 className="text-2xl mb-6 text-[#004368] font-semibold">
            Create an account
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <input
              className="w-full pl-2 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
              placeholder="Email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            <hr className="border-slate-400 mb-6 my-1" />

            {/* Password */}
            <div className="relative my-2">
              <div className="flex items-center">
                <input
                  className="w-full pl-2 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-0 pr-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <BsEyeFill className="text-slate-500" />
                  ) : (
                    <RiEyeCloseLine className="text-slate-500" />
                  )}
                </button>
              </div>
              <hr className="border-slate-400 mb-6 my-1" />
              <p className="text-xs text-red-600 ml-2 text-start">
                {errors.length}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="relative my-2">
              <div className="flex items-center">
                <input
                  className="w-full pl-2 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-0 pr-2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <BsEyeFill className="text-slate-500" />
                  ) : (
                    <RiEyeCloseLine className="text-slate-500" />
                  )}
                </button>
              </div>
              <hr className="border-slate-400 mb-6 my-1" />
              <p className="text-xs text-red-600 ml-2 text-start">
                {errors.match}
              </p>
            </div>

            {/* Name */}
            <input
              className="w-full pl-2 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
              placeholder="Full Name"
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
            <hr className="border-slate-400 mb-6 my-1" />

            {/* Role with tooltip */}
            <div className="mb-6 relative">
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-white text-gray-400 cursor-pointer peer focus:outline-none focus:ring-0 focus:border-gray-300"
              >
                <option className="text-gray-400" value="">
                  Select your role
                </option>
                <option value="Product Manager">Product Manager</option>
                <option value="Commercial Manager">Commercial Manager</option>
                <option value="Finance">Finance</option>
              </select>

              {/* Tooltip visible ONLY when the select (peer) is hovered */}
              <div
                className="absolute top-full left-0 mt-1 w-72 p-2 bg-black text-white text-sm rounded-md 
                  opacity-0 peer-hover:opacity-100 transition-opacity duration-300 
                  shadow-lg z-20 pointer-events-none"
              >
                If you are in account department, please select according to
                your role to use the export-import management system. Otherwise
                you can select any one.
              </div>

              {errors.role && (
                <p className="text-red-600 font-semibold my-1">{errors.role}</p>
              )}
              <hr className="border-slate-400 mb-6 my-1" />
            </div>

            {/* Phone */}
            <input
              className="w-full pl-2 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
              placeholder="Phone Number"
              type="text"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <hr className="border-slate-400 mb-6 my-1" />

            {/* Designation */}
            <input
              className="w-full pl-2 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
              placeholder="Designation"
              type="text"
              id="designation"
              value={formData.designation}
              onChange={handleChange}
            />
            <hr className="border-slate-400 mb-6 my-1" />

            {/* Department */}
            <div className="">
              <select
                id="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full  bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
              >
                <option value="">Select Department</option>
                <option value="Customer Service Officer">
                  Customer Service Officer
                </option>
                <option value="Sales">Sales</option>
                <option value="Research & Development">
                  Research & Development
                </option>
                <option value="Accounts">Accounts</option>
              </select>
              <hr className="border-slate-400 mb-6 my-1" />
            </div>

            {/* Country */}
            <input
              className="w-full pl-2 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
              placeholder="Country"
              type="text"
              id="country"
              value={formData.country}
              onChange={handleChange}
            />
            <hr className="border-slate-400 mb-6 my-1" />

            {/* Language */}
            <input
              className="w-full pl-2 bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-gray-300"
              placeholder="Native Language"
              type="text"
              id="language"
              value={formData.language}
              onChange={handleChange}
            />
            <hr className="border-slate-400 mb-6" />

            {/* Image Upload */}
            <div {...getRootProps()} className="mb-10 cursor-pointer">
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="w-full h-10 flex items-center justify-center pl-2 shadow-lg rounded-md border text-slate-400">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Uploading...
                </div>
              ) : isDragActive ? (
                <p className="text-lg font-medium text-gray-500">
                  Drop the files here ...
                </p>
              ) : (
                <div className="w-full h-10 flex items-center pl-2 shadow-lg rounded-md border text-slate-400">
                  <img className="w-6 h-6" src={AddFile} alt="Add File" />
                  <span className="ml-3">Add Image</span>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="mt-2 text-sm text-red-500">{errors.file}</p>
            )}

            {/* Submit */}
            <button
              className="bg-[#004368] text-white w-full py-2 text-xl font-semibold rounded-md"
              type="submit"
              disabled={loading}
            >
              {!loading ? "Register" : "Loading..."}
            </button>
          </form>

          <div className="text-sm my-3">
            Already have an account?{" "}
            <Link className="font-semibold text-[#65ABFF]" to="/logIn">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="hidden w-full lg:flex items-center justify-center">
        <img className="h-3/4 w-2/3" src={registerLogo} alt="Register" />
      </div>
    </div>
  );
};

export default Register;

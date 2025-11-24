import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import BtnSpinner from '../../../../Shared/Loading/BtnSpinner';
import toast from 'react-hot-toast';

function ShowingVideoCN() {
    // State to store the selected video and title
    const [video, setVideo] = useState(null);
    const [title, setTitle] = useState('');
    const [allVideo, setAllVideo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productCountryName, setProductCountryName] = useState('');

    const handleProductCountryNameChange = (e) => {
        setProductCountryName(e.target.value);
    };

    useEffect(() => {
        // Make a GET request to retrieve showing videos
        axios.get('https://jiapuv.com:8033/tht/showingVideo/zh-cn')
            .then(response => {
                // Handle the successful response here
                setAllVideo((response?.data)?.data);
            })
            .catch(error => {
                // Handle any errors here
                console.error('Error retrieving showing videos:', error);
            });
    }, []);

    // Function to handle the video input change
    const handleVideoChange = (e) => {
        const selectedVideo = e.target.files[0];
        setVideo(selectedVideo);
    };

    // Function to handle the title input change
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // Function to handle the form submission
    // Frontend code
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Create a FormData object to send the video and title
        const formData = new FormData();
        formData.append('showingVideo', video); // Use 'showingVideo' instead of 'video'
        formData.append('title', title);
        formData.append('country', productCountryName);
        formData.append('imgPath', `https://jiapuv.com:8033/tht/showingVideos/`);

        try {
            // Make a POST request to your backend API to handle the video upload
            const response = await axios.post('https://jiapuv.com:8033/tht/showingVideo/add', formData, {
                // const response = await axios.post('http://localhost:2000/tht/showingVideo/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle the response from the backend
            console.log('Video uploaded successfully:', response.data);
            toast.success('Video uploaded successfully');
            setLoading(false);
            setAllVideo([...allVideo, { title: title, video: video }])

            // Clear the form fields after successful upload
            setVideo(null);
            setTitle('');
        } catch (error) {
            console.error('Error uploading video:', error);
            toast.error('Error uploading video');
            setLoading(false);
        }
    };

    const handleToDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this showing video?');
        if (!confirmed) return;

        try {
            const response = await axios.delete(`https://jiapuv.com:8033/tht/showingVideo/delete/${id}`);

            if (response.status === 200) {
                setAllVideo((prevVideos) => prevVideos.filter(video => video.id !== id));
                toast.success('Showing video deleted successfully.');
            } else {
                toast.error('Failed to delete showing video. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting showing video:', error.response?.data || error.message);
            toast.error('An error occurred while deleting the video. Please try again.');
        }
    };

    return (
        <div className="mt-20">
            <h2 className="font-bold text-3xl text-[#004368] mb-8">Upload Chinese Server Showing Video</h2>

            <div className=" flex justify-center items-center">
                <form className="" onSubmit={handleFormSubmit}>
                    <div className="mb-5 text-center">
                        <label htmlFor="title" className=" mr-2 font-semibold ">Title:</label>
                        <input
                            type="text"
                            id="title"
                            className="bg-white border px-1 py-1 mr-auto"
                            placeholder="Enter the title"
                            name="title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />
                    </div>

                    <div className="mb-5 text-center flex justify-center items-center">
                        <label htmlFor="title" className=" mr-2 font-semibold ">Country:</label>
                        <select
                            id="productCountryCategory"
                            className="shadow appearance-none border rounded w-48 py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                            value={productCountryName}
                            onChange={handleProductCountryNameChange}
                            required
                        >
                            <option value="">Select Country Category</option>
                            <option value="zh-CN">中文</option>
                            <option value="en-US">USA(En)</option>
                            <option value="en-SG">Singapore(En)</option>
                            <option value="th-TH">ไทย</option>
                            <option value="fil-PH">Philippines</option>
                            <option value="vi-VN">Tiếng Việt</option>
                            <option value="ms-MY">Malaysia</option>
                            <option value="id-ID">Indonesia</option>
                        </select>
                    </div>

                    <div className="text-center ml-20">
                        <label htmlFor="video" className="mr-2 font-semibold ">Video:</label>
                        <input
                            type="file"
                            id="video"
                            className="mr-auto"
                            name="video"
                            accept="video/*" // Accept only video files
                            onChange={handleVideoChange}
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" className=" bg-[#004368] hover:bg-blue-700 text-white font-bold py-2 my-10 px-20 ml-5 rounded-lg">
                            {
                                loading ? <BtnSpinner></BtnSpinner> : 'Upload Showing Video'
                            }

                        </button>
                    </div>
                </form>
            </div>

            <div>
                <h2 className="font-bold text-3xl text-[#004368] mt-20 mb-10">Available Showing Video From Chinese Server</h2>

                {/* Video Grid */}
                <div className="grid grid-cols-4 gap-4 px-10">
                    {allVideo.map((video, index) => (
                        <div key={index} className="mb-4 flex justify-center p-2 shadow-lg rounded-lg">
                            <div className="relative rounded-lg">
                                <video controls width="300" className="rounded-lg">
                                    <source
                                        src={`${video.imgPath}${video.showingVideo}`}
                                        type="video/mp4"
                                    />
                                </video>
                                <button
                                    onClick={() => handleToDelete(video.id)}
                                    className="absolute right-2 top-2 text-blue-600 p-2 bg-slate-300 rounded-full font-bold"
                                >
                                    <RiDeleteBin6Fill />
                                </button>

                                <h3 className="font-semibold text-base my-2">{video.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ShowingVideoCN;


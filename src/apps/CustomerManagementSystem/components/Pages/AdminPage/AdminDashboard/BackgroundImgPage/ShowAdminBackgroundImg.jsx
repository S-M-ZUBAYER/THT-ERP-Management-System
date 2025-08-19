import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { AiOutlineDownload } from 'react-icons/ai';
import { AuthContext } from '../../../../../context/UserContext';
import DisplaySpinner from '../../../../Shared/Loading/DisplaySpinner';

const ShowAdminBackgroundImg = () => {
    const [allIcons, setAllIcons] = useState([]);
    const location = useLocation();
    const categoryName = location.pathname.split('/').pop().replace(/%20/g, ' ');
    const params = new URLSearchParams(location.search);
    const baseUrl = params.get('baseUrl');

    // get the value from useContext
    const { loading, setLoading } = useContext(AuthContext)

    // Make a GET request to fetch all background images for the specific category
    useEffect(() => {
        const apiUrl = `${baseUrl}/tht/adminBackgroundImgs/${categoryName}`;
        axios.get(apiUrl)
            .then((response) => {
                setAllIcons(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [categoryName]);

    //create a function to delete background images from the frontend and database both side 
    const handleToDelete = async (id) => {
        try {
            await axios.delete(`${baseUrl}/tht/adminBackgroundImgs/delete/${id}`);
            toast.success('Icon deleted successfully');
            setAllIcons(allIcons.filter((icon) => icon.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete Icon');
        }
    };

    //create a function to download background image
    const handleToDownload = (icon) => {
        const imageURL = `${baseUrl}/tht/adminBackgroundImgs/${icon}`; // Replace with your image URL
        fetch(imageURL)
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'image.jpg'; // Specify the desired filename
                a.click();
                URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error downloading image:', error);
            });
    }

    return (
        <div className=" min-h-screen">
            <h1 className="text-3xl font-bold text-yellow-400 my-10">
                Available icons for <span className="text-teal-400">{categoryName}</span> category
            </h1>
            {
                loading ?
                    <DisplaySpinner></DisplaySpinner>
                    :
                    allIcons?.length === 0 ? <p className="text-2xl font-semibold text-amber-500">No Icons Available !!!</p>
                        :
                        <div className="grid sm:grid-cols-2 md:grid-cols-6 mx-1 md:mx-5  gap-4 text-center">
                            {
                                allIcons.map((element, index) => {
                                    return <div className=" relative border-2">
                                        <AiOutlineDownload onClick={() => handleToDownload(element?.image)} className=" absolute top-0 hover:cursor-pointer text-green-500"></AiOutlineDownload>
                                        <MdDelete onClick={() => handleToDelete(element?.id)} className=" absolute right-0 hover:cursor-pointer text-red-500"></MdDelete>
                                        <img key={index} id="myDiv" className=" inline-block w-28 h-28" src={`${baseUrl}/tht/adminBackgroundImgs/${element.image}`} alt="Icon"></img>
                                    </div>
                                })
                            }
                        </div>
            }
        </div>
    );
};

export default ShowAdminBackgroundImg;
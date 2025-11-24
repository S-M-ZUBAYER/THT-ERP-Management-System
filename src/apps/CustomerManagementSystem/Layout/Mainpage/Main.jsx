import React from 'react';
import Navbar from '../../components/Shared/NavbarSection/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../../components/Shared/FooterSection/Footer';

const Main = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default Main;
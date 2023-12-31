import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../../App.css';
import BackEndUrl from '../../backend URL/BackEndUrl';

function SideBar() {
    // get backend URL
    const backendUrl = BackEndUrl();

    const navigate = useNavigate();

    // get token from the localStorage
    const [userData, setUserData] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        async function fetchProtected() {
            try {
                const response = await axios.get(`${backendUrl}/protected`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    // console.log(response.data.user);
                    const userId = response.data.user.id;

                    try {
                        await axios.get(`${backendUrl}/api/getData/${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }).then((response) => {
                            if (response.status === 200) {
                                // console.log(response.data.results[0]);
                                setUserData(response.data.results[0]);
                            }
                        })
                    } catch (error) {
                        console.log("Error: ", error);
                        if (error.response && error.response.status === 401) {
                            console.log(error.response.data);
                        }
                    }
                }

            } catch (error) {
                console.log("Error: ", error);
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data);
                    navigate('/');
                }
            }
        }
        fetchProtected();
    }, []);

  return (
    <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <i className='fas fa-times close-button' data-widget="pushmenu" href="#" role="button"></i>
                {/* Brand Logo */}
                <span onClick={(e) => navigate('unitHead-homePage')} className="brand-link span-cursor" style={{width: '190px'}}>
                    <img src="../../CSS/img/logo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">Unit Head</span>
                </span>
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Sidebar user (optional) */}
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img style={{ width: 34, height: 34 }} src={userData && ( `${backendUrl}/uploads/${userData.image}` )} className="img-profile rounded-circle" />
                        </div>
                        <div className="info">
                            <a href="#" className="d-block" data-toggle="modal" data-target="#profile" style={{ cursor: 'pointer' }}>{userData && (userData.fullname )}</a>
                        </div>
                    </div>
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                            {/* =========================================================== PUBLICIZE RESEARCH ======================================================================================== */}
                            <li className="nav-item has-treeview">
                                <span onClick={(e) => navigate('/unitHead-public-RorE')} className="nav-link span-cursor">
                                    <i className="nav-icon fas fa-copy" />
                                    <p>
                                        R & E Programs
                                    </p>
                                </span>
                            </li>
                            {/* =========================================================== RESEARCH WORKS ======================================================================================== */}
                            <li className="nav-item has-treeview">
                                <span onClick={(e) => navigate('/unitHead-RorE-Works')} className="nav-link span-cursor">
                                    <i className="nav-icon fas fa-copy" />
                                    <p>
                                        {userData && (userData.RorE)} Works
                                    </p>
                                </span>
                            </li>
                            {/* =========================================================== CHAIRPERSON ACCOUNTS ======================================================================================== */}
                            <li className="nav-item has-treeview">
                                <span onClick={(e) => navigate('/unitHead-chairperson-account')} className="nav-link span-cursor">
                                    <i className="nav-icon fas fa-users" />
                                    <p>
                                        Chairperson Accounts
                                    </p>
                                </span>
                            </li>
                            {/* =========================================================== AUTHOR ACCOUNTS ======================================================================================== */}
                            <li className="nav-item has-treeview">
                                <span onClick={(e) => navigate('/unitHead-author-account')} className="nav-link span-cursor">
                                    <i className="nav-icon fas fa-users" />
                                    <p>
                                        Author Accounts
                                    </p>
                                </span>
                            </li>
                        </ul></nav>
                    {/* /.sidebar-menu */}
                </div>
            </aside>
        </div>
  )
}

export default SideBar

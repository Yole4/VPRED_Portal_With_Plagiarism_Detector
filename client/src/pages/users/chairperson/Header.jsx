import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import BackEndUrl from '../../backend URL/BackEndUrl';

function Header() {
    // get backend URL
    const backendUrl = BackEndUrl();

    const navigate = useNavigate();

    // get token from the localStorage
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState('');

    // convert to string
    const user_id = userId.toString();

    // get token
    const token = localStorage.getItem('token');

    //  get user_id
    useEffect(() => {
        async function fetchProtected() {
            try {
                const response = await axios.get(`${backendUrl}/protected`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setUserId(response.data.user.id);
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

    // ###############################################################     REQUEST GET ALL NOTIFICATION     ##################################################################################
    const [notification, setNotification] = useState([]);
    // reverse the array or notification
    const notificationReverse = [...notification].reverse();
    const firstFive = notificationReverse.slice(0, 5);

    let hasUnseen = 0;

    for (let i = 0; i < notification.length; i++) {
        if (notification[i].seen === 0) {
            hasUnseen++;
        }
    }

    useEffect(() => {
        async function not() {
            try {
                const response = await axios.get(`${backendUrl}/all/notification/${user_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setNotification(response.data.results);
                }
            } catch (error) {
                if (error.response.status === 401) {
                    console.log(error.response.data.message);
                } else {
                    console.log('Error: ', error);
                }
            }
        }
        not();
    }, [user_id]);

    // #########################################################################    EDIT PROFILE    ####################################################################################
    const [email, setEmail] = useState(userData && userData.email);
    const [phoneNumber, setPhoneNumber] = useState(userData && userData.phone_number);
    const [fullname, setFullName] = useState(userData && userData.fullname);
    const [oldImage, setOldImage] = useState(userData && userData.image);
    const [image, setImage] = useState([]);

    // display error or success
    const [isResponse, setIsResponse] = useState(false);
    const [success, setSuccess] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const editProfile = async (e) => {
        e.preventDefault();

        const reqestEdit = new FormData();
        reqestEdit.append('image', image);
        reqestEdit.append('fullname', fullname);
        reqestEdit.append('email', email);
        reqestEdit.append('phone_number', phoneNumber);
        reqestEdit.append('id', user_id);
        reqestEdit.append('oldImage', oldImage);

        try {
            const response = await axios.post(`${backendUrl}/api/edit-profile`, reqestEdit, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                //success
                setEmail(email);
                setPhoneNumber(phoneNumber);
                setFullName(fullname);
                setImage(null);
                setResponseMessage(response.data.message);
                setIsResponse(true);
                setSuccess(true);
                setIsLoading(false);

                setTimeout(() => {
                    setIsResponse(false);
                }, 7000);
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.status === 401) {
                setResponseMessage(error.response.data.message);
                setSuccess(false);
                setIsLoading(true);

                setTimeout(() => {
                    setResponseMessage(false);
                }, 7000);
            } else {
                console.log("Error: ", error);
            }
        }
    }

    // #########################################################################    CHANGE PASSWORD     ####################################################################################
    const [confirmPassword, setConPass] = useState('');
    const [newPassword, setNewPass] = useState('');
    const [currentPassword, setOldPass] = useState('');

    const changePassword = async (e) => {
        e.preventDefault();

        const requestToChangePass = { currentPassword, newPassword, confirmPassword, user_id };

        try {
            const response = await axios.post(`${backendUrl}/api/change-password`, requestToChangePass, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                //success
                setResponseMessage(response.data.message);
                setIsResponse(true);
                setSuccess(true);
                setIsLoading(false);

                setTimeout(() => {
                    setIsResponse(false);
                }, 7000);

            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.status === 401) {
                setResponseMessage(error.response.data.message);
                setSuccess(false);
                setIsLoading(true);

                setTimeout(() => {
                    setResponseMessage(false);
                }, 7000);
            } else {
                console.log("Error: ", error);
            }
        }
    }

    // get user data
    useEffect(() => {
        async function getUserData() {
            try {
                await axios.get(`${backendUrl}/api/getData/${user_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then((response) => {
                    if (response.status === 200) {
                        setEmail(response.data.results[0].email);
                        setPhoneNumber(response.data.results[0].phone_number);
                        setUserId(response.data.results[0].id);
                        setUserData(response.data.results[0]);
                        setFullName(response.data.results[0].fullname);
                        setOldImage(response.data.results[0].image);
                    }
                })
            } catch (error) {
                console.log("Error: ", error);
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data);
                }
            }
        }
        getUserData();
    }, [user_id]);

    return (
        <div>
            <nav className="main-header navbar navbar-expand navbar-primary navbar-dark">
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <span style={{ cursor: 'pointer' }} onClick={(e) => navigate('/chairperson-homePage')} className="nav-link">Home</span>
                    </li>
                    {/* =============================================================== PUBLICIZE RESEARCH ================================================================================== */}
                    <li className="nav-item d-none d-sm-inline-block">
                        <span style={{ cursor: 'pointer' }} onClick={(e) => navigate('/chairperson-public-RorE')} className="nav-link">Research & Extension Programs</span>
                    </li>
                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto">
                    {/* Messages Dropdown Menu */}
                    <li className="nav-item dropdown">
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <a href="#" className="dropdown-item">
                                {/* Message Start */}
                                {/* Message End */}
                            </a>
                            <div className="dropdown-divider" />
                            <a href="#" className="dropdown-item dropdown-footer">See All Messages</a>
                        </div>
                    </li>
                    {/* Notifications Dropdown Menu */}
                    {/* // ================================================================= NOTIFICATION =============================================================================== */}
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href="#">
                            <i className="far fa-bell" />
                            <span className="badge badge-warning navbar-badge">{hasUnseen}</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <span className="dropdown-item dropdown-header">{hasUnseen} Notification</span>

                            {firstFive.map((item, index) => (
                                <div className='dropdown-item other' style={{ fontSize: '12px', backgroundColor: item.seen === 0 ? 'rgb(199, 200, 211)' : '', cursor: 'pointer' }}>
                                    <i className="fas fa-bell mr-2" style={{ position: 'absolute', fontSize: '15px', marginTop: '5px', marginLeft: '-5px', color: 'rgba(80, 66, 66, 0.935)' }} /><p style={{ marginLeft: '22px' }}>{item.content} </p>
                                    <p style={{ marginLeft: 22, fontSize: 10, color: 'rgb(105, 96, 96)' }}>{item.date}</p>
                                </div>
                            ))}
                            <div className="dropdown-divider" />
                            <a data-toggle="modal" data-target="#allNotification" style={{ cursor: 'pointer' }} className="dropdown-item dropdown-footer">See All Notifications</a>
                        </div>
                    </li>

                    {/* Admin Profile */}
                    <li className="nav-item dropdown no-arrow">
                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">{fullname}</span>
                            <img style={{ width: 25, height: 25 }} className="img-profile rounded-circle" src={userData && (`${backendUrl}/uploads/${userData && userData.image}`)} />
                        </a>
                        {/* Dropdown - User Information */}
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                            <a className="dropdown-item" data-toggle="modal" data-target="#profile" style={{ cursor: 'pointer' }}><i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                                Profile
                            </a>
                            <a className="dropdown-item" data-toggle="modal" data-target="#change_password" style={{ cursor: 'pointer' }}><i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
                                Change Password
                            </a>
                            <a className="dropdown-item" data-toggle="modal" data-target="#logout" style={{ cursor: 'pointer' }}>
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                                Logout
                            </a>
                        </div>
                    </li>
                    {/* End of Profile */}
                </ul>
            </nav>

            {/* Profile */}
            <div className="modal fade" id="profile" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{ width: 400 }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        {/* Profile Image */}
                        <div className="card card-primary card-outline">
                            <div className="card-body box-profile">
                                <div className="text-center">
                                    <img style={{ width: 100, height: 100 }} className="profile-user-img img-fluid img-circle" src={`${backendUrl}/uploads/${userData && userData.image}`} alt="User profile picture" />
                                </div>
                                <h3 className="profile-username text-center">{fullname}</h3>
                                <p className="text-muted text-center">Admin</p>
                                <hr />
                                <div className="form-group">
                                    <label htmlFor>Email</label>
                                    <input type="email" className="form-control" placeholder='Email' value={email} id="yourEmail" readOnly />
                                </div>
                                <div className="form-group">
                                    <label htmlFor>Phone Number</label>
                                    <input type="text" className="form-control" id="cellphoneNumber" readOnly value={phoneNumber} />
                                </div>
                                <div className="form-group" style={{ textAlign: 'center' }}>
                                    <button id="savebutton" className="btn btn-primary" style={{ width: '100%' }} data-toggle="modal" data-target="#editProfile">Edit Profile</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit Profile */}
            <div className="modal fade" id="editProfile" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{ width: 400 }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        {/* Profile Image */}
                        <div className="card card-primary card-outline">
                            <div className="card-body box-profile">

                                {isResponse && (
                                    <div style={{ textAlign: 'center', color: success ? 'lightblue' : 'white', backgroundColor: success ? 'rgb(94, 94, 159)' : 'rgb(219, 164, 164)', padding: '5px', borderRadius: '5px' }}>
                                        <span>{responseMessage}</span>
                                    </div>
                                )}

                                {/* Loading screen */}
                                <div class="modal-pop-up-loading" style={{ display: isLoading ? 'block' : 'none' }}>
                                    <div class="modal-pop-up-loading-spiner"></div>
                                    <p>Loading...</p>
                                </div>

                                <form onSubmit={editProfile}>
                                    <input type="hidden" />
                                    <div className="form-group">
                                        <label htmlFor>Profile Picture</label>
                                        <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor>Full Name</label>
                                        <input type="text" className="form-control" name="fullname" value={fullname} onChange={(e) => setFullName(e.currentTarget.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor>Email</label>
                                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor>Phone Number</label>
                                        <input type="number" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                                    </div>
                                    <div className="form-group" style={{ textAlign: 'center' }}>
                                        <button id="savebutton" name="save" className="btn btn-primary" style={{ width: '100%' }}>Save Profile</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="modal fade" id="change_password" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Change Password</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                        </div>
                        <div className="modal-body">

                            {isResponse && (
                                <div style={{ textAlign: 'center', color: success ? 'lightblue' : 'white', backgroundColor: success ? 'rgb(94, 94, 159)' : 'rgb(219, 164, 164)', padding: '5px', borderRadius: '5px' }}>
                                    <span>{responseMessage}</span>
                                </div>
                            )}

                            {/* Loading screen */}
                            <div class="modal-pop-up-loading" style={{ display: isLoading ? 'block' : 'none' }}>
                                <div class="modal-pop-up-loading-spiner"></div>
                                <p>Loading...</p>
                            </div>

                            <form onSubmit={changePassword}>

                                <div className="form-group">
                                    <span>Current Password</span>
                                    <input className="form-control" type="password" value={currentPassword} onChange={(e) => setOldPass(e.target.value)} placeholder="Current Password" required />
                                    <i className="fa fa-eye-slash" style={{ fontSize: 20, cursor: 'pointer', position: 'absolute', marginTop: '-29px', marginLeft: 'calc(100% - 75px)' }} />
                                </div>
                                <div className="form-group">
                                    <span>New Password</span>
                                    <input className="form-control" type="password" value={newPassword} onChange={(e) => setNewPass(e.target.value)} placeholder="New Password" required />
                                    <i className="fa fa-eye-slash" style={{ fontSize: 20, cursor: 'pointer', position: 'absolute', marginTop: '-29px', marginLeft: 'calc(100% - 75px)' }} />
                                </div>
                                <div className="form-group">
                                    <span>Confirm Password</span>
                                    <input className="form-control" type="password" value={confirmPassword} onChange={(e) => setConPass(e.target.value)} placeholder="Confirm Password" required />
                                    <i className="fa fa-eye-slash" style={{ fontSize: 20, cursor: 'pointer', position: 'absolute', marginTop: '-29px', marginLeft: 'calc(100% - 75px)' }} onclick="conChange()" id="conEye" />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" name="cancel">Cancel</button>
                                    <button className="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout */}
            <div className="modal fade" id="logout" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document" style={{ top: '30%' }}>
                    <div className="modal-content">
                        <div className="modal-body">
                            <div>
                                <h5>Confirmation</h5>
                            </div>
                            <hr />
                            <div>
                                <p>Are you sure you wan't to logout?</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <button className='btn btn-danger' style={{ marginRight: '10px' }} data-dismiss="modal" name="cancel">Cancel</button>
                                <button className='btn btn-primary' data-dismiss="modal" onClick={(e) => { localStorage.removeItem('token'); navigate('/'); }} >Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===============================================  ALL NOTIFICATION  ========================================================================================== */}

            <div className="modal fade" id="allNotification" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{hasUnseen} Notifications</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        {notificationReverse.map((item, index) => (
                            <div className='dropdown-item other' style={{ fontSize: '12px', backgroundColor: item.seen === 0 ? 'rgb(199, 200, 211)' : '', cursor: 'pointer' }}>
                                <i className="fas fa-bell mr-2" style={{ position: 'absolute', fontSize: '15px', marginTop: '5px', marginLeft: '-5px', color: 'rgba(80, 66, 66, 0.935)' }} /><p style={{ marginLeft: '22px' }}>{item.content} </p>
                                <p style={{ marginLeft: 22, fontSize: 10, color: 'rgb(105, 96, 96)' }}>{item.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header

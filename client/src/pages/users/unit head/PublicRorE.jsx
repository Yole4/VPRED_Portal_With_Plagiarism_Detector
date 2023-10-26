import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import BackEndUrl from '../../backend URL/BackEndUrl';

function PublicRorE() {
    // get backend URL
    const backendUrl = BackEndUrl();

    const navigate = useNavigate();
    const location = useLocation();

    // check if the user is already login or not
    const token = localStorage.getItem('token');
    const [userData, setUserData] = useState('');

    useEffect(() => {
        async function fetchProtected() {
            try {
                const response = await axios.get(`${backendUrl}/protected`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {

                    // get the id
                    const userId = response.data.user.id;

                    try {
                        // fetch data
                        await axios.get(`${backendUrl}/api/getData/${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }).then((response) => {
                            if (response.status === 200) {
                                // set data on state
                                setUserData(response.data.results[0]);

                                const check = response.data.results[0].rank;

                                // go to author side
                                if (check === "Author") {
                                    if (location.pathname === "/author-myWorks") {
                                        navigate('/author-myWorks');
                                    }
                                    else if (location.pathname === "/author-public-works") {
                                        navigate('/author-public-works');
                                    }
                                    else {
                                        navigate('/author-homePage');
                                    }
                                }

                                // go to chairperson side
                                else if (check === "Chairperson") {
                                    if (location.pathname === "/chairperson-author-account") {
                                        navigate('/chairperson-author-account');
                                    }
                                    else if (location.pathname === "/chairperson-public-RorE") {
                                        navigate('/chairperson-public-RorE');
                                    }
                                    else if (location.pathname === "/chairperson-RorE-Works") {
                                        navigate('/chairperson-RorE-Works');
                                    }
                                    else {
                                        navigate('/chairperson-homePage');
                                    }
                                }

                                // go to unit head side
                                else if (check === "Unit Head") {
                                    if (location.pathname === "/unitHead-author-account") {
                                        navigate('/unitHead-author-account');
                                    }
                                    else if (location.pathname === "/unitHead-chairperson-account") {
                                        navigate('/unitHead-chairperson-account');
                                    }
                                    else if (location.pathname === "/unitHead-public-RorE") {
                                        navigate('/unitHead-public-RorE');
                                    }
                                    else if (location.pathname === "/unitHead-RorE-Works") {
                                        navigate('/unitHead-RorE-Works');
                                    }
                                    else {
                                        navigate('/unitHead-homePage');
                                    }
                                }

                                // go to admin side
                                else if (check === "Admin") {
                                    if (location.pathname === '/Admin-chairperson') {
                                        navigate('/Admin-chairperson');
                                    }
                                    else if (location.pathname === '/Admin-unit-head') {
                                        navigate('/Admin-unit-head');
                                    }
                                    else if (location.pathname === '/admin-author') {
                                        navigate('/Admin-author');
                                    }
                                    else if (location.pathname === '/Admin-all-RorE') {
                                        navigate('/Admin-all-RorE');
                                    }
                                    else if (location.pathname === '/Admin-public') {
                                        navigate('/Admin-public');
                                    }
                                }

                                // go to login page
                                else {
                                    navigate('/');
                                }

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

    useEffect(() => {
        document.title = "Research & Extension Programs";
    });
    // end of checking data if already login

    // #################################################################################  GET ALL PUBLICIZE RESEARCH OR EXTENSION   ############################################################################
    const [publicData, setPublicData] = useState([]);
    const [searchList, setSearchList] = useState('');
    const [testingLoading, setTestingLoading] = useState(true);

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const response = await axios.get(`${backendUrl}/fetch/public-data`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setPublicData(response.data.results);
                    setTestingLoading(false);
                }
            } catch (error) {
                setTestingLoading(false);
                if (error.response && error.response.status === 401) {
                    setPublicData(error.response.data.message.results);
                } else {
                    console.log("Error: ", error);
                }
            }
        }
        fetchPublicData();
    }, []);

    // on search on table
    const filteredList = publicData.filter(item =>
        item.status.toLowerCase().includes(searchList.toLocaleLowerCase()) ||
        item.RorE.toLowerCase().includes(searchList.toLowerCase()) ||
        item.campus.toLowerCase().includes(searchList.toLowerCase()) ||
        item.research.toLowerCase().includes(searchList.toLowerCase()) ||
        item.college.toLowerCase().includes(searchList.toLowerCase())
    );

    // ##################################################################   DOWNLOAD RESEARCH OR EXTENSION DOCUMENT REQUEST API ##############################################################
    // download button
    const downloadDocument = async (item) => {
        // const downloadId = item.id;
        const downloadDocument = item.file_name;
        const requestId = { downloadDocument };

        try {
            const response = await axios.post(`${backendUrl}/download/RorE/document`, requestId, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });

            const blobUrl = URL.createObjectURL(response.data);

            const anchor = document.createElement('a');
            anchor.href = blobUrl;
            // check the extension

            anchor.download = downloadDocument.split('_+_').pop();
            anchor.click();

            URL.revokeObjectURL(blobUrl);


        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log(error.response.data.message);
            } else {
                console.log('Error: ', error);
            }
        }
    }

    return (
        <div>

            <div className="content-wrapper" >
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                {/* List of Public Research or Extension */}
                <div className="card shadow mb-4">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary"><span style={{ fontSize: 20 }}>Research &amp; Extension Programs</span>
                        </h6>
                    </div>
                    {/* ============================================================================================================================================= */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    {/* <div class="card-tools"> */}
                                    <div>
                                        <div className="input-group input-group-sm" style={{ width: 330, marginLeft: '-15px' }}>
                                            <input type="text" style={{ marginLeft: 10 }} className="form-control float-right" value={searchList} onChange={(e) => setSearchList(e.target.value)} placeholder="Search From The Table..." />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-default"><i className="fas fa-search" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <style dangerouslySetInnerHTML={{ __html: "\n                table {\n                  width: 100%;\n                  border-collapse: collapse;\n                  border-spacing: 0;\n                  margin-bottom: 1em;\n                }\n                th{\n                  background-color:lightgreen;\n                }\n                .hover:hover{\n                  background-color:rgb(187, 187, 222);\n                }\n                .exist{\n                  display: none;\n                }\n                th, td {\n                  text-align: left;\n                  padding: 0.5em;\n                  border-bottom: 1px solid #ddd;\n                }\n                tr:nth-child(odd) {\n                  background-color: white;\n                }\n                tr:nth-child(even) {\n                  background-color: #ddd;\n                }\n                @media screen and (max-width: 767px) {\n                  .s{\n                      display: none;\n                  }\n                  .exist{\n                    display:block;\n                    background-color: white;\n                    padding: 20px;\n                  }\n                  th, td {\n                    display: block;\n                    width: 100%;\n                  }\n                  th:before {\n                    content: attr(data-title);\n                    float: left;\n                    font-weight: bold;\n                  }\n                  td:before {\n                    content: attr(data-title) \" \";\n                    float: left;\n                    font-weight: bold;\n            \n                  }\n                }\n              " }} />
                                <div className="card-body table-responsive p-0" style={{ height: 500 }}>
                                    <table id="my-table" style={{ fontSize: 13 }}>
                                        <thead>
                                            <tr>
                                                <th className="s" />
                                                <th className="s">Title</th>
                                                <th className="s">Authors</th>
                                                <th className="s">Status</th>
                                                <th className="s">Research/Extension</th>
                                                <th className="s">Campus</th>
                                                <th className="s">College</th>
                                                <th className="s">Date/Time Added</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ display: 'visible' }} id="all_id">

                                            {filteredList.length === 0 ? (
                                                <tr>
                                                    <td></td><td>No Result Found!</td>
                                                </tr>
                                            ) : (
                                                filteredList.map(item => (
                                                    <tr className="hover">
                                                        <td>
                                                            <form action method="post">
                                                                <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link dropdown-toggle" />
                                                                <ul aria-labelledby="dropdownSubMenu1" className="dropdown-menu border-0 shadow">

                                                                    <li><a href="#" className="dropdown-item" onClick={() => downloadDocument(item)}>Download Document</a></li>
                                                                </ul>
                                                            </form>
                                                        </td>
                                                        <td data-title="Title: ">{item.research}</td>
                                                        <td data-title="Authors: ">not yet fix</td>
                                                        <td data-title="Status: ">{item.status}</td>
                                                        <td data-title="Research/Extension: ">{item.RorE}</td>
                                                        <td data-title="Campus: ">{item.campus}</td>
                                                        <td data-title="College: ">{item.college}</td>
                                                        <td data-title="Date Added: ">{item.date}</td>
                                                        <td className="exist" />
                                                    </tr>
                                                ))
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* fetching data screen */}
            {isLoading && (
                <div className="popup">
                    <div className="modal-pop-up-loading">
                        <div className="modal-pop-up-loading-spiner"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PublicRorE

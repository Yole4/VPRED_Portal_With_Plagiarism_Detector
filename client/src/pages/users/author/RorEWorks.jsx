import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import BackEndUrl from '../../backend URL/BackEndUrl';

function RorEWorks() {
    // get backend URL
    const backendUrl = BackEndUrl();

    const navigate = useNavigate();
    const location = useLocation();

    // check if the user is already login or not
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [userData, setUserData] = useState('');
    const [mainUserId, setMainUserId] = useState('');
    // convert to string
    const user_id = mainUserId.toString();

    // initialize variable to identity when to reload
    const [reloadTester, setReloadTest] = useState(true);

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
                                setMainUserId(response.data.results[0].data_id);
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
            finally {
                setLoading(false);
            }
        }
        fetchProtected();
    }, []);

    if (loading) {
        <div>Loading...</div>
    }

    useEffect(() => {
        const fetchRorE = userData.RorE;
        document.title = `${fetchRorE} Works`;
    });
    // end of checking data if already login

    // #####################################################################    SET PUBLIC OR RETRIEVE PUBLIC   #############################################################################
    const [isPublic, setIsPublic] = useState('');
    const [setId, setSetId] = useState('');
    const [myResearch, setMyResearch] = useState('');
    // display loading
    const [isLoading, setIsLoading] = useState(false);

    const setPublic = async (item) => {
        setIsPublic(item.publicize);
        setSetId(item.id);
        setMyResearch(item.research);
    }
    // set to public or private
    const confirmPublic = async (e) => {
        setIsLoading(true);
        const publicId = setId.toString();
        const publicStatus = isPublic.toString();
        const publicResearch = myResearch.toString();

        const requestSetData = { publicId, publicStatus, publicResearch };
        try {
            const response = await axios.post(`${backendUrl}/set/RorE`, requestSetData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setReloadTest(reloadTester ? false : true);
                setIsLoading(false);
                alert(response.data.message);

            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log(error.response.data.message);
            } else {
                console.log("Error: ", error);
            }
        }
    }

    // ########################################################################     DOWNLOAD DOCUMENT   ################################################################################
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

    // ##############################################################   REQUEST TO GET AUTHOR WORKS ############################################################################
    const [authorWorks, setAuthorWorks] = useState([]);
    const [searchList, setSearchList] = useState('');
    const [testingLoading, setTestingLoading] = useState(true);

    const intId = Number(mainUserId);

    useEffect(() => {
        const fetchAllAuthorAccount = async () => {
            try {
                const response = await axios.get(`${backendUrl}/fetch/author-works/${intId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setAuthorWorks(response.data.results);
                    setTestingLoading(false);
                }
            } catch (error) {
                setTestingLoading(false);
                if (error.response && error.response.status === 401) {
                    console.log(error.response.data.message);
                }
                else {
                    console.log("Error: ", error);
                }
            }
        }
        fetchAllAuthorAccount();

    }, [reloadTester, intId]);

    // on search on table
    const filteredList = authorWorks.filter(item =>
        item.research.toLowerCase().includes(searchList.toLowerCase()) ||
        item.added_by.toLowerCase().includes(searchList.toLocaleLowerCase()) ||
        item.status.toLowerCase().includes(searchList.toLowerCase())
    );

    // ###################################################################  DOWNLOAD PLAGIARISM RESULT REQUEST  #################################################################################
    const [downloadChecker, setDownloadChecker] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const [myFileName, setMyFileName] = useState('');

    const downloadResult = async (item) => {

        const data_id = (item.id).toString();
        const gc = (item.group_code);
        const research = (item.research).toString();
        setMyFileName(item.file_name);

        const requestResult = { data_id, gc, research };

        try {
            const response = await axios.post(`${backendUrl}/api/download/plagiarism-result`, requestResult, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = URL.createObjectURL(blob);
            setFileUrl(url);
            setDownloadChecker(true);
        } catch (error) {
            console.error('Error generating DOCX:', error);
        }
    };

    if (downloadChecker) {
        const fileName = myFileName.split('_+_').pop();
        const file = fileName.split('.')[0];

        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = file;
        a.click();
        setDownloadChecker(false);
    }

    return (
        <div>
            <div className="content-wrapper" style={{ pointerEvents: isLoading ? 'none' : '' }}>
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

                {/* set to public or set to private */}
                <div className="modal fade" id="setPublic" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document" style={{ top: '30%' }}>
                        <div className="modal-content">
                            <div className="modal-body">
                                <div>
                                    <h5>Confirmation</h5>
                                </div>
                                <hr />
                                <div>
                                    <p>Are you sure you wan't set {myResearch} to {isPublic === "not" ? 'public?' : 'private?'}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <button className='btn btn-danger' style={{ marginRight: '10px' }} data-dismiss="modal" name="cancel">No</button>
                                    <button className='btn btn-primary' data-dismiss="modal" onClick={confirmPublic}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* List of Author Works */}
                <div className="card shadow mb-4" id="data1">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary"><span style={{ fontSize: 20 }}>My Works</span>
                        </h6>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    {/* <div class="card-tools"> */}
                                    <div>
                                        <div className="input-group input-group-sm" style={{ width: 330, marginLeft: '-15px' }}>
                                            <input type="text" name="table_search" style={{ marginLeft: 10 }} className="form-control float-right" id="search-input" placeholder="Search From The Table" />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-default"><i className="fas fa-search" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <style dangerouslySetInnerHTML={{ __html: "\n                table {\n                  width: 100%;\n                  border-collapse: collapse;\n                  border-spacing: 0;\n                  margin-bottom: 1em;\n                }\n                th{\n                  background-color:lightgreen;\n                }\n                .hover:hover{\n                  background-color:rgb(187, 187, 222);\n                }\n                .exist{\n                  display: none;\n                }\n                th, td {\n                  text-align: left;\n                  padding: 0.5em;\n                  border-bottom: 1px solid #ddd;\n                }\n                tr:nth-child(odd) {\n                  background-color: white;\n                }\n                tr:nth-child(even) {\n                  background-color: #ddd;\n                }\n                @media screen and (max-width: 767px) {\n                  .s{\n                      display: none;\n                  }\n                  .exist{\n                    display:block;\n                    background-color: white;\n                    padding: 20px;\n                  }\n                  th, td {\n                    display: block;\n                    width: 100%;\n                  }\n                  th:before {\n                    content: attr(data-title);\n                    float: left;\n                    font-weight: bold;\n                  }\n                  td:before {\n                    content: attr(data-title) \" \";\n                    float: left;\n                    font-weight: bold;\n            \n                  }\n                }\n              " }} />
                                <div className="card-body table-responsive p-0" style={{ height: 450 }}>
                                    <table id="my-table">
                                        <thead>
                                            <tr>
                                                <th className="s" />
                                                <th className="s">Title</th>
                                                <th className="s">Authors</th>
                                                <th className="s">Status</th>
                                                <th className="s" style={{ textAlign: 'center' }}>Proposed Date</th>
                                                <th className="s" style={{ textAlign: 'center' }}>Started Date</th>
                                                <th className="s" style={{ textAlign: 'center' }}>Completed Date</th>
                                                <th className="s" style={{ textAlign: 'center' }}>Added By</th>
                                                <th className="s">Date Added</th>
                                                <th className="s">Originality</th>
                                                <th className="s">Similarity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredList.map(item => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <form action="#" method="post">
                                                            <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link dropdown-toggle" />
                                                            <ul aria-labelledby="dropdownSubMenu1" className="dropdown-menu border-0 shadow">
                                                                <li><a href="#" className="dropdown-item" style={{ display: item.group_code === "" ? 'none' : 'block' }} onClick={() => downloadResult(item)}>Download Plagiarism Result</a></li>
                                                                <li><a href="#" onClick={() => downloadDocument(item)} className="dropdown-item">Download Document</a></li>
                                                                {/* <li>
                                                                    <input type="submit" className="dropdown-item" value="History" name="history" />
                                                                </li> */}
                                                                <li>
                                                                    <a href="#" onClick={() => setPublic(item)} data-toggle="modal" data-target="#setPublic" className="dropdown-item">{item.publicize === "not" ? 'Set to public' : 'Set to private'}</a>
                                                                </li>
                                                            </ul></form>
                                                    </td>
                                                    <td data-title="Title: ">{item.research}</td>
                                                    <td data-title="Authors: "></td>
                                                    <td data-title="Status: ">{item.status}</td>
                                                    <td data-title="Proposed Date: ">{item.proposed}</td>
                                                    <td data-title="Started Date: ">{item.started}</td>
                                                    <td data-title="Completed Date: ">{item.completed}</td>
                                                    <td data-title="Added By: ">{item.added_by}</td>
                                                    <td data-title="Date Added: ">{item.date}</td>

                                                    {item.originality === 0 && item.similarity === 0 ? (
                                                        <td data-title="Originality: ">N/A</td>
                                                    ) : (
                                                        <td style={{ color: 'blue' }} data-title="Originality: ">{item.originality}%</td>
                                                    )}
                                                    {item.originality === 0 && item.similarity === 0 ? (
                                                        <td data-title="Originality: ">N/A</td>
                                                    ) : (
                                                        <td style={{ color: 'red' }} data-title="Originality: ">{item.similarity}%</td>
                                                    )}

                                                    <td className="exist" />
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* fetching data screen */}
            <div class="modal-pop-up-loading" style={{ display: testingLoading ? 'block' : 'none' }}>
                <div class="modal-pop-up-loading-spiner"></div>
                <p>fetching data...</p>
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

export default RorEWorks

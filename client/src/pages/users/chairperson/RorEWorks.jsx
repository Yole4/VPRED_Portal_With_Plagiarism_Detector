import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import BackEndUrl from '../../backend URL/BackEndUrl';
import '../../admin side/CSS/ResultDesign.css';

function RorEWorks() {
    // get backend URL
    const backendUrl = BackEndUrl();

    const navigate = useNavigate();
    const location = useLocation();

    // check if the user is already login or not
    const token = localStorage.getItem('token');
    const [userData, setUserData] = useState('');
    const [RorE, setRorE] = useState('');
    const [campus, setCampus] = useState('');
    const [userRank, setUserRank] = useState('');
    const [mainUserId, setMainUserId] = useState('');
    const [college, setCollege] = useState('');
    // convert to string
    const user_id = mainUserId.toString();

    // initialize variable to identity when to reload
    const [reloadTester, setReloadTest] = useState(true);

    // display error or success
    const [isResponse, setIsResponse] = useState(false);
    const [success, setSuccess] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                                setMainUserId(response.data.results[0].id);
                                setRorE(response.data.results[0].RorE);
                                setCampus(response.data.results[0].campus);
                                setUserRank(response.data.results[0].rank);
                                setCollege(response.data.results[0].college);
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
        const fetchRorE = userData.RorE;
        document.title = `${fetchRorE} Works`;
    });
    // end of checking data if already login

    // #########################################################    ADDING DATA REQUEST ##########################################################################################
    const [research, setResearch] = useState('');
    const [file, setFile] = useState('');
    const [status, setStatus] = useState('');
    const [proposed, setProposed] = useState('');
    const [started, setStarted] = useState('');
    const [completed, setCompleted] = useState('');

    // input number of authorsAndEmails
    const [numberInput, setNumberInput] = useState('');
    const [authorsAndEmails, setAuthorsAndEmails] = useState([]);

    const handleNumberInputChange = (event) => {
        const inputValue = event.target.value;
        setNumberInput(inputValue);

        // Clear previous input pairs when the number is changed
        setAuthorsAndEmails([]);
    };

    const handleTextInputChange = (index, inputType, event) => {
        const newInputPairs = [...authorsAndEmails];
        newInputPairs[index] = { ...newInputPairs[index], [inputType]: event.target.value };
        setAuthorsAndEmails(newInputPairs);
    };

    const renderInputPairs = () => {
        const pairs = [];
        for (let i = 0; i < parseInt(numberInput, 10); i++) {
            pairs.push(
                <div key={i} style={{ marginBottom: '20px' }}>
                    <input required
                        className='form-control'
                        type="text"
                        value={authorsAndEmails[i]?.author || ''}
                        placeholder={`${i + 1}. Author Full Name`}
                        onChange={(event) => handleTextInputChange(i, 'author', event)}
                    />
                    <input required
                        className='form-control'
                        type="email"
                        value={authorsAndEmails[i]?.email || ''}
                        placeholder={`${i + 1}. Author Email`}
                        onChange={(event) => handleTextInputChange(i, 'email', event)}
                    />
                </div>
            );
        }
        return pairs;
    };

    // request add API
    const addData = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const inputData = authorsAndEmails.filter(pair => pair.author && pair.email);
            if (inputData.length > 0) {
                try {
                    const requestAddData = new FormData();
                    requestAddData.append('RorE', RorE);
                    requestAddData.append('campus', campus);
                    requestAddData.append('college', college);
                    requestAddData.append('research', research);
                    requestAddData.append('file', file);
                    requestAddData.append('status', status);
                    requestAddData.append('proposed', proposed);
                    requestAddData.append('started', started);
                    requestAddData.append('completed', completed);
                    requestAddData.append('user_id', user_id);
                    requestAddData.append('userRank', userRank);
                    requestAddData.append('inputData', JSON.stringify(inputData));

                    const response = await axios.post(`${backendUrl}/add-data`, requestAddData, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 200) {
                        setReloadTest(reloadTester ? false : true);
                        setResponseMessage(response.data.message);
                        setIsLoading(false);
                        setIsResponse(true);
                        setSuccess(true);
                        setResearch('');
                        setFile(null);
                        setNumberInput(0);
                        setStatus('');
                        setProposed('');
                        setStarted('');
                        setCompleted('');

                        setTimeout(() => {
                            setIsResponse(false);
                        }, 7000);

                    }

                } catch (error) {
                    setIsLoading(false);
                    if (error.response && error.response.status === 401) {
                        setResponseMessage(error.response.data.message);
                        setIsResponse(true);
                        setSuccess(false);
                        setTimeout(() => {
                            setIsResponse(false);
                        }, 7000);
                    } else {
                        console.log('Error: ', error);
                    }
                }

            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error adding data:', error);
        }
    }

    // ############################################################ UPDATE DATA ADDED BY EACH UNIT HEAD REQUEST  ##########################################################################
    const [updateResearch, setUpdateResearch] = useState('');
    const [updateFile, setUpdateFile] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');
    const [updateProposed, setUpdateProposed] = useState('');
    const [updateStarted, setUpdateStarted] = useState('');
    const [updateCompleted, setUpdateCompleted] = useState('');
    const [updateId, setUpdateId] = useState('');

    // for response display
    const [isUpdateResponse, setIsUpdateResponse] = useState(false);
    const [updateSuccess, setUpdateSucess] = useState(false);
    const [updateResponseMessage, setUpdateResponseMessage] = useState('');

    // authors
    const [fetchedAuthors, setFetchedAuthors] = useState([]);
    // initialize data if author is empty
    const [isEmpty, setIsEmpty] = useState('');

    // edit button side
    const updateDataBtn = async (item) => {
        // e.preventDefault();

        setUpdateResearch(item.research);
        setUpdateStatus(item.status);
        setUpdateProposed(item.proposed);
        setUpdateStarted(item.started);
        setUpdateCompleted(item.completed);
        setUpdateId(item.id);

        const id = item.id;
        const updateIdString = id.toString();
        try {
            const response = await axios.post(`${backendUrl}/fetch/each-author`, { updateIdString }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                // do something here
                setFetchedAuthors(response.data.results);
                setIsEmpty(false);

            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log(error.response.data.message);
                setIsEmpty(true);
                setFetchedAuthors([]);
            } else {
                console.log('Error: ', error);
            }
        }
    }

    // update data request
    const updateData = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const updateRorEString = RorE.toString();
        const updateCampusString = campus.toString();
        const updateCollegeString = college.toString();
        const updateResearchString = updateResearch.toString();
        const updateStatusString = updateStatus.toString();
        const updateProposedString = updateProposed.toString();
        const updateStartedString = updateStarted.toString();
        const updateCompletedString = updateCompleted.toString();
        const updateIdString = updateId.toString();

        const updateDataRequest = new FormData();
        updateDataRequest.append('file', updateFile);
        updateDataRequest.append('user_id', user_id);
        updateDataRequest.append('completed', updateCompletedString);
        updateDataRequest.append('proposed', updateProposedString);
        updateDataRequest.append('started', updateStartedString);
        updateDataRequest.append('college', updateCollegeString);
        updateDataRequest.append('research', updateResearchString);
        updateDataRequest.append('status', updateStatusString);
        updateDataRequest.append('RorE', updateRorEString);
        updateDataRequest.append('campus', updateCampusString);
        updateDataRequest.append('id', updateIdString);
        updateDataRequest.append('userRank', userRank);

        try {
            const response = await axios.post(`${backendUrl}/update/data`, updateDataRequest, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setReloadTest(reloadTester ? false : true);
                setUpdateResponseMessage(response.data.message);
                setIsLoading(false);
                setIsUpdateResponse(true);
                setUpdateSucess(true);

                setTimeout(() => {
                    setIsUpdateResponse(false);
                }, 7000);

            }
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.status === 401) {
                setUpdateResponseMessage(error.response.data.message);
                setUpdateSucess(false);
                setIsUpdateResponse(true);

                setTimeout(() => {
                    setIsUpdateResponse(false);
                }, 7000);
            } else {
                console.log("Error: ", error);
            }
        }
    }

    // ###############################################################  DELETE RESEARCH OR EXTENSION DATA REQUEST  ############################################################################################
    const [deleteId, setDeleteId] = useState('');
    const [deleteVisible, setDeleteVisible] = useState(false);

    const deleteData = async (item) => {
        setDeleteId(item.id);
        setDeleteVisible(true);
    }
    const btnDelete = async () => {
        setIsLoading(true);
        // setDeleteVisible(false);

        const deleteIdString = deleteId.toString();

        const requestDeleteId = { deleteIdString };

        try {
            const response = await axios.post(`${backendUrl}/delete/data`, requestDeleteId, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setReloadTest(reloadTester ? false : true);
                setIsLoading(false);
                setDeleteVisible(false);

            }
        } catch (error) {
            setDeleteVisible(false);
            setIsLoading(false);
            if (error.response && error.response.status === 401) {
                console.log(error.response.data.message);
            } else {
                console.log("Error: ", error);
            }
        }
    }

    const cancelDelete = async () => {
        setDeleteVisible(false);
    }

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

    // #############################################################################    SCAN DOCUMENT SIDE  ################################################################################
    const [scanLoading, setScanLoading] = useState(false);
    const [plagiarizeRespond, setPlagiarizeRespond] = useState('');
    const [isScanDone, setIsScanDone] = useState(false);
    const [originality, setOriginality] = useState(0);
    const [similarity, setSimilarity] = useState(0);

    const scanDocument = async (item) => {
        setScanLoading(true);
        const filename = (item.file_name).toString();
        const id = (item.id).toString();
        const requestFilename = { filename, id };

        try {
            const response = await axios.post(`${backendUrl}/plagiarize/document`, requestFilename, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setReloadTest(reloadTester ? false : true);
                setPlagiarizeRespond(response.data.combinedContentAndLink);
                setOriginality(response.data.originality);
                setSimilarity(response.data.similarity);

                setScanLoading(false);
                setIsScanDone(true);

            }
        } catch (error) {
            setScanLoading(false);
            if (error.response && error.response.status === 401) {
                console.log(error.response.data.message);
            } else {
                console.log('Error: ', error);
            }
        }
    }

    // #############################################################    PLAGIARISM RESULT SIDE  DESIGN CONDITION  ######################################################################################
    useEffect(() => {
        let number = document.getElementById("number");
        let counter = -1;
        let result = similarity; // Set your desired result value

        let numberInterval = setInterval(() => {
            if (counter === result) {
                clearInterval(numberInterval);
            } else {
                counter += 1;
                number.innerHTML = counter + "%";
            }
        }, 25);

        let dif = document.getElementById("dif");
        let count = -1;
        let orig = originality; // Set your desired orig value

        let difInterval = setInterval(() => {
            if (count === orig) {
                clearInterval(difInterval);
            } else {
                count += 1;
                dif.innerHTML = count + "%";
            }
        }, 20);

        return () => {
            clearInterval(numberInterval);
            clearInterval(difInterval);
        };
    }, [originality, similarity]);

    const [isView, setIsView] = useState();

    // ###############################################################  FETCH ALL DATA ADDED   ###################################################################################
    const [listOfRorE, setListUnitHead] = useState([]);
    const [searchList, setSearchList] = useState('');
    const [testingLoading, setTestingLoading] = useState(true);

    const userId = userData && userData.id;

    useEffect(() => {
        const fetchAllRorE = async () => {
            try {
                const userId = userData && userData.id;
                const response = await axios.get(`${backendUrl}/chairperson/fetch/all-RorE/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setListUnitHead(response.data.results);
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
        fetchAllRorE();
    }, [reloadTester, userId]);

    // on search on table
    const filteredList = listOfRorE.filter(item =>
        item.authors.toLowerCase().includes(searchList.toLowerCase()) ||
        item.status.toLowerCase().includes(searchList.toLocaleLowerCase()) ||
        item.RorE.toLowerCase().includes(searchList.toLowerCase()) ||
        item.campus.toLowerCase().includes(searchList.toLowerCase()) ||
        item.research.toLowerCase().includes(searchList.toLowerCase()) ||
        item.added_by.toLowerCase().includes(searchList.toLowerCase())
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
            <div className="content-wrapper" style={{ pointerEvents: deleteVisible || isLoading || scanLoading || isScanDone ? 'none' : '' }}>
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

                {/* Edit Data */}
                <div className="modal fade" id="editData" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ pointerEvents: isLoading ? 'none' : '', }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Edit {userData && userData.RorE}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <form onSubmit={updateData}>
                                <div className="modal-body">

                                    {isUpdateResponse && (
                                        <div style={{ textAlign: 'center', color: updateSuccess ? 'lightblue' : 'white', backgroundColor: updateSuccess ? 'rgb(94, 94, 159)' : 'rgb(219, 164, 164)', padding: '5px', borderRadius: '5px' }}>
                                            <span>{updateResponseMessage}</span>
                                        </div>
                                    )}

                                    {/* Loading screen */}
                                    <div class="modal-pop-up-loading" style={{ display: isLoading ? 'block' : 'none' }}>
                                        <div class="modal-pop-up-loading-spiner"></div>
                                        <p>Loading...</p>
                                    </div>

                                    <div className="form-group">
                                        <label>Title</label>
                                        <input type="text" value={updateResearch} onChange={(e) => setUpdateResearch(e.target.value)} className="form-control" id="research2" required />
                                    </div>

                                    <div className="form-group">
                                        <label>Document</label>
                                        <input type="file" onChange={(e) => setUpdateFile(e.target.files[0])} className="form-control" />
                                    </div>

                                    <div className='form-group'>
                                        <label>Author/s</label>
                                        {isEmpty && (
                                            <div style={{ textAlign: 'center', color: 'red' }}><span>No Author</span></div>
                                        )}
                                        {fetchedAuthors.map(item => (
                                            <div key={item.id}>
                                                <input type="text" value={item.fullname} placeholder='Author' className='form-control' readOnly />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="form-group">
                                        <label>Status</label><br />
                                        <select className="form-control" value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)} required>
                                            <option value="" selected disabled>Select Status</option>
                                            <option value="Proposed" >Proposed</option>
                                            <option value="On-Going">On-Going</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ display: updateStatus === "Proposed" || updateStatus === "On-Going" || updateStatus === "Completed" ? 'block' : 'none' }}>
                                        <label>Proposed</label>
                                        <input type="date" value={updateProposed} onChange={(e) => setUpdateProposed(e.target.value)} className="form-control" />
                                    </div>
                                    <div className="form-group" style={{ display: updateStatus === "On-Going" || updateStatus === "Completed" ? 'block' : 'none' }}>
                                        <label>Started</label>
                                        <input type="date" value={updateStarted} onChange={(e) => setUpdateStarted(e.target.value)} className="form-control" />
                                    </div>
                                    <div className="form-group" style={{ display: updateStatus === "Completed" ? 'block' : 'none' }}>
                                        <label>Completed</label>
                                        <input type="date" value={updateCompleted} onChange={(e) => setUpdateCompleted(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* End of editing data */}


                {/* Adding Data */}
                <div className="modal fade" id="addadminprofile" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ pointerEvents: isLoading ? 'none' : '', }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add {userData && userData.RorE}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <form onSubmit={addData}>
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

                                    <div className="form-group">
                                        <label>Title</label>
                                        <input type="text" value={research} onChange={(e) => setResearch(e.target.value)} className="form-control" placeholder="Resesarch Title" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Document</label>
                                        <input type="file" id='fileInput' onChange={(e) => setFile(e.target.files[0])} className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Author <input type="number" value={numberInput} onChange={handleNumberInputChange} style={{ borderRadius: 5, width: '50px' }} required /></label>
                                        <div className='form-group'>
                                            {renderInputPairs()}
                                        </div>
                                    </div>


                                    <div className="form-group" style={{ marginTop: '-20px' }}>
                                        <label>Status</label><br />
                                        <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)} required>
                                            <option value="" selected disabled>Select Status</option>
                                            <option value="Proposed">Proposed</option>
                                            <option value="On-Going">On-Going</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ display: status === "Proposed" || status === "On-Going" || status === "Completed" ? 'block' : 'none' }}>
                                        <label>Proposed</label>
                                        <input type="date" value={proposed} onChange={(e) => setProposed(e.target.value)} className="form-control" />
                                    </div>
                                    <div className="form-group" style={{ display: status === "On-Going" || status === "Completed" ? 'block' : 'none' }}>
                                        <label>Started</label>
                                        <input type="date" value={started} onChange={(e) => setStarted(e.target.value)} className="form-control" />
                                    </div>
                                    <div className="form-group" style={{ display: status === "Completed" ? 'block' : 'none' }}>
                                        <label>Completed</label>
                                        <input type="date" value={completed} onChange={(e) => setCompleted(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" name="add" className="btn btn-primary">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* End of Adding Data */}


                {/* List Of Research or Extension */}
                <div className="card shadow mb-4" id="data1">
                    <div className="card-header py-3">
                        <h6 className="m-0 font-weight-bold text-primary"><span style={{ fontSize: 20 }}><span id="a1" style={{ display: 'visible', fontSize: 20 }}>Research Works </span><span id="a5" style={{ display: 'none' }}>Approved {/*?php echo " ".$myRorE." "; ?*/} Programs</span><span id="a2" style={{ display: 'none' }}>{/*?php echo $myRorE." "; ?*/} On-Going Papers</span><span id="a3" style={{ display: 'none' }}>{/*?php echo $myRorE." "; ?*/} Completed Papers</span><span id="a4" style={{ display: 'none' }}>Proposed {/*?php echo " ".$myRorE." "; ?*/} Papers</span></span>
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#addadminprofile">
                                Add Data
                            </button>
                        </h6>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    {/* <div class="card-tools"> */}
                                    <div>
                                        <div className="input-group input-group-sm" style={{ width: 330, marginLeft: '-15px' }}>
                                            <select name id="showRorE" style={{ width: 100, borderColor: '#ccc', color: 'rgb(117, 107, 107)' }} onchange="option()">
                                                <option value="all">All</option>
                                                <option value="myProposed">Proposed</option>
                                                <option value="on-going">On-Going</option>
                                                <option value="myCompleted">Completed</option>
                                                <option value="myApproved">Approved Papers</option>
                                            </select>
                                            <input type="text" value={searchList} onChange={(e) => setSearchList(e.target.value)} style={{ marginLeft: 10 }} className="form-control float-right" placeholder="Search From The Table..." />
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
                                                <th className="s" style={{ textAlign: 'center', display: 'visible' }} id="dateProposed">Proposed Date</th>
                                                <th className="s" style={{ textAlign: 'center', display: 'visible' }} id="dateStarted">Started Date</th>
                                                <th className="s" style={{ textAlign: 'center', display: 'visible' }} id="dateCompleted">Completed Date</th>
                                                <th className="s">Added By</th>
                                                <th className="s">Originality</th>
                                                <th className="s">Similarity</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ display: 'visible' }} id="all">
                                            {listOfRorE.length === 0 ? (
                                                <tr>
                                                    <td></td><td>No Data Found!</td>
                                                </tr>
                                            ) : (
                                                filteredList.map(item => (
                                                    <tr className="hover" key={item.id}>
                                                        <td>
                                                            <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link dropdown-toggle" />
                                                            <ul aria-labelledby="dropdownSubMenu1" className="dropdown-menu border-0 shadow">

                                                                <li><a href="#" className="dropdown-item" onClick={() => scanDocument(item)} >{item.isScan === "not" ? 'Scan Document' : 'Scan Document Again'}</a></li>
                                                                <li><a href="#" className="dropdown-item" style={{ display: item.group_code === "" ? 'none' : 'block' }} onClick={() => downloadResult(item)}>Download Plagiarism Result</a></li>
                                                                <li><a href="#" onClick={() => downloadDocument(item)} className="dropdown-item">Download Document</a></li>
                                                                <li>
                                                                    <button data-toggle="modal" data-target="#editData" onClick={() => updateDataBtn(item)} type='button' className="dropdown-item edit_me">Edit</button>
                                                                </li>
                                                                <li>
                                                                    <button onClick={() => deleteData(item)} className="dropdown-item">Delete</button>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                        <td data-title="Title: ">{item.research}</td>
                                                        <td data-title="Authors: ">not yet</td>
                                                        <td data-title="Status: ">{item.status}</td>
                                                        <td data-title="Proposed Date: ">{item.proposed}</td>
                                                        <td data-title="Started Date: ">{item.started}</td>
                                                        <td data-title="Completed Date: ">{item.completed}</td>
                                                        <td data-title="Added By: ">{item.added_by}</td>

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
            {/* pup-up Delete */}
            < div style={{ position: 'fixed', pointerEvents: isLoading ? 'none' : '', display: deleteVisible ? 'block' : 'none', backgroundColor: 'white', width: '500px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)', borderRadius: '8px', padding: '20px', transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }
            }>
                {/* Loading screen */}
                < div class="modal-pop-up-loading" style={{ display: isLoading ? 'block' : 'none' }}>
                    <div class="modal-pop-up-loading-spiner"></div>
                    <p>Deleting...</p>
                </div >
                <div>
                    <h5>Confirmation</h5>
                </div>
                <hr />
                <div>
                    <p>Are you sure you wan't to delete this data?</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <button className='btn btn-danger' style={{ marginRight: '10px' }} onClick={cancelDelete}>Cancel</button>
                    <button className='btn btn-primary' onClick={btnDelete}>Delete</button>
                </div>
            </div >

            {/* fetching data screen */}
            <div class="modal-pop-up-loading" style={{ display: testingLoading ? 'block' : 'none' }}>
                <div class="modal-pop-up-loading-spiner"></div>
                <p>fetching data...</p>
            </div>

            {/* Loading for plagiarism */}
            < div class="modal-pop-up-loading" style={{ display: scanLoading ? 'block' : 'none' }}>
                <div class="modal-pop-up-loading-spiner"></div>
                <p>Scanning...</p>
            </div >

            {/* result design */}
            <div style={{ display: isScanDone ? 'block' : 'none' }}>
                <div className="container" style={{ height: '90%' }}>
                    <div className="back-button" style={{ marginTop: '-100px' }} onClick={() => setIsScanDone(false)}>
                        <button className="done">Done</button>
                    </div>
                    <div className='result' style={{ position: 'absolute', marginTop: '-70%', fontSize: '32px', backgroundColor: 'white', width: '80%', textAlign: 'center', padding: '6px 20px 6px 20px', borderRadius: '10px' }}>
                        <span>Plagiarism Result</span>
                    </div>
                    <div className="back-button" style={{ marginTop: 25 }} onClick={() => setIsView(true)}>
                        <button className="done" style={{ fontSize: 20 }}>Vew Similar Sentences</button>
                    </div>
                    <div className="bar">
                        <div className="outer_similarities">
                            <div className="inner_similarities">
                                <div id="number">
                                </div>
                                <small>Similarities</small>
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                            <defs>
                                <linearGradient id="Simi_Color">
                                    <stop offset="50%" stopColor="red" />
                                    <stop offset="100%" stopColor="blue" />
                                </linearGradient>
                            </defs>
                            <circle cx={80} cy={80} r={70} strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="bar">
                        <div className="outer_differences">
                            <div className="inner_differences">
                                <div id="dif" />
                                <small>Originality</small>
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                            <defs>
                                <linearGradient id="GradientColor">
                                    <stop offset="0%" stopColor="red" />
                                    <stop offset="50%" stopColor="blue">
                                    </stop></linearGradient>
                            </defs>
                            <circle cx={80} cy={80} r={70} strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
                <div className='loading' style={{ display: isView ? 'block' : 'none' }}>
                    <div style={{ textAlign: 'center', margin: '20px 20px 20px 20px' }}>
                        <span>Plagiarized detected every sentences</span>
                    </div>
                    <div className="similar-area" style={{ textAlign: 'left', color: 'red', margin: '0 20px 20px 20px', overflowY: 'scroll', maxHeight: 430, fontSize: 20 }}>

                        {plagiarizeRespond.length > 0 ? (
                            plagiarizeRespond.map((item, index) => (
                                <div key={index}>
                                    <p key={index}>{index + 1}. {item.sentencesPlagiarized}</p><a href={item.link}>{item.link}</a><br />
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'lightblue', fontSize: '25px' }}>No similarities detected!</p>
                        )}
                    </div>
                    <div className="testHover" onClick={() => setIsView(false)}>
                        <span>Close</span>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default RorEWorks

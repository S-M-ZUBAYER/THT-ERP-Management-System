import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VersionInfo = () => {
    const [appVersion, setAppVersion] = useState('');
    const [appTestVersion, setTestAppVersion] = useState('');
    const [androidId, setAndroidId] = useState('');
    const [testAndroidId, setTestAndroidId] = useState('');
    const [releaseNotes, setReleaseNotes] = useState('');
    const [testReleaseNotes, setTestReleaseNotes] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [testDownloadUrl, setTestDownloadUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [appData, setAppData] = useState(null);
    const [appTestData, setAppTestData] = useState(null);
    const [versionMark, setVersionMark] = useState(null);
    const [testVersionMark, setTestVersionMark] = useState(null);
    const [iosAppVersion, setIosAppVersion] = useState('');
    const [iosId, setIosId] = useState('');
    const [iosReleaseNotes, setIosReleaseNotes] = useState('');
    const [iosDownloadUrl, setIosDownloadUrl] = useState('');
    const [iosAppData, setIosAppData] = useState(null);
    const [iosVersionMark, setIosVersionMark] = useState(null);
    const [iosLoading, setIosLoading] = useState(false);

    const [chineseAppVersion, setChineseAppVersion] = useState('');
    const [chineseAndroidId, setChineseAndroidId] = useState('');
    const [chineseReleaseNotes, setChineseReleaseNotes] = useState('');
    const [chineseDownloadUrl, setChineseDownloadUrl] = useState('');
    const [chineseLoading, setChineseLoading] = useState(false);
    const [chineseAppData, setChineseAppData] = useState(null);
    const [chineseVersionMark, setChineseVersionMark] = useState(null);
    const [chineseIosAppVersion, setChineseIosAppVersion] = useState('');
    const [chineseIosId, setChineseIosId] = useState('');
    const [chineseIosReleaseNotes, setChineseIosReleaseNotes] = useState('');
    const [chineseIosDownloadUrl, setChineseIosDownloadUrl] = useState('');
    const [chineseIosAppData, setChineseIosAppData] = useState(null);
    const [chineseIosVersionMark, setChineseIosVersionMark] = useState(null);
    const [chineseIosLoading, setChineseIosLoading] = useState(false);

    useEffect(() => {

        fetchTestGlobalData();
        fetchGlobalData();
        fetchChineseData();
    }, []);

    // Fetch initial data
    const fetchGlobalData = async () => {
        try {
            // const response = await axios.get('http://localhost:2000/tht/version');
            const response = await axios.get('https://grozziieget.zjweiting.com:8033/tht/version');


            if (response.status === 200) {
                const data = response.data[0];
                setAppVersion(data?.appVersion);
                setReleaseNotes(data?.releaseNotes);
                setDownloadUrl(data?.downloadUrl);
                setVersionMark(data?.versionMark)
                setAndroidId(data?.id)
                setAppData(data);
                const data2 = response.data[1];
                setIosAppVersion(data2?.appVersion);
                setIosReleaseNotes(data2?.releaseNotes);
                setIosDownloadUrl(data2?.downloadUrl);
                setIosVersionMark(data2?.versionMark)
                setIosId(data2?.id)
                setIosAppData(data2);
            } else {
                toast.error('Failed to load data');
            }
        } catch (error) {
            toast.error('An error occurred while fetching data');
            console.error(error);
        }
    };

    const fetchTestGlobalData = async () => {
        try {
            // const response = await axios.get('http://localhost:2000/tht/testVersion');
            const response = await axios.get('https://grozziieget.zjweiting.com:8033/tht/testVersion');


            if (response.status === 200) {
                const data = response.data[0];
                setTestAppVersion(data?.appVersion);
                setTestReleaseNotes(data?.releaseNotes);
                setTestDownloadUrl(data?.downloadUrl);
                setTestVersionMark(data?.versionMark)
                setTestAndroidId(data?.id)
                setAppTestData(data);
            } else {
                toast.error('Failed to load data');
            }
        } catch (error) {
            toast.error('An error occurred while fetching data');
            console.error(error);
        }
    };
    const handleTestCancel = () => {
        setTestAppVersion('');
        setTestReleaseNotes('');
        setTestDownloadUrl('');
        setTestVersionMark('');
        toast.info('Inputs cleared');
    };
    const handleTestAppSave = async () => {
        console.log("Android");

        // Validate inputs
        if (!appTestVersion) {
            toast.error('Please enter the app version');
            return;
        }
        if (!testReleaseNotes) {
            toast.error('Please enter release notes');
            return;
        }
        if (!testDownloadUrl || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(testDownloadUrl)) {
            toast.error('Please enter a valid URL for the download link');
            return;
        }
        setLoading(true);
        try {
            // const response = await axios.put(`http://localhost:2000/tht/testVersion/update/${testAndroidId}`, {
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/testVersion/update/${testAndroidId}`, {
                appVersion: appTestVersion,
                releaseNotes: testReleaseNotes,
                downloadUrl: testDownloadUrl,
                versionMark: testVersionMark
            });


            if (response.status === 200) {
                toast.success('Data saved successfully!');
                setAppTestData({
                    id: 1, appVersion: appTestVersion,
                    releaseNotes: testReleaseNotes,
                    downloadUrl: testDownloadUrl,
                    versionMark: testVersionMark
                });
                handleTestCancel(); // Clear inputs after successful save
            } else {
                toast.error('Failed to save data');
            }
        } catch (error) {
            toast.error('An error occurred while saving data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch initial data
    const fetchChineseData = async () => {
        try {
            // const response = await axios.get('http://localhost:2000/tht/version');
            const response = await axios.get('https://jiapuv.com:8033/tht/version');


            if (response.status === 200) {
                const data4 = response.data[1];
                setChineseIosAppVersion(data4?.appVersion);
                setChineseIosReleaseNotes(data4?.releaseNotes);
                setChineseIosDownloadUrl(data4?.downloadUrl);
                setChineseIosVersionMark(data4?.versionMark)
                setChineseIosId(data4?.id)
                setChineseIosAppData(data4);
                const data3 = response.data[0];
                setChineseAppVersion(data3?.appVersion);
                setChineseReleaseNotes(data3?.releaseNotes);
                setChineseDownloadUrl(data3?.downloadUrl);
                setChineseVersionMark(data3?.versionMark)
                setChineseAndroidId(data3?.id)
                setChineseAppData(data3);
            } else {
                toast.error('Failed to load data');
            }
        } catch (error) {
            toast.error('An error occurred while fetching data');
            console.error(error);
        }
    };

    const handleCancel = () => {
        setAppVersion('');
        setReleaseNotes('');
        setDownloadUrl('');
        setVersionMark('');
        toast.info('Inputs cleared');
    };
    const handleIosCancel = () => {
        setIosAppVersion('');
        setIosReleaseNotes('');
        setIosDownloadUrl('');
        setIosVersionMark("");
        toast.info('Inputs cleared');
    };

    const handleChineseCancel = () => {
        setChineseAppVersion('');
        setChineseReleaseNotes('');
        setChineseDownloadUrl('');
        setChineseVersionMark('');
        toast.info('Inputs cleared');
    };
    const handleChineseIosCancel = () => {
        setChineseIosAppVersion('');
        setChineseIosReleaseNotes('');
        setChineseIosDownloadUrl('');
        setChineseIosVersionMark("");
        toast.info('Inputs cleared');
    };

    const handleAppSave = async () => {
        console.log("Android");

        // Validate inputs
        if (!appVersion) {
            toast.error('Please enter the app version');
            return;
        }
        if (!releaseNotes) {
            toast.error('Please enter release notes');
            return;
        }
        if (!downloadUrl || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(downloadUrl)) {
            toast.error('Please enter a valid URL for the download link');
            return;
        }
        console.log({
            appVersion,
            releaseNotes,
            downloadUrl,
            versionMark
        });
        setLoading(true);
        try {
            // const response = await axios.put(`http://localhost:2000/tht/version/update/${androidId}`, {
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/version/update/${androidId}`, {
                appVersion,
                releaseNotes,
                downloadUrl,
                versionMark
            });


            if (response.status === 200) {
                toast.success('Data saved successfully!');
                setAppData({ id: 1, appVersion, releaseNotes, downloadUrl });
                handleCancel(); // Clear inputs after successful save
            } else {
                toast.error('Failed to save data');
            }
        } catch (error) {
            toast.error('An error occurred while saving data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleIosSave = async () => {

        // Validate inputs
        if (!iosAppVersion) {
            toast.error('Please enter the ios app version');
            return;
        }
        if (!iosReleaseNotes) {
            toast.error('Please enter ios release notes');
            return;
        }
        if (!iosDownloadUrl || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(iosDownloadUrl)) {
            toast.error('Please enter a valid URL for the download link');
            return;
        }

        setIosLoading(true);
        try {
            // const response = await axios.put(`http://localhost:2000/tht/version/update/${iosId}`, {
            const response = await axios.put(`https://grozziieget.zjweiting.com:8033/tht/version/update/${iosId}`, {
                appVersion: iosAppVersion,
                releaseNotes: iosReleaseNotes,
                downloadUrl: iosDownloadUrl,
                versionMark: iosVersionMark

            });

            if (response.status === 200) {
                toast.success('Data saved successfully!');
                setIosAppData({ id: 2, appVersion: iosAppVersion, releaseNotes: iosReleaseNotes, downloadUrl: iosDownloadUrl, versionMark: iosVersionMark });
                handleIosCancel(); // Clear inputs after successful save
            } else {
                toast.error('Failed to save data');
            }
        } catch (error) {
            toast.error('An error occurred while saving data');
            console.error(error);
        } finally {
            setIosLoading(false);
        }
    };

    const handleChineseAppSave = async () => {
        console.log("Chinese Android");

        // Validate inputs
        if (!chineseAppVersion) {
            toast.error('Please enter the Chinese app version');
            return;
        }
        if (!chineseReleaseNotes) {
            toast.error('Please enter chinese release notes');
            return;
        }
        if (!chineseDownloadUrl || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(chineseDownloadUrl)) {
            toast.error('Please enter a valid URL for the chinese download link');
            return;
        }

        setChineseLoading(true);
        try {
            // const response = await axios.put(`http://localhost:2000/tht/version/update/${androidId}`, {
            const response = await axios.put(`https://jiapuv.com:8033/tht/version/update/${chineseAndroidId}`, {
                appVersion: chineseAppVersion,
                releaseNotes: chineseReleaseNotes,
                downloadUrl: chineseDownloadUrl,
                versionMark: chineseVersionMark
            });


            if (response.status === 200) {
                console.log(response);

                toast.success('Data saved successfully!');
                setChineseAppData({
                    id: 1,
                    appVersion: chineseAppVersion,
                    releaseNotes: chineseReleaseNotes,
                    downloadUrl: chineseDownloadUrl,
                    versionMark: chineseVersionMark
                });
                handleChineseCancel(); // Clear inputs after successful save
            } else {
                toast.error('Failed to save data');
            }
        } catch (error) {
            toast.error('An error occurred while saving data');
            console.error(error);
        } finally {
            setChineseLoading(false);
        }
    };


    const handleChineseIosSave = async () => {

        // Validate inputs
        if (!chineseIosAppVersion) {
            toast.error('Please enter the Chinese ios app version');
            return;
        }
        if (!iosReleaseNotes) {
            toast.error('Please enter Chinese ios release notes');
            return;
        }
        if (!chineseIosDownloadUrl || !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(chineseIosDownloadUrl)) {
            toast.error('Please enter a valid URL for the chinese download link');
            return;
        }

        setChineseIosLoading(true);
        try {
            // const response = await axios.put(`http://localhost:2000/tht/version/update/${iosId}`, {
            const response = await axios.put(`https://jiapuv.com:8033/tht/version/update/${chineseIosId}`, {
                appVersion: chineseIosAppVersion,
                releaseNotes: chineseIosReleaseNotes,
                downloadUrl: chineseIosDownloadUrl,
                versionMark: chineseIosVersionMark

            });

            if (response.status === 200) {
                toast.success('Data saved successfully!');
                setChineseIosAppData({ id: 2, appVersion: chineseIosAppVersion, releaseNotes: chineseIosReleaseNotes, downloadUrl: chineseIosDownloadUrl, versionMark: chineseIosVersionMark });
                handleChineseIosCancel(); // Clear inputs after successful save
            } else {
                toast.error('Failed to save data');
            }
        } catch (error) {
            toast.error('An error occurred while saving data');
            console.error(error);
        } finally {
            setChineseIosLoading(false);
        }
    };


    return (
        <div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="p-8 max-w-2xl w-full mx-auto bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        Global Android Application Information
                    </h2>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Android App Version</label>
                        <input
                            type="text"
                            value={appVersion}
                            onChange={(e) => setAppVersion(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter app version"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Android Release Notes</label>
                        <textarea
                            value={releaseNotes}
                            onChange={(e) => setReleaseNotes(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter release notes"
                            rows="4"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Android Download URL</label>
                        <input
                            type="url"
                            value={downloadUrl}
                            onChange={(e) => setDownloadUrl(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter download URL"
                        />
                    </section>
                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Android Version Mark</label>
                        <input
                            type="url"
                            value={versionMark}
                            onChange={(e) => setVersionMark(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter download URL"
                        />
                    </section>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-3 font-medium bg-gray-800 text-white rounded hover:bg-gray-600 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAppSave}
                            className={`px-6 py-3 font-medium text-white rounded transition-colors ${loading ? 'bg-gray-400' : 'bg-[#004368]  hover:bg-blue-700'}`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    <ToastContainer />

                    {appData && (
                        <section className="mt-12 bg-gray-100 p-6">
                            <h3 className="text-2xl font-medium text-gray-800 mb-4">Current Android Application Data</h3>
                            <div className="text-gray-700">
                                <p><strong>Android App Version:</strong> {appData.appVersion}</p>
                                <p><strong>Android Release Notes:</strong> {appData.releaseNotes}</p>
                                <p><strong>Android Download URL:</strong> <a href={appData.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{appData.downloadUrl}</a></p>
                            </div>
                        </section>
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-32">
                <div className="p-8 max-w-2xl w-full mx-auto bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        Global Ios Application Information
                    </h2>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Ios App Version</label>
                        <input
                            type="text"
                            value={iosAppVersion}
                            onChange={(e) => setIosAppVersion(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter app version"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Ios Release Notes</label>
                        <textarea
                            value={iosReleaseNotes}
                            onChange={(e) => setIosReleaseNotes(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter release notes"
                            rows="4"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Ios Download URL</label>
                        <input
                            type="url"
                            value={iosDownloadUrl}
                            onChange={(e) => setIosDownloadUrl(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter download URL"
                        />
                    </section>
                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Ios Version Mark</label>
                        <input
                            type="url"
                            value={iosVersionMark}
                            onChange={(e) => setIosVersionMark(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter download URL"
                        />
                    </section>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleIosCancel}
                            className="px-6 py-3 font-medium bg-gray-600 text-white rounded hover:bg-gray-800 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleIosSave}
                            className={`px-6 py-3 font-medium text-white rounded transition-colors ${loading ? 'bg-gray-400' : 'bg-[#004368]  hover:bg-blue-700'}`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    <ToastContainer />

                    {iosAppData && (
                        <section className="mt-12 bg-gray-100 p-6">
                            <h3 className="text-2xl font-medium text-gray-800 mb-4">Current Ios Application Data</h3>
                            <div className="text-gray-700">
                                <p><strong>Ios App Version:</strong> {iosAppData.appVersion}</p>
                                <p><strong>Ios Release Notes:</strong> {iosAppData.releaseNotes}</p>
                                <p><strong>Ios Download URL:</strong> <a href={iosAppData.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{iosAppData.downloadUrl}</a></p>
                            </div>
                        </section>
                    )}
                </div>

            </div>

            {/* chinese part */}
            <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-32">
                <div className="p-8 max-w-2xl w-full mx-auto bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        Chinese Android Application Information
                    </h2>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Android App Version</label>
                        <input
                            type="text"
                            value={chineseAppVersion}
                            onChange={(e) => setChineseAppVersion(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter Chinese app version"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Chinese Android Release Notes</label>
                        <textarea
                            value={chineseReleaseNotes}
                            onChange={(e) => setChineseReleaseNotes(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter Chinese release notes"
                            rows="4"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Chinese Android Download URL</label>
                        <input
                            type="url"
                            value={chineseDownloadUrl}
                            onChange={(e) => setChineseDownloadUrl(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter Chinese download URL"
                        />
                    </section>
                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Chinese Android Version Mark</label>
                        <input
                            type="url"
                            value={chineseVersionMark}
                            onChange={(e) => setChineseVersionMark(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter Chinese download URL"
                        />
                    </section>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleChineseCancel}
                            className="px-6 py-3 font-medium bg-gray-800 text-white rounded hover:bg-gray-600 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleChineseAppSave}
                            className={`px-6 py-3 font-medium text-white rounded transition-colors ${chineseLoading ? 'bg-gray-400' : 'bg-[#004368]  hover:bg-blue-700'}`}
                            disabled={chineseLoading}
                        >
                            {chineseLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    <ToastContainer />

                    {chineseAppData && (
                        <section className="mt-12 bg-gray-100 p-6">
                            <h3 className="text-2xl font-medium text-gray-800 mb-4">Current Chinese Android Application Data</h3>
                            <div className="text-gray-700">
                                <p><strong>Chinese Android App Version:</strong> {chineseAppData.appVersion}</p>
                                <p><strong>Chinese Android Release Notes:</strong> {chineseAppData.releaseNotes}</p>
                                <p><strong>Chinese Android Download URL:</strong> <a href={chineseAppData.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{chineseAppData.downloadUrl}</a></p>
                            </div>
                        </section>
                    )}
                </div>

            </div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-32">
                <div className="p-8 max-w-2xl w-full mx-auto bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        Chinese Ios Application Information
                    </h2>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Chinese Ios App Version</label>
                        <input
                            type="text"
                            value={chineseIosAppVersion}
                            onChange={(e) => setChineseIosAppVersion(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter app version"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Chinese Ios Release Notes</label>
                        <textarea
                            value={chineseIosReleaseNotes}
                            onChange={(e) => setChineseIosReleaseNotes(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter release notes"
                            rows="4"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Chinese Ios Download URL</label>
                        <input
                            type="url"
                            value={chineseIosDownloadUrl}
                            onChange={(e) => setChineseIosDownloadUrl(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter download URL"
                        />
                    </section>
                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Chinese Ios Version Mark</label>
                        <input
                            type="url"
                            value={chineseIosVersionMark}
                            onChange={(e) => setChineseIosVersionMark(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter download URL"
                        />
                    </section>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleChineseIosCancel}
                            className="px-6 py-3 font-medium bg-gray-600 text-white rounded hover:bg-gray-800 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleChineseIosSave}
                            className={`px-6 py-3 font-medium text-white rounded transition-colors ${chineseIosLoading ? 'bg-gray-400' : 'bg-[#004368]  hover:bg-blue-700'}`}
                            disabled={chineseIosLoading}
                        >
                            {chineseIosLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    <ToastContainer />

                    {chineseIosAppData && (
                        <section className="mt-12 bg-gray-100 p-6">
                            <h3 className="text-2xl font-medium text-gray-800 mb-4">Current Chinese Ios Application Data</h3>
                            <div className="text-gray-700">
                                <p><strong>Chinese Ios App Version:</strong> {chineseIosAppData.appVersion}</p>
                                <p><strong>Chinese Ios Release Notes:</strong> {chineseIosAppData.releaseNotes}</p>
                                <p><strong>Chinese Ios Download URL:</strong> <a href={chineseIosAppData.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{chineseIosAppData.downloadUrl}</a></p>
                            </div>
                        </section>
                    )}
                </div>

            </div>

            <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-32">
                <div className="p-8 max-w-2xl w-full mx-auto bg-gray-50">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                        <strong className="text-red-600">Test</strong> Global Android Application Information
                    </h2>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Test Android App Version</label>
                        <input
                            type="text"
                            value={appTestVersion}
                            onChange={(e) => setTestAppVersion(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter app version"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Test Android Release Notes</label>
                        <textarea
                            value={testReleaseNotes}
                            onChange={(e) => setTestReleaseNotes(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter release notes"
                            rows="4"
                        />
                    </section>

                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Test Android Download URL</label>
                        <input
                            type="url"
                            value={testDownloadUrl}
                            onChange={(e) => setTestDownloadUrl(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter download URL"
                        />
                    </section>
                    <section className="mb-8">
                        <label className="block font-medium text-gray-700 text-lg mb-2">Test Android Version Mark</label>
                        <input
                            type="url"
                            value={testVersionMark}
                            onChange={(e) => setTestVersionMark(e.target.value)}
                            className="p-3 bg-white text-black border border-gray-300 rounded w-full"
                            placeholder="Enter download URL"
                        />
                    </section>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleTestCancel}
                            className="px-6 py-3 font-medium bg-gray-800 text-white rounded hover:bg-gray-600 transition-colors"
                            disabled={loading}
                        >
                            Test Cancel
                        </button>
                        <button
                            onClick={handleTestAppSave}
                            className={`px-6 py-3 font-medium text-white rounded transition-colors ${loading ? 'bg-gray-400' : 'bg-[#004368]  hover:bg-blue-700'}`}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    <ToastContainer />

                    {appTestData && (
                        <section className="mt-12 bg-gray-100 p-6">
                            <h3 className="text-2xl font-medium text-gray-800 mb-4">Current Test Android Application Data</h3>
                            <div className="text-gray-700">
                                <p><strong>Test Android App Version:</strong> {appTestData?.appVersion}</p>
                                <p><strong>Test Android Release Notes:</strong> {appTestData?.releaseNotes}</p>
                                <p><strong>Test Android Download URL:</strong> <a href={appTestData?.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{appTestData?.downloadUrl}</a></p>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VersionInfo;



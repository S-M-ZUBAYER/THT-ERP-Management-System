import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import ShowModelNo from "./ShowModelNo";
import AddModelNo from "./AddModelNo";




function ModelHightWidth() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedModelNo, setSelectedModelNo] = useState('');
  const [allModelNoList, setAllModelNoList] = useState([]);
  const [defaultHight, setDefaultHight] = useState('');
  const [defaultWidth, setDefaultWidth] = useState('');
  const [maxHight, setMaxHight] = useState('');
  const [maxWidth, setMaxWidth] = useState('');
  const [selectedCommands, setSelectedCommands] = useState([]);
  const [selectedPID, setSelectedPID] = useState('');
  const [sliderImageMark, setSliderImageMark] = useState('');
  // Define the list of elements to choose from
  const elements = ['CPCL', 'ESC'];
  const [baseUrl, setBaseUrl] = useState("https://grozziieget.zjweiting.com:8033");
  const allUrls = [
    {
      id: 1,
      serverName: "Global",
      url: "https://grozziieget.zjweiting.com:8033"
    },
    {
      id: 2,
      serverName: "China",
      url: "https://jiapuv.com:8033"
    }
  ]

  useEffect(() => {
    fetch(`${baseUrl}/tht/modelNoList`)
      .then(response => response.json())
      .then(data => {

        setAllModelNoList(data.map(modelNo => modelNo.modelNo))

      });
  }, [baseUrl]);

  // Function to handle changes in the city name input field
  const handleDefaultHightChange = (event) => {
    const { value } = event.target;
    setDefaultHight(value);
  };

  const handleDefaultWidthChange = (event) => {
    const { value } = event.target;
    setDefaultWidth(value);
  };

  const handleMaxHightChange = (event) => {
    const { value } = event.target;
    setMaxHight(value);
  };

  const handleMaxWidthChange = (event) => {
    const { value } = event.target;
    setMaxWidth(value);
  };

  const handleInputPIDChange = (e) => {
    setSelectedPID(e.target.value);
  };

  const handleSliderImageMarkChange = (e) => {
    setSliderImageMark(e.target.value);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    axios
      .post(`${baseUrl}/tht/hightWidth/add`, { pidNo: selectedPID, defaultHight, defaultWidth, maxHight, maxWidth, command: selectedCommands, modelNo: selectedModelNo, sliderImageMark: sliderImageMark })
      // .post('http://localhost:2000/tht/hightWidth/add', { pidNo: selectedPID, defaultHight, defaultWidth, maxHight, maxWidth, command: selectedCommands, modelNo: selectedModelNo, sliderImageMark: sliderImageMark })
      .then((res) => {
        if (res.data.status === "success") {
          toast.success("Model information uploaded successfully");
          setSelectedPID("");
          setDefaultHight("")
          setDefaultWidth("")
          setMaxHight("")
          setMaxWidth("")
          setSliderImageMark("")
          setSelectedCommands([])
        } else {
          toast.error("Model information uploaded failed");
        }
      })
      .catch((error) => {
        console.error(error); // Log the error to the console
        toast.error("An error occurred while uploading Model information"); // Show a toast for the error
      });
  }

  const handleSelectChange = (e) => {
    setSelectedModelNo(e.target.value);
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    // Update the selectedElements array based on checkbox changes
    if (checked) {
      setSelectedCommands([...selectedCommands, value]);
    } else {
      setSelectedCommands(selectedCommands.filter((element) => element !== value));
    }
  };


  return (
    <div>
      {/* Server Selected Tabs */}
      <div className="flex justify-center items-center mb-6 mt-3">
        <div className="p-1 bg-slate-300 rounded-full">
          {allUrls.map((server, index) => (
            <button
              key={index}
              onClick={() => setBaseUrl(server.url)}
              className={`px-16 py-1 rounded-full text-xl ${server.url === baseUrl
                ? "bg-[#004368] text-white font-bold"
                : "text-gray-500 font-semibold"
                }`}
            >
              {server.serverName}
            </button>
          ))}
        </div>
      </div>

      <AddModelNo
        baseUrl={baseUrl}
        setAllWarehouseNameList={setAllModelNoList}
        allWarehouseNameList={allModelNoList}
      ></AddModelNo>

      <div className="my-24 flex items-center justify-center px-4">
        <form className="w-full max-w-4xl bg-white shadow rounded-xl p-10 space-y-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-[#004368]">Add Height & Width Configuration</h2>

          {/* PID Input */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">PID</label>
            <input
              type="text"
              className="w-full bg-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004368]"
              value={selectedPID}
              onChange={handleInputPIDChange}
              placeholder="Enter PID"
            />
          </div>

          {/* Default Height & Width */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Default Height & Width</label>
            <div className="flex gap-4">
              <input
                type="text"
                className="w-1/2 bg-white  px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004368]"
                placeholder="Enter Default Height"
                onChange={handleDefaultHightChange}
              />
              <input
                type="text"
                className="w-1/2 bg-white  px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004368]"
                placeholder="Enter Default Width"
                onChange={handleDefaultWidthChange}
              />
            </div>
          </div>

          {/* Max Height & Width */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Max Height & Width</label>
            <div className="flex gap-4">
              <input
                type="text"
                className="w-1/2 bg-white  px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004368]"
                placeholder="Enter Max Height"
                onChange={handleMaxHightChange}
              />
              <input
                type="text"
                className="w-1/2 bg-white  px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004368]"
                placeholder="Enter Max Width"
                onChange={handleMaxWidthChange}
              />
            </div>
          </div>

          {/* Slider Image Mark */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Slider Image Mark</label>
            <input
              type="text"
              className="w-full bg-white  px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004368]"
              value={sliderImageMark}
              onChange={handleSliderImageMarkChange}
              placeholder="Enter Slider Image Mark"
            />
          </div>

          {/* Select Elements */}
          <div>
            <label className="block mb-3 text-gray-700 font-medium">Select Elements</label>
            <div className="flex flex-wrap gap-4">
              {elements.map((element) => (
                <label key={element} className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    value={element}
                    checked={selectedCommands.includes(element)}
                    onChange={handleCheckboxChange}
                    className="accent-[#004368] bg-white "
                  />
                  {element}
                </label>
              ))}
            </div>
          </div>

          {/* Selected Elements List */}
          {selectedCommands.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Selected Elements:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {selectedCommands.map((element) => (
                  <li key={element}>{element}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Model No Select */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Select Model No</label>
            <select
              className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#004368]"
              value={selectedModelNo}
              onChange={handleSelectChange}
            >
              <option value="">Select Model No</option>
              {allModelNoList.map((modeNo, index) => (
                <option key={index} value={modeNo}>
                  {modeNo}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              className="bg-[#004368] hover:bg-blue-800 text-white font-semibold py-2 px-10 rounded-lg transition duration-300"
              onClick={handleUpload}
              disabled={!selectedImages}
            >
              Add Bluetooth Modal H & W
            </button>
          </div>
        </form>
      </div>

      <ShowModelNo
        baseUrl={baseUrl}
        allModelNoList={allModelNoList}
      ></ShowModelNo>

    </div>
  );
}


export default ModelHightWidth;
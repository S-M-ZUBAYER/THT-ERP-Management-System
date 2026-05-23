import axios from "axios";

const API_BASE_URL = "https://grozziieget.zjweiting.com:8033/tht";

export const MACHINE_VERSION_CONFIGS = {
  face: {
    key: "face",
    label: "Face Machine",
    endpoints: {
      all: "/faceAttendance/allVersion",
      add: "/faceAttendance/version/add",
      update: "/faceAttendance/version/update",
      delete: "/faceAttendance/version/delete",
    },
  },
  manual: {
    key: "manual",
    label: "Manual Machine",
    endpoints: {
      all: "/attendanceMachine/allVersion",
      add: "/attendanceMachine/version/add",
      update: "/attendanceMachine/version/update",
      delete: "/attendanceMachine/version/delete",
    },
  },
};

const normalizeVersionList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export const getMachineVersions = async (config) => {
  const response = await axios.get(`${API_BASE_URL}${config.endpoints.all}`);
  return normalizeVersionList(response.data);
};

export const addMachineVersion = async (config, payload) => {
  const response = await axios.post(
    `${API_BASE_URL}${config.endpoints.add}`,
    payload,
  );
  return response.data;
};

export const updateMachineVersion = async (config, id, payload) => {
  const response = await axios.put(
    `${API_BASE_URL}${config.endpoints.update}/${id}`,
    payload,
  );
  return response.data;
};

export const deleteMachineVersion = async (config, id) => {
  const response = await axios.delete(
    `${API_BASE_URL}${config.endpoints.delete}/${id}`,
  );
  return response.data;
};

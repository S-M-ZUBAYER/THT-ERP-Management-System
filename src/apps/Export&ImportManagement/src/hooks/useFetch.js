import { useState } from "react";
import axios from "axios";

const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dataGet = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const dataPost = async (url, payload) => {
    setLoading(true);
    try {
      const response = await axios.post(url, payload);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const dataUpdate = async (url, payload) => {
    setLoading(true);
    try {
      const response = await axios.put(url, payload);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const dataDelete = async (url) => {
    setLoading(true);
    try {
      await axios.delete(url);
      setData(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, dataGet, dataPost, dataUpdate, dataDelete };
};

export default useFetch;

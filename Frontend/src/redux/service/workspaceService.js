import axios from 'axios';
import { useSelector } from 'react-redux';
import axiosInstance from 'src/utils/axios';
import { dispatch } from '../store';

const API_URL = 'workspace/';
const getWorkspaces = async (id) => {
  const response = await axiosInstance.get(API_URL + id);
  return response.data;
};

const getWorkspace = async (id) => {
  const response = await axiosInstance.get(API_URL + 'details/' + id);
  return response.data;
};

//add workspace
const addworkspace = async (workspaceData, idmember) => {
  const response = await axiosInstance.post(API_URL + '/add/' + idmember, workspaceData);
  return response.data;
};

//delete workspace
const deleteworkspace = async (idworkspace, idmember) => {
  const response = await axiosInstance.put(API_URL + '/deleteworkspace/' + idworkspace + '/' + idmember);
  return response.data;
};

const workspaceService = {
  getWorkspaces,
  addworkspace,
  getWorkspace,
  deleteworkspace,
};

export default workspaceService;
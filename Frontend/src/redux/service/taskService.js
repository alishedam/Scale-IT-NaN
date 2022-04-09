import axiosInstance from 'src/utils/axios';

const API_URL = 'task/';

//add task
const addTask = async (data) => {
  const response = await axiosInstance.post(API_URL + 'add/', data);
  return response.data;
};

const getUserTasks = async (object) => {
  const response = await axiosInstance.get(API_URL + 'getUserTasks/' + object.projectId+'/'+object.memberId);
  return response.data;
};

const getBoard = async (projectid) => {
  const response = await axiosInstance.get(API_URL+'tasksbyproject/'+projectid);
  return response.data;
};

//add task
const updateTaskStatus = async (data) => {
  const response = await axiosInstance.put(API_URL + 'updatestate/'+data.taskid, data);
  return response.data;
};

const taskService = {
  addTask,
  getUserTasks,
  updateTaskStatus,
  getBoard,
};

export default taskService;
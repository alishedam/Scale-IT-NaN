import { useState } from 'react';
import {
  resetErrorMessage,
  getWorkspaceProjectsForMembers,
  getWorkspaceProjects,
  deleteProject,
} from 'src/redux/slices/projectSlice';
import { useSelector, useDispatch } from 'src/redux/store';

// ----------------------------------------------------------------------

const useProject = () => {
  const projects = useSelector((state) => state.projects.projects);
  const projectError = useSelector((state) => state.projects.projectsErrorMessage);
  const projectSuccess = useSelector((state) => state.projects.projectsSuccessMessage);

  const dispatch = useDispatch();

  const getWorkspaceProjectsHook = (idWorkspace, idMember, isExecutive) =>
    isExecutive
      ? dispatch(getWorkspaceProjects(idWorkspace))
      : dispatch(getWorkspaceProjectsForMembers({ idWorkspace, idMember }));

  const resetErrorMessageHook = () => dispatch(resetErrorMessage());

  const resetSuccessMessageHook = () => dispatch(resetSuccessMessage());

  const deleteProjectHook = (data) => dispatch(deleteProject(data));

  return {
    projects,
    projectError,
    projectSuccess,
    resetSuccessMessageHook,
    resetErrorMessageHook,
    deleteProjectHook,
    getWorkspaceProjectsHook,
  };
};

export default useProject;

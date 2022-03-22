import { useState } from 'react';
import { resetErrorMessage, getWorkspaceProjectsForMembers, getWorkspaceProjects } from 'src/redux/slices/projectSlice';
import { useSelector, useDispatch } from 'src/redux/store';

// ----------------------------------------------------------------------

const useProject = () => {
  const projects = useSelector((state) => state.projects.projects);
  const projectError = useSelector((state) => state.projects.projectsErrorMessage);

  const dispatch = useDispatch();

  const getWorkspaceProjectsHook = (idWorkspace, idMember, isExecutive) => {
    isExecutive
      ? dispatch(getWorkspaceProjectsForMembers({ idWorkspace, idMember }))
      : dispatch(getWorkspaceProjects(idWorkspace));
  };

  const resetErrorMessageHook = () => dispatch(resetErrorMessage());

  return {
    projects,
    projectError,
    resetErrorMessageHook,
    getWorkspaceProjectsHook,
  };
};

export default useProject;
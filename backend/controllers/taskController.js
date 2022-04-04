const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const Member = require("../models/memberModel");
const Task = require("../models/taskModel");

const addTask = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    startDate,
    expectedEndDate,
    teamLeadId,
    projectId,
  } = req.body;
  if (!name || !description || !startDate || !expectedEndDate) {
    res.status(400);
    throw new Error("please add all fields");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("project not found");
  }
  project.assigned_members.forEach((element) => {
    if (element.memberId.equals(teamLeadId)) {
      if (!element.isTeamLeader) {
        res.status(403);
        throw new Error("you are not allowed to create a task");
      }
    }
  });

  const member = await Member.findById(teamLeadId);
  if (!member) {
    res.status(404);
    throw new Error("invalid team leader id");
  }

  const task = await Task.create({
    name,
    description,
    startDate,
    expectedEndDate,
    project: projectId,
  }).catch((err) => {
    res.status(400);
    throw new Error("could not create task", err);
  });
  res.status(201).json({ task });
});

const updateTask = asyncHandler(async (req, res) => {
  const data = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, data).catch(
    (err) => {
      res.status(400);
      throw new Error("could not update task", err);
    }
  );
  res.status(201).json({ msg: "task updated successfully" });
});

const updateTaskState = asyncHandler(async (req, res) => {
  //const status = req.body;
  const { status, teamLeadId, projectId } = req.body;
  if (!status || !teamLeadId || !projectId) {
    res.status(400);
    throw new Error("please add all fields");
  }
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("project not found");
  }
  var isTl = false;
  project.assigned_members.forEach((element) => {
    if (element.memberId == teamLeadId) {
      if (element.isTeamLeader == true) {
        isTl = true;
      }
    }
  });
  if (!isTl) {
    res.status(403);
    throw new Error("you are not allowed to update a task");
  } else {
    var possibleStates = ["to_do", "doing", "done", "review"];
    var stateIsValid = possibleStates.includes(status);
    if (!stateIsValid) {
      res.status(404);
      throw new Error("invalid tasks status");
    } else {
      const task = await Task.findByIdAndUpdate(req.params.id, {
        status,
      }).catch((err) => {
        res.status(400);
        throw new Error("could not update task", err);
      });
      res.status(200).json(task);
    }
  }
});

//PS: soft delete to keep data
const deleteTask = asyncHandler(async (req, res) => {
  const { teamLeadId, projectId } = req.body;
  if (!teamLeadId || !projectId) {
    res.status(400);
    throw new Error("please add all fields");
  }
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("project not found");
  }
  var isTl = false;
  project.assigned_members.forEach((element) => {
    if (element.memberId == teamLeadId) {
      if (element.isTeamLeader == true) {
        isTl = true;
      }
    }
  });
  if (!isTl) {
    res.status(403);
    throw new Error("you are not allowed to delete a task");
  } else {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: "true" }
    ).catch((err) => {
      res.status(400);
      throw new Error("could not update task", err);
    });
    res.status(200).json(task);
  }
});

//PS: recover after soft delete, in case its a mistake
const recoverTask = asyncHandler(async (req, res) => {
  const { teamLeadId, projectId } = req.body;
  if (!teamLeadId || !projectId) {
    res.status(400);
    throw new Error("please add all fields");
  }
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("project not found");
  }
  var isTl = false;
  project.assigned_members.forEach((element) => {
    if (element.memberId == teamLeadId) {
      if (element.isTeamLeader == true) {
        isTl = true;
      }
    }
  });
  if (!isTl) {
    res.status(403);
    throw new Error("you are not allowed to recover a task");
  } else {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: "false" }
    ).catch((err) => {
      res.status(400);
      throw new Error("could not update task", err);
    });
    res.status(200).json(task);
  }
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const tasksToDo = await Task.find({
    project: req.params.projectid,
    status: "to_do",
  });
  const tasksDoing = await Task.find({
    project: req.params.projectid,
    status: "doing",
  });
  const tasksDone = await Task.find({
    project: req.params.projectid,
    status: "done",
  });
  const tasksReview = await Task.find({
    project: req.params.projectid,
    status: "review",
  });
  res.status(200).json({
    tasksToDo: tasksToDo,
    tasksDoing: tasksDoing,
    tasksDone: tasksDone,
    tasksReview: tasksReview,
  });
});

module.exports = {
  addTask,
  updateTask,
  updateTaskState,
  deleteTask,
  recoverTask,
  getTasksByProject,
};

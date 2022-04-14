const workspaceModel = require("../models/workspaceModel");
const projectModel = require("../models/projectModel");
const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const UserScore = require("../models/userscoreModel");
const Workspace = require("../models/workspaceModel");

async function MemberInWorkspace(memberId, workspaceId) {
  let exist = false;
  const workspace = await workspaceModel.findOne({ _id: workspaceId });
  if (!workspace) {
    return false;
  } else {
    for (let i = 0; i < workspace.assigned_members.length; i++) {
      if (workspace.assigned_members[i].member.equals(memberId)) {
        exist = true;
      }
    }
  }

  return exist;
}

async function MemberInProject(memberId, projectId) {
  let exist = false;
  const project = await projectModel.findById(projectId);
  if (!project) {
    return false;
  } else {
    for (let i = 0; i < project.assigned_members.length; i++) {
      if (project.assigned_members[i].memberId.equals(memberId)) {
        exist = true;
      }
    }
  }

  return exist;
}

async function ProjectHasTeamLeader(projectId) {
  const project = await projectModel.findOne({ _id: projectId });
  if (!project || project.assigned_members.length === 0) {
    return false;
  }
  project.assigned_members.forEach((element) => {
    if (element.isTeamLeader) {
      return true;
    }
  });
  return false;
}

/**
 * todo: change "push in tables" by compteur .
 */
async function getPerformanceByMember(memberId, workspaceId) {
  let task = await Task.find({
    "members.memberId": memberId,
    status: "done",
  });

  const ftfe = [];
  const fcit = [];
  const fcfaster = [];
  const ftit = [];

  const ftat = [];
  const fcat = [];

  let usertasks = [];

  for (let t of task) {
    let proj = await Project.findById(t.project);
    if (proj) {
      console.log(proj.workspace);
      console.log("////");
      console.log(workspaceId);
      if (proj.workspace.equals(workspaceId)) {
        usertasks.push(t);
      }
    }
  }

  console.log(usertasks);

  usertasks.map((task) => {
    if (task.expectedEndDate > task.endDate) {
      if (task.expectedEndDate.getTime() - task.startDate.getTime() >= 8)
        fcit.push(task);
      if (
        task.expectedEndDate.getTime() - task.startDate.getTime() >= 8 &&
        task.endDate - task.startDate <=
          (task.expectedEndDate - task.startDate) * (2 / 3)
      )
        fcfaster.push(task);
      if (
        task.endDate - task.startDate <=
        (task.expectedEndDate - task.startDate) * (2 / 3)
      )
        ftfe.push(task);

      ftit.push(task);
    } else {
      if (task.expectedEndDate.getTime() - task.startDate.getTime() >= 8)
        fcat.push(task);

      ftat.push(task);
    }
  });

  // console.log("ftfe", ftfe);
  // console.log("fcit", fcit);
  // console.log("fcfaster", fcfaster);
  // console.log("ftat", ftat);
  // console.log("ftit", ftit);
  // console.log("fcat", fcat);

  const performance =
    ftfe.length * 3 +
    fcit.length * 4.5 +
    fcfaster.length * 6 +
    ftit.length * 2 +
    (ftat.length * 1 + fcat.length * 1.5);

  return performance;
}

async function updatescoremembersinworkspace(workspaceId) {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    // console.log("invalid workspace id");
  } else {
    for (assignee of workspace.assigned_members) {
      const newscore = await getPerformanceByMember(
        assignee.member,
        workspaceId
      );

      if (newscore) {
        console.log("workspace id ", workspaceId);
        console.log("member id ", assignee.member);
        console.log("score ", newscore);
        let scoreExists = await UserScore.exists({ member: assignee.member });

        if (!scoreExists) {
          // console.log("mahouch majoud", assignee.member);
          let newScrore = await UserScore.create({
            member: assignee.member,
            score_workspace: [],
            score_project: [],
          });
          // if (newScrore) console.log("created");
        }
        let workspaceExistsInScore = await UserScore.exists({
          member: assignee.member,
          "score_workspace.workspaceId": workspaceId,
        });
        if (workspaceExistsInScore) {
          UserScore.findOne(
            {
              member: assignee.member,
              "score_workspace.workspaceId": workspaceId,
            },
            function (err, success) {
              // if (success) {
              //   // console.log("success find");
              //   // console.log(success.member);
              //   for (let i = 0; i < success.score_workspace.length; i++) {
              //     console.log(success.score_workspace[i]);
              //   }
              // } else {
              //   console.log("error", err);
              // }
            }
          );
          UserScore.updateOne(
            {
              member: assignee.member,
              "score_workspace.workspaceId": workspaceId,
            },
            {
              $set: { "score_workspace.$.score": newscore },
            },
            { new: true },
            function (err, success) {
              // console.log("log zz");
              if (err) console.log("err", err);
              else {
                UserScore.findOne(
                  {
                    member: assignee.member,
                    "score_workspace.workspaceId": workspaceId,
                  },
                  function (err, success) {
                    // if (success) {
                    //   console.log("success find");
                    //   console.log(success.member);
                    //   for (let i = 0; i < success.score_workspace.length; i++) {
                    //     console.log(success.score_workspace[i]);
                    //   }
                    // } else {
                    //   console.log("error", err);
                    // }
                  }
                );
              }
            }
          );
          // if (updatero) {
          //   console.log("workspaceExistsInScore");
          //   console.log("updatero");
          //   // console.log(updatero);
          // }
        } else {
          UserScore.findOneAndUpdate(
            {
              member: assignee.member,
            },
            {
              $push: {
                score_workspace: { workspaceId: workspaceId, score: newscore },
              },
            },
            { new: true },
            function (err, success) {
              // if (success) {
              //   console.log("success find");
              //   console.log(success.member);
              //   for (let i = 0; i < success.score_workspace.length; i++) {
              //     console.log(success.score_workspace[i]);
              //   }
              // } else {
              //   console.log("error", err);
              // }
            }
          );
          // if (updatero) {
          //   console.log("not workspaceExistsInScore");
          //   console.log("updatero");
          //   // console.log(updatero);
          // }
        }
        /*
       
        

        if(!workspaceExistsInScore){

          await UserScore.findOneAndUpdate(
            {
              member: assignee.member,
            },
            {
              $push: { "score_workspace": {workspaceId: workspaceId ,score: newscore }},
            },
            { new: true,}
          );
        }else{
          await UserScore.findOneAndUpdate(
            {
              member: assignee.member,
              "score_workspace.workspaceId": workspaceId,
            },
            {
              $set: { "score_workspace.$.score": newscore },
            },
            { new: true,  }
          );
        }*/
      }
    }
  }
}

async function updatescoremembersinproject(projectId) {
  const project = await projectModel.findById(projectId);
  if (!project) {
    console.log("invalid project id");
  } else {
    for (assignee of project.assigned_members) {
      const newscore = await getPerformanceByMember(assignee.memberId);
      if (newscore) {
        const user_score = await UserScore.findOneAndUpdate(
          {
            member: assignee.member,
            "score_project.projectId": projectId,
          },
          {
            $set: { "score_project.score": newscore },
          },
          { upsert: true, new: true }
        );
      }
    }
    console.log("updating project leaderboard");
  }
}

module.exports = {
  MemberInWorkspace,
  ProjectHasTeamLeader,
  MemberInProject,
  getPerformanceByMember,
  updatescoremembersinworkspace,
  updatescoremembersinproject,
};

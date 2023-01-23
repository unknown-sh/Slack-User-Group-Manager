import { WorkflowStep,  WorkflowStepExecute } from "https://deno.land/x/deno_slack_sdk@1.4.4/mod.ts";
import { approveRequest, declineRequest } from "./approve_request.ts";
import { notifyITTeam } from "./notify_it_team.ts";
import { manageUserGroup } from "./manage_user_groups.ts";

export const ApprovalWorkflowSteps: WorkflowStep[] = [
  {
    name: "Approve Request",
    execute: (args: WorkflowStepExecute) => {
      const { request_id, user_id } = args.inputs;
      approveRequest(request_id, user_id);
    },
  },
  {
    name: "Decline Request",
    execute: (args: WorkflowStepExecute) => {
      const { request_id, user_id } = args.inputs;
      declineRequest(request_id, user_id);
    },
  },
];

export const NotificationWorkflowSteps: WorkflowStep[] = [
  {
    name: "Notify IT Team",
    execute: (args: WorkflowStepExecute) => {
      const { request_id } = args.inputs;
      notifyITTeam(request_id);
    },
  },
  {
    name: "Manage User Group",
    execute: (args: WorkflowStepExecute) => {
      const { request_id } = args.inputs;
      manageUserGroup(request_id);
    },
  },
];

import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { ApprovalWorkflowSteps, NotificationWorkflowSteps } from "./workflow_steps.ts";

export const ApprovalWorkflow = DefineWorkflow({
  name: "User Group Request Approval",
  steps: ApprovalWorkflowSteps,
});

export const NotificationWorkflow = DefineWorkflow({
  name: "User Group Request Notification",
  steps: NotificationWorkflowSteps,
});

import { DefineWorkflow, SlackWorkflowArguments } from "https://deno.land/x/deno_slack_sdk@1.4.4/mod.ts";
import { ApprovalWorkflowSteps, NotificationWorkflowSteps } from "./functions/workflow_steps.ts";

export const ApprovalWorkflow = DefineWorkflow({
  name: "User Group Request Approval",
  async handler(args: SlackWorkflowArguments) {
    try {
      // Execute the steps of the workflow
      for (const step of ApprovalWorkflowSteps) {
        await step(args);
      }
    } catch (e) {
      console.error(e);
      throw new Error(`An error occurred while executing the Approval Workflow`);
    }
  },
});

export const NotificationWorkflow = DefineWorkflow({
  name: "User Group Request Notification",
  async handler(args: SlackWorkflowArguments) {
    try {
      // Execute the steps of the workflow
      for (const step of NotificationWorkflowSteps) {
        await step(args);
      }
    } catch (e) {
      console.error(e);
      throw new Error(`An error occurred while executing the Notification Workflow`);
    }
  },
});

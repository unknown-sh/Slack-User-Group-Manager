import { DefineTrigger, SlackTriggerArguments } from "https://deno.land/x/deno_slack_sdk@1.4.4/mod.ts";

export const RequestApprovalTrigger = DefineTrigger({
  callback_id: "request_approval",
  title: "Request Approval",
  description: "Triggers when a request is submitted for approval",
  source_file: "triggers.ts",
  async handler(args: SlackTriggerArguments) {
    const { request_reason, requester_id } = args.payload;

    // Create a new request in the datastore
    const request = await args.slack.datastore.create("request", {
      requester_id,
      request_reason,
      request_time: Date.now(),
      status: "pending",
    });

    // Notify the IT Team
    await args.slack.functions.invoke("notify_it_team", { request_id: request.id });
  },
});

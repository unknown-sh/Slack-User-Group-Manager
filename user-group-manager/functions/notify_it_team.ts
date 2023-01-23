import { DefineFunction, SlackFunctionArguments } from "deno-slack-sdk/mod.ts";
import { Datastore } from "https://deno.land/x/deno_slack_sdk/datastore.ts";

interface ITTeamRequest {
  status: string;
  requester_id: string;
  request_time: string;
  request_reason: string;
  approval_time: string;
  approved_by: string;
  members: string[];
}

export const NotifyITTeam = DefineFunction({
  callback_id: "notify_it_team",
  title: "Notify IT Team",
  description: "Notify the IT Team of a new request",
  source_file: "notify_it_team.ts",
  input_parameters: {
    properties: {
      request_id: {
        type: "string",
        description: "ID of the request",
      },
    },
    required: ["request_id"],
  },
  async handler(args: SlackFunctionArguments) {
    const { request_id } = args.inputs;
    const dataStore = new Datastore({ token: Deno.env.get('SLACK_TOKEN') });
    try {
      // Get the request from the datastore
      const request = await dataStore.get('request', request_id);
      const { requester_id, request_reason } = request;
      
      // Get the members of the IT Team
      const itTeamMembers = await dataStore.get("it_team", "members");

      // Send direct message to each IT Team member
      for (const itTeamMember of itTeamMembers) {
        const dmConversation = await args.slack.webClient.conversations.create({
          users: itTeamMember,
        });
        const user = await args.slack.webClient.users.info({ user: requester_id });
        const message = `New Request from ${user.user.name}: ${request_reason}\nRequest ID: ${request_id}\nUse /approve_request ${request_id} or /decline_request ${request_id} in this direct message to approve or decline this request`;
        await args.slack.webClient.chat.postMessage({
          channel: dmConversation.channel.id,
          text: message,
        });
      }
    } catch (e) {
      console.log(e);
    }
  },
});

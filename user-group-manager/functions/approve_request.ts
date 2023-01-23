import { DefineFunction, SlackFunctionArguments } from "deno-slack-sdk/mod.ts";

export const ApproveRequest = DefineFunction({
    callback_id: "approve_request",
    title: "Approve Request",
    description: "Approve a user group request",
    source_file: "approve_request.ts",
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
        // Get the request from the datastore
        const requestDataStore = new SlackDataStore(args.app, request_id);
        const request = await requestDataStore.get();
        // Approve the request
        requestDataStore.update({
            ...request,
            status: "approved",
            approved_by: args.user.id,
            approval_time: new Date().toISOString(),
        });
        // Notify the requester that their request has been approved
        const requester = await args.slack.webClient.users.info({ user: request.requester_id });
        const message = `Your request to join ${request.group_name} has been approved by ${args.user.name}!`;
        await args.slack.webClient.chat.postEphemeral({
            channel: request.requester_id,
            user: request.requester_id,
            text: message,
        });
    },
});

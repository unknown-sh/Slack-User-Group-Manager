import { Slack } from "https://deno.land/x/deno_slack_sdk@1.4.4/mod.ts";

// Get token from environment variable
const SLACK_TOKEN = Deno.env.get("SLACK_APP_TOKEN") || "";

const slack = new Slack(SLACK_TOKEN);

/**
 * Approve a request
 *
 * @param {string} request_id - The ID of the request
 * @param {string} user_id - The ID of the user approving the request
 */
export async function approveRequest(request_id: string, user_id: string) {
  try {
    // Update request status in the datastore
    await slack.datastore.update("request", request_id, {
      status: "approved",
      approval_time: Date.now(),
      approved_by: user_id,
    });

    // Get the request
    const request = await slack.datastore.get("request", request_id);

    // Notify the requester
    await slack.chat.postMessage({
      channel: request.requester_id,
      text: `Your request (ID: ${request_id}) has been approved!`,
    });
  } catch (e) {
    console.error(e);
    throw new Error(`An error occurred while approving request ${request_id}`);
  }
}

/**
 * Decline a request
 *
 * @param {string} request_id - The ID of the request
 * @param {string} user_id - The ID of the user declining the request
 */
export async function declineRequest(request_id: string, user_id: string) {
  try {
    // Update request status in the datastore
    await slack.datastore.update("request", request_id, {
      status: "declined",
      approval_time: Date.now(),
      approved_by: user_id,
    });
      // Get the request
      const request = await slack.datastore.get("request", request_id);

        // Notify the requester
  await slack.chat.postMessage({
    channel: request.requester_id,
    text: `Your request (ID: ${request_id}) has been declined.`,
  });
    } catch (e) {
      console.error(e);
      throw new Error(`An error occurred while declining request ${request_id}`);
    }
}
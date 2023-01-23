import { Slack } from "https://deno.land/x/deno_slack_sdk@1.4.4/mod.ts";

// Get token from environment variable
const SLACK_TOKEN = Deno.env.get("SLACK_APP_TOKEN") || "";

const slack = new Slack(SLACK_TOKEN);

/**
 * Add user to user group
 *
 * @param {string} user_id - The ID of the user to add
 * @param {string} user_group_id - The ID of the user group
 */
export async function addUserToGroup(user_id: string, user_group_id: string) {
  try {
    await slack.usergroups.users.update({
      usergroup: user_group_id,
      users: user_id,
      include_count: true
    });
  } catch (e) {
    console.error(e);
    throw new Error(`An error occurred while adding user ${user_id} to group ${user_group_id}`);
  }
}

/**
 * Remove user from user group
 *
 * @param {string} user_id - The ID of the user to remove
 * @param {string} user_group_id - The ID of the user group
 */
export async function removeUserFromGroup(user_id: string, user_group_id: string) {
  try {
    await slack.usergroups.users.update({
      usergroup: user_group_id,
      users: user_id,
      include_count: true
    });
  } catch (e) {
    console.error(e);
    throw new Error(`An error occurred while removing user ${user_id} from group ${user_group_id}`);
  }
}

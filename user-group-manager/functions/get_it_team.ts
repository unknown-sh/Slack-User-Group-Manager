import { WebClient } from "https://deno.land/x/slack_webhook/mod.ts";

//Get token from environment variable
const SLACK_TOKEN = Deno.env.get("SLACK_TOKEN") || "";

const webClient = new WebClient(SLACK_TOKEN);

/**
 * Get the members of an IT Team usergroup
 *
 * @param {string} it_team_id - The ID of the IT Team user group
 */
export async function getITTeamMembers(it_team_id: string) {
  const { members } = await webClient.usergroups.users.list({
    usergroup: it_team_id,
    include_disabled: true,
  });

  return members;
}

/**
 * Check if a user is a member of the IT Team user group
 *
 * @param {string} user_id - The ID of the user
 * @param {string} it_team_id - The ID of the IT Team user group
 */
export async function isUserInITTeam(user_id: string, it_team_id: string) {
  const members = await getITTeamMembers(it_team_id);
  return members.includes(user_id);
}

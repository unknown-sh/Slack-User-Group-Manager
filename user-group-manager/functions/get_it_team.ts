import { Slack, WebClient } from "https://deno.land/x/deno_slack_sdk@1.4.4/mod.ts";

const SLACK_TOKEN = Deno.env.get("SLACK_APP_TOKEN") || "";

const slack = new Slack(SLACK_TOKEN);
const webClient = new WebClient();

/**
 * Get the members of an IT Team usergroup
 *
 * @param {string} it_team_id - The ID of the IT Team user group
 */
export async function getITTeamMembers(it_team_id: string) {
    const members = await webClient.users.list({
        usergroup_id: it_team_id
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
    return members.users.map(x => x.id).includes(user_id);
}

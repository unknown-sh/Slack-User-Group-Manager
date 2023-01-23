import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { SlackClient } from "https://deno.land/x/slack_sdk/mod.ts";

const client = new SlackClient(Deno.env.get("SLACK_APP_TOKEN"));

export const ManageUserGroup = DefineFunction({
  callback_id: "manage_user_group",
  title: "Manage User Group Membership",
  description: "Add or remove users from Slack user groups",
  source_file: "functions/manage_user_group.ts",
  input_parameters: {
    properties: {
      group_id: {
        type: Schema.slack.types.usergroup_id,
        description: "The ID of the Slack user group",
      },
      user_id: {
        type: Schema.slack.types.user_id,
        description: "The ID of the user to add or remove",
      },
      action: {
        type: Schema.types.string,
        description: "The action to perform on the user (add or remove)",
        enum: ["add", "remove"],
      },
    },
    required: ["group_id", "user_id", "action"],
  },
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "The message indicating the success or failure of the action",
      },
    },
    required: ["message"],
  },
  async execute(inputs, context) {
    try {
      // Get usergroup members table
      const usergroup_members_table = await client.datastore.table("usergroup_members");
      if (inputs.action === "add") {
        // Add user to usergroup
        const result = await usergroup_members_table.insert({
          user_id: inputs.user_id,
          usergroup_id: inputs.group_id,
        });
        if (result.ok) {
          return { message: "User added to usergroup" };
        } else {
          return { message: "An error occurred while adding the user to the usergroup" };
        }
      } else if (inputs.action === "remove") {
        // Remove user from usergroup
        const result = await usergroup_members_table.delete({
          user_id: inputs.user_id,
          usergroup_id: inputs.group_id,
        });
        if (result.ok) {
          return { message: "User removed from usergroup" };
        } else {
          return { message: "An error occurred while removing the user from the usergroup" };
        }
      } else {
        return { message: "Invalid action provided" };
      }
    } catch (e) {
      console.error(e);
      return { message: "An error occurred while managing the usergroup" };
    }
  },
});

import { ManageUserGroupFunction } from "./functions/manage_user_group.ts";

export const triggers = [
    {
      name: "Manage User Group",
      type: "button",
      callback_id: ManageUserGroupFunction.callback_id,
    },
    {
      name: "Manage User Group Command",
      type: "command",
      command: "/manage-user-group",
      callback_id: ManageUserGroupFunction.callback_id,
    }
  ];

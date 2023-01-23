import { Manifest } from "deno-slack-sdk/mod.ts";
import { ManageUserGroupFunction } from "./functions/manage_user_group.ts";
import { ManageUserGroup } from "./functions/manage_user_group.ts";
import { triggers } from "./triggers/triggers.ts";

export default Manifest({
  name: "user-group-manager",
  description: "An app that allows managing user group membership",
  icon: "assets/icon.png",
  functions: [
    {
      definition: ManageUserGroupFunction,
      handler: ManageUserGroup
    }
  ],
  triggers: triggers,
  outgoingDomains: [],
  botScopes: ["commands","users:read","usergroups:write", "usergroups:read"]
});

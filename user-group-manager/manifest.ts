import { Manifest } from "https://deno.land/x/deno_slack_sdk@1.4.4/mod.ts";
import { addUserToGroup, removeUserFromGroup } from "./functions/manage_user_groups.ts";
import { RequestApprovalTrigger } from "./triggers/triggers.ts";

export default Manifest({
  name: "user-group-manager",
  description: "An app that allows managing user group membership",
  icon: "assets/icon.png",
  functions: [
    {
      definition: addUserToGroup, removeUserFromGroup,
      handler: addUserToGroup, removeUserFromGroup
    }
  ],
  triggers: RequestApprovalTrigger,
  outgoingDomains: [],
  botScopes: ["commands","users:read","usergroups:write", "usergroups:read"]
});

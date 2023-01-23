
Create an approval app with workflows using Typescript and Deno 
 Advanced 
Future generation platform 
This track will guide you on how to create, run and deploy an app using the next generation Slack platform. The Request Time Off App models how to collect user inputs and send those inputs to other users in Slack. More specifically this app showcases one way user interactivity is implemented within a Slack CLI app. By the end you will have a working app that can post Block Kit messages, handle user interactions, and even update messages in real time. 
We can break this app into 3 major parts that work together to create a symphonic harmony. 
1. Functions 
2. Workflows 
3. Triggers 
Each segment will give an explanation of the components along with some tips & tricks for executing a successful path forward. 
Step 1 
Complete the Prerequisites 
Every Slack CLI app journey begins with a few common steps. Complete the prerequisites below to get started on your trek up the CLI mountain. 
Prework for the future platform. 
Before we create a harmonious collection we must warm up the instruments, in this case your local machine and terminal. Follow along with the pre-work steps to set up your machine and Slack workspace. From there you'll have the pieces to follow along. 
After you've installed the command-line interface you have two ways to dive in. 
Create a super fresh project 
You can create a fresh new project: 

1 slack create deno-approval-app 


But you'll still be presented with the paradox of choice: a totally clean project or something with some suggested structure to it. We'll walk you through the suggested structure regardless so it's best to go ahead and choose the blank project when following along directly. 
Or, use a template instead 
Of course, you could just jump right to the sample project on GitHub if you want. You can even just jumpstart your project using the CLI and skip all this copy and pasting. 
1 slack create --template https://github.com/slack-samples/deno-request-time-off 
 Step complete! 
Step 2 
Explore the Manifest At the root of every Slack CLI app there exists an app manifest that configures how an app presents itself. 
Explore the App Manifest 
The App Manifest is where we define the meat and potatoes of an app. Below is the manifest that powers the Request Time Off app: 
1 import { Manifest } from "deno-slack-sdk/mod.ts"; 
2 import { CreateTimeOffRequestWorkflow } from "./workflows/CreateTimeOffRequestWorkflow.ts"; 3 import { SendTimeOffRequestToManagerFunction } from "./functions/send_time_off_request_to_manager/definition.ts 4 
5 export default Manifest({ 
6 name: "Request Time Off", 
7 description: "Ask your manager for some time off", 
8 icon: "assets/icon.png", 
9 workflows: [CreateTimeOffRequestWorkflow], 
10 functions: [SendTimeOffRequestToManagerFunction], 
11 outgoingDomains: [], 
12 botScopes: [ 
13 "commands", 
14 "chat:write", 
15 "chat:write.public", 
16 "datastore:read", 
17 "datastore:write", 
18 ], 
19 }); 

20 
The manifest of a CLI Slack app describes the most important application information, such as its name , description , icon , the list of Workflows and Functions (among many other things). Read through the full manifest documentation to learn more. 
The following steps will guide you through how to expand the manifest file into a functional app.  Step complete! 
Step 3 
Create a Function 
Functions are where you define inputs and outputs of your app, and implement how your app transforms the inputs into outputs. 
Define a Function 
First we will define and implement our function. Functions are reusable building blocks that accept inputs, perform calculations and provide outputs. 
The code behind the app's function is stored under the ./functions/send_time_off_request_to_manager/ directory. We're working with five files inside: 
1. definition.ts : Function definition 
2. mod.ts : Function implementation 
3. block_actions.ts : Action handler for our interactive blocks. 
4. blocks.ts : A layout of visual blocks that is easy on the eyes. 
5. constants.ts : Constant variables referenced throughout the app. 
definition.ts houses the function's input_parameters , output_parameters , title , description and implementation source file. This is a custom function as opposed to built-in function, meaning the function implementation is up to you! 
Notice the interactivity parameter of type Schema.slack.types.interactivity -- one of the many built-in Slack types available to allow your function to utilize user interaction. 
1 
2 import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts"; 
3 
4 /** 
5 * Custom function that sends a message to the user's manager asking for approval 
6 * for the time off request. The message includes some Block Kit with two interactive 
7 * buttons: one to approve, and one to deny. 
8 */ 
9 export const SendTimeOffRequestToManagerFunction = DefineFunction({ 
10 callback_id: "send_time_off_request_to_manager", 
11 title: "Request Time Off", 
12 description: "Sends your manager a time off request to approve or deny", 
13 source_file: "functions/send_time_off_request_to_manager/mod.ts", 
14 input_parameters: { 

15 properties: { 
16 interactivity: { 
17 type: Schema.slack.types.interactivity, 
18 }, 
19 employee: { 
20 type: Schema.slack.types.user_id, 
21 description: "The user requesting the time off", 
22 }, 
23 manager: { 
24 type: Schema.slack.types.user_id, 
25 description: "The manager approving the time off request", 
26 }, 
27 start_date: { 
28 type: "slack#/types/date", 
29 description: "Time off start date", 
30 }, 
31 end_date: { 
32 type: "slack#/types/date", 
33 description: "Time off end date", 
34 }, 
35 reason: { 
36 type: Schema.types.string, 
37 description: "The reason for the time off request", 
38 }, 
39 }, 
40 required: [ 
41 "employee", 
42 "manager", 
43 "start_date", 
44 "end_date", 
45 "interactivity", 
46 ], 
47 }, 
48 output_parameters: { 
49 properties: {}, 
50 required: [], 
51 }, 
52 }); 
blocks.ts 
Block kit element layouts are stored inside of this file. Inside you will find a block definition for a message containing the user input of requested dates off. 
1 /** 
2 * Based on user-inputted data, assemble a Block Kit approval message for easy 
3 * parsing by the approving manager. 
4 */ 
5 // deno-lint-ignore no-explicit-any 
6 export default function timeOffRequestHeaderBlocks(inputs: any): any[] { 
7 return [ 
8 { 
9 type: "header", 
10 text: { 
11 type: "plain_text", 
12 text: `A new time-off request has been submitted`, 
13 }, 
14 }, 
15 { 
16 type: "section", 

17 text: { 
18 type: "mrkdwn", 
19 text: `*From:* <@${inputs.employee}>`, 
20 }, 
21 }, 
22 { 
23 type: "section", 
24 text: { 
25 type: "mrkdwn", 
26 text: `*Dates:* ${inputs.start_date} to ${inputs.end_date}`, 
27 }, 
28 }, 
29 { 
30 type: "section", 
31 text: { 
32 type: "mrkdwn", 
33 text: `*Reason:* ${inputs.reason ? inputs.reason : "N/A"}`, 
34 }, 
35 }, 
36 ]; 
37 } 
38 
Implement a Custom Function 
Now that your custom function is defined, we will bring it to life by filling out the mod.ts file with various API calls and Block Kit blocks. 
Remember, the Request Time Off app collects the time off start and end dates and sends that request to a manager for approval. We can utilize Block Kit buttons to help facilitate the decision process and give the user a richer experience. 
1 import { SendTimeOffRequestToManagerFunction } from "./definition.ts"; 
2 import { SlackAPI } from "deno-slack-api/mod.ts"; 
3 import { SlackFunction } from "deno-slack-sdk/mod.ts"; 
4 import BlockActionHandler from "./block_actions.ts"; 
5 import { APPROVE_ID, DENY_ID } from "./constants.ts"; 
6 import timeOffRequestHeaderBlocks from "./blocks.ts"; 
7 
8 // Custom function that sends a message to the user's manager asking 
9 // for approval for the time off request. The message includes some Block Kit with two 
10 // interactive buttons: one to approve, and one to deny. 
11 export default SlackFunction( 
12 SendTimeOffRequestToManagerFunction, 
13 async ({ inputs, token }) => { 
14 console.log("Forwarding the following time off request:", inputs); 
15 const client = SlackAPI(token, {}); 
16 
17 // Create a block of Block Kit elements composed of several header blocks 
18 // plus the interactive approve/deny buttons at the end 
19 const blocks = timeOffRequestHeaderBlocks(inputs).concat([{ 
20 "type": "actions", 
21 "block_id": "approve-deny-buttons", 
22 "elements": [ 
23 { 
24 type: "button", 
25 text: { 
26 type: "plain_text", 

27 text: "Approve", 
28 }, 
29 action_id: APPROVE_ID, // <-- important! we will differentiate between buttons using these IDs 30 style: "primary", 
31 }, 
32 { 
33 type: "button", 
34 text: { 
35 type: "plain_text", 
36 text: "Deny", 
37 }, 
38 action_id: DENY_ID, // <-- important! we will differentiate between buttons using these IDs 39 style: "danger", 
40 }, 
41 ], 
42 }]); 
Now you've created a message with two buttons, each using a unique ACTION_ID to differentiate between an approval or denial of time off. In order to properly utilize the Block Kit buttons, we will rely on the  BlockActionsHandler to route the button actions. Check it out below: 
1 // Send the message to the manager 
2 const msgResponse = await client.chat.postMessage({ 
3 channel: inputs.manager, 
4 blocks, 
5 // Fallback text to use when rich media can't be displayed (i.e. notifications) as well as for screen rea 6 text: "A new time off request has been submitted", 
7 }); 
8 
9 if (!msgResponse.ok) { 
10 console.log("Error during request chat.postMessage!", msgResponse.error); 
11 } 
12 
13 // IMPORTANT! Set `completed` to false in order to keep the interactivity 
14 // points (the approve/deny buttons) "alive" 
15 // We will set the function's complete state in the button handlers below. 
16 return { 
17 completed: false, 
18 }; 
19 }, 
20 // Create an 'actions router' which is a helper utility to route interactions 
21 // with different interactive Block Kit elements (like buttons!) 
22 ).addBlockActionsHandler( 
23 // listen for interactions with components with the following action_ids 
24 [APPROVE_ID, DENY_ID], 
25 // interactions with the above components get handled by the function below 
26 BlockActionHandler, 
27 ); 
This mods.ts is responsible for building a rich message to the selected manager and replying with a response that is triggered by the decision of that manager. How do we connect these function steps you may ask? Not to worry, our next step covers how to bring together the functions using a workflow! 
 Step complete! 

Step 4 


Create a Workflow Create a workflow that gives your app some functionality. 
Define a Workflow 
A workflow is a set of steps that are executed in order. Each step in a workflow is a Function. Similar to functions, workflows can also optionally accept input and pass it further along to functions that make up the workflow. 
This app contains a single workflow stored under the workflows/ folder. 
This app's workflow is composed of two functions chained sequentially as steps: 
1. The workflow uses the OpenForm Built-in Function to collect data from the user that triggered the workflow. 2. Form data is then passed to your app's Custom Function, called SendTimeOffRequestToManagerFunction . This function is stored under the functions/ folder. 
First define the workflow with the DefineWorkflow method. Making sure to set a custom callback_id that you can reference later on once we create our trigger. 
1 /** 
2 * A workflow composed of two steps: asking for time off details from the user 
3 * that started the workflow, and then forwarding the details along with two 
4 * buttons (approve and deny) to the user's manager. 
5 */ 
6 export const CreateTimeOffRequestWorkflow = DefineWorkflow({ 
7 callback_id: "create_time_off", 
8 title: "Request Time Off", 
9 description: 
10 "Create a time off request and send it for approval to your manager", 
11 input_parameters: { 
12 properties: { 
13 interactivity: { 
14 type: Schema.slack.types.interactivity, 
15 }, 
16 }, 
17 required: ["interactivity"], 
18 }, 
19 }); 
Then place the functions in order of execution. In this case, using the built-in  OpenForm function to bring up a modal to collect the time off request, then using the custom function you built to send the request for approval. 
1 // Step 1: opening a form for the user to input their time off details. 
2 const formData = CreateTimeOffRequestWorkflow.addStep( 
3 Schema.slack.functions.OpenForm, 
4 { 
5 title: "Time Off Details", 
6 interactivity: CreateTimeOffRequestWorkflow.inputs.interactivity, 
7 submit_label: "Submit", 
8 description: "Enter your time off request details", 
9 fields: { 
10 required: ["manager", "start_date", "end_date"], 

11 elements: [ 
12 { 
13 name: "manager", 
14 title: "Manager", 
15 type: Schema.slack.types.user_id, 
16 }, 
17 { 
18 name: "start_date", 
19 title: "Start Date", 
20 type: "slack#/types/date", 
21 }, 
22 { 
23 name: "end_date", 
24 title: "End Date", 
25 type: "slack#/types/date", 
26 }, 
27 { 
28 name: "reason", 
29 title: "Reason", 
30 type: Schema.types.string, 
31 }, 
32 ], 
33 }, 
34 }, 
35 ); 
36 
37 // Step 2: send time off request details along with approve/deny buttons to manager 
38 CreateTimeOffRequestWorkflow.addStep(SendTimeOffRequestToManagerFunction, { 
39 interactivity: formData.outputs.interactivity, 
40 employee: CreateTimeOffRequestWorkflow.inputs.interactivity.interactor.id, 
41 manager: formData.outputs.fields.manager, 
42 start_date: formData.outputs.fields.start_date, 
43 end_date: formData.outputs.fields.end_date, 
44 reason: formData.outputs.fields.reason, 
45 }); 
46 
Now with a trusty workflow in tow, you must define a trigger to get the wheels turning! Check out the next step to learn more about to ignite your Workflow. 
 Step complete! 
Step 5 
Create a Trigger Now that you've been acquainted with functions and workflows, lets dive into the last building block—triggers. 
Create a Trigger 
A trigger is a crucial finishing piece of your Slack CLI app. Creating a trigger ignites the steps of your workflow, running your custom & built-in functions, allowing your app to provide a pleasant experience. 
These triggers can be invoked by a user, or automatically as a response to an event within Slack. 
A link trigger is a type of trigger that generates a shortcut URL which, when posted in a channel or added as a bookmark, becomes a link. When clicked, the link trigger will run the associated workflow. 
To create a link trigger for the "Request Time Off" workflow, run the following command: 
1 $ slack trigger create --trigger-def triggers/trigger.ts 
After selecting a workspace, the output provided will include the Link Trigger URL. Copy and paste this URL into a channel as a message, or add it as a bookmark in a channel of the workspace you selected. 
Note: this link won't run the workflow until the app is either running locally or deployed! Read on to learn how to run your app locally and eventually deploy it to Slack hosting. 
 Step complete! 
Step 6 
Run, Deploy and Beyond Finishing touches for this app but not the end of your Slack CLI journey. 
Run your app 
There are two CLI commands to consider once you are ready to test your app or deploy your app to a workspace for other users to experience. 
For now, you'll want to locally install the app to the workspace. From the command line, within your app's root folder, run the following command: 
1 $ slack run 
Proceed through the prompts until you have a local server running in that terminal instance. 
It's installed! Utilize your link trigger that was defined in the previous step to start using your app! 
Deploy your app 
When you're ready to make the app accessible to others, you'll want to deploy it instead of running it: 1 $ slack deploy 
Congratulations! You've successfully built a approval workflow app, providing snazzy buttons to all who request time off. 
Going Above & Beyond 
Now that we've posted a message using Block Kit, handled the user interaction of buttons and updated a message -- you now have the capability to either extend this app or create a new one from scratch! 
Be sure to check out other tracks: Welcome Bot or Create a Github issue and more. These tracks are meant to be remixed and expanded upon, so we encourage you to continue on your journey that's just begun! 
How would you rate the overall developer experience of building & deploying functions and workflows to Slack? 
�� 2 3 4 �� Complete this survey 

 
Step complete! 

Was this page helpful? Yes No Docs 

Start learning Authentication 
Messaging Metadata 

Surfaces Block Kit 
Interactivity APIs 
Workflows Enterprise 
Apps for Admins Gov Slack 
Keep updated 
Subscribe to our changelog to see the latest changes to the Slack platform. 
Subscribe 
Join our community 
Connect with other developers, builders, designers, and product managers to build the future of work. Join 

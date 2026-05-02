import { Router } from "express";
import { requireAuth } from "../middleware/authetication.middleware";
import { createGroup } from "../controller/group/createGroup.controller";
import { deleteGroup } from "../controller/group/deleteGroup.controller";
import { getGroups } from "../controller/group/getGroups.controller";
import { modifyGroup } from "../controller/group/manageGroupAccess.controller";
import { getUserNotifications } from "../controller/group/userGroupNotification.controller";
import { respondToInvite } from "../controller/group/userNotificationResponse.controller";
const groupRouter = Router();

groupRouter.post("/creategroup/:name",requireAuth, createGroup); //Create Group Route
groupRouter.delete("/deletegroup/:groupId",requireAuth, deleteGroup); //Delete Group Route
groupRouter.get("/getgroups/:email",requireAuth, getGroups);  //Get Groups for a user
groupRouter.put("/manageGroupAccess/:groupId/:email/:action",requireAuth, modifyGroup);  //Modify Group Route (add/remove user)
groupRouter.get("/userNotifications",requireAuth, getUserNotifications); //Get user notifications for group invites 
groupRouter.post("/respondToInvite/:groupId/:action",requireAuth, respondToInvite); //Respond to group invite

export default groupRouter;

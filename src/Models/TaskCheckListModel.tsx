import { UserTaskCheckListModel } from "./UserTaskCheckList";

export interface TaskCheckListModel {
categoryId:number;
checkListDescription: string
id:number
isDevChecked: false
isQAChecked: false
projectId: number
taskId: number
uiId:number
usId:number
userStoryUIId: number,
userTaskCheckList:UserTaskCheckListModel

};
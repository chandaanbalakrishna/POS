export interface UserTaskCheckListModel {
    categoryId:number;
    checkListDescription: string
    id:number;
    taskCheckListId:number;
    isDevChecked: boolean
    isQAChecked: boolean
    projectId: number
    taskId: number
    uiId:number
    usId:number
    userStoryUIId: number,
    isLatest:boolean
    };
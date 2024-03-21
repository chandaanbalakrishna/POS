export interface TaskCheckList {
    employeeId:number,
    uIUserStoryId:number;
    uIId:number;
    userStoryId:number;
    projectId:number;
    categoryId:number;
    name:string;
    description:string;
    actualStartDate: Date;
    actualEndDate: Date;
    estTime:number;
    actTime:number;
    weekEndingDate:Date;
    status:string;
    priority:string;
    percentage:number;
    Comment:string;
    EstimateStartDate:Date;
    EstimateEndDate:Date;
    taskType:string;
    classification:string;
    taskDescription:string;
    checkListDescriptions: string[];
}
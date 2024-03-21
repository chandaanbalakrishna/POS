export interface TaskModel {
    id:number;
    employeeTaskId:number;
    uIUserStoryId:number;
    projectId:number;
    categoryId:number;
    name:string;
    description:string;
    startDate:Date;
    endDate:Date;
    estTime:number;
    actTime:number;
    weekEndingDate:Date;
    status:string;
    priority:string;
    percentage:number;
    createdDate:Date;
    createdBy:string;
    updatedDate:Date;
    updatedBy:string;
    taskDescription:string;
    taskType:string;
    }

   
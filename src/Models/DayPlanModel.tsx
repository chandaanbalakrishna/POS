export interface DayPlanModel {
    id:number;
    employeeId:number;
    taskId:number;
    projectId:number;
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
    estStartDate:Date;
    estEndDate:Date;
    Comment: string;
    createdBy:string;
    }

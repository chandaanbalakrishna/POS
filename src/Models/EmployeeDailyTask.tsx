import { EmployeeTask } from "./EmployeeTask";

export interface EmployeeDailyTask {
    id:number,
    employeeId:number,
    taskId:number;
    employeeTaskId:number;
    projectObjectiveId:number;
    employeeName:string;
    projectName:string;
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
    comment: string;
    workedOn:Date;
    taskDescription:string;
    employeeTask : EmployeeTask;
    taskChecklistId:number[];
}
export interface Comments {
    id: number;
    projectId: number;
    taskId: number;
    employeeTaskId: number;
    employeeDailyTaskId: number;
    employeeId: number;
    employeeTimeId: number;
    comment: string;
    employeeName:string;
    status:string;
    percentage:number;
    createdOn:Date;
    createdBy:string;
    project:string;
    employee:string;
    createdDate:Date;
  }
  
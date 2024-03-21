export interface TimePlan {
    id:number;
    employeeId:number,
    DayPlanId:number;
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
}
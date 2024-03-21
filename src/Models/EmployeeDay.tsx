export interface EmployeeDay {
    id:number;
    dayId:number;
    present:number;
    absent:number;
    date:Date;
    inTime:Date;
    outTime:Date;
    late:number;
  }
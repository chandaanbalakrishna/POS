export interface EmployeeLeave {
    id:number;
    EmployeeId:number;
    leaveType:string;
    leaveSubType:string;
    leaveRequestDate :Date[];
    createdDate:Date;
    leaveReason :string;
    leaveStatus :string;
}
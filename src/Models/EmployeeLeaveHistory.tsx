export interface EmployeeLeaveHistory {
    id:number;
    leaveId:number;
    employeeId:number;
    leaveRequestDate :Date;
    approveStatus:string;
    leaveType:string;
    leaveSubType:string;
    leaveReason:string;
}
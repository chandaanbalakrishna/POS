export interface EmployeeStat {
    totalProject:number;
    totalTask: number;
    inProgressTask: number;
    completedTask: number;
  }

export interface DailyTaskStat{
  dailyTaskAct:number;
  dailyTaskEst: number;
  employeeTaskEst: number
}
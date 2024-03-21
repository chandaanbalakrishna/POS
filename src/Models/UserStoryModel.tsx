export interface UserStory {
    id:number;
    projectId:number;
    name: string;
    description: string;
    status: string;
    percentage : number;
    startDate: Date;
    endDate:Date;
  }
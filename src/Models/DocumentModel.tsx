export interface DocumentModel {
contentType(data: any, fileName: any, contentType: any): unknown;
content: any;
id:number;
tableName:string;
attributeId:number;
projectId:number;
docType:string;
fileName:string;
fileType:string;
filePath:string;
isActive:boolean;
}
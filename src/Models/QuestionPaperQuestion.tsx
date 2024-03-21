import { QuestionPaper } from "./QuestionPaper";

export interface QuestionPaperQuestion {
    questionPaperId: number,
    questionTypeName: string,
    qText: string,
    isMandatory: boolean,
    additionalComment: boolean,
    displaySequence: number,
    id: number,
    questionPaper : QuestionPaper
}
import { Request, Response } from "express";
import { Issue, IssueType } from "../models/Issue";

export const dashboardController = (req: Request, res: Response) => {

    let issues: IssueType[] = [];
    for (let i = 0; i < 10; i++) {
        issues.push(new Issue({
            title: 'title' + i,
            description: 'description' + i,
            status: 1
        }))
    }



    res.render("dashboard", {issues: issues});
};

import { Request, Response } from "express";
import { Issue, IssueType } from "../models/Issue";
var ObjectId = require('mongodb').ObjectID;

export const list = (req: Request, res: Response) => {

    let issues: IssueType[] = [];
    for (let i = 0; i < 10; i++) {
        issues.push(new Issue({
            title: 'title' + i,
            description: 'description' + i,
            status: 1
        }))
    }

    res.json(issues);
};

export const update = async (req: Request, res: Response) => {

    const body = req.body;
    const id = ObjectId(req.params.id);
    const model = await Issue.findByIdAndUpdate(id, body, {upsert: true});
    res.json(body);
};

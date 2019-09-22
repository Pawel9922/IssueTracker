import { Request, Response } from "express";
import { Issue } from "../models/Issue";
const ObjectId = require('mongodb').ObjectID;

export const list = async (req: Request, res: Response, next: Function) => {

    const issues = await Issue.find().catch(err => {
        next(err);
    });
    res.json(issues);
};

export const update = async (req: Request, res: Response, next: Function) => {

    const body = req.body;
    const id = ObjectId(req.params.id);
    await Issue.findByIdAndUpdate(id, body).catch(err => {
        next(err);
    });
    res.send();
};

export const add = async (req: Request, res: Response, next: Function) => {

    const body = req.body;
    const issue = new Issue(body);
    await issue.save().catch(err => {
        next(err);
    });
    res.json(issue);
};

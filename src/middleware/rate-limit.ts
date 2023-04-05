import NodeCache from "node-cache";
import {Request, Response, NextFunction} from "express";

let count = 1;
const myCache = new NodeCache();

export const rateLimitGuard = async (req: Request, res: Response, next: NextFunction) => {
    const url = req.url
    const tracker = req.ip;
    const prefixAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unKnown';
    const generateKey = (url: string, agentContext: string, suffix: string): string => {
        return `${url}-${agentContext}-${suffix}`
    }
    const key = generateKey(url, prefixAgent, tracker);

    if (myCache.has(`${key}`)) {
        const foo = myCache.get(`${key}`)
        if(Number(foo) > 4) {
            res.sendStatus(429)

            return;
        }
        count = Number(foo) + 1;
    }
    myCache.set(`${key}`, count, 10);
    count = 1;
    next()
}
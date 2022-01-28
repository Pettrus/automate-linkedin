import nc from "next-connect";
import { getUnreadMessages, sendMessage } from "@scripts/linkedin";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization;

      const messages = await getUnreadMessages(token!);

      res.json(messages);
    } catch (e) {
      res.status(401).end();
    }
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization;

    await sendMessage(req.body, token!);

    res.status(200).end();
  });

export default handler;

import nc from "next-connect";
import { getUnreadMessages, sendMessage } from "@scripts/linkedin";

const handler = nc()
  .get(async (req, res) => {
    try {
      const token = req.headers.authorization;

      const messages = await getUnreadMessages(token!);

      res.json(messages);
    } catch (e) {
      res.status(401).end();
    }
  })
  .post(async (req, res) => {
    const token = req.headers.authorization;

    await sendMessage(req.body, token!);

    res.status(200).end();
  });

export default handler;

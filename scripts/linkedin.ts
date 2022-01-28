import { Action } from "@interfaces/index";
import { Message } from "@interfaces/message";
import puppeteer from "puppeteer";

const login = async (token: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", `--window-size=1366,768`],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  await page.setCookie({
    name: "li_at",
    value: token,
    domain: ".www.linkedin.com",
  });

  await Promise.all([
    page.goto("https://www.linkedin.com/"),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  return {
    page,
    browser,
  };
};

export const getUnreadMessages = async (token: string): Promise<Message[]> => {
  const { page, browser } = await login(token);

  const hasLoggedIn = await page.$(".msg-conversation-card");

  if (hasLoggedIn == null) {
    await browser.close();
    throw new Error("Invalid Credentials");
  }

  const conversations = await page.$$eval(".msg-conversation-card", (nodes) =>
    nodes.map((element): any => {
      const appMessage = element.querySelector(
        ".msg-conversation-card__message-snippet-body"
      ) as HTMLElement;
      const inMail = element.querySelector(
        ".msg-overlay-list-bubble__message-snippet--v2"
      ) as HTMLElement;
      const title = element.querySelector(
        ".msg-conversation-listitem__participant-names"
      ) as HTMLElement;
      const isNew = element.querySelector(".t-normal");
      const image = element.querySelector("img")?.src;

      return {
        title: title.innerText,
        message: (inMail != null ? inMail : appMessage).innerText,
        isNew: isNew == null,
        image,
      };
    })
  );

  await browser.close();

  if (conversations) {
    return conversations.filter((c) => c.isNew);
  }

  return [];
};

export const sendMessage = async (actions: Action[], token: string) => {
  const { page, browser } = await login(token);

  await page.waitForSelector(
    ".msg-overlay-list-bubble__convo-card-content-wrapper"
  );

  const elements = await page.$$(
    ".msg-overlay-list-bubble__convo-card-content-wrapper"
  );

  for (let i = 0; i < elements.length; i++) {
    const titleNode = await elements[i].$(
      ".msg-conversation-listitem__participant-names"
    );

    const title = await page.evaluate((el) => el.innerText, titleNode);

    const action = actions.find((action) => action.message.title === title);

    if (action != null) {
      await elements[i].click();

      await page.waitForSelector(".msg-form__contenteditable");

      if (action.actionType === "INTERACT") {
        const greetingMessage =
          action.language === "ENGLISH"
            ? `Hello ${action.message.title} thanks but i am not interested :)`
            : `Olá ${action.message.title} obrigado mas não tenho interesse no momento :)`;

        await page.type(".msg-form__contenteditable", greetingMessage);
        await page.waitForSelector(
          "button.msg-form__send-button:not([disabled])"
        );

        await page.click(".msg-form__send-button");

        await page.waitForSelector("button.msg-form__send-button[disabled]");
      }

      await page.click(
        '[data-control-name="overlay.close_conversation_window"]'
      );
      await page.waitForSelector(
        '[data-control-name="overlay.close_conversation_window"]',
        { hidden: true }
      );
    }
  }

  await browser.close();
};

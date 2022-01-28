import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Router from "next/router";
import Image from "next/image";
import { Message, Language, ActionType, Action } from "@interfaces/index";

const URL = "/api/messages";

const Automation: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [headers, setHeaders] = useState<HeadersInit>();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    getMessages();
  }, []);

  useEffect(() => {
    if (messages.length > 0 && actions.length === messages.length) {
      sendMessages();
    }
  }, [actions, messages]);

  const sendMessages = async () => {
    setLoading(true);
    await fetch(URL, {
      method: "POST",
      headers,
      body: JSON.stringify(actions),
    });

    setMessages([]);
    setLoading(false);
  };

  const getMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token == null) {
        Router.push("/");
      } else {
        const authorization = {
          Authorization: token as string,
          "Content-Type": "application/json",
        };

        setHeaders(authorization);

        const res = await fetch(URL, {
          headers: authorization,
        });

        if (!res.ok) {
          throw res;
        }

        setMessages(await res.json());
        setLoading(false);
      }
    } catch (e: any) {
      if (e.status === 401) {
        Router.push("/");
      } else {
        setLoading(false);
        setErrorMessage("Something went wrong try again later");
      }
    }
  };

  const addMessage = (
    message: Message,
    language: Language,
    actionType: ActionType = "INTERACT"
  ) => {
    const action: Action = {
      message,
      language,
      actionType,
    };

    setActions((oldArray: Action[]) => [...oldArray, action]);
    setCurrentMessageIndex(currentMessageIndex + 1);
  };

  const renderMessages = () => {
    const message = messages[currentMessageIndex];

    return (
      <div className="lg:min-w-[450px] max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20 mx-auto">
        <div className="flex justify-center md:justify-end -mt-16">
          <img
            className="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
            alt="Profile pic"
            src={message.image}
          />
        </div>
        <div>
          <h2 className="text-gray-800 text-3xl font-semibold">
            {message.title}
          </h2>
          <p className="mt-2 text-gray-600">{message.message}</p>
        </div>

        <div className="flex items-center justify-between mt-4 mt-8">
          <div>
            <button
              type="button"
              className="text-l font-medium text-indigo-500"
              onClick={() => addMessage(message, "PORTUGUESE", "READ")}
            >
              Just Read
            </button>
          </div>

          <div>
            <button
              type="button"
              className="mr-1 px-4 py-2 rounded-md text-sm font-medium border-0 focus:outline-none focus:ring transition text-white bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:ring-gray-300"
              onClick={() => addMessage(message, "ENGLISH")}
            >
              English
            </button>

            <button
              type="button"
              className="px-4 py-2 rounded-md text-sm font-medium border-0 focus:outline-none focus:ring transition text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-300"
              onClick={() => addMessage(message, "PORTUGUESE")}
            >
              Portuguese
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{{ errorMessage }}</div>;
  }

  return (
    <>
      {messages?.length > 0 &&
        messages?.length > currentMessageIndex &&
        renderMessages()}

      {messages == null ||
        (messages.length === 0 && <div>No unread messages anymore</div>)}
    </>
  );
};

export default Automation;

import { useState } from "react";
import type { NextPage } from "next";
import Router from "next/router";
import Modal from "components/modal";

const Home: NextPage = () => {
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);

  const submitToken = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();

    localStorage.setItem("token", token);

    Router.push("/messages");
  };

  const renderModal = () => (
    <Modal title="What is the li_at token?" close={() => setShowModal(false)}>
      Placeholder
    </Modal>
  );

  /*
<div className="text-center">
            <a
              className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
              onClick={() => setShowModal(true)}
            >
              What is the li_at token?
            </a>
          </div>
  */

  return (
    <>
      {showModal && renderModal()}
      <div
        className="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
        style={{
          backgroundImage: "url('https://picsum.photos/600/600')",
        }}
      ></div>
      <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
        <h3 className="pt-4 text-2xl text-center">
          Insert your LinkedIn token
        </h3>
        <form
          onSubmit={submitToken}
          className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
        >
          <div className="mb-4">
            <input
              className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Token li_at"
              value={token}
              onChange={(evt) => setToken(evt.target.value)}
            />
          </div>
          <div className="mb-6 text-center">
            <button
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Start automating
            </button>
          </div>
          <hr className="mb-6 border-t" />
        </form>
      </div>
    </>
  );
};

export default Home;

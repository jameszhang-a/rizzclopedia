import { showNotification } from "@mantine/notifications";
import { type NextPage } from "next";
import Image from "next/image";
import Head from "next/head";

import { useState, useEffect } from "react";
import RizzRow from "~/components/RizzRow";

import { api, type RouterOutputs } from "~/utils/api";

type Rizz = RouterOutputs["rizz"]["getAll"];

const rizzAPI = api.rizz;

const Home: NextPage = () => {
  const [cook, cooking] = useState("");
  const [rizz, rizzling] = useState<Rizz>([]);
  const [order, setOrder] = useState<string>("vote");

  const { getAll, submit } = rizzAPI;

  const { data: rizzData } = getAll.useQuery();

  useEffect(() => {
    if (rizzData) {
      rizzling(rizzData);
    }
  }, [rizzData]);

  const rizzCreation = submit.useMutation({
    onSuccess(data) {
      if (data) {
        rizzling((prev) => [...prev, data]);
        showNotification({
          message: "Rizz added! 💦",
          autoClose: 1500,
        });
      }
    },
    onError: (error) => {
      showNotification({
        message: error.message,
        autoClose: 1500,
        color: "red",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    rizzCreation.mutate({ name: cook });
    cooking("");
  };

  const handleOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value);
    switch (e.target.value) {
      case "vote":
        rizzling((prev) => [...prev].sort((a, b) => b.votes - a.votes));
        break;

      case "alphabetical":
        rizzling((prev) =>
          [...prev].sort((a, b) => a.rizz.localeCompare(b.rizz))
        );
        break;
    }
  };

  return (
    <>
      <Head>
        <title>The Rizzclopedia</title>
        <meta name="description" content="For all your rizz needs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] font-medium">
        <div className="px-4 py-16">
          <h1 className="text-xxl font-extrabold tracking-tight text-white sm:text-[4rem]">
            The <span className="text-[hsl(280,100%,70%)]">Rizzclopedia</span>
          </h1>
        </div>

        <section about="Rizz ranking" className="w-screen px-7 sm:w-[500px]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-row items-center justify-center"
          >
            <input
              type="text"
              name="habit"
              className="mr-1 rounded p-1"
              value={cook}
              onChange={(e) => cooking(e.target.value)}
            />
            <button
              type="submit"
              className="mx-1 rounded bg-sky-400 px-3 py-1 text-white hover:bg-sky-300"
            >
              add
            </button>
          </form>

          <div className="m-4" />

          <div>
            <label htmlFor="order" className="mr-2 text-white">
              Sort:
            </label>
            <select
              name="order"
              id="order"
              value={order}
              onChange={handleOrder}
              className="w-24 rounded"
            >
              <option value="vote">by vote</option>
              <option value="alphabetical">by name</option>
            </select>
          </div>

          <div className="m-7" />

          <ul className="mb-6 flex flex-col">
            {rizz.length < 1 ? (
              <div className="flex flex-row items-center gap-2">
                <Image
                  src="/Rolling-1s-200px.svg"
                  alt="spinner image"
                  className="animate-spin"
                  width={50}
                  height={50}
                ></Image>{" "}
                Loading...
              </div>
            ) : (
              rizz.map((rizz) => (
                <li key={rizz.id} className="pb-2">
                  <RizzRow data={rizz} />
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </>
  );
};

export default Home;

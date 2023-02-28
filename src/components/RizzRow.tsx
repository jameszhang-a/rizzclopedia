import { useEffect, useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";

import { showNotification } from "@mantine/notifications";
import Image from "next/image";

import { default as c } from "classnames";

type Rizz = RouterOutputs["rizz"]["getAll"][number];

type Props = {
  data: Rizz;
};

const LIKE_TIMEOUT = 2 * 60 * 1000;
const likeButton = "flex flex-row items-center gap-1 rounded px-2 py-1";

const rizzAPI = api.rizz;

const RizzRow = ({ data }: Props) => {
  const [likes, setLikes] = useState(data.votes);
  const [canLike, setCanLike] = useState(true);
  const [startTimer, setStartTimer] = useState(false);
  const [clicked, setClicked] = useState(false);

  const { upvote } = rizzAPI;

  const likeCreation = upvote.useMutation({
    onSuccess(data) {
      setLikes(data.votes);
    },
  });

  const handleLike = () => {
    likeCreation.mutate({ id: data.id });
    setCanLike(false);
    setStartTimer(true);
    setClicked(true);

    showNotification({
      message: "Liked!",
      color: "teal",
      autoClose: 1500,
    });
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (startTimer) {
      timeout = setTimeout(() => {
        setCanLike(true);
        setStartTimer(false);
      }, LIKE_TIMEOUT);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [startTimer]);
  console.log(clicked);

  return (
    <div className="around flex flex-row justify-between rounded-lg text-white">
      <span className="capitalize">{data.rizz}</span>
      <div className="flex flex-row">
        <button
          onClick={handleLike}
          className={c(
            likeButton,
            canLike ? "bg-sky-400" : "bg-red-400",
            clicked ? "animate-wiggle" : ""
          )}
          disabled={!canLike}
          onAnimationEnd={() => setClicked(false)}
        >
          <Image
            src="./heart-white.svg"
            alt="heart icon"
            width={20}
            height={20}
          />
          <span className="min-w-[2rem] text-center">{likes}</span>
        </button>
      </div>
    </div>
  );
};

export default RizzRow;

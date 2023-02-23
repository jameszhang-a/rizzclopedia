import { useEffect, useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";

type Rizz = RouterOutputs["rizz"]["getAll"][number];

type Props = {
  data: Rizz;
};

const rizzAPI = api.rizz;
const LIKE_TIMEOUT = 2 * 60 * 1000;

const RizzRow = ({ data }: Props) => {
  const [likes, setLikes] = useState(data.votes);
  const [canLike, setCanLike] = useState(true);
  const [startTimer, setStartTimer] = useState(false);

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

  return (
    <div className="around flex w-[400px] flex-row justify-between rounded-lg pb-2 text-white md:w-[500px]">
      <span className="capitalize">{data.rizz}</span>

      <div className="flex flex-row">
        {canLike ? (
          <button
            onClick={handleLike}
            className="mx-2 max-h-6 rounded bg-sky-400 px-3 hover:bg-sky-300 hover:px-[13px]"
          >
            ♥
          </button>
        ) : (
          <button
            onClick={handleLike}
            className="mx-2 rounded bg-red-400 px-3 "
            disabled
          >
            ♥
          </button>
        )}

        <div className="min-w-[2rem] text-center">{likes}</div>
        {/* <button
                      onClick={() => downvoteCreation.mutate({ id: rizz.id })}
                      className="mx-2 rounded bg-sky-400 px-3 hover:bg-sky-300"
                    >
                      -
                    </button> */}
      </div>
    </div>
  );
};

export default RizzRow;

import React, { useState, useEffect, useCallback } from "react";
import { RankingsObject } from "../common/types";
import { addRanking } from "../common/api";
import { getRankingColor } from "../common/utils";

interface RankingModalProps {
  item: RankingsObject;
  rankings: RankingsObject[];
  appendRankingItem: (ranking: RankingsObject) => void;
  onClose: (isRanked: boolean) => boolean;
  updateShowRankingModal: (showRankingModal: boolean) => void;
  removeBookmarksItem: (bookmark: RankingsObject) => void;
}

const RankingModal: React.FC<RankingModalProps> = ({
  item,
  rankings,
  appendRankingItem,
  onClose,
  updateShowRankingModal,
  removeBookmarksItem,
}) => {
  const [rankingGroup, setRankingGroup] = useState<string | null>(null);
  const [rankingItemIndex, setRankingItemIndex] = useState<number | null>(null);
  const [newRankings, setNewRankings] = useState<RankingsObject[]>(
    [] as RankingsObject[]
  );
  const [bounds, setBounds] = useState<number[]>([0, 1000]);
  const [isFinished, setIsFinished] = useState(false);

  const assignRankings = useCallback(() => {
    let maxValue = 0;
    let minValue = 0;
    if (rankingGroup === "bad") {
      minValue = 0;
      maxValue = 3.3;
    } else if (rankingGroup === "mid") {
      minValue = 3.4;
      maxValue = 6.6;
    } else if (rankingGroup === "good") {
      minValue = 6.7;
      maxValue = 10;
    }

    for (let i = 0; i < newRankings.length; i++) {
      const fraction = (i + 1) / newRankings.length;
      const value = minValue + fraction * (maxValue - minValue);
      newRankings[i].ranking = parseFloat(value.toFixed(2));
    }
    return newRankings;
  }, [newRankings, rankingGroup]);

  const handleSubmit = useCallback(async () => {
    const userRankings = assignRankings();
    try {
      await addRanking(userRankings);
      onClose(true);
    } catch (error) {
      console.error(error);
    }
  }, [onClose, assignRankings]);

  useEffect(() => {
    setRankingGroup(null);
    setRankingItemIndex(null);
    const sortedRankings = rankings.sort((a, b) => a.ranking - b.ranking);
    setNewRankings([...sortedRankings]);
  }, [rankings]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose(false);
      }
    };
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (rankingGroup !== null && !isFinished) {
      setBounds([0, newRankings.length]);
      const midIndex = Math.floor(newRankings.length / 2);
      setRankingItemIndex(midIndex);
    }
  }, [newRankings, handleSubmit, isFinished, rankingGroup]);

  useEffect(() => {
    if (bounds[0] >= bounds[1]) {
      setIsFinished(true);
      setNewRankings((prevNewRankings) => {
        const newNewRankings = [...prevNewRankings];
        newNewRankings.splice(bounds[0], 0, item);
        return newNewRankings;
      });
    } else {
      const midIndex = Math.floor((bounds[0] + bounds[1]) / 2);
      setRankingItemIndex(midIndex);
    }
  }, [bounds, setIsFinished, item, updateShowRankingModal]);

  useEffect(() => {
    if (isFinished) {
      appendRankingItem(item);
      removeBookmarksItem(item);
      handleSubmit().catch((error) => {
        console.error("Error in handleSubmit:", error);
      });

      updateShowRankingModal(false);
    }
  }, [
    isFinished,
    appendRankingItem,
    handleSubmit,
    updateShowRankingModal,
    newRankings,
    item,
    removeBookmarksItem,
  ]);

  const handleRanking = (isHigher: boolean) => {
    // isHigher is true if the chosen ranking is higher than the current anime's intrinsic ranking
    if (rankingItemIndex !== null) {
      setBounds((prevBounds) => {
        if (!isHigher) {
          return [rankingItemIndex + 1, prevBounds[1]];
        } else {
          return [prevBounds[0], rankingItemIndex];
        }
      });
    }
  };

  const handleRankingGroup = (rankingGroup: string) => {
    setRankingGroup(rankingGroup);
    if (rankingGroup === "good") {
      setNewRankings(newRankings.filter((item) => item.ranking >= 6.7));
    } else if (rankingGroup === "mid") {
      setNewRankings(
        newRankings.filter((item) => item.ranking >= 3.4 && item.ranking < 6.7)
      );
    } else if (rankingGroup === "bad") {
      setNewRankings(newRankings.filter((item) => item.ranking < 3.4));
    }
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center p-4 text-center items-center">
          <div className="min-h-full relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg">
            <div className="mt-5 px-4 text-left pointer-events-none">
              <h3
                className="text-sm leading-6  text-gray-400"
                id="modal-headline"
              >
                Ranking: <i>{item.title}</i>
              </h3>
            </div>
            <div className="absolute top-2 right-2 mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center sm:mx-0 sm:h-10 sm:w-10">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                data-modal-hide="default-modal"
                onClick={() => onClose(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="bg-white p-4 flex-1 justify-center items-center">
              <div className="flex justify-center items-center">
                <div className="mt-2">
                  {(rankingGroup !== null &&
                    rankingItemIndex !== null &&
                    !isFinished && (
                      <div className="justify-center items-center grid grid-cols-2 gap-x-8">
                        <div className="text-sm leading-4">
                          <button
                            type="button"
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-36 h-28 relative flex flex-col items-center"
                            onClick={() => handleRanking(false)}
                          >
                            <div className="mt-2 flex overflow-hidden">
                              {item.title}
                            </div>
                          </button>
                        </div>
                        <div className="text-sm leading-4">
                          <button
                            type="button"
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-3 border border-gray-400 rounded shadow w-36 h-28 relative flex flex-col items-center"
                            onClick={() => handleRanking(true)}
                          >
                            <div className="mt-2 flex overflow-hidden">
                              {newRankings[rankingItemIndex]?.title}
                            </div>
                            <div
                              className={`flex items-center justify-center text-sm ${getRankingColor(
                                newRankings[rankingItemIndex]?.ranking,
                                true
                              )}`}
                            >
                              {newRankings[rankingItemIndex]?.ranking}
                            </div>
                          </button>
                        </div>
                      </div>
                    )) ||
                    (!isFinished && (
                      <div className="mt-4 justify-center items-center grid grid-cols-3 gap-x-4">
                        <div className="flex flex-col items-center justify-center">
                          <button
                            type="button"
                            className="items-center justify-center w-10 h-10 rounded-full bg-green-400 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={() => handleRankingGroup("good")}
                          ></button>
                          <div className="mb-2 items-center justify-center text-gray-400">
                            I liked it
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            onClick={() => handleRankingGroup("mid")}
                          ></button>
                          <div className="mb-2 text-gray-400">It was ok</div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-400 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => handleRankingGroup("bad")}
                          ></button>
                          <div className="mb-2 text-gray-400">
                            I disliked it
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingModal;

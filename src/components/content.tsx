export type ActiveCardType = "teamStudy" | "recommend" | "share" | "chart";

export default function ActiveContent({
  activeCard,
}: {
  activeCard: ActiveCardType;
}) {
  const activeContent = {
    teamStudy: <img src="/example.png" />,
    recommend: <img src="/example.png" />,
    share: <img src="/example.png" />,
    chart: <img src="/example.png" />,
  };

  return (
    <div className="w-fit h-fit p-5 md:p-10 bg-white/50 rounded-3xl shadow my-20">
      {activeContent[activeCard]}
    </div>
  );
}

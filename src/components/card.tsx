export default function Card({
  imgSrcPath,
  title,
  description,
}: {
  imgSrcPath: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex flex-col w-[370px] md:w-[450px] h-auto bg-white/50 border border-[#f0f0f0] rounded-lg shadow-lg items-center hover:scale-105 hover:brightness-100">
        <div className="flex flex-row items-center w-full px-5 pt-7 pb-2 gap-3 my-3 text-[#333388]">
          <img src={imgSrcPath} alt="icon_teamPlay" className="w-12 h-12" />
          <span className="text-2xl">
            <b>{title}</b>
          </span>
        </div>
        <div className="flex flex-row items-center w-full p-5 text-xl text-[#555588]">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

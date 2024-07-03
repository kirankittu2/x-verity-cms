export default function Button({ name, onClick, dataOption = "" }) {
  return (
    <button
      htmlFor="create-button"
      data-option={dataOption}
      className="bg-black px-4 py-4 rounded text-[15px] text-white min-w-[140px] h-[48px] flex items-center justify-center"
      onClick={onClick}>
      {name}
    </button>
  );
}

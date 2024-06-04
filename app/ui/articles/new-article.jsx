import Button from "@/app/ui/button";

export default function NewArticle() {
  return (
    <>
      <h2 className="text-15-grey mb-5">Create New</h2>
      <div className="bg-white custom-border p-5 mb-10">
        <form className="flex">
          <input
            className="bg-[#F8F8F8] flex-1 p-4 rounded outline-none placeholder:text-black placeholder:text-[15px] mr-2 h-[48px]"
            type="text"
            placeholder="Enter Article Title"
          />
          <Button name="Create New" />
        </form>
      </div>
    </>
  );
}

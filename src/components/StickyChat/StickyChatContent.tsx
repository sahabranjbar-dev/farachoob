import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PrePareForChatForm from "./PrePareForChatForm";

const StickyChatContent = () => {
  return (
    <div className="h-full rounded-t-2xl w-full">
      <div className="bg-[#273F4F] h-18 w-full flex justify-start items-center pr-[25%]">
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>

          <div className="mr-6">
            <span className="text-white">پشتیبانی مشتریان </span>
            <div className="flex justify-start items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-400 text-xs">آنلاین</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full h-full container">
        <div className="p-4">
          <PrePareForChatForm />
        </div>
      </div>
    </div>
  );
};

export default StickyChatContent;

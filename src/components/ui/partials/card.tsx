import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Image,
  Button,
} from "@nextui-org/react";
import CheckIcon from "@/components/icons/CheckIcon";
import BookmarkIcon from "@/components/icons/BookmarkIcon";
import ShareIcon from "@/components/icons/ShareIcon";
import AddressIcon from "@/components/icons/AddressIcon";

export default function Cardlist() {
  const [isExpanded, setIsExpanded] = useState(false);

  const description =
    "Khi cuộc đột kích của Ukraine vào Nga bước sang ngày thứ năm, quân đội Ukraine đã tiến được 16km vào khu vực Kursk và đang bắt đầu truy quét bất kỳ linh lính nào họ bỏ qua trong quá trình vội vã mở rộng quyền kiểm soát của mình.";
  const maxLength = 80; // Độ dài tối đa hiển thị trước khi cắt

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded
    ? description
    : `${description.slice(0, maxLength)}`;

  return (
    <>
      <Card className="max-w-[400px] ">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src="https://nextui.org/avatars/avatar-1.png"
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <span className="text-small font-semibold leading-none text-default-600">
                Jennifer_Anni
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold leading-none text-default-600">
            Thu, 15 Aug 2024
          </span>
        </CardHeader>
        <Image
          alt="Album cover"
          className="object-cover w-full"
          height={200}
          src="https://nextui.org/images/album-cover.png"
          width="100%"
          style={{ margin: 0, padding: 0 }}
        />
        <CardBody>
          <div className="flex flex-row mt-5 mb-3">
            <div className="flex-grow overflow-hidden">
              <div className="text-lg font-bold truncate">
                London Tech Entertaiment
              </div>
            </div>
            <div className="flex-none flex items-center">
              <span className="text-xs flex items-center">
                Nhơn Đức, Nhà Bè, TP.HCM
                <AddressIcon />
              </span>
            </div>
          </div>
          <div className="text-default-600">
            <div className="text-sm">
              {displayText}
              {description.length > maxLength && (
                <a
                  href="#"
                  className="text-blue-500 ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggle();
                  }}
                >
                  {isExpanded ? "See less" : "... See more"}
                </a>
              )}
            </div>
            <div className="m-3 flex gap-4 items-center">
              <Button size="sm">Technology</Button>
              <Button size="sm">Conferences</Button>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="flex-1">
              <div className="flex gap-5">
                <Image
                  alt="Album cover"
                  className="object-cover w-full"
                  height={30}
                  src="https://nextui.org/avatars/avatar-1.png"
                  width="100%"
                  style={{ margin: 0, padding: 0 }}
                />
                <div className="flex flex-col gap-1 items-start justify-center">
                  <span className="text-small font-semibold leading-none text-default-600">
                    Friends Going
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex justify-end gap-2">
                <div className="border-2 border-cyan-600 rounded-full p-1">
                  <CheckIcon />
                </div>
                <div className="border-2 border-cyan-600 rounded-full p-1">
                  <BookmarkIcon />
                </div>
                <div className="border-2 border-cyan-600 rounded-full p-1">
                  <ShareIcon />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

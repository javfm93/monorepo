import { FC } from "react";

export const Header: FC<{ text: string }> = ({ text }) => {
  return <h1 className="text-3xl font-bold color-gray-900">{text}</h1>;
};

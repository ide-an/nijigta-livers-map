import { Navbar, Typography } from "@material-tailwind/react";
import Link from "next/link";

export function NavbarDefault() {
  return (
    <Navbar
      variant="gradient"
      color="blue-gray"
      className="from-blue-gray-900 to-blue-gray-800 px-4 py-3"
      fullWidth
    >
      <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
        <Link href="/">
          <Typography
            href="#"
            variant="h5"
            className="mr-4 ml-2 cursor-pointer py-1.5"
          >
            にじGTAライバーMAP
          </Typography>
        </Link>
        {/* TODO: リンク */}
        <div className="ml-auto flex gap-1 md:mr-4">
          <Typography
            as="li"
            variant="small"
            className="flex items-center gap-x-2 p-1 font-medium"
          >
            <Link
              href="/notice"
              className="flex items-center hover:text-blue-gray-200"
            >
              注意事項
            </Link>
          </Typography>
          {/* 誤判定がありうる、配信外は取れない、アーカイブ非公開で取れないなど */}
          <Typography
            as="li"
            variant="small"
            className="flex items-center gap-x-2 p-1 font-medium"
          >
            <Link
              href="/credit"
              className="flex items-center hover:text-blue-gray-200"
            >
              Credit
            </Link>
          </Typography>
          {/* 元動画、地図画像、開発者情報など */}
          {/* 技術的な話はcreditからgithub docへのリンクでよかろう */}
        </div>
      </div>
    </Navbar>
  );
}

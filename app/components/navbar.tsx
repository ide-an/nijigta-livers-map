import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Collapse,
  IconButton,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navList = (
  <div className="ml-auto flex flex-col lg:flex-row gap-1 md:mr-4">
    {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
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
    {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
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
  </div>
);

export function NavbarDefault() {
  const [openNav, setOpenNav] = useState(false);
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);
  return (
    // @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528
    <Navbar
      variant="gradient"
      color="blue-gray"
      className="from-blue-gray-900 to-blue-gray-800 px-4 py-3"
      fullWidth
    >
      <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
        <Link href="/">
          {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
          <Typography
            href="#"
            variant="h5"
            className="mr-4 ml-2 cursor-pointer py-1.5"
          >
            にじGTAライバーMAP
          </Typography>
        </Link>
        <div className="mr-4 hidden lg:block">{navList}</div>
        {/* @ts-expect-error: material-tailwind由来の型エラー。 See https://github.com/creativetimofficial/material-tailwind/issues/528 */}
        <IconButton
          variant="text"
          className="lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <FontAwesomeIcon
              icon={faXmark}
              className="text-white"
              size="xl"
              strokeWidth={2}
            />
          ) : (
            <FontAwesomeIcon
              icon={faBars}
              className="text-white"
              size="xl"
              strokeWidth={2}
            />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>{navList}</Collapse>
    </Navbar>
  );
}

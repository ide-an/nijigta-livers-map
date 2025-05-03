import { Navbar, Typography } from "@material-tailwind/react";

export function NavbarDefault() {
  return (
    <Navbar
      variant="gradient"
      color="blue-gray"
      className="from-blue-gray-900 to-blue-gray-800 px-4 py-3"
      fullWidth
    >
      <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
        <Typography
          as="a"
          href="#"
          variant="h5"
          className="mr-4 ml-2 cursor-pointer py-1.5"
        >
          にじGTAライバーMAP
        </Typography>
        {/* TODO: リンク */}
        <div className="ml-auto flex gap-1 md:mr-4">
          <Typography
            as="li"
            variant="small"
            className="flex items-center gap-x-2 p-1 font-medium"
          >
            <a href="#" className="flex items-center">
              Credit
            </a>
          </Typography>
          <Typography
            as="li"
            variant="small"
            className="flex items-center gap-x-2 p-1 font-medium"
          >
            <a href="#" className="flex items-center">
              技術的な話
            </a>
          </Typography>
        </div>
      </div>
    </Navbar>
  );
}

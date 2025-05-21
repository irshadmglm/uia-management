import { MdHome, MdLibraryBooks, MdPeople } from "react-icons/md";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-md shadow-md flex justify-around py-4 rounded-t-2xl text-gray-800 dark:text-white">
      <Link
        to="/library"
        className="flex flex-col items-center hover:text-green-500 transition-colors duration-300"
      >
        <MdHome className="text-2xl transition-transform duration-300 hover:scale-110" />
        <span className="text-sm">Home</span>
      </Link>
      <Link
        to="/books"
        className="flex flex-col items-center hover:text-green-500 transition-colors duration-300"
      >
        <MdLibraryBooks className="text-2xl transition-transform duration-300 hover:scale-110" />
        <span className="text-sm">Books</span>
      </Link>
      <Link
        to="/users"
        className="flex flex-col items-center hover:text-green-500 transition-colors duration-300"
      >
        <MdPeople className="text-2xl transition-transform duration-300 hover:scale-110" />
        <span className="text-sm">Students</span>
      </Link>
    </footer>
  );
};

export default Footer;

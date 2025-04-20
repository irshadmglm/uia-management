import { Link } from "react-router-dom";

const Card = ({ title, icon: Icon, route }) => {
  return (
    <Link
      to={route}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-md hover:shadow-2xl dark:hover:shadow-lg 
                 transform transition duration-300 hover:scale-105 cursor-pointer p-5 flex flex-col items-center"
    >
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-full p-3 shadow-lg">
        <Icon className="text-white text-4xl transition-transform duration-300 hover:scale-110" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
    </Link>
  );
};

export default Card;

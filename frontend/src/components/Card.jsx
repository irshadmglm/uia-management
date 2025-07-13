import { Link } from "react-router-dom";

const Card = ({ title, icon: Icon, route, url }) => {
  const content = (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-md hover:shadow-2xl dark:hover:shadow-lg 
                 transform transition duration-300 hover:scale-105 cursor-pointer p-5 flex flex-col items-center"
    >
      <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-full p-2 shadow-lg">
        <Icon className="text-white text-4xl transition-transform duration-300 hover:scale-110" />
      </div>
      <h2 className="mt-2 text-lg font-bold text-gray-800 dark:text-gray-200">{title}</h2>
    </div>
  );

  if (route) {
    return <Link to={route}>{content}</Link>;
  } else if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  } else {
    return content;
  }
};

export default Card;

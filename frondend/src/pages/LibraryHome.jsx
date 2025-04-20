import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { MdLibraryBooks, MdMenuBook, MdAssignmentReturned, MdPeople } from "react-icons/md";

const LibraryHome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 w-full max-w-4xl p-4">
        <Card title="Books" icon={MdLibraryBooks} route="/dashboard/student/books" />
        <Card title="Borrow Books" icon={MdMenuBook} route="/dashboard/student/borrow" />
        <Card title="Return Books" icon={MdAssignmentReturned} route="/dashboard/student/borrowed-books" />
      </div>
      <Footer />
    </div>
  );
};

export default LibraryHome;

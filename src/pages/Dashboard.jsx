import Card from "../components/Card";

const Dashboard = () => {
  return (
    <>
      <div className="flex flex-col gap-10 p-20">
        <input
          type="text"
          placeholder="Search"
          className="w-fit mx-auto py-3 px-10 border-2 rounded-full text-2xl"
        />

        <div className="w-fit grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Card />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

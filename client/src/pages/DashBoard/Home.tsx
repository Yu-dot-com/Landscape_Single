import RecentProjects from '../../components/Dashboard/RecentProjects'
import AllProjects from '../../components/Dashboard/AllProjects'
import Collaborators from '../../components/Dashboard/Collaborators'
function Home() {
  return (
    <div>
      {" "}
      <RecentProjects />
      <div className="grid grid-cols-[1fr_250px] gap-10">
        <AllProjects />
        <Collaborators />
      </div>{" "}
    </div>
  );
}

export default Home;

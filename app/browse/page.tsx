import Search from "./_components/algolia/Search";
import TrendingCourse from "./_components/algolia/TrendingCourse";
export default async function BrowsePage() {
  return (
    <div className="mt-10">
      <TrendingCourse />
      <Search />
    </div>
  );
}

import Map from "./components/map"
import MapControl from "./components/map_control";

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row flex-grow h-screen">
      <div className="flex-grow">
        <Map />
      </div>
      <div className="w-full md:w-64 bg-gray-200">
        <MapControl />
      </div>
    </div>
  );
}
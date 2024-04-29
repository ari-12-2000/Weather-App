import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { City, ForecastType } from "../types/Types";
import axios, { AxiosResponse } from "axios";


interface Props {
  cities: City[];
  setPageSize: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setForecastData:Dispatch<SetStateAction<ForecastType|null>>
}

interface Data {
  lat: number;
  lon: number;
}
const API_key = import.meta.env.VITE_API_key;

const CityTable = (props: Props) => {
  const { cities, setPageSize, pageSize , setForecastData} = props;
  const [visibleCities, setVisibleCities] = useState<City[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  

  const CityWeather = async (data: Data) => {
    const { lat, lon } = data;
    console.log(lat, lon);

    try {
      const response: AxiosResponse<ForecastType> = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`
      );

      const forecastData: ForecastType = {
        ...response.data,
        list: response.data.list.slice(0, 16),
      };

      console.log(forecastData);
      setForecastData(forecastData);
    } catch (err) {
      console.error(err);
    }
  };

  const updateVisibleCities: () => void = () => {
    const newCities: City[] = cities.slice(
      currentPage - 1,
      currentPage * pageSize
    );
    setVisibleCities((prev) => [...prev, ...newCities]); //visibleCities should be modified from top and bottom level
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    updateVisibleCities();
  }, [pageSize]);

  const handleInfiniteScroll: () => void = async () => {
    console.log("Scroll done");
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      )
        setPageSize((prev) => prev + 10);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);
    return () => {
      window.removeEventListener("scroll", handleInfiniteScroll);
    };
  }, []);

  return (
    <>
     
        <table className="w-full">
          <thead>
            <tr>
              <th className="hidden sm:table-cell border  px-4 py-2">
                City Name
              </th>
              <th className="hidden sm:table-cell border  px-4 py-2">
                Country
              </th>
              <th className="hidden sm:table-cell border  px-4 py-2">
                Timezone
              </th>
              <th className="hidden sm:table-cell border  px-4 py-2">
                Coordinates
              </th>
              <th className="hidden sm:table-cell border  px-4 py-2">
                Population
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleCities.map((city, index) => (
              <tr
                key={index}
                onClick={() =>
                  CityWeather({
                    lat: city.coordinates.lat,
                    lon: city.coordinates.lon,
                  })
                }
              >
                <td
                  data-cell="City Name"
                  className={`before:content-[attr(data-cell)_':'] ${
                    index % 2 === 0 && "bg-gray-300"
                  } grid grid-cols-2 gap-x-1  before:font-bold  sm:table-cell  sm:before:content-[''] sm:font-normal border  px-4 py-2 `}
                >
                  {city.name}
                </td>
                <td
                  data-cell="Country"
                  className={`before:content-[attr(data-cell)_':'] ${
                    index % 2 === 0 && "bg-gray-300"
                  } grid grid-cols-2 gap-x-1  before:font-bold  sm:table-cell  sm:before:content-[''] sm:font-normal border  px-4 py-2 `}
                >
                  {city.cou_name_en}
                </td>
                <td
                  data-cell="Timezone"
                  className={`before:content-[attr(data-cell)_':'] ${
                    index % 2 === 0 && "bg-gray-300"
                  } grid grid-cols-2 gap-x-1  before:font-bold  sm:table-cell  sm:before:content-[''] sm:font-normal border  px-4 py-2 `}
                >
                  {city.timezone}
                </td>
                <td
                  data-cell="Coordinates"
                  className={`before:content-[attr(data-cell)_':'] ${
                    index % 2 === 0 && "bg-gray-300"
                  } grid grid-cols-2 gap-x-1  before:font-bold  sm:table-cell  sm:before:content-[''] sm:font-normal border  px-4 py-2 `}
                >
                  {city.coordinates.lon}°, {city.coordinates.lat}°
                </td>
                <td
                  data-cell="Population"
                  className={`before:content-[attr(data-cell)_':'] ${
                    index % 2 === 0 && "bg-gray-300"
                  } grid grid-cols-2 gap-x-1  before:font-bold  sm:table-cell  sm:before:content-[''] sm:font-normal border  px-4 py-2 `}
                >
                  {city.population}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={5}
                className="border border-gray-800 px-4 py-2 bg-zinc-800"
              ></td>
            </tr>
          </tfoot>
        </table>
    
    </>
  );
};

export default CityTable;

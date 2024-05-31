import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import CityTable from "./CityTable";
import { ForecastType } from "../types/Types";
import Forecast from "./Forecast";
import { CircularProgress } from "@mui/material";

function FetchCitiesAndCityWeather() {
  const [cities, setCities] = useState<[]>([]);
  const [pageSize, setPageSize] = useState<number>(15);
  const [forecastData, setForecastData] = useState<ForecastType | null>(null);
  const [loading, setloading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
     
      try {
        const response: AxiosResponse<any> = await axios.get(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${pageSize}`
        );
        setloading(false);
        setCities(response.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [pageSize]);

  return (
    <div
      className={`container mx-auto bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400 w-full  bg-repeat-y ${
        forecastData && "flex flex-col justify-center items-center"
      }`}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          {forecastData ? (
            <Forecast data={forecastData!} setForecastData={setForecastData} />
          ) : (
            <>
              <h1 className="text-2xl text-center uppercase font-bold my-4">
                Cities
              </h1>

              <CityTable
                cities={cities}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setForecastData={setForecastData}
                setloading={setloading}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default FetchCitiesAndCityWeather;

"use client";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  RefinementList,
  Pagination,
} from "react-instantsearch";
import algoliasearch from "@/node_modules/algoliasearch";
import { index, appId, apiKey, userToken } from "../../../../helper";
import Hit from "./Hit";
import aa from "search-insights";
import TrendingCourseCategory from "./TrendingCourseCategory";
import { TrendingFacets, useTrendingFacets } from "@algolia/recommend-react";
import recommend from "@algolia/recommend";
import { useState } from "react";

export default function Search() {
  const searchClient = algoliasearch(appId, apiKey);
  const recommendClient = recommend(appId, apiKey);
  const [selectedCategory, setSelectedCategory] = useState("");

  const TrendingCourseHandler = (value: string) => {
    setSelectedCategory(value);
    console.log(`[category:${value}]`);
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={index}
      insights={true}
      //clickAnalytics={true}
      //stalledSearchDelay={100000}
    >
      <Configure
        clickAnalytics={true}
        enablePersonalization={true}
        userToken={userToken}
        hitsPerPage={12}
        enableReRanking={true}
        facetFilters={`category:${selectedCategory}`}
      />
      {/* <div className=""> */}
      <div className=" flex font bg-white sticky top-16 z-30 pt-10">
        <div className=" flex flex-col  items-center w-4/5  mx-auto gap-5 ">
          <SearchBox
            placeholder="Courses title, categories"
            searchAsYouType={false}
            classNames={{
              root: "w-3/5 ",
              form: "flex ",
              input:
                " w-4/5 text-xl  font-light h-10  pl-5 mr-1 bg-white text-black outline-none placeholder-gray-400 rounded-l-full border-2 border-blue-300 shadow-md  ",
              submit:
                "bg-blue-400 hover:bg-blue-500 transition-1000 text-white font-bold w-2/12 h-10 rounded-r-full shadow-md border-2 border-blue-400 ",
              submitIcon: "w-full h-3/5 font-bold hover:text-white",
              resetIcon: "",
              reset: "hidden",
            }}
          />
          <TrendingCourseCategory
            TrendingCourseHandler={TrendingCourseHandler}
          />
        </div>
      </div>
      <div className="pb-52">
        <Hits
          hitComponent={Hit}
          classNames={{
            root: "m-10 min-h-screen",
            list: "w-[80vw] mx-auto grid gap-10 grid-cols-[repeat(auto-fill,minmax(340px,1fr))] z-20",
          }}
        />
      </div>
      {/* <Pagination
          classNames={{
            root: "h-10 pt-20 bg-transparent",
            list: "w-96 mx-auto flex justify-between",
            item: "  h-10  flex justify-center border-grey border-2 rounded-lg items-center m-1 hover:bg-slate-100",
            selectedItem:
              "bg-blue-500 w-10 flex justify-center rounded-lg text-white hover:bg-blue-500",
            disabledItem: "hover:bg-slate-100",
            link: "flex justify-center w-10",
          }}
        /> */}
      {/* </div> */}
      {/* <RefinementList
        attribute="category"
        classNames={{
          root: "ml-[10vw]",
          list: "flex mr-10 text-sm",
          item: "rounded-md m-1 p-1 bg-slate-200 hover:bg-slate-300 ",
          selectedItem: "bg-slate-950 text-white hover:bg-slate-950",
          checkbox: "hidden",
          count: "hidden",
        }}
      />  */}
    </InstantSearch>
  );
}

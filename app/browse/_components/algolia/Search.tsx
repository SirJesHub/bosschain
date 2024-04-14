"use client";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  RefinementList,
  Pagination
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
      
      <SearchBox
        placeholder="Search for Courses"
        searchAsYouType={false}

 

        classNames={{
          root: "ml-[10vw] mt-10 mb-5 border-black ",
          form: "w-3/12 flex justify-items-center ",
          input:
            " w-4/5 text-md pl-5 h-10 rounded-3xl border-solid border-black border-solid border-2  mr-1 ",
          submit:
            "bg-blue-500 hover:bg-blue-700 text-white font-bold w-2/12 h-10 rounded-full ",
          submitIcon: "w-full h-2/5",
          resetIcon: "",
          reset: "hidden",
        }}
      />
      <TrendingCourseCategory TrendingCourseHandler={TrendingCourseHandler} />
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
      /> */}
      <Hits
        hitComponent={Hit}
        classNames={{
          root: "m-10 ",
          list: "w-[80vw] mx-auto grid gap-10 grid-cols-[repeat(auto-fill,minmax(340px,1fr))]",
         
        }}
      />
      <Pagination
      classNames={{
        root: "h-10 ",
        list: "w-96 mx-auto flex justify-between",
        item:"  h-10  flex justify-center border-grey border-2 rounded-lg items-center m-1 hover:bg-slate-100",
        selectedItem: "bg-blue-500 w-10 flex justify-center rounded-lg text-white hover:bg-blue-500",
        disabledItem: "hover:bg-slate-100",
        link:"flex justify-center w-10"
        
      }}
      />
    </InstantSearch>
  );
}

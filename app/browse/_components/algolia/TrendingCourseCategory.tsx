import { TrendingFacets, useTrendingFacets } from "@algolia/recommend-react";
import recommend from "@algolia/recommend";
import { index, appId, apiKey, userToken } from "../../../../helper";
import { useState, useRef, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

const recommendClient = recommend(appId, apiKey);

type TrendingFacetItemProps = {
  _score: number;
  facetName: string;
  facetValue: string;
};

export default function TrendingCourseCategory({
  TrendingCourseHandler,
}: {
  TrendingCourseHandler: Function;
}) {
  const { recommendations } = useTrendingFacets({
    recommendClient,
    facetName: "category",
    indexName: "supabase",
    maxRecommendations: 10,
  });

  const TRANSLATE_AMOUNT = 200;
  const [isLeftVisible, setIsLeftVisible] = useState(true);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const [clickedValue, setClickedValue] = useState();
  const [translate, setTranslate] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current == null) return;
    const observer = new ResizeObserver((entries) => {
      const container = containerRef.current;
      if (container == null) return;

      setIsLeftVisible(translate > 0);
      setIsRightVisible(
        translate + container.clientWidth < container.scrollWidth,
      );
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [recommendations, translate]);

  const categoryButtonHandler = (value: any) => {
    TrendingCourseHandler(value);
    setClickedValue(value);
  };

  return (
    <div className="overflow-x-hidden px-[10vw] pr-[10vw]">
      <div className="sticky">
        <div
          ref={containerRef}
          className="relative overflow-x-hidden
        "
        >
          <div
            className="flex whitespace-nowrap transition-transform gap-10 w-[max-content]"
            style={{ transform: `translateX(-${translate}px)` }}
          >
            <button
              key={"all"}
              className={`bg-slate-200 text-sm h-full rounded-xl whitespace-nowrap p-2 hover:bg-slate-400 transition-colors duration-1000 ${clickedValue == "" ? "bg-slate-500" : "bg-slate-200"}`}
              onClick={() => {
                categoryButtonHandler("");
              }}
            >
              ALL
            </button>
            {recommendations.map((recommendation) => (
              <button
                key={recommendation.facetValue}
                className={`text-sm h-full rounded-xl whitespace-nowrap p-2 hover:bg-slate-400 transition-colors duration-1000 ${clickedValue == recommendation.facetValue ? "bg-slate-500" : "bg-slate-200"}`}
                onClick={() => {
                  categoryButtonHandler(recommendation.facetValue);
                }}
              >
                {recommendation.facetValue}
              </button>
              // <Button  onClick={()=>{
              //   TrendingCourseHandler(recommendation.facetValue)
              // }}  key={recommendation.facetValue} variant="pill" size="default">  {recommendation.facetValue}</Button>
            ))}
          </div>
          {isLeftVisible && (
            <div
              className="
            absolute 
            left-0 
            top-1/2
            -translate-y-1/2
            bg-gradient-to-r 
            from-white 
            from-50% 
            to-transparent 
            w-24 
            h-full
            flex"
            >
              <button
                className="bg-white w-auto"
                onClick={() => {
                  setTranslate((translate) => {
                    const newTranslate = translate - TRANSLATE_AMOUNT;
                    if (newTranslate <= 0) return 0;
                    return newTranslate;
                  });
                }}
              >
                <ChevronLeft />
              </button>
            </div>
          )}

          {isRightVisible && (
            <div className="absolute top-1/2 -translate-y-1/2 right-0 bg-gradient-to-l from-white from-50% to-transparent w-24 h-full  flex justify-end ">
              <button
                className="w-auto"
                onClick={() => {
                  setTranslate((translate) => {
                    if (containerRef.current == null) {
                      return translate;
                    }
                    const newTranslate = translate + TRANSLATE_AMOUNT;
                    const edge = containerRef.current.scrollWidth;
                    const width = containerRef.current.clientWidth;
                    console.log(
                      "newTranslate:",
                      newTranslate,
                      "Edge",
                      edge,
                      "Width:",
                      width,
                    );
                    if (newTranslate + width >= edge) {
                      return edge - width;
                    }
                    return newTranslate;
                  });
                }}
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

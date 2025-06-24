// import { useEffect, useState } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import DefaultSection from "./DefaultSection";
import type { Tab } from "./tabs";

export default function ResultCalculation({tab, parsedJson}: {tab: Tab, parsedJson: any}) {
  useEffect(() => {
    console.log(tab)
    console.log(parsedJson)
  }, [tab, parsedJson])
  
  const collectArrInObject = useCallback((dataObj: any, result: any) => {
    for(const key in dataObj) {
      if(Array.isArray(dataObj[key])) {
        tab.selectedProps.forEach((props) => {
          (dataObj[key] as any[]).forEach(e => {
            if(typeof e[props] === 'number') {
              if(result[props]) result[props] += e[props]
              else result[props] = e[props]
            } 
          })
        }) 
      }else collectArrInObject(dataObj[key], result)
    }
  }, [tab.selectedProps]) 

  const calculated: any = useMemo(() => {
    const result: any = {}
    if(parsedJson.length > 0) {
      tab.selectedProps.forEach((props) => {
        (parsedJson as any[]).forEach(e => {
          if(typeof e[props] === 'number') {
            if(result[props]) result[props] += e[props]
            else result[props] = e[props]
          } 
        })
      }) 
    }else {
      collectArrInObject(parsedJson, result)
    }
    return result
  }, [collectArrInObject, parsedJson, tab.selectedProps])

  return <DefaultSection>
    <div className="min-h-[400px] flex flex-col gap-6 text-2xl">
      {tab.selectedProps.map(props => (
        <div className="flex flex-row">
          <div className="min-w-[100px]">{props}</div>
          <div>: {calculated[props] || 0}</div>
        </div>
      ))}
    </div>
  </DefaultSection>
}
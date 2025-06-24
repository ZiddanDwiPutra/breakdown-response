import { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import DefaultSection from "./DefaultSection";

export default function ResultInterfacing({tab}: any) {
  useEffect(() => {
    if(!(tab.err) && tab?.jsonInput !== ''){
      const gen = new Generator(tab.jsonInput)
      setValue(gen.generateInterface())
    }
  }, [tab])
  const [value, setValue] = useState<string>('')
  return <DefaultSection>
    <div className="min-h-[400px]">
      {value !== '' && <CodeEditor height={500} language="plaintext" value={value}/>}
      {value === '' && 'No Result!'}
    </div>
  </DefaultSection>
}

class Generator {
  json: string;
  result: string[] = [];
  data: any;
  indentation = 0;

  constructor(json: string) {
    this.json = json
    this.result = []
    try {
      this.data = JSON.parse(json)  
    } catch (error) {}
    
  }

  public generateInterface(){
    try {
      this.generateByType()
    } catch (error) {}
    return this.result.join('\n')
  }

  private generateObject(object: any, propName?: string, endText?: string) {
    this.indentation++
    const indentationTab: string[] = []
    for (const _ of new Array(this.indentation-1)) indentationTab.push('\t')
    const indentTabText = indentationTab.join('')

    if(propName === '[X]Parent') this.result.push( `${indentTabText}export interface ${propName.replace("[X]", '')} {`)
    else this.result.push( `${indentTabText}${propName}: {`)
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const value = typeof object[key];
        if(Array.isArray(object[key])) {
          this.generateArray(object[key], key)
        } else if(typeof object[key] === 'object') {
          this.generateObject(object[key], key)
        }else this.result.push(`${indentTabText}\t${key}: ${value};`)
      }
    }
    this.result.push(`${indentTabText}}${endText||''}`)
    this.indentation--
  }

  private generateArray(arrData: any[], propName?: string) {
    const indentationTab: string[] = []
    for (const _ of new Array(this.indentation-1)) indentationTab.push('\t')
    const indentTabText = indentationTab.join('')
    
    if(arrData.length > 0 ) {
      const obj = arrData[0]
      if(typeof obj === 'object') {
        // this.result.push( `${indentTabText}${propName}: `)
        this.generateObject(obj, propName, "[];")
      }else this.result.push(`${indentTabText}\t${propName}: ${typeof obj}[];`)
    }
    // this.result.push(`${indentTabText}[]`)
  }

  private generateByType() {
    if(Array.isArray(this.data) && this.data.length>0) {
      // this.indentation++
      // this.generateArray(this.data, '[X]Parent')  
      // this.indentation--
      this.result.push( `export type ArrParent =  Parent[];\n`)
      this.generateObject(this.data[0], '[X]Parent')
    } else if(typeof this.data === 'object') {
      this.generateObject(this.data, '[X]Parent')
    }
  }
}
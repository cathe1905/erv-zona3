import { useContext } from "react";
import { ExploContext } from "../context/ExploContext";

export const  useExplo= () => {
    const context = useContext(ExploContext)
    if(!context){
      throw new Error('useExplo must be used within a BudgetProvider')
    }
    return context
  }
  
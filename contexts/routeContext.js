import React, { createContext, useState } from "react";

export const RouteContext = createContext();

const routeProvider = ({ children }) => {
  const [selectedRoute, setSelectedRoute] = useState({ name: "saugat" });

  return (
    <RouteContext.Provider value={{ selectedRoute, setSelectedRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

export default routeProvider;

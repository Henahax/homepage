// TabsComponent.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabsComponent: React.FC = () => (
  <Tabs defaultValue="deadlock" className="w-fit">
    <TabsContent value="gw2">
      <div>Guild Wars 2</div>
    </TabsContent>
    <TabsContent value="deadlock">
      <div>Deadlock</div>
    </TabsContent>
    <TabsList className="grid w-full grid-cols-2 h-full p-2 gap-2">
      <TabsTrigger value="gw2" className="p-0">
        <img className="size-16 p-2" src="https://media.invisioncic.com/a311129/monthly_2021_04/pKNMJ0DZ2WI1B.thumb.png.c6c32b5f04c39ad01f6993aa50c5d8f8.png"/>
      </TabsTrigger>
      <TabsTrigger value="deadlock" className="p-0">
        <img className="size-16 p-2" src="https://cdn2.steamgriddb.com/icon_thumb/eafd47a145d67a244ac72fa0617c3224.png"/>
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

export default TabsComponent;

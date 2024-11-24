// TabsComponent.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabsComponent: React.FC = () => (
  <Tabs defaultValue="card1" className="w-[400px]">
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="card1">card1</TabsTrigger>
      <TabsTrigger value="card2">card2</TabsTrigger>
    </TabsList>
    <TabsContent value="card1">
      <div>card1</div>
    </TabsContent>
    <TabsContent value="card2">
      <div>card2</div>
    </TabsContent>
  </Tabs>
);

export default TabsComponent;

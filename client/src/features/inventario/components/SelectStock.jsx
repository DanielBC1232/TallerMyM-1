import { CheckPicker, VStack } from "rsuite";
const data = ["todo","0-10", "11-30", "31-50", "50+"].map(
  (item) => ({ label: item, value: item })
);
const SelectStock = () => {

  return (
    <div>
    <span>Stock:</span>
    <VStack>
      <CheckPicker data={data} style={{ width: 224 }} placeholder="Seleccionar"/>
    </VStack>
  </div>
  );
};

export default SelectStock;

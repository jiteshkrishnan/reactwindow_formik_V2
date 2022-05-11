import { FixedSizeList as List, areEqual } from "react-window";
import { useEffect, memo, useCallback, useState } from "react";
import { useRecoilCallback, useSetRecoilState } from "recoil";
import isEqual from "lodash/isEqual";
import UserForm from "./UserForm";
import { modifiedItems } from "./atoms";
import "./styles.css";
import { deepDiffBetweenObjects } from "./diff";

const Row = memo(({ index, style, data }) => {
  const item = data[index];
  const updateModifiedItems = useSetRecoilState(modifiedItems);
  const [modifiedRow, setModifiedRow] = useState({ ...item });

  useEffect(() => {
    if (!isEqual(item, modifiedRow)) {
      updateModifiedItems((prevModifiedItems) => ({
        ...prevModifiedItems,
        ...{
          [`${modifiedRow.id.name}_${modifiedRow.id.value.replace(
            /[ ]+/g,
            ""
          )}`]: modifiedRow
        }
      }));
    }
  }, [modifiedRow]);

  const updateValues = useCallback((values) => {
    console.log("DIFF### ", deepDiffBetweenObjects(values, item));
    setModifiedRow((prevItem) => ({ ...prevItem, ...values }));
  }, []);

  return (
    <div style={style}>
      <UserForm index={index} updateValues={updateValues} item={modifiedRow} />
    </div>
  );
}, areEqual);

export default function App() {
  const [records, setRecords] = useState([]);
  console.log("Records ", records);

  const getModifiedRows = useRecoilCallback(({ snapshot }) => async () => {
    const modifiedRows = await snapshot.getPromise(modifiedItems);
    console.log("modifiedRows: ", modifiedRows);
  });

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=50&nat=gb")
      .then((res) => res.json())
      .then(({ results: data }) =>
        data.map((user) => ({
          ...user,
          friends: [
            { first: "John", last: "Grisham" },
            { first: "Peter", last: "Kirsten" }
          ]
        }))
      )
      .then((records) => setRecords(records));
  }, []);
  return (
    <div className="App">
      <button onClick={getModifiedRows}>Get Modified rows</button>
      <List
        height={700}
        itemCount={records.length}
        itemData={records}
        itemSize={100}
        width={1000}
      >
        {Row}
      </List>
    </div>
  );
}
